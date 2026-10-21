<?php

namespace App\Services\Guardrails;

use App\Models\Post;
use Carbon\Carbon;

class DuplicateContentGuard
{
    /**
     * Prevents duplicate content dispatched within a 48-hour window.
     */
    public function check(string $workspaceId, string $content): array
    {
        $normalized = trim(preg_replace('/\s+/', ' ', mb_strtolower($content)));
        $contentHash = hash('sha256', $normalized);
        $cutoff = Carbon::now()->subHours(48);

        // Check posts in the last 48 hours
        $duplicateExists = Post::where('workspace_id', $workspaceId)
            ->where('created_at', '>=', $cutoff)
            ->get()
            ->contains(function (Post $post) use ($normalized) {
                $existingNormalized = trim(preg_replace('/\s+/', ' ', mb_strtolower($post->content)));
                return $existingNormalized === $normalized;
            });

        if ($duplicateExists) {
            return [
                'passed' => false,
                'code' => 'DUPLICATE_CONTENT',
                'message' => 'Identical content has already been published or queued within the past 48 hours.',
            ];
        }

        return [
            'passed' => true,
            'hash' => $contentHash,
        ];
    }
}
