<?php

namespace Tests\Feature;

use App\Models\Board;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\WorkItem;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class JiraProjectManagementTest extends TestCase
{
    use RefreshDatabase;

    protected Workspace $workspace;
    protected Project $project;
    protected WorkItem $issue;

    protected function setUp(): void
    {
        parent::setUp();

        $this->workspace = Workspace::create([
            'id' => (string) Str::uuid(),
            'name' => 'Test Workspace',
            'slug' => 'test-workspace-' . Str::random(6),
            'owner_user_id' => 'test_user',
        ]);

        $this->project = Project::create([
            'workspace_id' => $this->workspace->id,
            'name' => 'Flagship Project',
            'key' => 'FLAG',
            'template' => 'scrum',
            'issue_counter' => 1,
        ]);

        $this->issue = WorkItem::create([
            'workspace_id' => $this->workspace->id,
            'project_id' => $this->project->id,
            'key' => 'FLAG-1',
            'issue_number' => 1,
            'title' => 'Initial Story',
            'status' => 'todo',
            'priority' => 'high',
        ]);
    }

    public function test_can_list_jira_projects(): void
    {
        $response = $this->withHeader('X-Workspace-Id', $this->workspace->id)
            ->getJson('/api/jira/projects');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
            ]);
    }

    public function test_can_create_project_with_unique_key(): void
    {
        $key = 'TST' . rand(10, 99);

        $response = $this->withHeader('X-Workspace-Id', $this->workspace->id)
            ->postJson('/api/jira/projects', [
                'name' => 'Test Mobile Platform',
                'key' => $key,
                'template' => 'scrum',
                'category' => 'Engineering',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonPath('data.key', $key);

        $this->assertDatabaseHas('projects', [
            'workspace_id' => $this->workspace->id,
            'key' => $key,
        ]);

        $this->assertDatabaseHas('boards', [
            'workspace_id' => $this->workspace->id,
            'name' => "{$key} Scrum Board",
        ]);
    }

    public function test_can_create_issue_with_sequential_key(): void
    {
        $project = Project::firstOrCreate(
            ['workspace_id' => $this->workspace->id, 'key' => 'FEAT'],
            [
                'name' => 'Feature Project',
                'template' => 'scrum',
                'issue_counter' => 0,
            ]
        );

        $res1 = $this->withHeader('X-Workspace-Id', $this->workspace->id)
            ->postJson("/api/jira/projects/{$project->id}/issues", [
                'title' => 'First issue',
                'type' => 'story',
                'priority' => 'high',
                'story_points' => 5,
            ]);

        $res1->assertStatus(201)
            ->assertJsonPath('data.key', 'FEAT-1');

        $res2 = $this->withHeader('X-Workspace-Id', $this->workspace->id)
            ->postJson("/api/jira/projects/{$project->id}/issues", [
                'title' => 'Second issue',
                'type' => 'bug',
                'priority' => 'highest',
            ]);

        $res2->assertStatus(201)
            ->assertJsonPath('data.key', 'FEAT-2');
    }

    public function test_can_transition_issue_status_and_audit(): void
    {
        $response = $this->withHeader('X-Workspace-Id', $this->workspace->id)
            ->patchJson("/api/jira/issues/{$this->issue->id}", [
                'status' => 'done',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'done')
            ->assertJsonPath('data.resolution', 'Done');

        $this->assertDatabaseHas('work_item_history', [
            'work_item_id' => $this->issue->id,
            'field' => 'status',
            'to_value' => 'done',
        ]);
    }

    public function test_can_manage_sprint_lifecycle_and_rollover(): void
    {
        // 1. Create future sprint
        $createRes = $this->withHeader('X-Workspace-Id', $this->workspace->id)
            ->postJson("/api/jira/projects/{$this->project->id}/sprints", [
                'name' => 'Lifecycle Test Sprint',
                'goal' => 'Test rollover logic',
            ]);

        $createRes->assertStatus(201);
        $sprintId = $createRes->json('data.id');

        // 2. Assign an issue to sprint
        $issue = WorkItem::create([
            'workspace_id' => $this->workspace->id,
            'project_id' => $this->project->id,
            'sprint_id' => $sprintId,
            'key' => 'TEST-100',
            'issue_number' => 100,
            'title' => 'Incomplete task',
            'status' => 'in_progress',
        ]);

        // 3. Complete sprint
        $completeRes = $this->withHeader('X-Workspace-Id', $this->workspace->id)
            ->postJson("/api/jira/sprints/{$sprintId}/complete", [
                'incomplete_destination' => 'backlog',
            ]);

        $completeRes->assertStatus(200)
            ->assertJsonPath('data.status', 'closed');

        // Verify issue was rolled over to backlog (sprint_id is null)
        $this->assertDatabaseHas('work_items', [
            'id' => $issue->id,
            'sprint_id' => null,
        ]);
    }

    public function test_can_fetch_board_and_reports(): void
    {
        $boardRes = $this->withHeader('X-Workspace-Id', $this->workspace->id)
            ->getJson("/api/jira/projects/{$this->project->id}/board");

        $boardRes->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'board',
                    'columns',
                ],
            ]);

        $reportRes = $this->withHeader('X-Workspace-Id', $this->workspace->id)
            ->getJson("/api/jira/projects/{$this->project->id}/reports/summary");

        $reportRes->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_issues',
                    'done_issues',
                    'completion_percentage',
                    'status_distribution',
                ],
            ]);
    }
}
