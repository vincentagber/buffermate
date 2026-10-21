<?php

namespace App\Models;

use App\Enums\SocialChannel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PublishJob extends Model
{
    use HasUuids;

    protected $fillable = [
        'workspace_id',
        'post_id',
        'social_account_id',
        'platform',
        'scheduled_at',
        'status',
        'idempotency_key',
        'attempts',
        'max_retries',
        'next_attempt_at',
        'lock_acquired_at',
        'external_post_id',
        'error_code',
        'error_message',
        'result_payload',
    ];

    protected $casts = [
        'platform' => SocialChannel::class,
        'scheduled_at' => 'datetime',
        'next_attempt_at' => 'datetime',
        'lock_acquired_at' => 'datetime',
        'result_payload' => 'array',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function socialAccount(): BelongsTo
    {
        return $this->belongsTo(SocialAccount::class);
    }
}
