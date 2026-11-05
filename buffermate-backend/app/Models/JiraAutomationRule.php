<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JiraAutomationRule extends Model
{
    use HasUuids;

    protected $fillable = [
        'workspace_id',
        'project_id',
        'name',
        'description',
        'trigger_event',
        'conditions',
        'actions',
        'is_active',
        'execution_count',
        'last_executed_at',
    ];

    protected $casts = [
        'conditions' => 'array',
        'actions' => 'array',
        'is_active' => 'boolean',
        'execution_count' => 'integer',
        'last_executed_at' => 'datetime',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function executions(): HasMany
    {
        return $this->hasMany(JiraAutomationExecution::class, 'rule_id')->orderBy('executed_at', 'desc');
    }
}

