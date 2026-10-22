<?php

namespace App\Services\News;

use Carbon\Carbon;

class TopicRankerService
{
    /**
     * Computes scoring metrics for a candidate topic.
     *
     * @param array $topic {title: string, summary: string, category: string, published_at: string, source_priority: int, source_urls: array}
     * @param array $config {keywords: array, preferred_categories: array, min_score: float}
     * @return array{score: float, breakdown: array{relevance: float, freshness: float, quality: float, explanation: string}}
     */
    public function evaluate(array $topic, array $config = []): array
    {
        $title = trim($topic['title'] ?? '');
        $summary = trim($topic['summary'] ?? $topic['description'] ?? '');
        $category = trim($topic['category'] ?? 'General');
        $pubTime = !empty($topic['published_at']) ? Carbon::parse($topic['published_at'])->timestamp : time();
        $sourceUrls = $topic['source_urls'] ?? [];
        $refCount = max(1, count($sourceUrls));
        $sourcePriority = (int) ($topic['source_priority'] ?? 5);

        // 1. Freshness Score (0 - 100)
        $ageHours = max(0, (time() - $pubTime) / 3600);
        if ($ageHours <= 3) {
            $freshnessScore = 100.0;
        } elseif ($ageHours <= 12) {
            $freshnessScore = 85.0;
        } elseif ($ageHours <= 24) {
            $freshnessScore = 70.0;
        } elseif ($ageHours <= 48) {
            $freshnessScore = 45.0;
        } elseif ($ageHours <= 72) {
            $freshnessScore = 25.0;
        } else {
            $freshnessScore = 10.0;
        }

        // 2. Source Credibility & Corroboration Score (0 - 100)
        // Priority 1 is highest priority, 10 is normal
        $prioFactor = max(20.0, 100.0 - ($sourcePriority * 6.0));
        $corroborationBonus = min(30.0, ($refCount - 1) * 15.0);
        $qualityScore = min(100.0, $prioFactor + $corroborationBonus);

        // 3. Relevance Score (0 - 100)
        $relevanceScore = $this->computeRelevance($title, $summary, $category, $config);

        // 4. Combined Weighted Score: 45% Relevance + 30% Freshness + 25% Quality
        $totalScore = round(($relevanceScore * 0.45) + ($freshnessScore * 0.30) + ($qualityScore * 0.25), 1);

        $explanation = sprintf(
            'Relevance: %d/100, Freshness: %d/100 (%.1fh old), Quality: %d/100 (%d source(s)).',
            (int) $relevanceScore,
            (int) $freshnessScore,
            $ageHours,
            (int) $qualityScore,
            $refCount
        );

        return [
            'score' => $totalScore,
            'breakdown' => [
                'relevance' => round($relevanceScore, 1),
                'freshness' => round($freshnessScore, 1),
                'quality' => round($qualityScore, 1),
                'age_hours' => round($ageHours, 1),
                'explanation' => $explanation,
            ],
        ];
    }

    protected function computeRelevance(string $title, string $summary, string $category, array $config): float
    {
        $baseScore = 60.0;
        $combinedText = strtolower("{$title} {$summary} {$category}");

        // Boost for preferred categories
        $prefCategories = $config['preferred_categories'] ?? [];
        if (!empty($prefCategories)) {
            foreach ($prefCategories as $prefCat) {
                if (str_contains(strtolower($category), strtolower($prefCat))) {
                    $baseScore += 20.0;
                    break;
                }
            }
        }

        // Boost for matching workspace keywords
        $keywords = $config['keywords'] ?? [];
        if (!empty($keywords)) {
            $matches = 0;
            foreach ($keywords as $kw) {
                $kw = trim(strtolower($kw));
                if (!empty($kw) && str_contains($combinedText, $kw)) {
                    $matches++;
                }
            }
            if ($matches > 0) {
                $baseScore += min(25.0, $matches * 10.0);
            }
        }

        // Deduct if title is extremely short (< 15 chars) or spammy
        if (strlen($title) < 15) {
            $baseScore -= 30.0;
        }

        return max(10.0, min(100.0, $baseScore));
    }

    /**
     * Calculate title similarity between two strings (0.0 to 1.0).
     */
    public function computeTitleSimilarity(string $titleA, string $titleB): float
    {
        $cleanA = strtolower(trim(preg_replace('/[^a-z0-9\s]/', '', $titleA)));
        $cleanB = strtolower(trim(preg_replace('/[^a-z0-9\s]/', '', $titleB)));

        if ($cleanA === $cleanB) {
            return 1.0;
        }

        similar_text($cleanA, $cleanB, $percent);
        return $percent / 100.0;
    }
}
