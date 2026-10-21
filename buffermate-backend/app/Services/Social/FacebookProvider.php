<?php

namespace App\Services\Social;

use App\Models\SocialAccount;
use Illuminate\Support\Facades\Http;

class FacebookProvider implements SocialProviderInterface
{
    public function getName(): string
    {
        return 'facebook';
    }

    public function isConfigured(): array
    {
        $appId = config('services.facebook.client_id', env('FACEBOOK_APP_ID'));
        $appSecret = config('services.facebook.client_secret', env('FACEBOOK_APP_SECRET'));
        $missing = [];

        if (!$appId || str_contains($appId, 'your_')) {
            $missing[] = 'FACEBOOK_APP_ID';
        }
        if (!$appSecret || str_contains($appSecret, 'your_')) {
            $missing[] = 'FACEBOOK_APP_SECRET';
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
            'publish_carousel',
            'schedule',
            'comments_read',
            'comments_reply',
            'account_metrics',
        ];
    }

    public function validatePost(string $content, array $attachments = []): array
    {
        $errors = [];
        if (empty(trim($content)) && empty($attachments)) {
            $errors[] = 'Facebook post requires text content or at least one attachment.';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    public function publish(SocialAccount $account, string $content, array $attachments = []): array
    {
        $token = $account->access_token ?: env('FACEBOOK_PAGE_ACCESS_TOKEN');
        $pageId = $account->provider_user_id ?: env('FACEBOOK_PAGE_ID', '111006725414026');

        if (!$token || !$pageId) {
            return [
                'success' => false,
                'error_code' => 'PROVIDER_NOT_CONFIGURED',
                'message' => 'Missing Facebook page credentials',
            ];
        }

        $response = Http::post("https://graph.facebook.com/v20.0/{$pageId}/feed", [
            'message' => $content,
            'access_token' => $token,
        ]);

        if ($response->successful()) {
            $postId = $response->json('id');
            return [
                'success' => true,
                'external_post_id' => $postId,
                'url' => "https://facebook.com/{$postId}",
                'raw' => $response->json(),
            ];
        }

        return [
            'success' => false,
            'error_code' => 'FACEBOOK_API_ERROR',
            'message' => $response->json('error.message', $response->body()),
            'status' => $response->status(),
        ];
    }

    public function refreshAccessToken(SocialAccount $account): ?string
    {
        return null;
    }
}
