<?php

namespace App\Services\Ai;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiDriver
{
    protected string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key') 
            ?: env('NEWSPILOT_GEMINI_API_KEY') 
            ?: env('GEMINI_API_KEY', '');

        $this->model = config('services.gemini.model') 
            ?: env('NEWSPILOT_GEMINI_MODEL') 
            ?: env('GEMINI_TEXT_MODEL', 'gemini-3.1-flash-lite');
    }

    public function generateSocialPost(string $topic, string $tone = 'professional', string $platform = 'all'): array
    {
        if (empty($this->apiKey) || str_contains($this->apiKey, 'your_')) {
            return $this->fallbackPost($topic, $tone, $platform);
        }

        try {
            $prompt = "You are a senior social media copywriter. Write an engaging {$platform} post about '{$topic}' in a {$tone} tone. Return clean JSON with keys: 'caption', 'hook', 'hashtags' (array), 'call_to_action'.";

            $response = Http::timeout(12)->post("https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}", [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                ],
            ]);

            if ($response->successful()) {
                $rawText = $response->json('candidates.0.content.parts.0.text', '');
                $parsed = json_decode($rawText, true);
                if (is_array($parsed) && isset($parsed['caption'])) {
                    return [
                        'success' => true,
                        'data' => $parsed,
                        'model' => $this->model,
                    ];
                }
            }

            Log::warning('[GeminiDriver] API response error, falling back', ['response' => $response->body()]);
        } catch (\Throwable $e) {
            Log::error('[GeminiDriver] Connection exception', ['error' => $e->getMessage()]);
        }

        return $this->fallbackPost($topic, $tone, $platform);
    }

    public function generateNewsSocialPost(array $topicData, array $platforms = ['facebook'], string $tone = 'engaging'): array
    {
        $title = trim($topicData['title'] ?? '');
        $summary = trim($topicData['summary'] ?? '');
        $category = trim($topicData['category'] ?? 'General News');
        $sources = $topicData['source_urls'] ?? [];
        $sourceAttribution = !empty($sources[0]['publisher']) ? $sources[0]['publisher'] : 'Verified News Source';
        $sourceUrl = !empty($sources[0]['url']) ? $sources[0]['url'] : '';

        if (empty($this->apiKey) || str_contains($this->apiKey, 'your_')) {
            return $this->fallbackNewsPost($topicData, $platforms, $tone);
        }

        try {
            $platformsStr = implode(', ', $platforms);
            $prompt = <<<PROMPT
You are a senior social media news editor and content strategist.
Transform this verified breaking news story into engaging, platform-tailored social media posts for: {$platformsStr}.

CRITICAL EDITORIAL MANDATES:
1. FACTUAL GROUNDING: Rely strictly on the verified facts in the headline and summary below. Do not hallucinate or invent unverified statistics, events, or quotes.
2. ATTRIBUTION: Credit the reporting source: "{$sourceAttribution}".
3. PLATFORM FIT:
   - Facebook: Engaging news angle, natural conversational hook, clear paragraph breaks, question for community comments, hashtags.
   - Instagram / Threads: Catchy hook, concise digestible summary, bullet points, hashtags.
   - X (Twitter): Under 260 characters, immediate hook, key takeaway.
   - LinkedIn: Professional industry framing, key takeaways, business impact.

STORY DETAILS:
Headline: "{$title}"
Summary: "{$summary}"
Category: "{$category}"
Source: "{$sourceAttribution}" ({$sourceUrl})

Respond ONLY with valid JSON with this schema:
{
  "headline": "...",
  "editorial_summary": "...",
  "source_attribution": "...",
  "platform_posts": {
    "facebook": {
      "caption": "Full post text...",
      "hook": "Opening sentence...",
      "hashtags": ["#tag1", "#tag2"]
    }
  }
}
PROMPT;

            $response = Http::timeout(12)->post("https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}", [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                ],
            ]);

            if ($response->successful()) {
                $rawText = $response->json('candidates.0.content.parts.0.text', '');
                $parsed = json_decode($rawText, true);
                if (is_array($parsed) && isset($parsed['platform_posts'])) {
                    return [
                        'success' => true,
                        'data' => $parsed,
                        'model' => $this->model,
                    ];
                }
            }

            Log::warning('[GeminiDriver] News AI generation error, using grounded fallback', ['response' => $response->body()]);
        } catch (\Throwable $e) {
            Log::error('[GeminiDriver] News AI exception', ['error' => $e->getMessage()]);
        }

        return $this->fallbackNewsPost($topicData, $platforms, $tone);
    }

    protected function fallbackNewsPost(array $topicData, array $platforms, string $tone): array
    {
        $title = trim($topicData['title'] ?? 'Trending Industry Update');
        $summary = trim($topicData['summary'] ?? 'Key developments unfold as new information comes to light.');
        $sources = $topicData['source_urls'] ?? [];
        $sourceName = !empty($sources[0]['publisher']) ? $sources[0]['publisher'] : 'Industry Reports';
        $sourceUrl = !empty($sources[0]['url']) ? $sources[0]['url'] : '';

        $platformPosts = [];

        foreach ($platforms as $platform) {
            $plat = strtolower(trim($platform));
            $hashtags = ['#news', '#breaking', '#trending', '#update', '#insights'];

            if ($plat === 'facebook') {
                $hook = "🚨 Breaking update: {$title}";
                $caption = "{$hook}\n\n{$summary}\n\n"
                    . "💡 Key Takeaway: This development signals significant shifts worth watching closely.\n\n"
                    . "What's your take on this? Let us know in the comments below! 👇\n\n"
                    . "📰 Source: Reported by {$sourceName}" . (!empty($sourceUrl) ? " ({$sourceUrl})" : '') . "\n\n"
                    . implode(' ', array_slice($hashtags, 0, 4));
            } elseif ($plat === 'x' || $plat === 'twitter') {
                $hook = "⚡ BREAKING: {$title}";
                $snippet = strlen($summary) > 130 ? substr($summary, 0, 127) . '...' : $summary;
                $caption = "{$hook}\n\n{$snippet}\n\nvia {$sourceName} #Trending";
            } elseif ($plat === 'linkedin') {
                $hook = "Market Intelligence: {$title}";
                $caption = "{$hook}\n\n{$summary}\n\n"
                    . "Strategic Implications:\n• Accelerated pace of industry transformation\n• Heightened focus on execution and agility\n\n"
                    . "How is your team responding to these shifts?\n\n"
                    . "Source: {$sourceName}\n"
                    . implode(' ', array_slice($hashtags, 0, 3));
            } else {
                $hook = "✨ News Alert: {$title}";
                $caption = "{$hook}\n\n{$summary}\n\n"
                    . "Stay tuned for more updates.\n\n"
                    . "Credit: {$sourceName}\n\n"
                    . implode(' ', $hashtags);
            }

            $platformPosts[$plat] = [
                'hook' => $hook,
                'caption' => $caption,
                'hashtags' => $hashtags,
            ];
        }

        return [
            'success' => true,
            'data' => [
                'headline' => $title,
                'editorial_summary' => $summary,
                'source_attribution' => $sourceName,
                'platform_posts' => $platformPosts,
            ],
            'model' => 'grounded-editorial-fallback',
        ];
    }
}
