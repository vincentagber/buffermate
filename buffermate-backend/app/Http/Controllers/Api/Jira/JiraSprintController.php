<?php

namespace App\Http\Controllers\Api\Jira;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\WorkItem;
use App\Services\Jira\JiraNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JiraSprintController extends Controller
{
    public function __construct(protected JiraNotificationService $notificationService)
    {
    }
    public function index(Request $request, string $projectIdOrKey): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $project = Project::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($projectIdOrKey) {
                $q->where('id', $projectIdOrKey)->orWhere('key', strtoupper($projectIdOrKey));
            })
            ->firstOrFail();

        $sprints = Sprint::where('project_id', $project->id)
            ->with(['workItems' => function ($q) {
                $q->orderBy('board_order', 'asc');
            }])
            ->orderByRaw("CASE status WHEN 'active' THEN 1 WHEN 'future' THEN 2 ELSE 3 END")
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($s) {
                $totalPts = $s->workItems->sum('story_points');
                $donePts = $s->workItems->where('status', 'done')->sum('story_points');
                return [
                    'id' => $s->id,
                    'name' => $s->name,
                    'goal' => $s->goal,
                    'status' => $s->status,
                    'start_date' => $s->start_date?->toIso8601String(),
                    'end_date' => $s->end_date?->toIso8601String(),
                    'completed_at' => $s->completed_at?->toIso8601String(),
                    'issues_count' => $s->workItems->count(),
                    'total_story_points' => $totalPts,
                    'done_story_points' => $donePts,
                    'work_items' => $s->workItems,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $sprints,
        ]);
    }

    public function store(Request $request, string $projectIdOrKey): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $project = Project::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($projectIdOrKey) {
                $q->where('id', $projectIdOrKey)->orWhere('key', strtoupper($projectIdOrKey));
            })
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'goal' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $sprint = Sprint::create([
            'project_id' => $project->id,
            'workspace_id' => $workspaceId,
            'name' => $validated['name'],
            'goal' => $validated['goal'] ?? null,
            'status' => 'future',
            'start_date' => $validated['start_date'] ?? now(),
            'end_date' => $validated['end_date'] ?? now()->addWeeks(2),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Sprint '{$sprint->name}' created successfully.",
            'data' => $sprint,
        ], 201);
    }

    public function start(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $sprint = Sprint::where('workspace_id', $workspaceId)->findOrFail($id);

        // Check if there is already an active sprint in this project
        $activeSprint = Sprint::where('project_id', $sprint->project_id)
            ->where('status', 'active')
            ->where('id', '!=', $sprint->id)
            ->first();

        if ($activeSprint) {
            return response()->json([
                'success' => false,
                'message' => "Cannot start sprint: Sprint '{$activeSprint->name}' is currently active. Please complete or pause it first.",
            ], 422);
        }

        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'goal' => 'nullable|string',
        ]);

        $sprint->update([
            'status' => 'active',
            'start_date' => $validated['start_date'] ?? now(),
            'end_date' => $validated['end_date'] ?? now()->addWeeks(2),
            'goal' => $validated['goal'] ?? $sprint->goal,
        ]);

        $userId = $request->attributes->get('supabase_user_id') ?: 'Alex Morgan';
        $this->notificationService->notifySprintStarted($sprint, $userId);

        return response()->json([
            'success' => true,
            'message' => "Sprint '{$sprint->name}' has started! Work is now active on the Scrum board.",
            'data' => $sprint->fresh(),
        ]);
    }

    public function complete(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $sprint = Sprint::where('workspace_id', $workspaceId)->findOrFail($id);

        $validated = $request->validate([
            'incomplete_destination' => 'nullable|string|in:backlog,next_sprint',
            'target_sprint_id' => 'nullable|uuid',
        ]);

        // Find incomplete issues
        $incompleteIssues = WorkItem::where('sprint_id', $sprint->id)
            ->where('status', '!=', 'done')
            ->get();

        $destination = $validated['incomplete_destination'] ?? 'backlog';
        $targetSprintId = $validated['target_sprint_id'] ?? null;

        if ($destination === 'next_sprint' && !$targetSprintId) {
            // Find next future sprint
            $nextSprint = Sprint::where('project_id', $sprint->project_id)
                ->where('status', 'future')
                ->orderBy('created_at', 'asc')
                ->first();
            $targetSprintId = $nextSprint?->id;
        }

        foreach ($incompleteIssues as $issue) {
            $issue->update([
                'sprint_id' => $targetSprintId, // null means backlog
            ]);
        }

        $sprint->update([
            'status' => 'closed',
            'completed_at' => now(),
        ]);

        $userId = $request->attributes->get('supabase_user_id') ?: 'Alex Morgan';
        $this->notificationService->notifySprintCompleted($sprint, $userId);

        return response()->json([
            'success' => true,
            'message' => "Sprint '{$sprint->name}' completed. " . $incompleteIssues->count() . " incomplete issues moved to " . ($targetSprintId ? "next sprint" : "backlog") . ".",
            'data' => $sprint->fresh(),
        ]);
    }

    public function reorderIssues(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $validated = $request->validate([
            'issue_ids' => 'required|array',
            'target_sprint_id' => 'nullable', // null = backlog
        ]);

        $targetSprintId = $validated['target_sprint_id'];
        if ($targetSprintId === 'backlog' || $targetSprintId === 'null') {
            $targetSprintId = null;
        }

        foreach ($validated['issue_ids'] as $idx => $issueId) {
            WorkItem::where('workspace_id', $workspaceId)
                ->where('id', $issueId)
                ->update([
                    'sprint_id' => $targetSprintId,
                    'board_order' => $idx,
                ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Issues reordered and assigned to sprint successfully.',
        ]);
    }
}

