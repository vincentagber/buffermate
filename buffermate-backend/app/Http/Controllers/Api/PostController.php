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

        AuditLog::log(
            $workspaceId,
            $userId,
            'post.created',
            'post',
            $res['post']->id,
            ['destinations' => $validated['destinations']]
        );

        return response()->json([
            'success' => true,
            'post' => $res['post'],
            'jobs' => $res['jobs'],
        ], 201);
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
