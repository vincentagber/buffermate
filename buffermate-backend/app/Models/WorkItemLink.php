<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkItemLink extends Model
{
    use HasUuids;

    protected $fillable = [
        'workspace_id',
        'source_work_item_id',
        'target_work_item_id',
        'relationship',
    ];

    public function source(): BelongsTo
    {
        return $this->belongsTo(WorkItem::class, 'source_work_item_id');
    }

    public function target(): BelongsTo
    {
        return $this->belongsTo(WorkItem::class, 'target_work_item_id');
    }
}

