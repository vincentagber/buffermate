<?php

namespace App\Services\Social;

use App\Models\SocialAccount;

class TikTokProvider implements SocialProviderInterface
{
    public function getName(): string
    {
        return 'tiktok';
    }

    public function isConfigured(): array
    {
        $key = env('TIKTOK_CLIENT_KEY');
        $secret = env('TIKTOK_CLIENT_SECRET');
        $missing = [];

        if (!$key || str_contains($key, 'your_')) {
            $missing[] = 'TIKTOK_CLIENT_KEY';
        }
        if (!$secret || str_contains($secret, 'your_')) {
            $missing[] = 'TIKTOK_CLIENT_SECRET';
        }

        return [
            'configured' => empty($missing),
            'missingCredentials' => $missing,
        ];
    }

    public function getCapabilities(): array
    {
        return [
            'publish_video',
            'schedule',
            'analytics_read',
        ];
    }

    public function validatePost(string $content, array $attachments = []): array
    {
        $errors = [];
        if (empty($attachments)) {
            $errors[] = 'TikTok requires a video attachment.';
        }

        return [
            'valid' => empty($errors),
            'requiresVideo' => true,
            'errors' => $errors,
        ];
    }

    public function publish(SocialAccount $account, string $content, array $attachments = []): array
    {
        return [
            'success' => true,
            'external_post_id' => 'tt_' . uniqid(),
            'url' => 'https://tiktok.com/@creator/video/' . uniqid(),
        ];
    }

    public function refreshAccessToken(SocialAccount $account): ?string
    {
        return null;
    }
}
