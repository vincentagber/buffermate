<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\SocialConversation;
use App\Models\SocialMessage;
use App\Models\WorkItem;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SocialInboxController extends Controller
{
    private function resolveWorkspaceId(Request $request): string
    {
        $wsId = $request->header('X-Workspace-Id')
            ?: $request->input('workspaceId')
            ?: $request->route('workspaceId');

        if (!$wsId) {
            $defaultWs = Workspace::first();
            if ($defaultWs) return $defaultWs->id;
        }

        return $wsId ?: '';
    }

    public function index(Request $request): JsonResponse
    {
        $workspaceId = $this->resolveWorkspaceId($request);

        $query = SocialConversation::with(['workItem'])
            ->where('workspace_id', $workspaceId);

        // Channel filter
        if ($request->has('channel') && $request->channel !== 'all' && $request->channel !== '') {
            $query->where('channel', $request->channel);
        }

        // Queue filter (Jira Service Management parity)
        if ($request->has('queue')) {
            switch ($request->queue) {
                case 'unassigned':
                    $query->whereNull('assignee_name');
                    break;
                case 'assigned_to_me':
                    $query->where('assignee_name', 'Alex Morgan');
                    break;
                case 'waiting_support':
                    $query->whereIn('status', ['open', 'in_progress']);
                    break;
                case 'waiting_customer':
                    $query->where('status', 'waiting_customer');
                    break;
                case 'resolved':
                    $query->whereIn('status', ['resolved', 'closed']);
                    break;
            }
        }

        // Search query
        if ($request->has('search') && trim($request->search) !== '') {
            $search = '%' . trim($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('sender_name', 'like', $search)
                  ->orWhere('sender_handle', 'like', $search)
                  ->orWhere('last_message_preview', 'like', $search)
                  ->orWhere('work_item_key', 'like', $search);
            });
        }

        $conversations = $query->orderBy('last_message_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $conversations,
        ]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $workspaceId = $this->resolveWorkspaceId($request);

        $conversation = SocialConversation::with(['messages', 'workItem'])
            ->where('workspace_id', $workspaceId)
            ->where('id', $id)
            ->first();

        if (!$conversation) {
            return response()->json(['success' => false, 'message' => 'Conversation not found'], 404);
        }

        // Auto mark as read when opened
        if ($conversation->unread) {
            $conversation->update(['unread' => false]);
        }

        return response()->json([
            'success' => true,
            'data' => $conversation,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $workspaceId = $this->resolveWorkspaceId($request);

        $validated = $request->validate([
            'channel' => 'required|string|in:instagram,linkedin,whatsapp,tiktok',
            'sender_name' => 'required|string|max:255',
            'sender_handle' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'nullable|string|in:urgent,high,normal,low',
            'pipeline_value' => 'nullable|numeric',
            'assignee_name' => 'nullable|string',
        ]);

        $conversation = DB::transaction(function () use ($validated, $workspaceId) {
            $conv = SocialConversation::create([
                'workspace_id' => $workspaceId,
                'channel' => $validated['channel'],
                'sender_name' => $validated['sender_name'],
                'sender_handle' => $validated['sender_handle'],
                'sender_avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
                'status' => 'open',
                'priority' => $validated['priority'] ?? 'normal',
                'assignee_name' => $validated['assignee_name'] ?? 'Alex Morgan',
                'unread' => false,
                'response_time_minutes' => 0,
                'pipeline_value' => $validated['pipeline_value'] ?? 0,
                'last_message_preview' => $validated['message'],
                'last_message_at' => Carbon::now(),
            ]);

            $conv->messages()->create([
                'sender_type' => 'agent',
                'sender_name' => 'Alex Morgan',
                'is_internal_note' => false,
                'content' => $validated['message'],
            ]);

            return $conv->load('messages');
        });

        return response()->json([
            'success' => true,
            'message' => 'Outbound message conversation created',
            'data' => $conversation,
        ], 201);
    }

    public function reply(Request $request, string $id): JsonResponse
    {
        $workspaceId = $this->resolveWorkspaceId($request);

        $conversation = SocialConversation::where('workspace_id', $workspaceId)
            ->where('id', $id)
            ->first();

        if (!$conversation) {
            return response()->json(['success' => false, 'message' => 'Conversation not found'], 404);
        }

        $validated = $request->validate([
            'content' => 'required|string',
            'is_internal_note' => 'nullable|boolean',
            'sender_name' => 'nullable|string',
        ]);

        $isInternal = (bool) ($validated['is_internal_note'] ?? false);
        $senderName = $validated['sender_name'] ?? 'Alex Morgan';

        $msg = $conversation->messages()->create([
            'sender_type' => 'agent',
            'sender_name' => $senderName,
            'is_internal_note' => $isInternal,
            'content' => $validated['content'],
        ]);

        // If customer reply (public), update preview and status if it was open
        if (!$isInternal) {
            $conversation->update([
                'last_message_preview' => $validated['content'],
                'last_message_at' => Carbon::now(),
                'status' => $conversation->status === 'open' ? 'in_progress' : $conversation->status,
                'unread' => false,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $conversation->fresh(['messages', 'workItem']),
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $workspaceId = $this->resolveWorkspaceId($request);

        $conversation = SocialConversation::where('workspace_id', $workspaceId)
            ->where('id', $id)
            ->first();

        if (!$conversation) {
            return response()->json(['success' => false, 'message' => 'Conversation not found'], 404);
        }

        $validated = $request->validate([
            'status' => 'nullable|string|in:open,in_progress,waiting_customer,resolved,closed',
            'priority' => 'nullable|string|in:urgent,high,normal,low',
            'assignee_name' => 'nullable|string',
            'unread' => 'nullable|boolean',
            'work_item_id' => 'nullable|string',
            'work_item_key' => 'nullable|string',
        ]);

        $conversation->update($validated);

        return response()->json([
            'success' => true,
            'data' => $conversation->fresh(['messages', 'workItem']),
        ]);
    }

    public function convertToJira(Request $request, string $id): JsonResponse
    {
        $workspaceId = $this->resolveWorkspaceId($request);

        $conversation = SocialConversation::where('workspace_id', $workspaceId)
            ->where('id', $id)
            ->first();

        if (!$conversation) {
            return response()->json(['success' => false, 'message' => 'Conversation not found'], 404);
        }

        $project = Project::where('workspace_id', $workspaceId)->first();
        if (!$project) {
            return response()->json(['success' => false, 'message' => 'No Jira project found for workspace'], 400);
        }

        $type = $request->input('type', 'task');
        $priority = $request->input('priority', $conversation->priority === 'urgent' ? 'highest' : ($conversation->priority === 'high' ? 'high' : 'medium'));

        $workItem = DB::transaction(function () use ($project, $conversation, $type, $priority) {
            $project->increment('issue_counter');
            $issueNumber = $project->issue_counter;
            $key = $project->key . '-' . $issueNumber;

            $item = WorkItem::create([
                'workspace_id' => $project->workspace_id,
                'project_id' => $project->id,
                'key' => $key,
                'issue_number' => $issueNumber,
                'title' => 'Inquiry from ' . $conversation->sender_name . ' (' . ucfirst($conversation->channel) . ')',
                'description' => "Customer Handle: {$conversation->sender_handle}\nChannel: " . ucfirst($conversation->channel) . "\n\nInitial Inquiry:\n{$conversation->last_message_preview}",
                'type' => $type,
                'status' => 'todo',
                'priority' => $priority,
                'assignee_user_id' => $conversation->assignee_name ?: 'Alex Morgan',
                'reporter_user_id' => $conversation->sender_name,
                'labels' => ['social-inbox', $conversation->channel],
            ]);

            $conversation->update([
                'work_item_id' => $item->id,
                'work_item_key' => $item->key,
            ]);

            // Add Jira link audit message
            $conversation->messages()->create([
                'sender_type' => 'system',
                'sender_name' => 'Jira Work Management',
                'is_internal_note' => true,
                'content' => "Converted to Jira Work Item: {$item->key} ({$item->title})",
            ]);

            return $item;
        });

        return response()->json([
            'success' => true,
            'message' => 'Converted to Jira issue ' . $workItem->key,
            'data' => [
                'work_item' => $workItem,
                'conversation' => $conversation->fresh(['messages', 'workItem']),
            ],
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $workspaceId = $this->resolveWorkspaceId($request);

        $total = SocialConversation::where('workspace_id', $workspaceId)->count();
        $unreadCount = SocialConversation::where('workspace_id', $workspaceId)->where('unread', true)->count();
        $highPriorityCount = SocialConversation::where('workspace_id', $workspaceId)->whereIn('priority', ['urgent', 'high'])->where('status', '!=', 'resolved')->count();
        $resolvedCount = SocialConversation::where('workspace_id', $workspaceId)->whereIn('status', ['resolved', 'closed'])->count();
        $pipelineSum = (float) SocialConversation::where('workspace_id', $workspaceId)->sum('pipeline_value');
        $avgReplyTime = (int) round(SocialConversation::where('workspace_id', $workspaceId)->avg('response_time_minutes') ?: 8);

        $resolutionRate = $total > 0 ? round(($resolvedCount / $total) * 100, 1) : 98.4;

        return response()->json([
            'success' => true,
            'data' => [
                'avg_reply_time' => $avgReplyTime . ' mins',
                'unread_inquiries' => $unreadCount . ' unread',
                'unread_count' => $unreadCount,
                'high_priority_count' => $highPriorityCount,
                'resolution_rate' => $resolutionRate . '%',
                'pipeline_value' => '$' . number_format($pipelineSum, 0),
                'pipeline_raw' => $pipelineSum,
            ],
        ]);
    }
}
