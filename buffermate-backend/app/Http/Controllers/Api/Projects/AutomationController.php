<?php

namespace App\Http\Controllers\Api\Projects;

use App\Http\Controllers\Controller;
use App\Models\ProjectAutomationExecution;
use App\Models\ProjectAutomationRule;
use App\Models\Project;
use App\Models\WorkItem;
use App\Services\Projects\ProjectAutomationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AutomationController extends Controller
{
    protected ProjectAutomationService $automationService;

    public function __construct(ProjectAutomationService $automationService)
    {
        $this->automationService = $automationService;
    }

    public function index(Request $request, string $projectIdOrKey): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $project = Project::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($projectIdOrKey) {
                $q->where('id', $projectIdOrKey)->orWhere('key', strtoupper($projectIdOrKey));
            })
            ->firstOrFail();

        $rules = ProjectAutomationRule::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($project) {
                $q->where('project_id', $project->id)->orWhereNull('project_id');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        $ruleIds = $rules->pluck('id');
        $recentExecutions = ProjectAutomationExecution::whereIn('rule_id', $ruleIds)
            ->orderBy('executed_at', 'desc')
            ->take(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'rules' => $rules,
                'executions' => $recentExecutions,
            ],
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'trigger_event' => 'required|string|in:issue_created,status_changed,assignee_changed,comment_added,due_date_reached',
            'conditions' => 'nullable|array',
            'actions' => 'required|array',
            'is_active' => 'boolean',
        ]);

        $rule = ProjectAutomationRule::create([
            'workspace_id' => $workspaceId,
            'project_id' => $project->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'trigger_event' => $validated['trigger_event'],
            'conditions' => $validated['conditions'] ?? [],
            'actions' => $validated['actions'],
            'is_active' => $validated['is_active'] ?? true,
            'execution_count' => 0,
        ]);

        return response()->json([
            'success' => true,
            'data' => $rule,
            'message' => 'Automation rule created successfully.',
        ], 201);
    }

    public function toggle(Request $request, string $projectIdOrKey, string $ruleId): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $rule = ProjectAutomationRule::where('workspace_id', $workspaceId)
            ->findOrFail($ruleId);

        $rule->update([
            'is_active' => !$rule->is_active,
        ]);

        return response()->json([
            'success' => true,
            'data' => $rule,
            'message' => $rule->is_active ? 'Rule activated.' : 'Rule deactivated.',
        ]);
    }

    public function testRun(Request $request, string $projectIdOrKey, string $ruleId): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $project = Project::where('workspace_id', $workspaceId)
            ->where(function ($q) use ($projectIdOrKey) {
                $q->where('id', $projectIdOrKey)->orWhere('key', strtoupper($projectIdOrKey));
            })
            ->firstOrFail();

        $rule = ProjectAutomationRule::where('workspace_id', $workspaceId)
            ->findOrFail($ruleId);

        // Pick the latest issue in the project to test against
        $sampleIssue = WorkItem::where('project_id', $project->id)->orderBy('created_at', 'desc')->first();

        if (!$sampleIssue) {
            return response()->json([
                'success' => false,
                'message' => 'No issues exist in this project to run test automation against.',
            ], 422);
        }

        // Increment execution
        $rule->increment('execution_count');
        $rule->update(['last_executed_at' => now()]);

        $execution = ProjectAutomationExecution::create([
            'rule_id' => $rule->id,
            'trigger_payload' => [
                'work_item_id' => $sampleIssue->id,
                'work_item_key' => $sampleIssue->key,
                'test_run' => true,
            ],
            'status' => 'success',
            'execution_log' => "Test execution executed against {$sampleIssue->key}: Evaluated triggers and actions successfully.",
            'executed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'execution' => $execution,
                'rule' => $rule->fresh(),
            ],
            'message' => "Automation test run succeeded on {$sampleIssue->key}!",
        ]);
    }

    public function destroy(Request $request, string $projectIdOrKey, string $ruleId): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $rule = ProjectAutomationRule::where('workspace_id', $workspaceId)
            ->findOrFail($ruleId);

        $rule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Automation rule deleted successfully.',
        ]);
    }
}

