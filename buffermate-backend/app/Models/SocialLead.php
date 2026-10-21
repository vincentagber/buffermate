<?php

namespace App\Models;

use App\Enums\SocialChannel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialLead extends Model
{
    use HasUuids;

    protected $fillable = [
        'workspace_id',
        'user_id',
        'handle',
        'name',
        'channel',
        'keyword_triggered',
        'automation_id',
        'status',
        'last_interaction',
        'notes',
    ];

    protected $casts = [
        'channel' => SocialChannel::class,
        'last_interaction' => 'datetime',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function automation(): BelongsTo
    {
        return $this->belongsTo(SocialAutomation::class, 'automation_id');
    }
}
