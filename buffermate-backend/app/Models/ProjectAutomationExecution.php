<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectAutomationExecution extends Model
{
    use HasUuids;

    protected $table = 'jira_automation_executions';

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
        return $this->belongsTo(ProjectAutomationRule::class, 'rule_id');
    }
}
