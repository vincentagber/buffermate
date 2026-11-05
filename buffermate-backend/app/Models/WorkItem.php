<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkItem extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'workspace_id',
        'project_id',
        'sprint_id',
        'parent_id',
        'key',
        'issue_number',
        'title',
        'description',
        'type',
        'status',
        'priority',
        'story_points',
        'estimated_hours',
        'logged_hours',
        'assignee_user_id',
        'reporter_user_id',
        'labels',
        'components',
        'start_date',
        'due_date',
        'completed_at',
        'resolution',
        'board_order',
    ];

    protected $casts = [
        'labels' => 'array',
        'components' => 'array',
        'story_points' => 'integer',
        'estimated_hours' => 'decimal:2',
        'logged_hours' => 'decimal:2',
        'board_order' => 'integer',
        'start_date' => 'datetime',
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function sprint(): BelongsTo
    {
        return $this->belongsTo(Sprint::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(WorkItem::class, 'parent_id');
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(WorkItem::class, 'parent_id')->orderBy('created_at', 'asc');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(WorkItemComment::class)->orderBy('created_at', 'asc');
    }

    public function history(): HasMany
    {
        return $this->hasMany(WorkItemHistory::class)->orderBy('created_at', 'desc');
    }

    public function links(): HasMany
    {
        return $this->hasMany(WorkItemLink::class, 'source_work_item_id');
    }

    public function inverseLinks(): HasMany
    {
        return $this->hasMany(WorkItemLink::class, 'target_work_item_id');
    }

    public function watchers(): HasMany
    {
        return $this->hasMany(WorkItemWatcher::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(WorkItemAttachment::class)->orderBy('created_at', 'desc');
    }
}

