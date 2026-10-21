<?php

namespace App\Enums;

enum WorkspaceRole: string
{
    case OWNER = 'owner';
    case ADMIN = 'admin';
    case STRATEGIST = 'strategist';
    case CREATOR = 'creator';
    case APPROVER = 'approver';
    case COMMUNITY_MANAGER = 'community_manager';
    case ANALYST = 'analyst';

    public function canCreateContent(): bool
    {
        return in_array($this, [self::OWNER, self::ADMIN, self::STRATEGIST, self::CREATOR]);
    }

    public function canApproveContent(): bool
    {
        return in_array($this, [self::OWNER, self::ADMIN, self::APPROVER]);
    }

    public function canPublishContent(): bool
    {
        return in_array($this, [self::OWNER, self::ADMIN, self::STRATEGIST]);
    }
}
