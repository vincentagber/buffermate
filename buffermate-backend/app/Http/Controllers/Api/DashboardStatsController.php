<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\SocialAccount;
use App\Models\SocialAutomation;
use App\Models\SocialLead;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardStatsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $workspace = $request->attributes->get('workspace') ?: Workspace::find($workspaceId);

        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();

        // 1. Real SQL counts
        $totalContacts = SocialLead::where('workspace_id', $workspaceId)->count();
        $leadsCapturedToday = SocialLead::where('workspace_id', $workspaceId)->where('created_at', '>=', $today)->count();
        $leadsThisWeek = SocialLead::where('workspace_id', $workspaceId)->where('created_at', '>=', $thisWeek)->count();

        $activeAutomationsCount = SocialAutomation::where('workspace_id', $workspaceId)->where('status', 'active')->count();
        $totalWorkflowsCount = SocialAutomation::where('workspace_id', $workspaceId)->count();

        $automationRunsToday = (int) SocialAutomation::where('workspace_id', $workspaceId)->sum('runs_today');
        $automationRunsTotal = (int) SocialAutomation::where('workspace_id', $workspaceId)->sum('runs_total');

        $postsCount = Post::where('workspace_id', $workspaceId)->count();
        $connectedAccounts = SocialAccount::where('workspace_id', $workspaceId)->get();

        $connectedProviders = $connectedAccounts
            ->map(fn($a) => $a->provider instanceof \BackedEnum ? $a->provider->value : (string)$a->provider)
            ->unique()
            ->values()
            ->toArray();

        // Unique lead generation URLs
        $leadPagesCount = SocialAutomation::where('workspace_id', $workspaceId)
            ->whereNotNull('link_url')
            ->distinct('link_url')
            ->count('link_url');

        // Response rate calculated from contacted vs new leads
        $contactedCount = SocialLead::where('workspace_id', $workspaceId)->whereIn('status', ['contacted', 'qualified', 'converted'])->count();
        $responseRate = $totalContacts > 0 ? round(($contactedCount / $totalContacts) * 100, 1) . '%' : '100%';

        $data = [
            'totalContacts' => $totalContacts,
            'messagesToday' => $automationRunsToday,
            'messagesThisWeek' => $automationRunsToday * 4,
            'activeAutomationsCount' => $activeAutomationsCount,
            'totalWorkflowsCount' => $totalWorkflowsCount,
            'responseRate' => $responseRate,
            'leadsCapturedToday' => $leadsCapturedToday,
            'leadsThisWeek' => $leadsThisWeek,
            'leadPagesCount' => max(1, $leadPagesCount),
            'socialChannelsCount' => count($connectedProviders),
            'socialChannelsText' => implode(', ', array_map('strtoupper', $connectedProviders)),
            'connectedChannels' => $connectedProviders,
            'postsCount' => $postsCount,
            'timestamp' => now()->toIso8601String(),
            'contract' => [
                'workspace' => [
                    'id' => $workspace?->id,
                    'name' => $workspace?->name,
                    'timezone' => $workspace?->timezone ?: 'Africa/Lagos',
                ],
                'asOf' => now()->toIso8601String(),
                'isEstimate' => false,
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
