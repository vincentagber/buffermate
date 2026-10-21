<?php

namespace App\Jobs;

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\Workspace;
use App\Services\Ai\GeminiDriver;
use App\Services\Guardrails\DuplicateContentGuard;
use App\Services\Guardrails\KeywordFilterGuard;
use App\Services\Guardrails\QuietHoursGuard;
use App\Services\Publishing\PublishingEngine;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class RunAutopilotCycleJob implements ShouldQueue
{
    use Queueable;

    public function handle(
        GeminiDriver $ai,
        QuietHoursGuard $quietHours,
        KeywordFilterGuard $keywords,
        DuplicateContentGuard $duplicate,
        PublishingEngine $publishingEngine
    ): void {
        Log::info('[RunAutopilotCycleJob] Running autonomous cycle...');

        $workspaces = Workspace::all();

        foreach ($workspaces as $ws) {
            // Check kill switch
            if ($ws->settings['autopilot_killed'] ?? false) {
                Log::warning("[Autopilot] Kill switch active for workspace {$ws->name}");
                continue;
            }

            // Check quiet hours
            $tz = $ws->timezone ?: 'Africa/Lagos';
            $quietCheck = $quietHours->check($tz);
            if (!$quietCheck['passed']) {
                Log::info("[Autopilot] Skipped workspace {$ws->name}: {$quietCheck['message']}");
                continue;
            }

            // Generate content
            $aiRes = $ai->generateSocialPost(
                topic: 'Digital Marketing & Growth Automation',
                tone: 'Authoritative & Engaging',
                platform: 'all'
            );

            if (!$aiRes['success']) {
                continue;
            }

            $caption = $aiRes['data']['caption'] ?? '';

            // Check keywords
            $keywordCheck = $keywords->check($caption);
            if (!$keywordCheck['passed']) {
                Log::warning("[Autopilot] Blocked by keyword filter: {$keywordCheck['message']}");
                continue;
            }

            // Check duplicate
            $dupCheck = $duplicate->check($ws->id, $caption);
            if (!$dupCheck['passed']) {
                Log::warning("[Autopilot] Blocked by duplicate guard: {$dupCheck['message']}");
                continue;
            }

            // Schedule post
            $publishingEngine->schedulePost([
                'workspaceId' => $ws->id,
                'creatorUserId' => $ws->owner_user_id ?: 'system_autopilot',
                'content' => $caption,
                'destinations' => [
                    ['platform' => 'instagram'],
                    ['platform' => 'facebook'],
                ],
                'scheduledAt' => now()->addMinutes(30)->toIso8601String(),
                'requireApproval' => $ws->settings['require_approval'] ?? false,
            ]);

            Log::info("[Autopilot] Scheduled autonomous post for workspace {$ws->name}");
        }
    }
}
