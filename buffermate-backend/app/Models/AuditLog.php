<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasUuids;

    protected $fillable = [
        'workspace_id',
        'actor_id',
        'action',
        'resource_type',
        'resource_id',
        'metadata_redacted',
    ];

    protected $casts = [
        'metadata_redacted' => 'array',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public static function log(
        string $workspaceId,
        ?string $actorId,
        string $action,
        string $resourceType,
        ?string $resourceId = null,
        array $metadata = []
    ): self {
        // Redact any sensitive tokens from audit logs
        $safeMetadata = self::redactSensitiveData($metadata);

        return self::create([
            'workspace_id' => $workspaceId,
            'actor_id' => $actorId,
            'action' => $action,
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'metadata_redacted' => $safeMetadata,
        ]);
    }

    private static function redactSensitiveData(array $data): array
    {
        $sensitiveKeys = ['access_token', 'accessToken', 'refresh_token', 'refreshToken', 'password', 'secret'];

        foreach ($data as $key => $value) {
            if (in_array(strtolower($key), array_map('strtolower', $sensitiveKeys), true)) {
                $data[$key] = '[REDACTED]';
            } elseif (is_array($value)) {
                $data[$key] = self::redactSensitiveData($value);
            }
        }

        return $data;
    }
}
