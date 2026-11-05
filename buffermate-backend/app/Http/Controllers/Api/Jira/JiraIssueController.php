<?php

namespace App\Http\Controllers\Api\Jira;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\WorkItem;
use App\Models\WorkItemComment;
use App\Models\WorkItemHistory;
use App\Models\WorkItemLink;
use App\Models\WorkItemWatcher;
use App\Services\Jira\JiraAutomationService;
use App\Services\Jira\JiraNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JiraIssueController extends Controller
{
    public function __construct(
        protected JiraAutomationService $automationService,
        protected JiraNotificationService $notificationService
    ) {
    }

    public function index(Request $request, string $projectIdOrKey): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $project = Project::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($projectIdOrKey) {
                $q->where('id', $projectIdOrKey)->orWhere('key', strtoupper($projectIdOrKey));
            })
            ->firstOrFail();

        $query = WorkItem::where('project_id', $project->id)
            ->with(['subtasks', 'comments', 'links.target', 'sprint']);

        // Filters
        if ($request->has('sprint_id')) {
            $sprintId = $request->input('sprint_id');
            if ($sprintId === 'backlog' || $sprintId === 'null') {
                $query->whereNull('sprint_id');
            } elseif ($sprintId) {
                $query->where('sprint_id', $sprintId);
            }
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('type') && $request->input('type') !== 'all') {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('priority') && $request->input('priority') !== 'all') {
            $query->where('priority', $request->input('priority'));
        }

        if ($request->filled('assignee_id')) {
            $assignee = $request->input('assignee_id');
            if ($assignee === 'unassigned') {
                $query->whereNull('assignee_user_id');
            } else {
                $query->where('assignee_user_id', $assignee);
            }
        }

        if ($request->filled('search')) {
            $s = strtolower($request->input('search'));
            $query->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(title) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(key) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$s}%"]);
            });
        }

        $issues = $query->orderBy('board_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $issues,
        ]);
    }

    public function store(Request $request, string $projectIdOrKey): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $userId = $request->attributes->get('supabase_user_id') ?: 'dev_user';

        $project = Project::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($projectIdOrKey) {
                $q->where('id', $projectIdOrKey)->orWhere('key', strtoupper($projectIdOrKey));
            })
            ->firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|in:epic,story,task,bug,subtask,feature,improvement,milestone',
            'status' => 'nullable|string|in:backlog,todo,in_progress,in_review,blocked,done,cancelled',
            'priority' => 'nullable|string|in:highest,high,medium,low,lowest',
            'story_points' => 'nullable|integer',
            'estimated_hours' => 'nullable|numeric',
            'assignee_user_id' => 'nullable|string',
            'sprint_id' => 'nullable|uuid',
            'parent_id' => 'nullable|uuid',
            'labels' => 'nullable|array',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
        ]);

        $keyInfo = $project->generateNextIssueKey();

        $workItem = WorkItem::create([
            'workspace_id' => $workspaceId,
            'project_id' => $project->id,
            'sprint_id' => $validated['sprint_id'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'key' => $keyInfo['key'],
            'issue_number' => $keyInfo['number'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'] ?? 'task',
            'status' => $validated['status'] ?? 'todo',
            'priority' => $validated['priority'] ?? 'medium',
            'story_points' => $validated['story_points'] ?? null,
            'estimated_hours' => $validated['estimated_hours'] ?? null,
            'assignee_user_id' => $validated['assignee_user_id'] ?? $project->default_assignee_id,
            'reporter_user_id' => $userId,
            'labels' => $validated['labels'] ?? [],
            'start_date' => $validated['start_date'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
        ]);

        // Audit Trail
        WorkItemHistory::create([
            'work_item_id' => $workItem->id,
            'user_id' => $userId,
            'field' => 'created',
            'from_value' => null,
            'to_value' => "Created {$workItem->key} ({$workItem->title})",
        ]);

        // Auto-watch for reporter
        WorkItemWatcher::firstOrCreate([
            'work_item_id' => $workItem->id,
            'user_id' => $userId,
        ]);

        // Trigger Automations & Jira Notifications
        $this->automationService->dispatchEvent('issue_created', $workItem);
        $this->notificationService->notifyIssueCreated($workItem, $userId);

        return response()->json([
            'success' => true,
            'message' => "Issue {$workItem->key} created successfully.",
            'data' => $workItem->fresh()->load(['subtasks', 'comments', 'links.target']),
        ], 201);
    }

    public function show(Request $request, string $idOrKey): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $workItem = WorkItem::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($idOrKey) {
                $q->where('id', $idOrKey)->orWhere('key', strtoupper($idOrKey));
            })
            ->with([
                'project',
                'sprint',
                'parent',
                'subtasks',
                'comments',
                'history',
                'links.target',
                'inverseLinks.source',
                'watchers',
            ])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $workItem,
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $userId = $request->attributes->get('supabase_user_id') ?: 'dev_user';

        $workItem = WorkItem::where('workspace_id', $workspaceId)->findOrFail($id);
        $oldStatus = $workItem->status;
        $oldAssignee = $workItem->assignee_user_id;

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|string|in:backlog,todo,in_progress,in_review,blocked,done,cancelled',
            'priority' => 'sometimes|string|in:highest,high,medium,low,lowest',
            'story_points' => 'nullable|integer',
            'estimated_hours' => 'nullable|numeric',
            'logged_hours' => 'nullable|numeric',
            'assignee_user_id' => 'nullable|string',
            'sprint_id' => 'nullable',
            'parent_id' => 'nullable',
            'labels' => 'nullable|array',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'resolution' => 'nullable|string',
            'board_order' => 'nullable|integer',
        ]);

        // Audit Trail for modified fields
        foreach ($validated as $field => $newValue) {
            $oldValue = $workItem->{$field};
            if ($oldValue != $newValue) {
                WorkItemHistory::create([
                    'work_item_id' => $workItem->id,
                    'user_id' => $userId,
                    'field' => $field,
                    'from_value' => is_array($oldValue) ? json_encode($oldValue) : (string)$oldValue,
                    'to_value' => is_array($newValue) ? json_encode($newValue) : (string)$newValue,
                ]);
            }
        }

        // If status changed to done, stamp completion
        if (isset($validated['status'])) {
            if ($validated['status'] === 'done' && $workItem->status !== 'done') {
                $validated['completed_at'] = now();
                $validated['resolution'] = $validated['resolution'] ?? 'Done';
            } elseif ($validated['status'] !== 'done' && $workItem->status === 'done') {
                $validated['completed_at'] = null;
                $validated['resolution'] = null;
            }
        }

        $workItem->update($validated);

        // Notifications: Check Assignee change
        if (array_key_exists('assignee_user_id', $validated) && $validated['assignee_user_id'] !== $oldAssignee) {
            $this->notificationService->notifyIssueAssigned($workItem, $oldAssignee, $validated['assignee_user_id'], $userId);
        }

        // Notifications & Automations: Check Status change
        if (isset($validated['status']) && $validated['status'] !== $oldStatus) {
            $this->notificationService->notifyIssueStatusChanged($workItem, $oldStatus, $validated['status'], $userId);
            $this->automationService->dispatchEvent('status_changed', $workItem);

            // Check if all subtasks of parent are now done
            if ($workItem->parent_id && $validated['status'] === 'done') {
                $parent = $workItem->parent;
                if ($parent) {
                    $unresolvedSubtasks = $parent->subtasks()->where('status', '!=', 'done')->count();
                    if ($unresolvedSubtasks === 0) {
                        $this->automationService->dispatchEvent('subtasks_completed', $parent);
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Issue {$workItem->key} updated successfully.",
            'data' => $workItem->fresh()->load(['subtasks', 'comments', 'links.target', 'sprint', 'watchers']),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $workItem = WorkItem::where('workspace_id', $workspaceId)->findOrFail($id);

        $key = $workItem->key;
        $workItem->delete();

        return response()->json([
            'success' => true,
            'message' => "Issue {$key} deleted successfully.",
        ]);
    }

    public function storeComment(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $userId = $request->attributes->get('supabase_user_id') ?: 'dev_user';

        $workItem = WorkItem::where('workspace_id', $workspaceId)->findOrFail($id);

        $validated = $request->validate([
            'content' => 'required|string',
            'author_name' => 'nullable|string',
        ]);

        $comment = WorkItemComment::create([
            'work_item_id' => $workItem->id,
            'user_id' => $userId,
            'author_name' => $validated['author_name'] ?? 'Alex Morgan',
            'content' => $validated['content'],
        ]);

        // Auto-add commenter as watcher (Jira standard behavior)
        WorkItemWatcher::firstOrCreate([
            'work_item_id' => $workItem->id,
            'user_id' => $userId,
        ]);

        // Dispatch comment notifications and @mentions
        $this->notificationService->notifyIssueCommented($workItem, $comment, $userId);

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully.',
            'data' => $comment,
        ], 201);
    }

    public function getWatchers(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $userId = $request->attributes->get('supabase_user_id') ?: 'dev_user';

        $workItem = WorkItem::where('workspace_id', $workspaceId)->findOrFail($id);

        $watchers = $workItem->watchers()->get();
        $isWatching = $watchers->contains('user_id', $userId);

        return response()->json([
            'success' => true,
            'data' => [
                'count' => $watchers->count(),
                'is_watching' => $isWatching,
                'watchers' => $watchers,
            ],
        ]);
    }

    public function toggleWatcher(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $userId = $request->attributes->get('supabase_user_id') ?: 'dev_user';

        $workItem = WorkItem::where('workspace_id', $workspaceId)->findOrFail($id);

        $existing = WorkItemWatcher::where('work_item_id', $workItem->id)
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            $existing->delete();
            $isWatching = false;
            $msg = 'You stopped watching this issue.';
        } else {
            WorkItemWatcher::create([
                'work_item_id' => $workItem->id,
                'user_id' => $userId,
            ]);
            $isWatching = true;
            $msg = 'You are now watching this issue for updates.';
        }

        $count = $workItem->watchers()->count();

        return response()->json([
            'success' => true,
            'message' => $msg,
            'data' => [
                'is_watching' => $isWatching,
                'count' => $count,
            ],
        ]);
    }

    public function linkIssue(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $source = WorkItem::where('workspace_id', $workspaceId)->findOrFail($id);

        $validated = $request->validate([
            'target_work_item_id' => 'required|uuid',
            'relationship' => 'required|string|in:blocks,is_blocked_by,relates_to,duplicates',
        ]);

        $link = WorkItemLink::updateOrCreate(
            [
                'source_work_item_id' => $source->id,
                'target_work_item_id' => $validated['target_work_item_id'],
            ],
            [
                'workspace_id' => $workspaceId,
                'relationship' => $validated['relationship'],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Issue dependency linked successfully.',
            'data' => $link->load('target'),
        ]);
    }
}

