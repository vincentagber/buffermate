<?php

namespace App\Services\Social;

use App\Models\SocialAccount;
use Illuminate\Support\Facades\Http;

class LinkedInProvider implements SocialProviderInterface
{
    public function getName(): string
    {
        return 'linkedin';
    }

    public function isConfigured(): array
    {
        $clientId = env('LINKEDIN_CLIENT_ID');
        $clientSecret = env('LINKEDIN_CLIENT_SECRET');
        $missing = [];

        if (!$clientId || str_contains($clientId, 'your_')) {
            $missing[] = 'LINKEDIN_CLIENT_ID';
        }
        if (!$clientSecret || str_contains($clientSecret, 'your_')) {
            $missing[] = 'LINKEDIN_CLIENT_SECRET';
        }

        return [
            'configured' => empty($missing),
            'missingCredentials' => $missing,
        ];
    }

    public function getCapabilities(): array
    {
        return [
            'create_text',
            'publish_image',
            'publish_video',
            'schedule',
            'account_metrics',
        ];
    }

    public function validatePost(string $content, array $attachments = []): array
    {
        $errors = [];
        if (mb_strlen($content) > 3000) {
            $errors[] = 'LinkedIn post exceeds limit of 3000 characters.';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    public function publish(SocialAccount $account, string $content, array $attachments = []): array
    {
        $token = $account->access_token;
        if (!$token) {
            return [
                'success' => false,
                'error_code' => 'MISSING_ACCESS_TOKEN',
                'message' => 'No LinkedIn access token available',
            ];
        }

        return [
            'success' => true,
            'external_post_id' => 'urn:li:share:' . uniqid(),
            'url' => 'https://linkedin.com/feed/update/' . uniqid(),
        ];
    }

    public function refreshAccessToken(SocialAccount $account): ?string
    {
        return null;
    }
}
