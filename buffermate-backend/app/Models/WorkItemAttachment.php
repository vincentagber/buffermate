<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkItemAttachment extends Model
{
    use HasUuids;

    protected $fillable = [
        'work_item_id',
        'user_id',
        'user_name',
        'filename',
        'file_path',
        'file_type',
        'file_size',
        'thumbnail_url',
    ];

    public function workItem(): BelongsTo
    {
        return $this->belongsTo(WorkItem::class);
    }
}

