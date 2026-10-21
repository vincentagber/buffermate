<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialAutomation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AutomationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $automations = SocialAutomation::where('workspace_id', $workspaceId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $automations,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $userId = $request->attributes->get('supabase_user_id');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'channel' => 'required|string',
            'trigger_type' => 'nullable|string',
            'keywords' => 'nullable|array',
            'reply_comment' => 'nullable|string',
            'dm_message' => 'nullable|string',
            'link_url' => 'nullable|url',
            'status' => 'nullable|in:active,paused,draft',
        ]);

        $automation = SocialAutomation::create([
            'workspace_id' => $workspaceId,
            'user_id' => $userId,
            'name' => $validated['name'],
            'channel' => $validated['channel'],
            'trigger_type' => $validated['trigger_type'] ?? 'comment_keyword',
            'keywords' => $validated['keywords'] ?? [],
            'reply_comment' => $validated['reply_comment'] ?? null,
            'dm_message' => $validated['dm_message'] ?? null,
            'link_url' => $validated['link_url'] ?? null,
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'success' => true,
            'data' => $automation,
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $automation = SocialAutomation::where('workspace_id', $workspaceId)->findOrFail($id);

        $automation->update($request->only([
            'name', 'keywords', 'reply_comment', 'dm_message', 'link_url', 'status'
        ]));

        return response()->json([
            'success' => true,
            'data' => $automation,
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $automation = SocialAutomation::where('workspace_id', $workspaceId)->findOrFail($id);
        $automation->delete();

        return response()->json(['success' => true, 'message' => 'Automation deleted']);
    }
}
