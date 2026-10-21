<?php

namespace App\Models;

use App\Enums\SocialChannel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SocialAutomation extends Model
{
    use HasUuids;

    protected $fillable = [
        'workspace_id',
        'user_id',
        'name',
        'channel',
        'trigger_type',
        'keywords',
        'reply_comment',
        'dm_message',
        'link_url',
        'status',
        'runs_today',
        'runs_total',
        'leads_captured',
    ];

    protected $casts = [
        'channel' => SocialChannel::class,
        'keywords' => 'array',
        'runs_today' => 'integer',
        'runs_total' => 'integer',
        'leads_captured' => 'integer',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(SocialLead::class, 'automation_id');
    }
}
