<?php

namespace App\Services\Social;

use App\Models\SocialAccount;

interface SocialProviderInterface
{
    public function getName(): string;
    public function isConfigured(): array;
    public function getCapabilities(): array;
    public function validatePost(string $content, array $attachments = []): array;
    public function publish(SocialAccount $account, string $content, array $attachments = []): array;
    public function refreshAccessToken(SocialAccount $account): ?string;
}
