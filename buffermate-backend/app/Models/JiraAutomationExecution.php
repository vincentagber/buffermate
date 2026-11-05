<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JiraAutomationExecution extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'rule_id',
        'trigger_payload',
        'status',
        'execution_log',
        'executed_at',
    ];

    protected $casts = [
        'trigger_payload' => 'array',
        'executed_at' => 'datetime',
    ];

    public function rule(): BelongsTo
    {
        return $this->belongsTo(JiraAutomationRule::class, 'rule_id');
    }
}

