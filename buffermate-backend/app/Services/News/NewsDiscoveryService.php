<?php

namespace App\Services\News;

use App\Models\NewsFeed;
use App\Models\NewsTopic;
use App\Models\Workspace;
use Illuminate\Support\Facades\Log;

class NewsDiscoveryService
{
    public function __construct(
        protected FeedReaderService $feedReader,
        protected TrendsProviderService $trendsProvider,
        protected GoogleNewsProviderService $googleNewsProvider,
        protected TopicRankerService $ranker,
        protected EditorialValidatorService $editorialValidator
    ) {
    }

    /**
     * Executes a news and trend discovery cycle for a workspace.
     *
     * @return array{discovered: int, skipped_duplicates: int, errors: array}
     */
    public function runForWorkspace(Workspace $workspace): array
    {
        $stats = [
            'discovered' => 0,
            'skipped_duplicates' => 0,
            'errors' => [],
        ];

        $settings = $workspace->settings ?? [];
        $newsConfig = $settings['news_pilot'] ?? [];
        $geo = $newsConfig['trends_geo'] ?? 'US';
        $keywords = $newsConfig['keywords'] ?? [];
        $preferredCategories = $newsConfig['preferred_categories'] ?? [];
        $minScore = (float) ($newsConfig['min_score'] ?? 40.0);

        $rankerConfig = [
            'keywords' => $keywords,
            'preferred_categories' => $preferredCategories,
            'min_score' => $minScore,
        ];

        // 1. Ingest configured NewsFeeds
        $feeds = NewsFeed::where('workspace_id', $workspace->id)
            ->where('enabled', true)
            ->get();

        foreach ($feeds as $feed) {
            try {
                $items = $this->feedReader->fetch($feed->url, 12);
                $feed->update([
                    'last_fetch_at' => now(),
                    'last_error' => null,
                ]);

                foreach ($items as $item) {
                    $item['category'] = $feed->category ?: 'General';
                    $item['source_priority'] = $feed->priority ?: 5;
                    $item['discovery_source'] = "rss:{$feed->name}";
                    $this->processCandidate($workspace, $item, $rankerConfig, $stats);
                }
            } catch (\Throwable $e) {
                $feed->update([
                    'last_fetch_at' => now(),
                    'last_error' => $e->getMessage(),
                ]);
                $stats['errors'][] = "Feed {$feed->name}: {$e->getMessage()}";
                Log::warning("[NewsDiscovery] Feed {$feed->name} error: {$e->getMessage()}");
            }
        }

        // 2. Ingest Google Trends if enabled (default true)
        if (($newsConfig['trends_enabled'] ?? true) !== false) {
            try {
                $trends = $this->trendsProvider->fetchTrends($geo, 6);
                foreach ($trends as $trend) {
                    $item = [
                        'title' => $trend['title'],
                        'link' => $trend['link'],
                        'normalized_link' => $trend['normalized_link'],
                        'description' => $trend['description'],
                        'published_at' => $trend['published_at'],
                        'publisher' => $trend['publisher'],
                        'category' => 'Trending',
                        'source_priority' => 3, // High interest priority
                        'discovery_source' => "google_trends:{$geo}",
                        'source_urls' => !empty($trend['news_items']) ? $trend['news_items'] : [
                            ['publisher' => $trend['publisher'], 'url' => $trend['link'], 'published_at' => $trend['published_at']]
                        ],
                    ];
                    $this->processCandidate($workspace, $item, $rankerConfig, $stats);
                }
            } catch (\Throwable $e) {
                $stats['errors'][] = "Google Trends error: {$e->getMessage()}";
                Log::warning("[NewsDiscovery] Trends error: {$e->getMessage()}");
            }
        }

        return $stats;
    }

    /**
     * Process an individual candidate story, deduplicate, score, and persist if new.
     */
    protected function processCandidate(Workspace $workspace, array $item, array $rankerConfig, array &$stats): void
    {
        $title = trim($item['title'] ?? '');
        $link = trim($item['link'] ?? '');
        if (empty($title) || strlen($title) < 10) {
            return;
        }

        $canonicalUrl = !empty($item['normalized_link']) ? $item['normalized_link'] : $link;
        $hash = NewsTopic::generateHash($title, $canonicalUrl);

        // 1. Exact hash deduplication check
        $exists = NewsTopic::where('workspace_id', $workspace->id)
            ->where('topic_hash', $hash)
            ->exists();

        if ($exists) {
            $stats['skipped_duplicates']++;
            return;
        }

        // 2. Recent title similarity deduplication check (past 7 days)
        $recentTopics = NewsTopic::where('workspace_id', $workspace->id)
            ->where('created_at', '>=', now()->subDays(7))
            ->select(['id', 'title'])
            ->get();

        foreach ($recentTopics as $recent) {
            if ($this->ranker->computeTitleSimilarity($title, $recent->title) >= 0.75) {
                $stats['skipped_duplicates']++;
                return;
            }
        }

        // 3. Score candidate
        $mediaUrl = $item['media_url'] ?? null;
        $sources = $item['source_urls'] ?? [
            [
                'publisher' => $item['publisher'] ?? 'External Source',
                'url' => $link,
                'published_at' => $item['published_at'] ?? now()->toIso8601String(),
                'snippet' => $item['description'] ?? '',
                'media_url' => $mediaUrl,
            ]
        ];
        if (!empty($mediaUrl) && isset($sources[0]) && empty($sources[0]['media_url'])) {
            $sources[0]['media_url'] = $mediaUrl;
        }

        $topicData = [
            'title' => $title,
            'summary' => $item['description'] ?? '',
            'category' => $item['category'] ?? 'General',
            'published_at' => $item['published_at'] ?? now()->toIso8601String(),
            'source_priority' => $item['source_priority'] ?? 5,
            'source_urls' => $sources,
            'media_url' => $mediaUrl,
        ];

        $scoring = $this->ranker->evaluate($topicData, $rankerConfig);

        // 4. Check minimum score threshold
        if ($scoring['score'] < ($rankerConfig['min_score'] ?? 30.0)) {
            return;
        }

        // 5. Evaluate editorial risk
        $editorial = $this->editorialValidator->evaluate($title, $item['description'] ?? '', $sources);

        // 6. Persist to database
        NewsTopic::create([
            'workspace_id' => $workspace->id,
            'topic_hash' => $hash,
            'title' => $title,
            'summary' => $item['description'] ?? '',
            'category' => $item['category'] ?? 'General',
            'discovery_source' => $item['discovery_source'] ?? 'rss',
            'source_urls' => $sources,
            'score' => $scoring['score'],
            'score_breakdown' => $scoring['breakdown'],
            'editorial_risk_score' => $editorial['risk_score'],
            'editorial_flags' => $editorial['flags'],
            'status' => 'discovered',
        ]);

        $stats['discovered']++;
    }
}
