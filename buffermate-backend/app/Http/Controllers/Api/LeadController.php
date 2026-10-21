<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LeadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $query = SocialLead::query();
        if ($workspaceId) {
            $query->where('workspace_id', $workspaceId);
        }
        $leads = $query->orderBy('last_interaction', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $leads,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $validated = $request->validate([
            'name' => 'nullable|string',
            'handle' => 'required|string',
            'channel' => 'required|string',
            'keyword_triggered' => 'nullable|string',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $lead = SocialLead::create([
            'id' => Str::uuid()->toString(),
            'workspace_id' => $workspaceId,
            'user_id' => $request->attributes->get('supabase_user_id'),
            'name' => $validated['name'] ?? null,
            'handle' => $validated['handle'],
            'channel' => $validated['channel'],
            'keyword_triggered' => $validated['keyword_triggered'] ?? null,
            'status' => $validated['status'] ?? 'new',
            'last_interaction' => now(),
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $lead,
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $lead = SocialLead::findOrFail($id);
        $lead->update($request->only(['status', 'notes', 'name', 'keyword_triggered']));

        return response()->json([
            'success' => true,
            'data' => $lead,
        ]);
    }
}
