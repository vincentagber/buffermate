<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialMessage extends Model
{
    use HasUuids;

    protected $fillable = [
        'conversation_id',
        'sender_type',
        'sender_name',
        'is_internal_note',
        'content',
    ];

    protected $casts = [
        'is_internal_note' => 'boolean',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(SocialConversation::class, 'conversation_id');
    }
}

