<?php

namespace App\Http\Controllers\Api\Jira;

use App\Http\Controllers\Controller;
use App\Models\JiraNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JiraNotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $userId = $request->attributes->get('supabase_user_id') ?: 'dev_user';

        // Also match 'Alex Morgan' if user is dev_user for convenient local development testing
        $matchedUserIds = [$userId];
        if ($userId === 'dev_user') {
            $matchedUserIds[] = 'Alex Morgan';
        }

        $query = JiraNotification::where('workspace_id', $workspaceId)
            ->whereIn('user_id', $matchedUserIds);

        $filter = $request->input('filter', 'all');
        if ($filter === 'unread') {
            $query->where('is_read', false);
        } elseif ($filter === 'assigned') {
            $query->where('event_type', 'issue_assigned');
        } elseif ($filter === 'mentions') {
            $query->where('event_type', 'issue_mentioned');
        }

        $unreadCount = JiraNotification::where('workspace_id', $workspaceId)
            ->whereIn('user_id', $matchedUserIds)
            ->where('is_read', false)
            ->count();

        $notifications = $query->orderBy('created_at', 'desc')
            ->limit((int)$request->input('limit', 30))
            ->get();

        return response()->json([
            'success' => true,
            'unread_count' => $unreadCount,
            'data' => $notifications,
        ]);
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $notification = JiraNotification::where('workspace_id', $workspaceId)->findOrFail($id);

        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read.',
            'data' => $notification,
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $userId = $request->attributes->get('supabase_user_id') ?: 'dev_user';

        $matchedUserIds = [$userId];
        if ($userId === 'dev_user') {
            $matchedUserIds[] = 'Alex Morgan';
        }

        JiraNotification::where('workspace_id', $workspaceId)
            ->whereIn('user_id', $matchedUserIds)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read.',
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $notification = JiraNotification::where('workspace_id', $workspaceId)->findOrFail($id);

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification dismissed.',
        ]);
    }
}

