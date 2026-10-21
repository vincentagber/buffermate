<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Workspace extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'timezone',
        'default_locale',
        'plan_id',
        'owner_user_id',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(WorkspaceMember::class);
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function socialAccounts(): HasMany
    {
        return $this->hasMany(SocialAccount::class);
    }

    public function automations(): HasMany
    {
        return $this->hasMany(SocialAutomation::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(SocialLead::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }
}
