<?php

namespace App\Services\Publishing;

use App\Enums\PostStatus;
use App\Enums\SocialChannel;
use App\Models\Post;
use App\Models\PublishJob;
use App\Models\SocialAccount;
use App\Services\Social\FacebookProvider;
use App\Services\Social\InstagramProvider;
use App\Services\Social\LinkedInProvider;
use App\Services\Social\TikTokProvider;
use App\Services\Social\TwitterProvider;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PublishingEngine
{
    protected array $providers = [];

    public function __construct()
    {
        $this->providers = [
            'x' => new TwitterProvider(),
            'twitter' => new TwitterProvider(),
            'facebook' => new FacebookProvider(),
            'instagram' => new InstagramProvider(),
            'linkedin' => new LinkedInProvider(),
            'tiktok' => new TikTokProvider(),
        ];
    }

    public function getProvider(string $platform)
    {
        return $this->providers[strtolower($platform)] ?? null;
    }

    public function generateIdempotencyKey(string $workspaceId, string $postId, string $platform, string $scheduledAt): string
    {
        $ts = Carbon::parse($scheduledAt)->timestamp;
        return "pub_{$workspaceId}_{$postId}_{$platform}_{$ts}";
    }

    public function schedulePost(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $workspaceId = $data['workspaceId'];
            $creatorUserId = $data['creatorUserId'];
            $content = $data['content'];
            $destinations = $data['destinations'] ?? [];
            $attachments = $data['attachments'] ?? [];
            $scheduledAt = Carbon::parse($data['scheduledAt'] ?? now());
            $requireApproval = $data['requireApproval'] ?? false;

            // 1. Validation across all destinations
            $validationErrors = [];
            foreach ($destinations as $dest) {
                $platform = $dest['platform'] instanceof SocialChannel ? $dest['platform']->value : (string)$dest['platform'];
                $provider = $this->getProvider($platform);
                if ($provider) {
                    $res = $provider->validatePost($content, $attachments);
                    if (!$res['valid']) {
                        $validationErrors[$platform] = $res['errors'];
                    }
                }
            }

            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'validationErrors' => $validationErrors,
                ];
            }

            // 2. Create the Post record
            $post = Post::create([
                'workspace_id' => $workspaceId,
                'user_id' => $creatorUserId,
                'content' => $content,
                'attachments' => $attachments,
                'status' => $requireApproval ? PostStatus::DRAFT : PostStatus::SCHEDULED,
                'approval_state' => $requireApproval ? 'in_review' : 'approved',
                'scheduled_at' => $scheduledAt,
            ]);

            // 3. Create destination publish jobs with deterministic idempotency keys
            $jobs = [];
            foreach ($destinations as $dest) {
                $platform = $dest['platform'] instanceof SocialChannel ? $dest['platform']->value : (string)$dest['platform'];
                $idempotencyKey = $this->generateIdempotencyKey(
                    $workspaceId,
                    $post->id,
                    $platform,
                    $scheduledAt->toIso8601String()
                );

                $job = PublishJob::firstOrCreate(
                    ['idempotency_key' => $idempotencyKey],
                    [
                        'workspace_id' => $workspaceId,
                        'post_id' => $post->id,
                        'social_account_id' => $dest['socialAccountId'] ?? null,
                        'platform' => $platform,
                        'scheduled_at' => $scheduledAt,
                        'status' => 'scheduled',
                    ]
                );

                $jobs[] = $job;
            }

            return [
                'success' => true,
                'post' => $post,
                'jobs' => $jobs,
            ];
        });
    }

    /**
     * Executes due publishing jobs.
     */
    public function executeDueJobs(?Carbon $now = null): array
    {
        $now = $now ?: Carbon::now();
        $dueJobs = PublishJob::with(['post', 'socialAccount'])
            ->where('status', 'scheduled')
            ->where('scheduled_at', '<=', $now)
            ->limit(20)
            ->get();

        $results = [];

        foreach ($dueJobs as $job) {
            $results[] = $this->executeSingleJob($job);
        }

        return $results;
    }

    public function executeSingleJob(PublishJob $job): array
    {
        $job->update([
            'status' => 'publishing',
            'lock_acquired_at' => now(),
            'attempts' => $job->attempts + 1,
        ]);

        $platform = $job->platform->value ?? (string)$job->platform;
        $provider = $this->getProvider($platform);

        if (!$provider) {
            $job->update([
                'status' => 'failed',
                'error_code' => 'UNKNOWN_PROVIDER',
                'error_message' => "No provider registered for {$platform}",
            ]);
            return ['job_id' => $job->id, 'status' => 'failed'];
        }

        $configStatus = $provider->isConfigured();
        if (!$configStatus['configured']) {
            $job->update([
                'status' => 'failed',
                'error_code' => 'PROVIDER_NOT_CONFIGURED',
                'error_message' => "Missing credentials: " . implode(', ', $configStatus['missingCredentials']),
            ]);

            // Update parent post status if all jobs failed
            $this->reconcilePostStatus($job->post);

            return ['job_id' => $job->id, 'status' => 'failed'];
        }

        // Publish with social account or fallback
        $account = $job->socialAccount ?: new SocialAccount([
            'provider' => $platform,
            'provider_user_id' => 'default',
        ]);

        $res = $provider->publish($account, $job->post->content, $job->post->attachments ?? []);

        if ($res['success']) {
            $job->update([
                'status' => 'published',
                'external_post_id' => $res['external_post_id'] ?? null,
                'result_payload' => $res,
            ]);
        } else {
            $job->update([
                'status' => 'failed',
                'error_code' => $res['error_code'] ?? 'PUBLISH_FAILED',
                'error_message' => $res['message'] ?? 'Publishing failed',
            ]);
        }

        $this->reconcilePostStatus($job->post);

        return ['job_id' => $job->id, 'status' => $job->status];
    }

    protected function reconcilePostStatus(Post $post): void
    {
        $jobs = $post->publishJobs()->get();
        if ($jobs->isEmpty()) return;

        $statuses = $jobs->pluck('status')->toArray();

        if (collect($statuses)->every(fn($s) => $s === 'published')) {
            $post->update(['status' => PostStatus::PUBLISHED, 'posted_at' => now()]);
        } elseif (collect($statuses)->every(fn($s) => $s === 'failed')) {
            $post->update(['status' => PostStatus::FAILED]);
        } elseif (collect($statuses)->contains('published')) {
            $post->update(['status' => PostStatus::PARTIALLY_PUBLISHED]);
        }
    }
}
