<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BoardColumn extends Model
{
    use HasUuids;

    protected $fillable = [
        'board_id',
        'name',
        'mapped_status',
        'wip_limit',
        'order_index',
    ];

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }
}

