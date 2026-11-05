<?php

namespace App\Http\Controllers\Api\Jira;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\Project;
use App\Models\ProjectMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class JiraProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $projects = Project::where('workspace_id', $workspaceId)
            ->with(['members', 'sprints' => function ($q) {
                $q->where('status', 'active');
            }])
            ->withCount(['workItems as total_issues'])
            ->withCount(['workItems as done_issues' => function ($q) {
                $q->where('status', 'done');
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($p) {
                $pct = $p->total_issues > 0 ? round(($p->done_issues / $p->total_issues) * 100) : 0;
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'key' => $p->key,
                    'description' => $p->description,
                    'template' => $p->template,
                    'category' => $p->category,
                    'lead_user_id' => $p->lead_user_id,
                    'default_assignee_id' => $p->default_assignee_id,
                    'status' => $p->status,
                    'total_issues' => $p->total_issues,
                    'done_issues' => $p->done_issues,
                    'completion_percentage' => $pct,
                    'members_count' => $p->members->count(),
                    'active_sprint' => $p->sprints->first(),
                    'created_at' => $p->created_at->toIso8601String(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $userId = $request->attributes->get('supabase_user_id') ?: 'dev_user';

        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'key' => 'required|string|max:10|regex:/^[A-Z0-9]+$/',
            'description' => 'nullable|string',
            'template' => 'nullable|string|in:scrum,kanban,basic',
            'category' => 'nullable|string',
            'lead_user_id' => 'nullable|string',
        ]);

        $key = strtoupper($validated['key']);

        // Check unique key in workspace
        $existing = Project::where('workspace_id', $workspaceId)->where('key', $key)->first();
        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => "A project with key '{$key}' already exists in this workspace.",
            ], 422);
        }

        $project = Project::create([
            'workspace_id' => $workspaceId,
            'name' => $validated['name'],
            'key' => $key,
            'description' => $validated['description'] ?? null,
            'template' => $validated['template'] ?? 'scrum',
            'category' => $validated['category'] ?? 'General',
            'lead_user_id' => $validated['lead_user_id'] ?? $userId,
            'default_assignee_id' => $userId,
            'issue_counter' => 0,
            'status' => 'active',
        ]);

        // Add creator as project_admin
        ProjectMember::create([
            'project_id' => $project->id,
            'user_id' => $userId,
            'role' => 'project_admin',
        ]);

        // Auto-create Board & Columns
        $board = Board::create([
            'workspace_id' => $workspaceId,
            'project_id' => $project->id,
            'name' => "{$project->key} " . ucfirst($project->template) . " Board",
            'type' => $project->template === 'scrum' ? 'scrum' : 'kanban',
        ]);

        $defaultColumns = [
            ['name' => 'Backlog', 'mapped_status' => 'backlog', 'order_index' => 0, 'wip_limit' => null],
            ['name' => 'To Do', 'mapped_status' => 'todo', 'order_index' => 1, 'wip_limit' => 10],
            ['name' => 'In Progress', 'mapped_status' => 'in_progress', 'order_index' => 2, 'wip_limit' => 5],
            ['name' => 'In Review', 'mapped_status' => 'in_review', 'order_index' => 3, 'wip_limit' => 4],
            ['name' => 'Done', 'mapped_status' => 'done', 'order_index' => 4, 'wip_limit' => null],
        ];

        foreach ($defaultColumns as $col) {
            BoardColumn::create([
                'board_id' => $board->id,
                'name' => $col['name'],
                'mapped_status' => $col['mapped_status'],
                'order_index' => $col['order_index'],
                'wip_limit' => $col['wip_limit'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully with default board and columns.',
            'data' => $project->load(['members', 'boards.columns']),
        ], 201);
    }

    public function show(Request $request, string $idOrKey): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $project = Project::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($idOrKey) {
                $q->where('id', $idOrKey)->orWhere('key', strtoupper($idOrKey));
            })
            ->with(['members', 'boards.columns', 'sprints'])
            ->withCount(['workItems as total_issues'])
            ->withCount(['workItems as done_issues' => function ($q) {
                $q->where('status', 'done');
            }])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $project,
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $project = Project::where('workspace_id', $workspaceId)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:120',
            'description' => 'nullable|string',
            'lead_user_id' => 'nullable|string',
            'default_assignee_id' => 'nullable|string',
            'category' => 'nullable|string',
            'status' => 'sometimes|string|in:active,archived',
        ]);

        $project->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully.',
            'data' => $project->fresh(),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $project = Project::where('workspace_id', $workspaceId)->findOrFail($id);

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project and associated resources deleted successfully.',
        ]);
    }
}

