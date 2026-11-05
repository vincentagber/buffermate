<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkItemHistory extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $table = 'work_item_history';

    protected $fillable = [
        'work_item_id',
        'user_id',
        'field',
        'from_value',
        'to_value',
        'created_at',
    ];

    public function workItem(): BelongsTo
    {
        return $this->belongsTo(WorkItem::class);
    }
}

