<?php

namespace App\Http\Controllers\Api\Jira;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\BoardColumn;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\WorkItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JiraBoardController extends Controller
{
    public function show(Request $request, string $projectIdOrKey): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $project = Project::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($projectIdOrKey) {
                $q->where('id', $projectIdOrKey)->orWhere('key', strtoupper($projectIdOrKey));
            })
            ->firstOrFail();

        $board = Board::where('project_id', $project->id)
            ->with(['columns' => function ($q) {
                $q->orderBy('order_index', 'asc');
            }])
            ->first();

        if (!$board) {
            // Auto create if not found
            $board = Board::create([
                'workspace_id' => $workspaceId,
                'project_id' => $project->id,
                'name' => "{$project->key} Board",
                'type' => $project->template === 'scrum' ? 'scrum' : 'kanban',
            ]);

            $defaultColumns = [
                ['name' => 'To Do', 'mapped_status' => 'todo', 'order_index' => 0, 'wip_limit' => 10],
                ['name' => 'In Progress', 'mapped_status' => 'in_progress', 'order_index' => 1, 'wip_limit' => 5],
                ['name' => 'In Review', 'mapped_status' => 'in_review', 'order_index' => 2, 'wip_limit' => 4],
                ['name' => 'Done', 'mapped_status' => 'done', 'order_index' => 3, 'wip_limit' => null],
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
            $board->load('columns');
        }

        // Determine issue scope:
        // If scrum board: active sprint issues (or all if no active sprint)
        // If kanban board: all non-archived issues
        $activeSprint = Sprint::where('project_id', $project->id)->where('status', 'active')->first();

        $issuesQuery = WorkItem::where('project_id', $project->id)
            ->with(['subtasks', 'comments', 'links.target']);

        if ($board->type === 'scrum' && $activeSprint) {
            $issuesQuery->where('sprint_id', $activeSprint->id);
        }

        $issues = $issuesQuery->orderBy('board_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Group issues by mapped_status
        $columnsWithCards = $board->columns->map(function ($col) use ($issues) {
            $colIssues = $issues->filter(function ($item) use ($col) {
                return $item->status === $col->mapped_status;
            })->values();

            return [
                'id' => $col->id,
                'name' => $col->name,
                'mapped_status' => $col->mapped_status,
                'wip_limit' => $col->wip_limit,
                'order_index' => $col->order_index,
                'cards' => $colIssues,
                'card_count' => $colIssues->count(),
                'story_points_sum' => $colIssues->sum('story_points'),
                'is_over_wip' => $col->wip_limit && $colIssues->count() > $col->wip_limit,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'board' => $board,
                'active_sprint' => $activeSprint,
                'columns' => $columnsWithCards,
                'total_cards' => $issues->count(),
            ],
        ]);
    }

    public function updateColumn(Request $request, string $columnId): JsonResponse
    {
        $column = BoardColumn::findOrFail($columnId);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:50',
            'wip_limit' => 'nullable|integer',
            'order_index' => 'sometimes|integer',
        ]);

        $column->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Board column updated.',
            'data' => $column,
        ]);
    }
}

