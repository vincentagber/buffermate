<?php

namespace App\Services\Ai;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAiDriver
{
    protected string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = env('OPENAI_API_KEY', '');
        $this->model = env('OPENAI_MODEL', 'gpt-4o-mini');
    }

    public function generateSuggestions(string $topic, string $tone = 'professional'): array
    {
        if (empty($this->apiKey) || str_contains($this->apiKey, 'your_')) {
            return $this->fallbackSuggestions($topic);
        }

        try {
            $response = Http::withToken($this->apiKey)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => $this->model,
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are an expert social media growth strategist.'],
                        ['role' => 'user', 'content' => "Generate 3 social post variations about '{$topic}' in {$tone} tone. Return a JSON array of strings."]
                    ],
                    'response_format' => ['type' => 'json_object'],
                ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                $parsed = json_decode($content, true);
                return [
                    'success' => true,
                    'suggestions' => $parsed['suggestions'] ?? [$content],
                ];
            }
        } catch (\Throwable $e) {
            Log::error('[OpenAiDriver] Exception: ' . $e->getMessage());
        }

        return $this->fallbackSuggestions($topic);
    }

    protected function fallbackSuggestions(string $topic): array
    {
        return [
            'success' => true,
            'suggestions' => [
                "3 big lessons we learned testing {$topic} this quarter. A breakdown you can replicate today:",
                "Why 90% of brands fail with {$topic} — and the 1 fix that turns it around in 24 hours.",
                "The simple checklist we use to execute {$topic} with zero guesswork.",
            ],
        ];
    }
}
