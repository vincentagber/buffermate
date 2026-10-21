<?php

namespace App\Models;

use App\Enums\PostStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasUuids;

    protected $fillable = [
        'workspace_id',
        'user_id',
        'content',
        'attachments',
        'status',
        'approval_state',
        'approved_by',
        'approved_at',
        'scheduled_at',
        'posted_at',
        'provider_results',
    ];

    protected $casts = [
        'status' => PostStatus::class,
        'attachments' => 'array',
        'provider_results' => 'array',
        'scheduled_at' => 'datetime',
        'posted_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function publishJobs(): HasMany
    {
        return $this->hasMany(PublishJob::class);
    }
}
