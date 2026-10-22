<?php

namespace App\Services\News;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FeedReaderService
{
    private const MAX_RESPONSE_BYTES = 5242880; // 5 MB

    /**
     * Fetches and parses an RSS 2.0 or Atom feed.
     *
     * @return array<array{title: string, link: string, description: string, published_at: string, publisher: string, guid: string, media_url: ?string}>
     */
    public function fetch(string $feedUrl, int $maxItems = 15): array
    {
        $feedUrl = trim($feedUrl);
        if (!UrlSecurityValidator::isSafeUrl($feedUrl)) {
            throw new \InvalidArgumentException("Invalid or unsafe feed destination: {$feedUrl}");
        }

        $response = Http::timeout(15)
            ->withHeaders([
                'User-Agent' => 'BufferMate-NewsPilot/1.0 (+https://buffermate.ai)',
                'Accept' => 'application/rss+xml, application/atom+xml, text/xml, application/xml;q=0.9, */*;q=0.8',
            ])
            ->get($feedUrl);

        if (!$response->successful()) {
            throw new \RuntimeException("Feed HTTP request returned status {$response->status()}");
        }

        $body = $response->body();
        if (strlen($body) > self::MAX_RESPONSE_BYTES) {
            throw new \RuntimeException('Feed response exceeded maximum allowed payload size (5MB)');
        }

        return $this->parse($body, $maxItems);
    }

    /**
     * Parses raw XML into structured news items.
     */
    public function parse(string $xmlContent, int $maxItems = 15): array
    {
        $prevLibXml = libxml_use_internal_errors(true);
        $xml = simplexml_load_string(
            $xmlContent,
            'SimpleXMLElement',
            LIBXML_NONET | LIBXML_NOCDATA | LIBXML_NOERROR | LIBXML_NOWARNING
        );
        libxml_clear_errors();
        libxml_use_internal_errors($prevLibXml);

        if (false === $xml) {
            throw new \RuntimeException('Failed to parse feed XML payload');
        }

        // Atom feed
        if ($xml->getName() === 'feed') {
            return $this->parseAtom($xml, $maxItems);
        }

        // RSS 2.0 feed
        if (isset($xml->channel)) {
            return $this->parseRss($xml, $maxItems);
        }

        throw new \RuntimeException('Unrecognized feed format (neither RSS 2.0 nor Atom)');
    }

    protected function parseRss(\SimpleXMLElement $xml, int $maxItems): array
    {
        $items = [];
        $channelTitle = trim((string) ($xml->channel->title ?? 'News Feed'));

        if (!isset($xml->channel->item)) {
            return [];
        }

        $count = 0;
        foreach ($xml->channel->item as $entry) {
            if ($count >= $maxItems) {
                break;
            }

            $title = trim(strip_tags((string) $entry->title));
            $link = trim((string) $entry->link);
            if (empty($title) || empty($link)) {
                continue;
            }

            $description = trim(strip_tags((string) ($entry->description ?? $entry->summary ?? '')));
            $pubDate = !empty($entry->pubDate) ? date('Y-m-d H:i:s', strtotime((string) $entry->pubDate)) : now()->toIso8601String();
            $guid = !empty($entry->guid) ? trim((string) $entry->guid) : $link;

            // Extract publisher / author
            $publisher = trim((string) ($entry->author ?? $entry->children('dc', true)->creator ?? $channelTitle));
            if (empty($publisher)) {
                $publisher = $channelTitle;
            }

            // Extract media enclosure / image if present
            $mediaUrl = null;
            if (isset($entry->enclosure) && str_starts_with((string) $entry->enclosure['type'], 'image/')) {
                $mediaUrl = (string) $entry->enclosure['url'];
            } elseif (isset($entry->children('media', true)->content)) {
                $mediaUrl = (string) $entry->children('media', true)->content->attributes()['url'];
            }

            $items[] = [
                'title' => $title,
                'link' => $link,
                'normalized_link' => UrlSecurityValidator::normalizeUrl($link),
                'description' => $description,
                'published_at' => $pubDate,
                'publisher' => $publisher,
                'guid' => $guid,
                'media_url' => $mediaUrl,
            ];

            $count++;
        }

        return $items;
    }

    protected function parseAtom(\SimpleXMLElement $xml, int $maxItems): array
    {
        $items = [];
        $feedTitle = trim((string) ($xml->title ?? 'Atom Feed'));

        if (!isset($xml->entry)) {
            return [];
        }

        $count = 0;
        foreach ($xml->entry as $entry) {
            if ($count >= $maxItems) {
                break;
            }

            $title = trim(strip_tags((string) $entry->title));

            // In Atom, link can be an attribute href
            $link = '';
            if (isset($entry->link)) {
                foreach ($entry->link as $linkEl) {
                    $rel = (string) $linkEl['rel'];
                    if (empty($rel) || $rel === 'alternate') {
                        $link = (string) $linkEl['href'];
                        break;
                    }
                }
                if (empty($link) && isset($entry->link[0]['href'])) {
                    $link = (string) $entry->link[0]['href'];
                }
            }

            if (empty($title) || empty($link)) {
                continue;
            }

            $summary = trim(strip_tags((string) ($entry->summary ?? $entry->content ?? '')));
            $pubDate = !empty($entry->published) ? date('Y-m-d H:i:s', strtotime((string) $entry->published)) : (
                !empty($entry->updated) ? date('Y-m-d H:i:s', strtotime((string) $entry->updated)) : now()->toIso8601String()
            );

            $publisher = trim((string) ($entry->author->name ?? $feedTitle));
            if (empty($publisher)) {
                $publisher = $feedTitle;
            }

            $items[] = [
                'title' => $title,
                'link' => $link,
                'normalized_link' => UrlSecurityValidator::normalizeUrl($link),
                'description' => $summary,
                'published_at' => $pubDate,
                'publisher' => $publisher,
                'guid' => (string) ($entry->id ?? $link),
                'media_url' => null,
            ];

            $count++;
        }

        return $items;
    }
}
