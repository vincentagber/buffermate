<?php

namespace App\Http\Controllers\Api;

use App\Enums\PostStatus;
use App\Http\Controllers\Controller;
use App\Jobs\ProcessNewsAutopilotJob;
use App\Models\AuditLog;
use App\Models\NewsFeed;
use App\Models\NewsTopic;
use App\Models\Post;
use App\Models\PublishJob;
use App\Models\SocialAccount;
use App\Models\Workspace;
use App\Services\Ai\GeminiDriver;
use App\Services\News\EditorialValidatorService;
use App\Services\News\FeedReaderService;
use App\Services\News\NewsDiscoveryService;
use App\Services\News\UrlSecurityValidator;
use App\Services\Publishing\PublishingEngine;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NewsPilotController extends Controller
{
    public function __construct(
        protected NewsDiscoveryService $discovery,
        protected FeedReaderService $feedReader,
        protected GeminiDriver $ai,
        protected EditorialValidatorService $editorialValidator,
        protected PublishingEngine $publishingEngine
    ) {
    }

    protected function resolveWorkspace(Request $request): Workspace
    {
        $ws = $request->attributes->get('workspace');
        if ($ws instanceof Workspace) {
            return $ws;
        }

        $wsId = $request->attributes->get('workspace_id')
            ?: $request->header('X-Workspace-Id')
            ?: $request->query('workspace_id');

        if ($wsId) {
            $found = Workspace::where('id', $wsId)->orWhere('slug', $wsId)->first();
            if ($found) {
                return $found;
            }
        }

        return Workspace::firstOrFail();
    }

    /**
     * Get feeds configured for workspace.
     */
    public function getFeeds(Request $request): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);

        $feeds = NewsFeed::where('workspace_id', $workspace->id)
            ->orderBy('priority', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $feeds,
        ]);
    }

    /**
     * Add or update an RSS/Atom feed.
     */
    public function storeFeed(Request $request): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);

        $request->validate([
            'name' => 'required|string|max:100',
            'url' => 'required|url|max:255',
            'category' => 'nullable|string|max:50',
            'keywords' => 'nullable|string|max:255',
            'priority' => 'nullable|integer|min:1|max:10',
            'enabled' => 'nullable|boolean',
        ]);

        $url = trim($request->input('url'));

        if (!UrlSecurityValidator::isSafeUrl($url)) {
            return response()->json([
                'success' => false,
                'message' => 'The provided feed URL is invalid or points to an unsafe network destination.',
            ], 422);
        }

        // Test fetching the feed
        try {
            $parsed = $this->feedReader->fetch($url, 3);
            if (empty($parsed)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Feed was reachable but contains no readable stories.',
                ], 422);
            }
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to parse feed: ' . $e->getMessage(),
            ], 422);
        }

        $feed = NewsFeed::updateOrCreate(
            [
                'workspace_id' => $workspace->id,
                'url' => $url,
            ],
            [
                'name' => $request->input('name'),
                'category' => $request->input('category', 'General'),
                'keywords' => $request->input('keywords'),
                'priority' => $request->input('priority', 5),
                'enabled' => $request->input('enabled', true),
                'last_fetch_at' => now(),
                'last_error' => null,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $feed,
            'message' => "Feed '{$feed->name}' verified and connected successfully.",
        ]);
    }

    /**
     * Delete a feed.
     */
    public function destroyFeed(Request $request, string $id): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);

        $deleted = NewsFeed::where('workspace_id', $workspace->id)
            ->where('id', $id)
            ->delete();

        return response()->json([
            'success' => (bool) $deleted,
            'message' => $deleted ? 'Feed removed successfully.' : 'Feed not found.',
        ]);
    }

    /**
     * List discovered news topics.
     */
    public function getTopics(Request $request): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);
        $status = $request->query('status', 'all');
        $category = $request->query('category');
        $search = $request->query('search');

        $query = NewsTopic::with('post')
            ->where('workspace_id', $workspace->id)
            ->orderByDesc('created_at');

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%");
            });
        }

        $topics = $query->paginate(25);

        return response()->json([
            'success' => true,
            'data' => $topics->items(),
            'pagination' => [
                'current_page' => $topics->currentPage(),
                'last_page' => $topics->lastPage(),
                'total' => $topics->total(),
            ],
        ]);
    }

    /**
     * Trigger the full NewsPilot discovery and publishing pipeline.
     */
    public function runPipeline(Request $request): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);

        $force = (bool) $request->input('force', true);
        $maxTopics = (int) $request->input('max_topics', 2);

        $job = new ProcessNewsAutopilotJob($workspace->id, $force, $maxTopics);
        $result = app()->call([$job, 'handle']);

        return response()->json([
            'success' => $result['success'] ?? false,
            'result' => $result,
            'message' => 'NewsPilot pipeline execution completed.',
        ]);
    }

    /**
     * Draft a social post from a discovered topic on-demand.
     */
    public function draftFromTopic(Request $request, string $id): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);
        $topic = NewsTopic::where('workspace_id', $workspace->id)->where('id', $id)->firstOrFail();

        // Get connected accounts
        $accounts = SocialAccount::where('workspace_id', $workspace->id)
            ->where('health_status', 'connected')
            ->get();

        $targetAccounts = $accounts->filter(fn($acc) => $acc->isNewsAutomationEnabled());
        if ($targetAccounts->isEmpty()) {
            $targetAccounts = $accounts; // fallback to all connected accounts
        }

        $platforms = $targetAccounts->map(fn($a) => $a->provider->value)->unique()->values()->all();
        if (empty($platforms)) {
            $platforms = ['facebook'];
        }

        $aiRes = $this->ai->generateNewsSocialPost($topic->toArray(), $platforms);
        $aiData = $aiRes['data'] ?? [];
        $platformPosts = $aiData['platform_posts'] ?? [];

        $primaryCaption = $platformPosts['facebook']['caption']
            ?? (reset($platformPosts)['caption'] ?? "{$topic->title}\n\n{$topic->summary}");

        // If user requested creating post record directly
        if ($request->input('create_post', false)) {
            $scheduledAt = Carbon::now()->addHours(2);
            $userId = $request->attributes->get('supabase_user_id') ?: 'manual';

            $post = Post::create([
                'workspace_id' => $workspace->id,
                'user_id' => $userId,
                'content' => $primaryCaption,
                'attachments' => [],
                'status' => PostStatus::DRAFT,
                'approval_state' => 'in_review',
                'scheduled_at' => $scheduledAt,
            ]);

            $topic->update([
                'status' => 'drafted',
                'post_id' => $post->id,
            ]);

            return response()->json([
                'success' => true,
                'post' => $post,
                'generated' => $aiData,
                'message' => 'Post drafted and sent to Approval Queue.',
            ]);
        }

        return response()->json([
            'success' => true,
            'topic' => $topic,
            'generated' => $aiData,
            'suggested_caption' => $primaryCaption,
        ]);
    }

    /**
     * Dismiss a discovered topic.
     */
    public function dismissTopic(Request $request, string $id): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);

        $updated = NewsTopic::where('workspace_id', $workspace->id)
            ->where('id', $id)
            ->update(['status' => 'dismissed']);

        return response()->json([
            'success' => (bool) $updated,
            'message' => 'Topic dismissed from discovery feed.',
        ]);
    }

    /**
     * Get workspace NewsPilot settings.
     */
    public function getSettings(Request $request): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);

        $settings = $workspace->settings ?? [];
        $newsConfig = $settings['news_pilot'] ?? [
            'enabled' => true,
            'trends_enabled' => true,
            'trends_geo' => 'US',
            'keywords' => ['AI', 'technology', 'growth', 'marketing', 'social media'],
            'preferred_categories' => ['Technology', 'Business', 'Innovation', 'General'],
            'min_score' => 40.0,
        ];

        return response()->json([
            'success' => true,
            'config' => $newsConfig,
        ]);
    }

    /**
     * Update workspace NewsPilot settings.
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);

        $settings = $workspace->settings ?? [];
        $currentConfig = $settings['news_pilot'] ?? [];

        $newConfig = array_merge($currentConfig, $request->only([
            'enabled', 'trends_enabled', 'trends_geo', 'keywords', 'preferred_categories', 'min_score'
        ]));

        $settings['news_pilot'] = $newConfig;
        $workspace->update(['settings' => $settings]);

        return response()->json([
            'success' => true,
            'config' => $newConfig,
            'message' => 'NewsPilot preferences updated.',
        ]);
    }

    /**
     * Update per-account news automation settings.
     * Supports:
     * - enabled (boolean)
     * - publishing_mode ('auto_publish' vs 'manual_review')
     * - custom_instructions (string)
     */
    public function updateAccountAutomation(Request $request, string $id): JsonResponse
    {
        $workspace = $this->resolveWorkspace($request);

        $account = SocialAccount::where('workspace_id', $workspace->id)
            ->where(function ($q) use ($id) {
                $q->where('id', $id)->orWhere('provider', $id);
            })
            ->firstOrFail();

        $request->validate([
            'enabled' => 'required|boolean',
            'publishing_mode' => 'required|string|in:auto_publish,manual_review',
            'custom_instructions' => 'nullable|string|max:500',
        ]);

        $account->setNewsAutomationSettings(
            (bool) $request->input('enabled'),
            $request->input('publishing_mode'),
            $request->input('custom_instructions')
        );

        return response()->json([
            'success' => true,
            'account_id' => $account->id,
            'provider' => $account->provider->value,
            'news_automation' => $account->meta['news_automation'],
            'message' => "Updated news automation settings for {$account->provider->value}.",
        ]);
    }
}
