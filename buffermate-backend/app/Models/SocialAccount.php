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

    /**
     * Check if news automation is enabled for this specific connected account.
     */
    public function isNewsAutomationEnabled(): bool
    {
        return (bool) ($this->meta['news_automation']['enabled'] ?? false);
    }

    /**
     * Get the publishing mode for this account: 'auto_publish' or 'manual_review'.
     * Defaults to 'manual_review' to guarantee editorial safety.
     */
    public function getNewsPublishingMode(): string
    {
        return $this->meta['news_automation']['publishing_mode'] ?? 'manual_review';
    }

    /**
     * Check if posts to this account require manual review / approval.
     */
    public function requiresManualReview(): bool
    {
        return $this->getNewsPublishingMode() !== 'auto_publish';
    }

    /**
     * Update news automation configuration in meta.
     */
    public function setNewsAutomationSettings(bool $enabled, string $mode = 'manual_review', ?string $customInstructions = null): void
    {
        $meta = $this->meta ?? [];
        $meta['news_automation'] = [
            'enabled' => $enabled,
            'publishing_mode' => in_array($mode, ['auto_publish', 'manual_review']) ? $mode : 'manual_review',
            'custom_instructions' => $customInstructions,
            'updated_at' => now()->toIso8601String(),
        ];
        $this->meta = $meta;
        $this->save();
    }
}
