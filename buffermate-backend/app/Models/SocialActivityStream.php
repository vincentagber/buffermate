<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialActivityStream extends Model
{
    use HasUuids;

    protected $table = 'social_activity_stream';

    protected $fillable = [
        'workspace_id',
        'user_id',
        'event_type',
        'channel',
        'title',
        'description',
        'user_handle',
        'post_reference',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}
