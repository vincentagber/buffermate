<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClinicReportController extends Controller
{
    private function resolveWorkspace(Request $request): ?Workspace
    {
        $wsId = $request->header('X-Workspace-Id')
            ?: $request->input('workspaceId')
            ?: $request->route('workspaceId');

        if ($wsId) {
            $ws = Workspace::where('id', $wsId)->orWhere('slug', $wsId)->first();
            if ($ws) return $ws;
        }

        return Workspace::first();
    }

    public function index(Request $request): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);
        $settings = $workspace?->settings ?: [];

        $dateRange = $request->input('date_range', '1-30 Sep 2026');
        $comparison = $request->input('comparison', 'vs Aug 2026');
        $provider = $request->input('provider', 'All providers');
        $search = strtolower(trim($request->input('search', '')));

        $isLiftApplied = (bool) ($settings['ortiz_slot_lift_applied'] ?? false);

        // Base Provider Utilisation Data
        $providers = [
            [
                'id' => 'p1',
                'name' => 'Dr. Ines Varga',
                'title' => 'Injector',
                'revenue' => '$58.4k',
                'revenue_raw' => 58400,
                'utilisation' => 86,
                'booked_hours' => 137.6,
                'available_hours' => 160,
                'avatar' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
                'specialty' => 'Injectables',
            ],
            [
                'id' => 'p2',
                'name' => 'Leo Park, RN',
                'title' => 'Aesthetics',
                'revenue' => '$34.1k',
                'revenue_raw' => 34100,
                'utilisation' => 78,
                'booked_hours' => 124.8,
                'available_hours' => 160,
                'avatar' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
                'specialty' => 'Facials & skin',
            ],
            [
                'id' => 'p3',
                'name' => 'Nina Alvarez',
                'title' => 'Skin therapist',
                'revenue' => '$22.6k',
                'revenue_raw' => 22600,
                'utilisation' => 72,
                'booked_hours' => 115.2,
                'available_hours' => 160,
                'avatar' => 'https://images.unsplash.com/photo-1594824813589-9a0714b1f6a1?w=120&auto=format&fit=crop&q=80',
                'specialty' => 'Facials & skin',
            ],
            [
                'id' => 'p4',
                'name' => 'Dr. James Ortiz',
                'title' => 'Laser & body',
                'revenue' => $isLiftApplied ? '$31.8k' : '$27.3k',
                'revenue_raw' => $isLiftApplied ? 31800 : 27300,
                'utilisation' => $isLiftApplied ? 76 : 64,
                'booked_hours' => $isLiftApplied ? 121.6 : 102.4,
                'available_hours' => 160,
                'avatar' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
                'specialty' => 'Laser & body',
            ],
        ];

        // Filter by Provider if specified
        if ($provider !== 'All providers') {
            $matched = array_values(array_filter($providers, fn($p) => $p['name'] === $provider));
            if (!empty($matched)) {
                $p = $matched[0];
                $kpi = [
                    'revenue' => $p['revenue'],
                    'revenue_raw' => $p['revenue_raw'],
                    'revenue_change' => '+16.2%',
                    'avg_ticket' => '$425',
                    'avg_ticket_change' => '+$32',
                    'rebooking_rate' => $p['utilisation'] . '%',
                    'rebooking_rate_change' => '+5 pts',
                    'new_clients' => round($p['revenue_raw'] / 3800),
                    'new_clients_change' => '+4',
                    'retention_90d' => '78%',
                    'retention_90d_change' => '+3 pts',
                ];
            }
        }

        if (!isset($kpi)) {
            $totalRevRaw = array_sum(array_column($providers, 'revenue_raw')) + 11100; // includes retail
            $kpi = [
                'revenue' => '$' . number_format($totalRevRaw),
                'revenue_raw' => $totalRevRaw,
                'revenue_change' => '18.4%',
                'avg_ticket' => '$412',
                'avg_ticket_change' => '$26',
                'rebooking_rate' => '68%',
                'rebooking_rate_change' => '4 pts',
                'new_clients' => 38,
                'new_clients_change' => '9',
                'retention_90d' => '74%',
                'retention_90d_change' => '2 pts',
            ];
        }

        // Categories Breakdown
        $categories = [
            [
                'id' => 'injectables',
                'name' => 'Injectables',
                'revenue' => '$61.2k',
                'pct' => 43,
                'change' => '+ 22%',
                'trend' => 'up',
            ],
            [
                'id' => 'facials',
                'name' => 'Facials & skin',
                'revenue' => '$32.4k',
                'pct' => 23,
                'change' => '+ 14%',
                'trend' => 'up',
            ],
            [
                'id' => 'laser',
                'name' => 'Laser & light',
                'revenue' => '$24.9k',
                'pct' => 17,
                'change' => '+ 0%',
                'trend' => 'flat',
            ],
            [
                'id' => 'contouring',
                'name' => 'Body contouring',
                'revenue' => '$12.8k',
                'pct' => 9,
                'change' => '+ 31%',
                'trend' => 'up',
            ],
            [
                'id' => 'retail',
                'name' => 'Retail',
                'revenue' => '$11.1k',
                'pct' => 8,
                'change' => '- 3%',
                'trend' => 'down',
            ],
        ];

        // Search Filter
        if ($search !== '') {
            $providers = array_values(array_filter($providers, function ($p) use ($search) {
                return str_contains(strtolower($p['name']), $search) || str_contains(strtolower($p['title']), $search);
            }));
            $categories = array_values(array_filter($categories, function ($c) use ($search) {
                return str_contains(strtolower($c['name']), $search);
            }));
        }

        // Funnel Stages
        $funnelStages = [
            ['name' => 'Consult', 'rate' => '100%', 'count' => '212 clients', 'height' => 100, 'isHighlight' => false, 'color' => 'bg-[#DDD6FE]'],
            ['name' => 'Plan', 'rate' => '84%', 'count' => '178 clients', 'height' => 84, 'isHighlight' => false, 'color' => 'bg-[#DDD6FE]'],
            ['name' => 'Consent', 'rate' => '58%', 'count' => '123 clients', 'height' => 58, 'isHighlight' => true, 'color' => 'bg-[#F6BA47]', 'note' => 'Biggest drop'],
            ['name' => 'Appt', 'rate' => '55%', 'count' => '117 clients', 'height' => 55, 'isHighlight' => false, 'color' => 'bg-[#DDD6FE]'],
            ['name' => 'Treated', 'rate' => '53%', 'count' => '112 clients', 'height' => 53, 'isHighlight' => false, 'color' => 'bg-[#DDD6FE]'],
            ['name' => 'Aftercare', 'rate' => '53%', 'count' => '112 clients', 'height' => 53, 'isHighlight' => false, 'color' => 'bg-[#DDD6FE]'],
            ['name' => 'Follow-up', 'rate' => '47%', 'count' => '100 clients', 'height' => 47, 'isHighlight' => false, 'color' => 'bg-[#DDD6FE]'],
            ['name' => 'Rebooked', 'rate' => '36%', 'count' => '76 clients', 'height' => 36, 'isHighlight' => true, 'color' => 'bg-[#BEE68D]', 'isSuccess' => true],
        ];

        // Cohort Matrix
        $cohortMatrix = [
            ['month' => 'Apr', 'm1' => '78%', 'm2' => '69%', 'm3' => '64%', 'm4' => '61%', 'm5' => '58%'],
            ['month' => 'May', 'm1' => '81%', 'm2' => '72%', 'm3' => '66%', 'm4' => '62%', 'm5' => null],
            ['month' => 'Jun', 'm1' => '76%', 'm2' => '70%', 'm3' => '63%', 'm4' => null, 'm5' => null],
            ['month' => 'Jul', 'm1' => '83%', 'm2' => '74%', 'm3' => null, 'm4' => null, 'm5' => null],
            ['month' => 'Aug', 'm1' => '85%', 'm2' => null, 'm3' => null, 'm4' => null, 'm5' => null],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'date_range' => $dateRange,
                'comparison' => $comparison,
                'provider' => $provider,
                'kpi' => $kpi,
                'categories' => $categories,
                'providers' => $providers,
                'funnel_stages' => $funnelStages,
                'cohort_matrix' => $cohortMatrix,
                'is_lift_applied' => $isLiftApplied,
            ],
        ]);
    }

    public function applyUtilizationLift(Request $request): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);
        if (!$workspace) {
            return response()->json(['success' => false, 'message' => 'Workspace not found'], 404);
        }

        $settings = $workspace->settings ?: [];
        $settings['ortiz_slot_lift_applied'] = true;
        $workspace->settings = $settings;
        $workspace->save();

        return response()->json([
            'success' => true,
            'message' => 'Applied 6 laser slots for Dr. Ortiz. Projected utilisation lifted to 76%.',
            'lift_applied' => true,
        ]);
    }
}

