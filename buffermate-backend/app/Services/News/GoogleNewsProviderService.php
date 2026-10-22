<?php

namespace App\Services\News;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleNewsProviderService
{
    public function __construct(protected FeedReaderService $feedReader)
    {
    }

    /**
     * Fetches top stories for a query or topic from Google News RSS.
     */
    public function search(string $query, string $geo = 'US', int $maxItems = 10): array
    {
        $encodedQuery = urlencode(trim($query));
        $geo = strtoupper(trim($geo));
        $url = "https://news.google.com/rss/search?q={$encodedQuery}&hl=en-{$geo}&gl={$geo}&ceid={$geo}:en";

        try {
            $response = Http::timeout(12)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (compatible; BufferMate-NewsPilot/1.0; +https://buffermate.ai)',
                ])
                ->get($url);

            if (!$response->successful()) {
                Log::warning("[GoogleNewsProviderService] HTTP error: {$response->status()}");
                return [];
            }

            return $this->feedReader->parse($response->body(), $maxItems);
        } catch (\Throwable $e) {
            Log::warning("[GoogleNewsProviderService] Exception searching '{$query}': {$e->getMessage()}");
            return [];
        }
    }
}
