<?php

namespace App\Policies;

use App\Enums\WorkspaceRole;
use App\Models\Post;
use App\Models\WorkspaceMember;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    protected function getMemberRole(?string $workspaceId, ?string $userId): ?WorkspaceRole
    {
        if (!$workspaceId || !$userId) {
            return null;
        }

        $member = WorkspaceMember::where('workspace_id', $workspaceId)
            ->where('user_id', $userId)
            ->first();

        return $member?->role;
    }

    public function viewAny(?string $userId, string $workspaceId): bool
    {
        return $this->getMemberRole($workspaceId, $userId) !== null;
    }

    public function create(?string $userId, string $workspaceId): Response
    {
        $role = $this->getMemberRole($workspaceId, $userId);

        if ($role && $role->canCreateContent()) {
            return Response::allow();
        }

        return Response::deny('Only Creators, Strategists, Admins, or Owners can create drafts.');
    }

    public function approve(?string $userId, Post $post): Response
    {
        $role = $this->getMemberRole($post->workspace_id, $userId);

        if ($role && $role->canApproveContent()) {
            return Response::allow();
        }

        return Response::deny('Creators and Analysts cannot approve content drafts. Role requires Approver, Admin, or Owner.');
    }

    public function publish(?string $userId, Post $post): Response
    {
        $role = $this->getMemberRole($post->workspace_id, $userId);

        if ($role && $role->canPublishContent()) {
            return Response::allow();
        }

        return Response::deny('Creators and Approvers cannot directly publish. Publishing requires Strategist, Admin, or Owner.');
    }

    public function delete(?string $userId, Post $post): Response
    {
        $role = $this->getMemberRole($post->workspace_id, $userId);

        if ($role && in_array($role, [WorkspaceRole::OWNER, WorkspaceRole::ADMIN])) {
            return Response::allow();
        }

        return Response::deny('Only Workspace Admins and Owners can delete posts.');
    }
}
