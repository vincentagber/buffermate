<?php

namespace App\Http\Controllers\Api\Jira;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\WorkItem;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JiraReportController extends Controller
{
    public function summary(Request $request, string $projectIdOrKey): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $project = Project::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($projectIdOrKey) {
                $q->where('id', $projectIdOrKey)->orWhere('key', strtoupper($projectIdOrKey));
            })
            ->firstOrFail();

        $issues = WorkItem::where('project_id', $project->id)->get();

        // 1. Status Breakdown
        $statusCounts = [
            'backlog' => $issues->where('status', 'backlog')->count(),
            'todo' => $issues->where('status', 'todo')->count(),
            'in_progress' => $issues->where('status', 'in_progress')->count(),
            'in_review' => $issues->where('status', 'in_review')->count(),
            'blocked' => $issues->where('status', 'blocked')->count(),
            'done' => $issues->where('status', 'done')->count(),
        ];

        // 2. Priority Breakdown
        $priorityCounts = [
            'highest' => $issues->where('priority', 'highest')->count(),
            'high' => $issues->where('priority', 'high')->count(),
            'medium' => $issues->where('priority', 'medium')->count(),
            'low' => $issues->where('priority', 'low')->count(),
            'lowest' => $issues->where('priority', 'lowest')->count(),
        ];

        // 3. Type Breakdown
        $typeCounts = [
            'epic' => $issues->where('type', 'epic')->count(),
            'story' => $issues->where('type', 'story')->count(),
            'task' => $issues->where('type', 'task')->count(),
            'bug' => $issues->where('type', 'bug')->count(),
            'subtask' => $issues->where('type', 'subtask')->count(),
        ];

        // 4. Assignee Workload
        $assigneeWorkload = $issues->groupBy(function ($item) {
            return $item->assignee_user_id ?: 'Unassigned';
        })->map(function ($group, $assignee) {
            return [
                'assignee' => $assignee,
                'count' => $group->count(),
                'story_points' => $group->sum('story_points'),
                'estimated_hours' => $group->sum('estimated_hours'),
                'logged_hours' => $group->sum('logged_hours'),
            ];
        })->values();

        // 5. Total Metrics
        $totalIssues = $issues->count();
        $doneIssues = $issues->where('status', 'done')->count();
        $completionPct = $totalIssues > 0 ? round(($doneIssues / $totalIssues) * 100) : 0;
        $totalPoints = $issues->sum('story_points');
        $donePoints = $issues->where('status', 'done')->sum('story_points');

        return response()->json([
            'success' => true,
            'data' => [
                'total_issues' => $totalIssues,
                'done_issues' => $doneIssues,
                'completion_percentage' => $completionPct,
                'total_story_points' => $totalPoints,
                'done_story_points' => $donePoints,
                'status_distribution' => $statusCounts,
                'priority_distribution' => $priorityCounts,
                'type_distribution' => $typeCounts,
                'assignee_workload' => $assigneeWorkload,
            ],
        ]);
    }

    public function burndown(Request $request, string $projectIdOrKey): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $project = Project::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($projectIdOrKey) {
                $q->where('id', $projectIdOrKey)->orWhere('key', strtoupper($projectIdOrKey));
            })
            ->firstOrFail();

        $sprintId = $request->query('sprint_id');
        $sprint = $sprintId
            ? Sprint::where('project_id', $project->id)->find($sprintId)
            : Sprint::where('project_id', $project->id)->where('status', 'active')->first();

        if (!$sprint) {
            $sprint = Sprint::where('project_id', $project->id)->orderBy('created_at', 'desc')->first();
        }

        if (!$sprint) {
            return response()->json([
                'success' => false,
                'message' => 'No sprint found for burndown chart.',
            ], 404);
        }

        $issues = WorkItem::where('sprint_id', $sprint->id)->get();
        $totalCommitted = $issues->sum('story_points') ?: 20;

        $startDate = $sprint->start_date ? Carbon::parse($sprint->start_date) : now()->subDays(7);
        $endDate = $sprint->end_date ? Carbon::parse($sprint->end_date) : now()->addDays(7);
        $totalDays = max(1, $startDate->diffInDays($endDate));

        $dailyPoints = [];
        $runningRemaining = $totalCommitted;

        for ($i = 0; $i <= $totalDays; $i++) {
            $currentDay = $startDate->copy()->addDays($i);
            $dayLabel = $currentDay->format('M d');

            // Ideal Line
            $idealRemaining = max(0, round($totalCommitted - ($totalCommitted / $totalDays) * $i, 1));

            // Actual Line (only for past and today)
            $isPastOrToday = $currentDay->lte(now()->endOfDay());

            if ($isPastOrToday) {
                $completedOnOrBefore = $issues->filter(function ($item) use ($currentDay) {
                    return $item->status === 'done' && $item->completed_at && Carbon::parse($item->completed_at)->lte($currentDay->endOfDay());
                })->sum('story_points');

                $actualRemaining = max(0, $totalCommitted - $completedOnOrBefore);
            } else {
                $actualRemaining = null;
            }

            $dailyPoints[] = [
                'day' => $dayLabel,
                'ideal' => $idealRemaining,
                'actual' => $actualRemaining,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'sprint' => [
                    'id' => $sprint->id,
                    'name' => $sprint->name,
                    'goal' => $sprint->goal,
                    'status' => $sprint->status,
                ],
                'total_committed_points' => $totalCommitted,
                'burndown_series' => $dailyPoints,
            ],
        ]);
    }

    public function velocity(Request $request, string $projectIdOrKey): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $project = Project::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($projectIdOrKey) {
                $q->where('id', $projectIdOrKey)->orWhere('key', strtoupper($projectIdOrKey));
            })
            ->firstOrFail();

        $sprints = Sprint::where('project_id', $project->id)
            ->with('workItems')
            ->orderBy('created_at', 'asc')
            ->take(6)
            ->get();

        $velocitySeries = $sprints->map(function ($s) {
            $committed = $s->workItems->sum('story_points') ?: 10;
            $completed = $s->workItems->where('status', 'done')->sum('story_points');

            return [
                'sprint' => $s->name,
                'committed' => $committed,
                'completed' => $completed,
            ];
        });

        $avgVelocity = $velocitySeries->count() > 0
            ? round($velocitySeries->avg('completed'), 1)
            : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'velocity_series' => $velocitySeries,
                'average_velocity' => $avgVelocity,
            ],
        ]);
    }
}

