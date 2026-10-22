<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsTopic extends Model
{
    use HasUuids;

    protected $fillable = [
        'workspace_id',
        'topic_hash',
        'title',
        'summary',
        'category',
        'discovery_source',
        'source_urls',
        'score',
        'score_breakdown',
        'editorial_risk_score',
        'editorial_flags',
        'status',
        'post_id',
        'published_at',
    ];

    protected $casts = [
        'source_urls' => 'array',
        'score' => 'float',
        'score_breakdown' => 'array',
        'editorial_risk_score' => 'integer',
        'editorial_flags' => 'array',
        'published_at' => 'datetime',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Helper to generate deterministic unique hash for deduplication.
     */
    public static function generateHash(string $title, ?string $canonicalUrl = null): string
    {
        $normalizedTitle = strtolower(trim(preg_replace('/[^a-zA-Z0-9]/', '', $title)));
        if (!empty($canonicalUrl)) {
            $cleanUrl = strtolower(trim(explode('#', explode('?', $canonicalUrl)[0])[0]));
            return md5($cleanUrl . '_' . substr($normalizedTitle, 0, 40));
        }
        return md5($normalizedTitle);
    }
}
