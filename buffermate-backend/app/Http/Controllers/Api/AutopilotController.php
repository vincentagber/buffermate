<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Workspace;
use App\Services\Ai\GeminiDriver;
use App\Services\Guardrails\DuplicateContentGuard;
use App\Services\Guardrails\KeywordFilterGuard;
use App\Services\Guardrails\QuietHoursGuard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AutopilotController extends Controller
{
    public function getConfig(Request $request): JsonResponse
    {
        $workspace = $request->attributes->get('workspace');
        $settings = $workspace->settings ?? [];

        return response()->json([
            'success' => true,
            'config' => [
                'enabled' => $settings['autopilot_enabled'] ?? true,
                'killed' => $settings['autopilot_killed'] ?? false,
                'require_approval' => $settings['require_approval'] ?? false,
                'timezone' => $workspace->timezone ?: 'Africa/Lagos',
                'target_channels' => $settings['target_channels'] ?? ['instagram', 'facebook', 'x', 'tiktok'],
                'frequency_per_day' => $settings['frequency_per_day'] ?? 2,
            ],
        ]);
    }

    public function updateConfig(Request $request): JsonResponse
    {
        $workspace = $request->attributes->get('workspace');
        $settings = $workspace->settings ?? [];

        $newSettings = array_merge($settings, $request->only([
            'autopilot_enabled', 'require_approval', 'target_channels', 'frequency_per_day'
        ]));

        $workspace->update(['settings' => $newSettings]);

        return response()->json([
            'success' => true,
            'config' => $newSettings,
        ]);
    }

    public function killSwitch(Request $request): JsonResponse
    {
        $workspace = $request->attributes->get('workspace');
        $userId = $request->attributes->get('supabase_user_id');
        $reason = $request->input('reason', 'Manual emergency stop triggered');

        $settings = $workspace->settings ?? [];
        $settings['autopilot_killed'] = true;
        $workspace->update(['settings' => $settings]);

        AuditLog::log(
            $workspace->id,
            $userId,
            'autopilot.kill_switch_activated',
            'workspace',
            $workspace->id,
            ['reason' => $reason]
        );

        return response()->json([
            'success' => true,
            'killed' => true,
            'message' => 'Emergency kill switch activated. All autonomous actions halted.',
        ]);
    }

    public function dryRun(
        Request $request,
        GeminiDriver $ai,
        QuietHoursGuard $quietHours,
        KeywordFilterGuard $keywords,
        DuplicateContentGuard $duplicate
    ): JsonResponse {
        $workspace = $request->attributes->get('workspace');
        $topic = $request->input('topic', 'Digital Marketing & Growth Automation');

        // 1. Dry run AI generation
        $aiRes = $ai->generateSocialPost($topic);
        $caption = $aiRes['data']['caption'] ?? '';

        // 2. Check guardrails
        $quiet = $quietHours->check($workspace->timezone ?: 'Africa/Lagos');
        $keywordCheck = $keywords->check($caption);
        $duplicateCheck = $duplicate->check($workspace->id, $caption);

        return response()->json([
            'success' => true,
            'is_dry_run' => true,
            'generated_content' => $aiRes['data'] ?? [],
            'guardrails' => [
                'quiet_hours' => $quiet,
                'keyword_filter' => $keywordCheck,
                'duplicate_prevented' => $duplicateCheck,
            ],
            'action_result' => [
                'executed' => false,
                'side_effects' => 0,
            ],
        ]);
    }
}
