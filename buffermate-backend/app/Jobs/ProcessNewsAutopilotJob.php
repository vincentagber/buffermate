<?php

namespace App\Jobs;

use App\Enums\PostStatus;
use App\Models\AuditLog;
use App\Models\NewsTopic;
use App\Models\Post;
use App\Models\PublishJob;
use App\Models\SocialAccount;
use App\Models\Workspace;
use App\Services\Ai\GeminiDriver;
use App\Services\Guardrails\QuietHoursGuard;
use App\Services\News\EditorialValidatorService;
use App\Services\News\NewsDiscoveryService;
use App\Services\Publishing\PublishingEngine;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessNewsAutopilotJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $workspaceId,
        public bool $forceRun = false,
        public int $maxTopicsToProcess = 1
    ) {
    }

    public function handle(
        NewsDiscoveryService $discovery,
        GeminiDriver $ai,
        EditorialValidatorService $editorialValidator,
        QuietHoursGuard $quietHours,
        PublishingEngine $publishingEngine
    ): array {
        $workspace = Workspace::find($this->workspaceId);
        if (!$workspace) {
            Log::warning("[ProcessNewsAutopilotJob] Workspace {$this->workspaceId} not found");
            return ['success' => false, 'error' => 'Workspace not found'];
        }

        $settings = $workspace->settings ?? [];

        // 1. Check emergency kill switch
        if (!empty($settings['autopilot_killed'])) {
            Log::info("[ProcessNewsAutopilotJob] Workspace {$workspace->id} autopilot is killed. Halting.");
            return ['success' => false, 'killed' => true, 'message' => 'Autopilot kill switch active'];
        }

        // 2. Check quiet hours guard unless forced
        if (!$this->forceRun) {
            $quietCheck = $quietHours->check($workspace->timezone ?: 'Africa/Lagos');
            if ($quietCheck['is_quiet_hours']) {
                Log::info("[ProcessNewsAutopilotJob] Workspace {$workspace->id} in quiet hours window ({$quietCheck['local_time']})");
                return ['success' => false, 'quiet_hours' => true, 'local_time' => $quietCheck['local_time']];
            }
        }

        // 3. Run news & trend discovery
        $discoveryStats = $discovery->runForWorkspace($workspace);

        // 4. Query connected social accounts for this workspace
        $connectedAccounts = SocialAccount::where('workspace_id', $workspace->id)
            ->where('health_status', 'connected')
            ->get();

        // Filter to only accounts where news automation is enabled
        $enabledAccounts = $connectedAccounts->filter(fn(SocialAccount $acc) => $acc->isNewsAutomationEnabled());

        if ($enabledAccounts->isEmpty()) {
            Log::info("[ProcessNewsAutopilotJob] No connected accounts enabled for news automation in workspace {$workspace->id}");
            return [
                'success' => true,
                'discovery' => $discoveryStats,
                'processed_topics' => 0,
                'message' => 'Discovery completed, but no connected accounts have news automation enabled.',
            ];
        }

        // 5. Select top discovered candidate topics
        $candidateTopics = NewsTopic::where('workspace_id', $workspace->id)
            ->where('status', 'discovered')
            ->orderByDesc('score')
            ->limit($this->maxTopicsToProcess)
            ->get();

        if ($candidateTopics->isEmpty()) {
            return [
                'success' => true,
                'discovery' => $discoveryStats,
                'processed_topics' => 0,
                'message' => 'No new qualified topics to publish.',
            ];
        }

        $processedCount = 0;
        $postsCreated = [];

        foreach ($candidateTopics as $topic) {
            $platforms = $enabledAccounts->map(fn($acc) => $acc->provider->value)->unique()->values()->all();

            // Generate grounded social post copy via GeminiDriver
            $aiRes = $ai->generateNewsSocialPost($topic->toArray(), $platforms);
            $aiData = $aiRes['data'] ?? [];
            $platformPosts = $aiData['platform_posts'] ?? [];

            // Primary post content (Facebook preferred or first platform post or headline)
            $primaryContent = $platformPosts['facebook']['caption']
                ?? (reset($platformPosts)['caption'] ?? "{$topic->title}\n\n{$topic->summary}");

            // Run editorial risk validation
            $editorial = $editorialValidator->evaluate($topic->title, $primaryContent, $topic->source_urls ?? []);
            $requiresHumanReviewEditorial = $editorial['requires_human_approval'];

            DB::transaction(function () use (
                $workspace,
                $topic,
                $enabledAccounts,
                $platformPosts,
                $primaryContent,
                $requiresHumanReviewEditorial,
                $publishingEngine,
                $settings,
                &$postsCreated
            ) {
                $scheduledAt = Carbon::now()->addMinutes(15);

                // Group accounts by review requirement:
                // If account requires review OR workspace global setting requires review OR editorial risk is high
                foreach ($enabledAccounts as $account) {
                    $platform = $account->provider->value;

                    // Respect NEWSPILOT_FB_ENABLED environment flag
                    if ($platform === 'facebook' && (env('NEWSPILOT_FB_ENABLED') === '0' || config('services.newspilot.fb_enabled') === '0')) {
                        continue;
                    }

                    $platformContent = $platformPosts[$platform]['caption'] ?? $primaryContent;

                    // NewsPilot environment override for global approval requirement
                    $envHumanApproval = config('services.newspilot.human_approval_required', env('NEWSPILOT_HUMAN_APPROVAL_REQUIRED', 0));

                    $mustReview = $account->requiresManualReview()
                        || (!empty($settings['require_approval']))
                        || ($envHumanApproval == 1)
                        || $requiresHumanReviewEditorial;

                    $postStatus = $mustReview ? PostStatus::DRAFT : PostStatus::SCHEDULED;
                    $approvalState = $mustReview ? 'in_review' : 'approved';

                    // Attach story media image if present in sources
                    $attachments = [];
                    if (!empty($topic->source_urls[0]['media_url'])) {
                        $attachments[] = $topic->source_urls[0]['media_url'];
                    }

                    $post = Post::create([
                        'workspace_id' => $workspace->id,
                        'user_id' => $workspace->owner_user_id ?: 'system',
                        'content' => $platformContent,
                        'attachments' => $attachments,
                        'status' => $postStatus,
                        'approval_state' => $approvalState,
                        'scheduled_at' => $scheduledAt,
                    ]);

                    $idempotencyKey = $publishingEngine->generateIdempotencyKey(
                        $workspace->id,
                        $post->id,
                        $platform,
                        $scheduledAt->toIso8601String()
                    );

                    $job = PublishJob::create([
                        'workspace_id' => $workspace->id,
                        'post_id' => $post->id,
                        'social_account_id' => $account->id,
                        'platform' => $platform,
                        'scheduled_at' => $scheduledAt,
                        'status' => $mustReview ? 'pending_approval' : 'scheduled',
                        'idempotency_key' => $idempotencyKey,
                    ]);

                    $postsCreated[] = [
                        'post_id' => $post->id,
                        'platform' => $platform,
                        'account_id' => $account->id,
                        'mode' => $mustReview ? 'manual_review' : 'auto_publish',
                        'status' => $postStatus->value,
                    ];
                }

                // Update topic status
                $allReview = collect($postsCreated)->every(fn($p) => $p['mode'] === 'manual_review');
                $topic->update([
                    'status' => $allReview ? 'drafted' : 'scheduled',
                    'post_id' => $postsCreated[0]['post_id'] ?? null,
                ]);
            });

            $processedCount++;
        }

        // Execute due publishing jobs if any were scheduled for immediate publish
        $publishResults = $publishingEngine->executeDueJobs();

        return [
            'success' => true,
            'discovery' => $discoveryStats,
            'processed_topics' => $processedCount,
            'posts_created' => $postsCreated,
            'executed_jobs' => count($publishResults),
        ];
    }
}
