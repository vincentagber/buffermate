<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'workspace_id',
        'name',
        'key',
        'description',
        'template',
        'category',
        'lead_user_id',
        'default_assignee_id',
        'issue_counter',
        'status',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'issue_counter' => 'integer',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function sprints(): HasMany
    {
        return $this->hasMany(Sprint::class)->orderBy('created_at', 'desc');
    }

    public function workItems(): HasMany
    {
        return $this->hasMany(WorkItem::class);
    }

    public function boards(): HasMany
    {
        return $this->hasMany(Board::class);
    }

    public function automationRules(): HasMany
    {
        return $this->hasMany(JiraAutomationRule::class);
    }

    /**
     * Atomically increment project issue counter and return new key, e.g. "BM-10"
     */
    public function generateNextIssueKey(): array
    {
        $this->increment('issue_counter');
        $this->refresh();
        return [
            'number' => $this->issue_counter,
            'key' => strtoupper($this->key) . '-' . $this->issue_counter,
        ];
    }
}

