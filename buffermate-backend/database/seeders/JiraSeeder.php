<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\JiraAutomationRule;
use App\Models\JiraNotification;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\Sprint;
use App\Models\WorkItem;
use App\Models\WorkItemComment;
use App\Models\WorkItemHistory;
use App\Models\WorkItemLink;
use App\Models\WorkItemWatcher;
use App\Models\Workspace;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class JiraSeeder extends Seeder
{
    public function run(): void
    {
        $workspace = Workspace::first();
        if (!$workspace) {
            $workspace = Workspace::create([
                'id' => (string) Str::uuid(),
                'name' => 'BufferMate Global',
                'slug' => 'buffermate',
                'owner_user_id' => 'dev_user',
            ]);
        }

        // 1. Create Project BM
        $project = Project::updateOrCreate(
            ['workspace_id' => $workspace->id, 'key' => 'BM'],
            [
                'name' => 'BufferMate Core Platform',
                'description' => 'Enterprise multichannel publishing engine, AI content studio, and analytics.',
                'template' => 'scrum',
                'category' => 'Core Architecture',
                'lead_user_id' => 'Alex Morgan',
                'default_assignee_id' => 'dev_user',
                'status' => 'active',
                'issue_counter' => 0,
            ]
        );

        // Project Members
        $members = [
            ['user_id' => 'dev_user', 'role' => 'project_admin'],
            ['user_id' => 'Alex Morgan', 'role' => 'scrum_master'],
            ['user_id' => 'Elena Rostova', 'role' => 'developer'],
            ['user_id' => 'Liam Chen', 'role' => 'developer'],
            ['user_id' => 'Sarah Connor', 'role' => 'viewer'],
        ];

        foreach ($members as $m) {
            ProjectMember::updateOrCreate(
                ['project_id' => $project->id, 'user_id' => $m['user_id']],
                ['role' => $m['role']]
            );
        }

        // 2. Default Scrum Board
        $board = Board::updateOrCreate(
            ['project_id' => $project->id, 'name' => 'BM Scrum Board'],
            [
                'workspace_id' => $workspace->id,
                'type' => 'scrum',
            ]
        );

        $columns = [
            ['name' => 'To Do', 'mapped_status' => 'todo', 'order_index' => 0, 'wip_limit' => 10],
            ['name' => 'In Progress', 'mapped_status' => 'in_progress', 'order_index' => 1, 'wip_limit' => 5],
            ['name' => 'In Review', 'mapped_status' => 'in_review', 'order_index' => 2, 'wip_limit' => 4],
            ['name' => 'Done', 'mapped_status' => 'done', 'order_index' => 3, 'wip_limit' => null],
        ];

        foreach ($columns as $col) {
            BoardColumn::updateOrCreate(
                ['board_id' => $board->id, 'mapped_status' => $col['mapped_status']],
                [
                    'name' => $col['name'],
                    'order_index' => $col['order_index'],
                    'wip_limit' => $col['wip_limit'],
                ]
            );
        }

        // 3. Sprints
        $sprint1 = Sprint::updateOrCreate(
            ['project_id' => $project->id, 'name' => 'BM Sprint 1: Foundation'],
            [
                'workspace_id' => $workspace->id,
                'goal' => 'Establish tenant isolation, SQLite lock mitigation, and OAuth token encryption.',
                'status' => 'closed',
                'start_date' => now()->subWeeks(3),
                'end_date' => now()->subWeek(),
                'completed_at' => now()->subWeek(),
            ]
        );

        $sprint2 = Sprint::updateOrCreate(
            ['project_id' => $project->id, 'name' => 'BM Sprint 2: Core Task & Agile Engine'],
            [
                'workspace_id' => $workspace->id,
                'goal' => 'Deliver Jira parity project management, interactive Kanban/Scrum, and sprint reports.',
                'status' => 'active',
                'start_date' => now()->subDays(3),
                'end_date' => now()->addDays(11),
            ]
        );

        $sprint3 = Sprint::updateOrCreate(
            ['project_id' => $project->id, 'name' => 'BM Sprint 3: Automation & Integrations'],
            [
                'workspace_id' => $workspace->id,
                'goal' => 'Extend webhooks, trigger-condition-action rule engine, and external sync.',
                'status' => 'future',
                'start_date' => now()->addDays(12),
                'end_date' => now()->addDays(26),
            ]
        );

        // 4. Epic & Work Items
        $epicKey = $project->generateNextIssueKey();
        $epic = WorkItem::updateOrCreate(
            ['project_id' => $project->id, 'key' => $epicKey['key']],
            [
                'workspace_id' => $workspace->id,
                'issue_number' => $epicKey['number'],
                'title' => 'Enterprise Social Auto-Posting & Task Engine Architecture',
                'description' => 'Comprehensive initiative spanning social publishing, multi-tenant database isolation, and agile issue management.',
                'type' => 'epic',
                'status' => 'in_progress',
                'priority' => 'highest',
                'assignee_user_id' => 'Alex Morgan',
                'reporter_user_id' => 'dev_user',
                'labels' => ['architecture', 'epic', 'v2'],
                'start_date' => now()->subDays(10),
                'due_date' => now()->addDays(30),
            ]
        );

        // Story 1: Closed in Sprint 1
        $s1Key = $project->generateNextIssueKey();
        WorkItem::updateOrCreate(
            ['project_id' => $project->id, 'key' => $s1Key['key']],
            [
                'workspace_id' => $workspace->id,
                'sprint_id' => $sprint1->id,
                'parent_id' => $epic->id,
                'issue_number' => $s1Key['number'],
                'title' => 'Implement multi-tenant workspace isolation middleware',
                'description' => 'Scope all incoming API requests with X-Workspace-Id header and verify tenant membership.',
                'type' => 'story',
                'status' => 'done',
                'priority' => 'high',
                'story_points' => 5,
                'estimated_hours' => 16,
                'logged_hours' => 14,
                'assignee_user_id' => 'Liam Chen',
                'reporter_user_id' => 'Alex Morgan',
                'labels' => ['backend', 'security'],
                'completed_at' => now()->subDays(8),
                'resolution' => 'Done',
            ]
        );

        // Story 2: In Progress in Sprint 2
        $s2Key = $project->generateNextIssueKey();
        $story2 = WorkItem::updateOrCreate(
            ['project_id' => $project->id, 'key' => $s2Key['key']],
            [
                'workspace_id' => $workspace->id,
                'sprint_id' => $sprint2->id,
                'parent_id' => $epic->id,
                'issue_number' => $s2Key['number'],
                'title' => 'Develop interactive Kanban & Scrum drag-and-drop board',
                'description' => 'Provide fluid column-based card transitions, live WIP limit validation, and quick filter toggles.',
                'type' => 'story',
                'status' => 'in_progress',
                'priority' => 'highest',
                'story_points' => 8,
                'estimated_hours' => 24,
                'logged_hours' => 12,
                'assignee_user_id' => 'Elena Rostova',
                'reporter_user_id' => 'Alex Morgan',
                'labels' => ['frontend', 'ui', 'agile'],
                'due_date' => now()->addDays(4),
            ]
        );

        // Subtask 1 for Story 2
        $sub1Key = $project->generateNextIssueKey();
        WorkItem::updateOrCreate(
            ['project_id' => $project->id, 'key' => $sub1Key['key']],
            [
                'workspace_id' => $workspace->id,
                'sprint_id' => $sprint2->id,
                'parent_id' => $story2->id,
                'issue_number' => $sub1Key['number'],
                'title' => 'Build column header with WIP indicators and card counter pills',
                'type' => 'subtask',
                'status' => 'done',
                'priority' => 'medium',
                'assignee_user_id' => 'Elena Rostova',
                'reporter_user_id' => 'Elena Rostova',
                'completed_at' => now()->subDay(),
            ]
        );

        // Subtask 2 for Story 2
        $sub2Key = $project->generateNextIssueKey();
        WorkItem::updateOrCreate(
            ['project_id' => $project->id, 'key' => $sub2Key['key']],
            [
                'workspace_id' => $workspace->id,
                'sprint_id' => $sprint2->id,
                'parent_id' => $story2->id,
                'issue_number' => $sub2Key['number'],
                'title' => 'Implement PATCH /api/jira/issues/{id} status transition endpoint',
                'type' => 'subtask',
                'status' => 'in_progress',
                'priority' => 'high',
                'assignee_user_id' => 'dev_user',
                'reporter_user_id' => 'Elena Rostova',
            ]
        );

        // Task 3: In Review in Sprint 2
        $t3Key = $project->generateNextIssueKey();
        $task3 = WorkItem::updateOrCreate(
            ['project_id' => $project->id, 'key' => $t3Key['key']],
            [
                'workspace_id' => $workspace->id,
                'sprint_id' => $sprint2->id,
                'issue_number' => $t3Key['number'],
                'title' => 'Burndown & Velocity real-time calculation service',
                'description' => 'Compute mathematical remaining story points and average team velocity against real database rows.',
                'type' => 'task',
                'status' => 'in_review',
                'priority' => 'high',
                'story_points' => 5,
                'estimated_hours' => 12,
                'logged_hours' => 10,
                'assignee_user_id' => 'Liam Chen',
                'reporter_user_id' => 'Alex Morgan',
                'labels' => ['analytics', 'reports'],
                'due_date' => now()->addDays(2),
            ]
        );

        // Bug 4: In Progress in Sprint 2
        $b4Key = $project->generateNextIssueKey();
        $bug4 = WorkItem::updateOrCreate(
            ['project_id' => $project->id, 'key' => $b4Key['key']],
            [
                'workspace_id' => $workspace->id,
                'sprint_id' => $sprint2->id,
                'issue_number' => $b4Key['number'],
                'title' => 'Resolve SQLite busy locking on concurrent queue workers',
                'description' => 'Implement WAL mode and busy_timeout=5000ms in database config to prevent deadlocks under burst publishing.',
                'type' => 'bug',
                'status' => 'in_progress',
                'priority' => 'highest',
                'story_points' => 3,
                'estimated_hours' => 8,
                'logged_hours' => 4,
                'assignee_user_id' => 'dev_user',
                'reporter_user_id' => 'Liam Chen',
                'labels' => ['database', 'sqlite', 'bug'],
                'due_date' => now()->addDays(1),
            ]
        );

        // Backlog Task 5 (unassigned sprint)
        $t5Key = $project->generateNextIssueKey();
        WorkItem::updateOrCreate(
            ['project_id' => $project->id, 'key' => $t5Key['key']],
            [
                'workspace_id' => $workspace->id,
                'sprint_id' => null,
                'issue_number' => $t5Key['number'],
                'title' => 'Design customizable event-driven automation rules builder',
                'description' => 'Allow project admins to create Trigger -> Condition -> Action sequences with execution logging.',
                'type' => 'story',
                'status' => 'backlog',
                'priority' => 'medium',
                'story_points' => 8,
                'assignee_user_id' => null,
                'reporter_user_id' => 'Alex Morgan',
                'labels' => ['automations', 'backlog'],
            ]
        );

        // 5. Work Item Dependency Link (Bug 4 is blocked by Task 3)
        WorkItemLink::updateOrCreate(
            [
                'source_work_item_id' => $bug4->id,
                'target_work_item_id' => $task3->id,
            ],
            [
                'workspace_id' => $workspace->id,
                'relationship' => 'is_blocked_by',
            ]
        );

        // 6. Comments
        WorkItemComment::updateOrCreate(
            ['work_item_id' => $story2->id, 'user_id' => 'Alex Morgan'],
            [
                'author_name' => 'Alex Morgan',
                'content' => 'Great progress on the board layout! Ensure mobile swipe gesture also moves cards smoothly.',
            ]
        );

        WorkItemComment::updateOrCreate(
            ['work_item_id' => $bug4->id, 'user_id' => 'dev_user'],
            [
                'author_name' => 'Alex Morgan',
                'content' => 'WAL mode PR tested locally on PHP 8.5. Lock duration dropped from 240ms to 4ms.',
            ]
        );

        // 7. Audit History
        WorkItemHistory::create([
            'work_item_id' => $story2->id,
            'user_id' => 'Elena Rostova',
            'field' => 'status',
            'from_value' => 'todo',
            'to_value' => 'in_progress',
            'created_at' => now()->subHours(5),
        ]);

        // 8. Automation Rules
        JiraAutomationRule::updateOrCreate(
            ['project_id' => $project->id, 'name' => 'Auto-Assign Bugs to Project Lead'],
            [
                'workspace_id' => $workspace->id,
                'description' => 'When a new bug is reported without an assignee, automatically assign to Alex Morgan.',
                'trigger_event' => 'issue_created',
                'conditions' => [
                    ['field' => 'type', 'operator' => 'equals', 'value' => 'bug'],
                    ['field' => 'assignee_user_id', 'operator' => 'is_empty'],
                ],
                'actions' => [
                    ['action' => 'assign_issue', 'user_id' => 'Alex Morgan'],
                    ['action' => 'add_comment', 'comment' => 'Automated: Assigned to project lead for initial triage.'],
                ],
                'is_active' => true,
                'execution_count' => 3,
                'last_executed_at' => now()->subDays(2),
            ]
        );

        JiraAutomationRule::updateOrCreate(
            ['project_id' => $project->id, 'name' => 'Auto-Timestamp Done Issues'],
            [
                'workspace_id' => $workspace->id,
                'description' => 'When an issue moves to Done, record completion timestamp and resolution.',
                'trigger_event' => 'status_changed',
                'conditions' => [
                    ['field' => 'status', 'operator' => 'equals', 'value' => 'done'],
                ],
                'actions' => [
                    ['action' => 'set_resolution', 'resolution' => 'Done'],
                ],
                'is_active' => true,
                'execution_count' => 12,
                'last_executed_at' => now()->subHours(8),
            ]
        );

        // 7. Watchers
        foreach ([$epic, $story2, $task3, $bug4] as $iss) {
            WorkItemWatcher::firstOrCreate([
                'work_item_id' => $iss->id,
                'user_id' => 'dev_user',
            ]);
            WorkItemWatcher::firstOrCreate([
                'work_item_id' => $iss->id,
                'user_id' => 'Alex Morgan',
            ]);
        }

        // 8. Initial Jira Notifications
        $sampleNotifications = [
            [
                'id' => (string) Str::uuid(),
                'workspace_id' => $workspace->id,
                'project_id' => $project->id,
                'work_item_id' => $bug4->id,
                'user_id' => 'dev_user',
                'actor_user_id' => 'Alex Morgan',
                'event_type' => 'issue_assigned',
                'title' => 'BM-4 assigned to you',
                'message' => 'Alex Morgan assigned BM-4: Fix OAuth token refresh bug with Meta API to you.',
                'data' => [
                    'issue_key' => 'BM-4',
                    'issue_title' => 'Fix OAuth token refresh bug with Meta API',
                    'priority' => 'highest',
                    'type' => 'bug',
                ],
                'is_read' => false,
                'created_at' => now()->subMinutes(14),
            ],
            [
                'id' => (string) Str::uuid(),
                'workspace_id' => $workspace->id,
                'project_id' => $project->id,
                'work_item_id' => $story2->id,
                'user_id' => 'dev_user',
                'actor_user_id' => 'Elena Rostova',
                'event_type' => 'issue_mentioned',
                'title' => 'Elena Rostova mentioned you in BM-2',
                'message' => 'Mention in BM-2: "@dev_user please verify the queue transaction lock behavior."',
                'data' => [
                    'issue_key' => 'BM-2',
                    'issue_title' => 'Develop interactive Kanban & Scrum drag-and-drop board',
                    'comment_preview' => '@dev_user please verify the queue transaction lock behavior.',
                ],
                'is_read' => false,
                'created_at' => now()->subHours(1),
            ],
            [
                'id' => (string) Str::uuid(),
                'workspace_id' => $workspace->id,
                'project_id' => $project->id,
                'work_item_id' => $task3->id,
                'user_id' => 'dev_user',
                'actor_user_id' => 'Liam Chen',
                'event_type' => 'issue_status_changed',
                'title' => 'BM-3 moved to In Review',
                'message' => 'Liam Chen moved BM-3 from In Progress to In Review.',
                'data' => [
                    'issue_key' => 'BM-3',
                    'issue_title' => 'Burndown & Velocity real-time calculation service',
                    'old_status' => 'in_progress',
                    'new_status' => 'in_review',
                ],
                'is_read' => false,
                'created_at' => now()->subHours(3),
            ],
            [
                'id' => (string) Str::uuid(),
                'workspace_id' => $workspace->id,
                'project_id' => $project->id,
                'sprint_id' => $sprint2->id,
                'user_id' => 'dev_user',
                'actor_user_id' => 'Alex Morgan',
                'event_type' => 'sprint_started',
                'title' => 'Sprint Started: BM Sprint 2',
                'message' => 'Alex Morgan started BM Sprint 2: Core Task & Agile Engine. Goal: Deliver Jira parity project management.',
                'data' => [
                    'sprint_name' => 'BM Sprint 2: Core Task & Agile Engine',
                ],
                'is_read' => true,
                'read_at' => now()->subHours(4),
                'created_at' => now()->subDays(1),
            ],
        ];

        foreach ($sampleNotifications as $n) {
            JiraNotification::updateOrCreate(
                ['workspace_id' => $n['workspace_id'], 'title' => $n['title'], 'user_id' => $n['user_id']],
                $n
            );
        }
    }
}

