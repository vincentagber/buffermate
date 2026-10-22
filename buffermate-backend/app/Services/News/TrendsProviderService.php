<?php

namespace App\Services\News;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TrendsProviderService
{
    /**
     * Supported geo regions.
     */
    public const SUPPORTED_GEOS = ['US', 'GB', 'NG', 'CA', 'AU', 'ZA', 'IN', 'KE', 'GH'];

    public function __construct(protected FeedReaderService $feedReader)
    {
    }

    /**
     * Fetches real-time trending news stories from Google Trends RSS.
     *
     * @return array<array{title: string, link: string, normalized_link: string, description: string, published_at: string, publisher: string, news_items: array}>
     */
    public function fetchTrends(string $geo = 'US', int $maxTrends = 10): array
    {
        $geo = strtoupper(trim($geo));
        if (!in_array($geo, self::SUPPORTED_GEOS, true)) {
            $geo = 'US';
        }

        $url = "https://trends.google.com/trending/rss?geo={$geo}";

        try {
            $response = Http::timeout(12)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (compatible; BufferMate-NewsPilot/1.0; +https://buffermate.ai)',
                ])
                ->get($url);

            if (!$response->successful()) {
                Log::warning("[TrendsProviderService] Google Trends request failed: {$response->status()}");
                return [];
            }

            $body = $response->body();
            if (empty($body)) {
                return [];
            }

            $prevLibXml = libxml_use_internal_errors(true);
            $xml = simplexml_load_string(
                $body,
                'SimpleXMLElement',
                LIBXML_NONET | LIBXML_NOCDATA | LIBXML_NOERROR | LIBXML_NOWARNING
            );
            libxml_clear_errors();
            libxml_use_internal_errors($prevLibXml);

            if (false === $xml || !isset($xml->channel->item)) {
                return [];
            }

            $results = [];
            $count = 0;

            foreach ($xml->channel->item as $item) {
                if ($count >= $maxTrends) {
                    break;
                }

                $title = trim((string) $item->title);
                $pubDate = !empty($item->pubDate) ? date('Y-m-d H:i:s', strtotime((string) $item->pubDate)) : now()->toIso8601String();
                $description = trim(strip_tags((string) $item->description));

                // Process ht:news_item sub-elements if present
                $newsItems = [];
                $htNs = $item->children('ht', true);
                if (isset($htNs->news_item)) {
                    foreach ($htNs->news_item as $ni) {
                        $niTitle = trim(strip_tags((string) ($ni->children('ht', true)->news_item_title ?? '')));
                        $niUrl = trim((string) ($ni->children('ht', true)->news_item_url ?? ''));
                        $niSource = trim((string) ($ni->children('ht', true)->news_item_source ?? 'Google Trends'));
                        $niSnippet = trim(strip_tags((string) ($ni->children('ht', true)->news_item_snippet ?? '')));

                        if (!empty($niTitle) && !empty($niUrl)) {
                            $newsItems[] = [
                                'title' => $niTitle,
                                'url' => $niUrl,
                                'normalized_link' => UrlSecurityValidator::normalizeUrl($niUrl),
                                'publisher' => $niSource,
                                'snippet' => $niSnippet,
                            ];
                        }
                    }
                }

                // Primary link is either first news item link or Google trends item link
                $link = !empty($newsItems[0]['url']) ? $newsItems[0]['url'] : trim((string) $item->link);
                $publisher = !empty($newsItems[0]['publisher']) ? $newsItems[0]['publisher'] : 'Google Trends';

                $results[] = [
                    'title' => $title,
                    'link' => $link,
                    'normalized_link' => UrlSecurityValidator::normalizeUrl($link),
                    'description' => $description,
                    'published_at' => $pubDate,
                    'publisher' => $publisher,
                    'news_items' => $newsItems,
                ];

                $count++;
            }

            return $results;
        } catch (\Throwable $e) {
            Log::warning("[TrendsProviderService] Exception fetching trends for {$geo}: {$e->getMessage()}");
            return [];
        }
    }
}
