<?php

namespace App\Models;

use App\Enums\WorkspaceRole;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkspaceMember extends Model
{
    use HasUuids;

    protected $fillable = [
        'workspace_id',
        'user_id',
        'role',
        'status',
        'invited_by',
        'joined_at',
    ];

    protected $casts = [
        'role' => WorkspaceRole::class,
        'joined_at' => 'datetime',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}
