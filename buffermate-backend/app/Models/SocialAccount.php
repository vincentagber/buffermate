<?php

namespace App\Models;

use App\Enums\SocialChannel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class SocialAccount extends Model
{
    use HasUuids;

    protected $fillable = [
        'workspace_id',
        'user_id',
        'provider',
        'provider_user_id',
        'access_token_encrypted',
        'refresh_token_encrypted',
        'token_expires_at',
        'health_status',
        'capabilities',
        'meta',
        'last_sync_at',
    ];

    protected $casts = [
        'provider' => SocialChannel::class,
        'capabilities' => 'array',
        'meta' => 'array',
        'token_expires_at' => 'datetime',
        'last_sync_at' => 'datetime',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function setAccessTokenAttribute(string $value): void
    {
        $this->attributes['access_token_encrypted'] = Crypt::encryptString($value);
    }

    public function getAccessTokenAttribute(): ?string
    {
        if (empty($this->attributes['access_token_encrypted'])) {
            return null;
        }

        try {
            return Crypt::decryptString($this->attributes['access_token_encrypted']);
        } catch (\Throwable) {
            return null;
        }
    }

    public function setRefreshTokenAttribute(?string $value): void
    {
        $this->attributes['refresh_token_encrypted'] = $value ? Crypt::encryptString($value) : null;
    }

    public function getRefreshTokenAttribute(): ?string
    {
        if (empty($this->attributes['refresh_token_encrypted'])) {
            return null;
        }

        try {
            return Crypt::decryptString($this->attributes['refresh_token_encrypted']);
        } catch (\Throwable) {
            return null;
        }
    }
}
