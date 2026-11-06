<?php

namespace Tests\Feature;

use App\Models\ProjectNotification;
use App\Models\Project;
use App\Models\WorkItem;
use App\Models\WorkItemWatcher;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected Workspace $workspace;
    protected Project $project;
    protected WorkItem $issue;

    protected function setUp(): void
    {
        parent::setUp();

        $this->workspace = Workspace::create([
            'name' => 'BufferMate Global',
            'slug' => 'buffermate',
            'owner_user_id' => 'dev_user',
        ]);

        $this->project = Project::create([
            'workspace_id' => $this->workspace->id,
            'name' => 'BufferMate Core Platform',
            'key' => 'BM',
            'template' => 'scrum',
            'lead_user_id' => 'Alex Morgan',
            'status' => 'active',
            'issue_counter' => 0,
        ]);

        $this->issue = WorkItem::create([
            'workspace_id' => $this->workspace->id,
            'project_id' => $this->project->id,
            'key' => 'BM-1',
            'issue_number' => 1,
            'title' => 'Sample Test Issue',
            'type' => 'task',
            'status' => 'todo',
            'priority' => 'high',
            'assignee_user_id' => 'Elena Rostova',
            'reporter_user_id' => 'Alex Morgan',
        ]);
    }

    public function test_can_fetch_notifications_with_unread_count(): void
    {
        ProjectNotification::create([
            'workspace_id' => $this->workspace->id,
            'project_id' => $this->project->id,
            'work_item_id' => $this->issue->id,
            'user_id' => 'dev_user',
            'actor_user_id' => 'Alex Morgan',
            'event_type' => 'issue_assigned',
            'title' => 'BM-1 assigned to you',
            'message' => 'Alex Morgan assigned BM-1 to you.',
            'is_read' => false,
        ]);

        $response = $this->withHeaders(['X-Workspace-Id' => $this->workspace->id])
            ->getJson('/api/projects/notifications');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'unread_count' => 1,
            ]);
    }

    public function test_can_mark_notification_as_read(): void
    {
        $notif = ProjectNotification::create([
            'workspace_id' => $this->workspace->id,
            'project_id' => $this->project->id,
            'user_id' => 'dev_user',
            'actor_user_id' => 'Alex Morgan',
            'event_type' => 'issue_assigned',
            'title' => 'Test Notif',
            'message' => 'Test message',
            'is_read' => false,
        ]);

        $response = $this->withHeaders(['X-Workspace-Id' => $this->workspace->id])
            ->patchJson("/api/projects/notifications/{$notif->id}/read");

        $response->assertStatus(200);
        $this->assertTrue($notif->fresh()->is_read);
    }

    public function test_can_mark_all_notifications_as_read(): void
    {
        ProjectNotification::create([
            'workspace_id' => $this->workspace->id,
            'project_id' => $this->project->id,
            'user_id' => 'dev_user',
            'actor_user_id' => 'Alex Morgan',
            'event_type' => 'issue_assigned',
            'title' => 'Notif 1',
            'message' => 'Message 1',
            'is_read' => false,
        ]);

        ProjectNotification::create([
            'workspace_id' => $this->workspace->id,
            'project_id' => $this->project->id,
            'user_id' => 'dev_user',
            'actor_user_id' => 'Elena Rostova',
            'event_type' => 'issue_status_changed',
            'title' => 'Notif 2',
            'message' => 'Message 2',
            'is_read' => false,
        ]);

        $response = $this->withHeaders(['X-Workspace-Id' => $this->workspace->id])
            ->postJson('/api/projects/notifications/mark-all-read');

        $response->assertStatus(200);
        $this->assertEquals(0, ProjectNotification::where('user_id', 'dev_user')->where('is_read', false)->count());
    }

    public function test_can_toggle_watcher_on_issue(): void
    {
        $response = $this->withHeaders(['X-Workspace-Id' => $this->workspace->id])
            ->postJson("/api/issues/{$this->issue->id}/watchers/toggle");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_watching' => true,
                    'count' => 1,
                ],
            ]);

        $this->assertDatabaseHas('work_item_watchers', [
            'work_item_id' => $this->issue->id,
            'user_id' => 'dev_user',
        ]);
    }

    public function test_commenting_with_mention_dispatches_notification(): void
    {
        $response = $this->withHeaders(['X-Workspace-Id' => $this->workspace->id])
            ->postJson("/api/issues/{$this->issue->id}/comments", [
                'content' => 'Hey @Elena Rostova, please verify the test cases!',
                'author_name' => 'Alex Morgan',
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('jira_notifications', [
            'work_item_id' => $this->issue->id,
            'user_id' => 'Elena Rostova',
            'event_type' => 'issue_mentioned',
        ]);
    }

    public function test_status_change_notifies_watchers_and_assignee(): void
    {
        WorkItemWatcher::create([
            'work_item_id' => $this->issue->id,
            'user_id' => 'Sarah Connor',
        ]);

        $response = $this->withHeaders(['X-Workspace-Id' => $this->workspace->id])
            ->patchJson("/api/issues/{$this->issue->id}", [
                'status' => 'in_progress',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('jira_notifications', [
            'work_item_id' => $this->issue->id,
            'user_id' => 'Sarah Connor',
            'event_type' => 'issue_status_changed',
        ]);
    }
}

