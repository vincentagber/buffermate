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
        $this->apiKey = env('GEMINI_API_KEY', '');
        $this->model = env('GEMINI_TEXT_MODEL', 'gemini-2.5-flash');
    }

    public function generateSocialPost(string $topic, string $tone = 'professional', string $platform = 'all'): array
    {
        if (empty($this->apiKey) || str_contains($this->apiKey, 'your_')) {
            return $this->fallbackPost($topic, $tone, $platform);
        }

        try {
            $prompt = "You are a senior social media copywriter. Write an engaging {$platform} post about '{$topic}' in a {$tone} tone. Return clean JSON with keys: 'caption', 'hook', 'hashtags' (array), 'call_to_action'.";

            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}", [
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

    protected function fallbackPost(string $topic, string $tone, string $platform): array
    {
        return [
            'success' => true,
            'data' => [
                'hook' => "Here is why {$topic} changes everything in 2026 💡",
                'caption' => "Mastering {$topic} is now the #1 lever for growth. Here are 3 actionable insights you can apply right now:\n\n1. Automate the routine\n2. Focus on engagement\n3. Iterate based on real metrics.\n\nDrop a comment below with your thoughts! 👇",
                'hashtags' => ['#growth', '#socialmedia', '#automation', '#business'],
                'call_to_action' => "Comment 'GROWTH' to get our free playbook.",
            ],
            'model' => 'fallback-template',
        ];
    }
}
