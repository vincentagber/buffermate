<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsFeed extends Model
{
    use HasUuids;

    protected $fillable = [
        'workspace_id',
        'name',
        'url',
        'category',
        'keywords',
        'priority',
        'enabled',
        'last_fetch_at',
        'last_error',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'priority' => 'integer',
        'last_fetch_at' => 'datetime',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}
