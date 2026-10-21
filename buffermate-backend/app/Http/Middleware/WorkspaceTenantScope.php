<?php

namespace App\Http\Middleware;

use App\Models\Workspace;
use App\Models\WorkspaceMember;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WorkspaceTenantScope
{
    public function handle(Request $request, Closure $next): Response
    {
        $workspaceId = $request->header('X-Workspace-Id')
            ?: $request->input('workspaceId')
            ?: $request->route('workspaceId')
            ?: $request->route('id');

        if (!$workspaceId) {
            // Default to first workspace if not provided (e.g. single tenant mode)
            $defaultWs = Workspace::first();
            if ($defaultWs) {
                $workspaceId = $defaultWs->id;
            }
        }

        if (!$workspaceId) {
            return response()->json([
                'error' => 'WORKSPACE_REQUIRED',
                'message' => 'Workspace context (X-Workspace-Id) is required for tenant isolation.',
            ], 400);
        }

        $workspace = Workspace::where('id', $workspaceId)->orWhere('slug', $workspaceId)->first();
        if (!$workspace) {
            $workspace = Workspace::first();
        }

        if (!$workspace) {
            return response()->json([
                'error' => 'WORKSPACE_NOT_FOUND',
                'message' => "Workspace '{$workspaceId}' does not exist.",
            ], 404);
        }

        $userId = $request->attributes->get('supabase_user_id');

        // Verify membership if user is authenticated
        if ($userId) {
            $member = WorkspaceMember::where('workspace_id', $workspace->id)
                ->where('user_id', $userId)
                ->first();

            if (!$member && $workspace->owner_user_id !== $userId) {
                return response()->json([
                    'error' => 'FORBIDDEN_TENANT_ACCESS',
                    'message' => 'User does not have access to this workspace tenant.',
                ], 403);
            }

            $request->attributes->set('workspace_role', $member?->role);
        }

        $request->attributes->set('workspace', $workspace);
        $request->attributes->set('workspace_id', $workspace->id);

        return $next($request);
    }
}
