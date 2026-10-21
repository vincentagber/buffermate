<?php

namespace App\Http\Controllers\Api;

use App\Enums\PostStatus;
use App\Enums\WorkspaceRole;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Post;
use App\Services\Publishing\PublishingEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(protected PublishingEngine $engine)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $status = $request->query('status');

        $query = Post::with('publishJobs')
            ->where('workspace_id', $workspaceId)
            ->orderBy('scheduled_at', 'asc');

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $posts = $query->get()->map(function (Post $post) {
            return [
                'id' => $post->id,
                'content' => $post->content,
                'status' => $post->status->value,
                'approval_state' => $post->approval_state,
                'scheduled_at' => $post->scheduled_at?->toIso8601String(),
                'posted_at' => $post->posted_at?->toIso8601String(),
                'attachments' => $post->attachments ?? [],
                'channels' => $post->publishJobs->pluck('platform')->toArray(),
                'created_at' => $post->created_at->toIso8601String(),
            ];
        });

        return response()->json($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id') ?: 'dev_user';
        $workspaceId = $request->attributes->get('workspace_id');

        // Normalize channels and scheduled_at from frontend payloads
        $destinations = $request->input('destinations');
        if (!$destinations && $request->has('channels')) {
            $destinations = array_map(fn($ch) => ['platform' => $ch], (array)$request->input('channels'));
            $request->merge(['destinations' => $destinations]);
        }
        if (!$request->has('scheduledAt') && $request->has('scheduled_at')) {
            $request->merge(['scheduledAt' => $request->input('scheduled_at')]);
        }

        $validated = $request->validate([
            'content' => 'required|string',
            'destinations' => 'required|array|min:1',
            'destinations.*.platform' => 'required|string',
            'destinations.*.socialAccountId' => 'nullable|string',
            'attachments' => 'nullable|array',
            'scheduledAt' => 'nullable|date',
            'requireApproval' => 'nullable|boolean',
        ]);

        $res = $this->engine->schedulePost([
            'workspaceId' => $workspaceId,
            'creatorUserId' => $userId,
            'content' => $validated['content'],
            'destinations' => $validated['destinations'],
            'attachments' => $validated['attachments'] ?? [],
            'scheduledAt' => $validated['scheduledAt'] ?? now()->toIso8601String(),
            'requireApproval' => $validated['requireApproval'] ?? false,
        ]);

        if (!$res['success']) {
            return response()->json([
                'error' => 'VALIDATION_FAILED',
                'validationErrors' => $res['validationErrors'],
            ], 422);
        }

        $isImmediate = $request->boolean('isImmediate')
            || $request->input('status') === 'posted'
            || (isset($validated['scheduledAt']) && \Carbon\Carbon::parse($validated['scheduledAt'])->lte(now()->addSeconds(30)));

        $publishResults = [];
        if ($isImmediate && !empty($res['jobs'])) {
            foreach ($res['jobs'] as $job) {
                $publishResults[] = $this->engine->executeSingleJob($job);
            }
        }

        AuditLog::log(
            $workspaceId,
            $userId,
            'post.created',
            'post',
            $res['post']->id,
            ['destinations' => $validated['destinations']]
        );

        $freshPost = $res['post']->fresh()->load('publishJobs');

        return response()->json([
            'success' => true,
            'id' => $freshPost->id,
            'post' => $freshPost,
            'jobs' => $freshPost->publishJobs,
            'channels' => $freshPost->publishJobs->pluck('platform')->toArray(),
            'content' => $freshPost->content,
            'status' => $freshPost->status->value,
            'scheduled_at' => $freshPost->scheduled_at?->toIso8601String(),
            'publish_results' => $publishResults,
        ], 201);
    }

    /**
     * POST /api/social/publish
     * Direct publish endpoint called by composer and scheduler modal.
     */
    public function publish(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id') ?: 'dev_user';
        $workspaceId = $request->attributes->get('workspace_id');

        $postId = $request->input('post_id');
        $content = $request->input('content', '');
        $attachments = $request->input('attachments', []);

        $normalizedAttachments = array_map(function ($att) {
            if (is_string($att)) {
                return ['type' => 'image', 'url' => $att];
            }
            return $att;
        }, (array)$attachments);

        $channels = $request->input('channels');
        $destinations = $request->input('destinations');
        $accountIds = $request->input('social_account_ids', []);

        if ($postId) {
            $post = Post::with('publishJobs')->where('workspace_id', $workspaceId)->find($postId);
        } else {
            $post = null;
        }

        if (!$post) {
            $destArray = [];
            if (!empty($destinations)) {
                $destArray = $destinations;
            } elseif (!empty($channels)) {
                $destArray = array_map(fn($ch) => ['platform' => $ch], (array)$channels);
            } elseif (!empty($accountIds)) {
                $accounts = \App\Models\SocialAccount::whereIn('id', $accountIds)->get();
                $destArray = $accounts->map(fn($acc) => [
                    'platform' => $acc->provider->value,
                    'socialAccountId' => $acc->id,
                ])->toArray();
            }

            if (empty($destArray)) {
                $destArray = [['platform' => 'facebook']];
            }

            $scheduleRes = $this->engine->schedulePost([
                'workspaceId' => $workspaceId,
                'creatorUserId' => $userId,
                'content' => $content ?: 'New update from BufferMate',
                'destinations' => $destArray,
                'attachments' => $normalizedAttachments,
                'scheduledAt' => now()->toIso8601String(),
                'requireApproval' => false,
            ]);

            if (!$scheduleRes['success']) {
                return response()->json([
                    'success' => false,
                    'error' => 'VALIDATION_FAILED',
                    'validationErrors' => $scheduleRes['validationErrors'],
                ], 422);
            }

            $post = $scheduleRes['post'];
        }

        $jobs = $post->publishJobs()->where('status', 'scheduled')->get();
        if ($jobs->isEmpty()) {
            $jobs = $post->publishJobs;
        }

        $results = [];
        $successCount = 0;

        foreach ($jobs as $job) {
            $this->engine->executeSingleJob($job);
            $job->refresh();
            $isSuccess = $job->status === 'published';
            if ($isSuccess) {
                $successCount++;
            }

            $results[] = [
                'status' => $isSuccess ? 'success' : 'failed',
                'platform' => $job->platform->value ?? (string)$job->platform,
                'external_id' => $job->external_post_id,
                'error' => $job->error_message,
            ];
        }

        $freshPost = $post->fresh()->load('publishJobs');

        AuditLog::log(
            $workspaceId,
            $userId,
            'post.published',
            'post',
            $freshPost->id,
            ['success_count' => $successCount, 'results' => $results]
        );

        return response()->json([
            'success' => $successCount > 0 || empty($jobs),
            'id' => $freshPost->id,
            'publishedCount' => $successCount,
            'results' => $results,
            'post' => $freshPost,
            'channels' => $freshPost->publishJobs->pluck('platform')->toArray(),
        ]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $post = Post::with('publishJobs')->where('workspace_id', $workspaceId)->findOrFail($id);

        return response()->json($post);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $post = Post::where('workspace_id', $workspaceId)->findOrFail($id);
        $post->delete();

        return response()->json(['success' => true, 'message' => 'Post deleted successfully']);
    }

    public function submitForApproval(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $post = Post::where('workspace_id', $workspaceId)->findOrFail($id);

        $post->update(['approval_state' => 'in_review']);

        return response()->json([
            'success' => true,
            'message' => 'Post submitted for approval',
            'post' => $post,
        ]);
    }

    public function approve(Request $request, string $id): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');
        $workspaceId = $request->attributes->get('workspace_id');
        $role = $request->attributes->get('workspace_role');

        if ($role && !$role->canApproveContent()) {
            return response()->json([
                'error' => 'FORBIDDEN',
                'message' => 'Creators cannot approve content. Action requires Approver, Admin, or Owner.',
            ], 403);
        }

        $post = Post::where('workspace_id', $workspaceId)->findOrFail($id);
        $post->update([
            'approval_state' => 'approved',
            'status' => PostStatus::SCHEDULED,
            'approved_by' => $userId,
            'approved_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Post approved and scheduled',
            'post' => $post,
        ]);
    }
}
