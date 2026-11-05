<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SocialConversation extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'workspace_id',
        'channel',
        'sender_name',
        'sender_handle',
        'sender_avatar',
        'status',
        'priority',
        'assignee_id',
        'assignee_name',
        'work_item_id',
        'work_item_key',
        'unread',
        'response_time_minutes',
        'pipeline_value',
        'last_message_preview',
        'last_message_at',
    ];

    protected $casts = [
        'unread' => 'boolean',
        'response_time_minutes' => 'integer',
        'pipeline_value' => 'decimal:2',
        'last_message_at' => 'datetime',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(SocialMessage::class, 'conversation_id')->orderBy('created_at', 'asc');
    }

    public function workItem(): BelongsTo
    {
        return $this->belongsTo(WorkItem::class, 'work_item_id');
    }
}

