<?php

namespace App\Services\Social;

use App\Models\SocialAccount;
use Illuminate\Support\Facades\Http;

class TwitterProvider implements SocialProviderInterface
{
    public function getName(): string
    {
        return 'x';
    }

    public function isConfigured(): array
    {
        $clientId = config('services.twitter.client_id', env('TWITTER_CLIENT_ID'));
        $missing = [];

        if (!$clientId || str_contains($clientId, 'your_')) {
            $missing[] = 'TWITTER_CLIENT_ID';
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
            'metrics_read',
        ];
    }

    public function validatePost(string $content, array $attachments = []): array
    {
        $errors = [];
        if (mb_strlen($content) > 280) {
            $errors[] = 'Tweet exceeds maximum limit of 280 characters.';
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
                'message' => 'No access token available for Twitter account',
            ];
        }

        $response = Http::withToken($token)
            ->post('https://api.twitter.com/2/tweets', [
                'text' => $content,
            ]);

        if ($response->successful()) {
            $data = $response->json('data');
            return [
                'success' => true,
                'external_post_id' => $data['id'] ?? null,
                'url' => isset($data['id']) ? "https://x.com/i/web/status/{$data['id']}" : null,
                'raw' => $response->json(),
            ];
        }

        return [
            'success' => false,
            'error_code' => 'TWITTER_API_ERROR',
            'message' => $response->body(),
            'status' => $response->status(),
        ];
    }

    public function refreshAccessToken(SocialAccount $account): ?string
    {
        return null;
    }
}
