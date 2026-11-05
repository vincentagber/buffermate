<?php

namespace App\Services\Jira;

use App\Models\JiraNotification;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\WorkItem;
use App\Models\WorkItemComment;
use Illuminate\Support\Str;

class JiraNotificationService
{
    /**
     * Dispatch notification when an issue is created.
     */
    public function notifyIssueCreated(WorkItem $issue, string $actorId): void
    {
        $project = $issue->project;

        // Notify Assignee if set and different from actor
        if ($issue->assignee_user_id && $issue->assignee_user_id !== $actorId) {
            $this->createNotification([
                'workspace_id' => $issue->workspace_id,
                'project_id' => $issue->project_id,
                'work_item_id' => $issue->id,
                'user_id' => $issue->assignee_user_id,
                'actor_user_id' => $actorId,
                'event_type' => 'issue_assigned',
                'title' => "{$issue->key} assigned to you",
                'message' => "{$actorId} assigned {$issue->key} ({$issue->title}) to you.",
                'data' => [
                    'issue_key' => $issue->key,
                    'issue_title' => $issue->title,
                    'type' => $issue->type,
                    'priority' => $issue->priority,
                ],
            ]);
        }

        // Notify Project Lead if not actor and not assignee
        if ($project && $project->lead_user_id && $project->lead_user_id !== $actorId && $project->lead_user_id !== $issue->assignee_user_id) {
            $this->createNotification([
                'workspace_id' => $issue->workspace_id,
                'project_id' => $issue->project_id,
                'work_item_id' => $issue->id,
                'user_id' => $project->lead_user_id,
                'actor_user_id' => $actorId,
                'event_type' => 'issue_created',
                'title' => "New issue created in {$project->key}",
                'message' => "{$actorId} created {$issue->key}: {$issue->title}",
                'data' => [
                    'issue_key' => $issue->key,
                    'issue_title' => $issue->title,
                    'type' => $issue->type,
                ],
            ]);
        }
    }

    /**
     * Dispatch notification when an issue assignee changes.
     */
    public function notifyIssueAssigned(WorkItem $issue, ?string $oldAssignee, ?string $newAssignee, string $actorId): void
    {
        if ($newAssignee && $newAssignee !== $actorId) {
            $this->createNotification([
                'workspace_id' => $issue->workspace_id,
                'project_id' => $issue->project_id,
                'work_item_id' => $issue->id,
                'user_id' => $newAssignee,
                'actor_user_id' => $actorId,
                'event_type' => 'issue_assigned',
                'title' => "{$issue->key} assigned to you",
                'message' => "{$actorId} assigned {$issue->key} ({$issue->title}) to you.",
                'data' => [
                    'issue_key' => $issue->key,
                    'issue_title' => $issue->title,
                    'priority' => $issue->priority,
                ],
            ]);
        }
    }

    /**
     * Dispatch notification when an issue status changes.
     */
    public function notifyIssueStatusChanged(WorkItem $issue, string $oldStatus, string $newStatus, string $actorId): void
    {
        $recipients = collect();

        // 1. Assignee
        if ($issue->assignee_user_id) {
            $recipients->push($issue->assignee_user_id);
        }

        // 2. Reporter
        if ($issue->reporter_user_id) {
            $recipients->push($issue->reporter_user_id);
        }

        // 3. Watchers
        $watchers = $issue->watchers()->pluck('user_id');
        $recipients = $recipients->merge($watchers);

        // Remove actor and unique
        $recipients = $recipients->unique()->filter(fn ($u) => $u !== $actorId);

        $oldPretty = ucwords(str_replace('_', ' ', $oldStatus));
        $newPretty = ucwords(str_replace('_', ' ', $newStatus));

        foreach ($recipients as $recipientId) {
            $this->createNotification([
                'workspace_id' => $issue->workspace_id,
                'project_id' => $issue->project_id,
                'work_item_id' => $issue->id,
                'user_id' => $recipientId,
                'actor_user_id' => $actorId,
                'event_type' => 'issue_status_changed',
                'title' => "{$issue->key} moved to {$newPretty}",
                'message' => "{$actorId} moved {$issue->key} from {$oldPretty} to {$newPretty}.",
                'data' => [
                    'issue_key' => $issue->key,
                    'issue_title' => $issue->title,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                ],
            ]);
        }
    }

