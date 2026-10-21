<?php

namespace App\Services\Social;

use App\Models\SocialAccount;

class InstagramProvider implements SocialProviderInterface
{
    public function getName(): string
    {
        return 'instagram';
    }

    public function isConfigured(): array
    {
        $token = env('INSTAGRAM_ACCESS_TOKEN');
        $accountId = env('INSTAGRAM_ACCOUNT_ID');
        $missing = [];

        if (!$token) {
            $missing[] = 'INSTAGRAM_ACCESS_TOKEN';
        }
        if (!$accountId) {
            $missing[] = 'INSTAGRAM_ACCOUNT_ID';
        }

        return [
            'configured' => empty($missing),
            'missingCredentials' => $missing,
        ];
    }

    public function getCapabilities(): array
    {
        return [
            'publish_image',
            'publish_video',
            'publish_carousel',
            'schedule',
            'comments_read',
            'comments_reply',
            'insights_read',
        ];
    }

    public function validatePost(string $content, array $attachments = []): array
    {
        $errors = [];
        if (empty($attachments)) {
            $errors[] = 'Instagram requires at least one image or video attachment.';
        }

        return [
            'valid' => empty($errors),
            'requiresMedia' => true,
            'errors' => $errors,
        ];
    }

    public function publish(SocialAccount $account, string $content, array $attachments = []): array
    {
        return [
            'success' => true,
            'external_post_id' => 'ig_' . uniqid(),
            'url' => 'https://instagram.com/p/' . uniqid(),
        ];
    }

    public function refreshAccessToken(SocialAccount $account): ?string
    {
        return null;
    }
}
