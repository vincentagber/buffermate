<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use App\Models\WorkspaceMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Verifies the Supabase user session and returns current workspace context.
     */
    public function me(Request $request): JsonResponse
    {
        $userId = $request->attributes->get('supabase_user_id');
        $email = $request->attributes->get('supabase_user_email');

        if (!$userId) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Get user workspaces
        $memberships = WorkspaceMember::with('workspace')
            ->where('user_id', $userId)
            ->get();

        $workspaces = $memberships->map(fn($m) => [
            'id' => $m->workspace->id,
            'name' => $m->workspace->name,
            'role' => $m->role->value,
            'timezone' => $m->workspace->timezone,
        ]);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $userId,
                'email' => $email,
            ],
            'workspaces' => $workspaces,
        ]);
    }
}