    /**
     * Dispatch notification when a comment is added or user is mentioned.
     */
    public function notifyIssueCommented(WorkItem $issue, WorkItemComment $comment, string $actorId): void
    {
        $content = $comment->content;
        $mentionedUsers = $this->extractMentions($content, $issue->project_id);

        // 1. Notify mentioned users first
        foreach ($mentionedUsers as $mentionedUserId) {
            if ($mentionedUserId === $actorId) continue;

            $this->createNotification([
                'workspace_id' => $issue->workspace_id,
                'project_id' => $issue->project_id,
                'work_item_id' => $issue->id,
                'user_id' => $mentionedUserId,
                'actor_user_id' => $actorId,
                'event_type' => 'issue_mentioned',
                'title' => "{$actorId} mentioned you in {$issue->key}",
                'message' => "Mention in {$issue->key}: \"" . Str::limit($content, 80) . "\"",
                'data' => [
                    'issue_key' => $issue->key,
                    'issue_title' => $issue->title,
                    'comment_id' => $comment->id,
                    'comment_preview' => Str::limit($content, 120),
                ],
            ]);
        }

        // 2. Notify Assignee, Reporter, Watchers (excluding mentioned and actor)
        $recipients = collect();
        if ($issue->assignee_user_id) $recipients->push($issue->assignee_user_id);
        if ($issue->reporter_user_id) $recipients->push($issue->reporter_user_id);
        $watchers = $issue->watchers()->pluck('user_id');
        $recipients = $recipients->merge($watchers);

        $recipients = $recipients->unique()
            ->reject(fn ($u) => $u === $actorId || in_array($u, $mentionedUsers));

        foreach ($recipients as $recipientId) {
            $this->createNotification([
                'workspace_id' => $issue->workspace_id,
                'project_id' => $issue->project_id,
                'work_item_id' => $issue->id,
                'user_id' => $recipientId,
                'actor_user_id' => $actorId,
                'event_type' => 'issue_commented',
                'title' => "New comment on {$issue->key}",
                'message' => "{$actorId}: \"" . Str::limit($content, 80) . "\"",
                'data' => [
                    'issue_key' => $issue->key,
                    'issue_title' => $issue->title,
                    'comment_id' => $comment->id,
                ],
            ]);
        }
    }

    /**
     * Dispatch notification when a sprint is started.
     */
    public function notifySprintStarted(Sprint $sprint, string $actorId): void
    {
        $project = $sprint->project;
        if (!$project) return;

        $members = $project->members()->pluck('user_id')->unique();

        foreach ($members as $userId) {
            if ($userId === $actorId) continue;

            $this->createNotification([
                'workspace_id' => $sprint->workspace_id,
                'project_id' => $sprint->project_id,
                'sprint_id' => $sprint->id,
                'user_id' => $userId,
                'actor_user_id' => $actorId,
                'event_type' => 'sprint_started',
                'title' => "Sprint Started: {$sprint->name}",
                'message' => "{$actorId} started {$sprint->name}. Goal: {$sprint->goal}",
                'data' => [
                    'sprint_name' => $sprint->name,
                    'sprint_goal' => $sprint->goal,
                ],
            ]);
        }
    }

    /**
     * Dispatch notification when a sprint is completed.
     */
    public function notifySprintCompleted(Sprint $sprint, string $actorId): void
    {
        $project = $sprint->project;
        if (!$project) return;

        $members = $project->members()->pluck('user_id')->unique();

        foreach ($members as $userId) {
            if ($userId === $actorId) continue;

            $this->createNotification([
                'workspace_id' => $sprint->workspace_id,
                'project_id' => $sprint->project_id,
                'sprint_id' => $sprint->id,
                'user_id' => $userId,
                'actor_user_id' => $actorId,
                'event_type' => 'sprint_completed',
                'title' => "Sprint Completed: {$sprint->name}",
                'message' => "{$actorId} completed sprint {$sprint->name}.",
                'data' => [
                    'sprint_name' => $sprint->name,
                ],
            ]);
        }
    }

    /**
     * Extract @mentions matching project members or known usernames.
     */
    protected function extractMentions(string $content, string $projectId): array
    {
        $project = Project::find($projectId);
        $candidateUsers = collect(['dev_user', 'Alex Morgan', 'Elena Rostova', 'Liam Chen', 'Sarah Connor']);

        if ($project) {
            $memberIds = $project->members()->pluck('user_id');
            $candidateUsers = $candidateUsers->merge($memberIds)->unique();
        }

        $mentioned = [];
        foreach ($candidateUsers as $user) {
            // Check for @User or @user (case-insensitive)
            if (stripos($content, '@' . $user) !== false || stripos($content, '@' . str_replace(' ', '', $user)) !== false) {
                $mentioned[] = $user;
            }
        }

        return array_values(array_unique($mentioned));
    }

    /**
     * Create notification record.
     */
    public function createNotification(array $attributes): JiraNotification
    {
        return JiraNotification::create([
            'workspace_id' => $attributes['workspace_id'],
            'project_id' => $attributes['project_id'],
            'work_item_id' => $attributes['work_item_id'] ?? null,
            'sprint_id' => $attributes['sprint_id'] ?? null,
            'user_id' => $attributes['user_id'],
            'actor_user_id' => $attributes['actor_user_id'],
            'event_type' => $attributes['event_type'],
            'title' => $attributes['title'],
            'message' => $attributes['message'],
            'data' => $attributes['data'] ?? [],
            'is_read' => false,
            'read_at' => null,
        ]);
    }
}

