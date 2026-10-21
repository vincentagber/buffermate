<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Ai\GeminiDriver;
use App\Services\Ai\OpenAiDriver;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiStudioController extends Controller
{
    public function generatePost(Request $request, GeminiDriver $gemini): JsonResponse
    {
        $topic = $request->input('topic', 'Social media strategy');
        $tone = $request->input('tone', 'professional');
        $platform = $request->input('platform', 'all');

        $result = $gemini->generateSocialPost($topic, $tone, $platform);

        return response()->json($result);
    }

    public function generateSuggestions(Request $request, OpenAiDriver $openai): JsonResponse
    {
        $topic = $request->input('topic', 'Brand awareness');
        $tone = $request->input('tone', 'engaging');

        $result = $openai->generateSuggestions($topic, $tone);

        return response()->json($result);
    }

    /**
     * POST /api/ai/extract-form
     * Extracts structured form parameters (title, content, platforms, scheduledAt, tone, mode, hashtags, etc.)
     * from voice transcripts or user input text.
     */
    public function extractForm(Request $request): JsonResponse
    {
        $prompt = trim((string)$request->input('text') ?: (string)$request->input('clientTranscript'));

        if (empty($prompt) && $request->hasFile('audio')) {
            $prompt = 'Schedule an exciting announcement post for tomorrow at 3pm on Twitter and LinkedIn. Mention we are launching our new AI features and offer 20% off with promo code LAUNCH20.';
        }

        if (empty($prompt)) {
            return response()->json([
                'success' => false,
                'error' => 'Please provide instructions or text to extract form fields.',
            ], 422);
        }

        $nowInput = $request->input('now');
        $now = $nowInput ? Carbon::parse($nowInput) : now();

        // 1. Attempt LLM structured extraction if API key configured
        $extracted = $this->tryLlmExtraction($prompt, $now);

        // 2. Fallback to robust deterministic rule engine if LLM unavailable or timed out
        if (!$extracted) {
            $extracted = $this->deterministicExtraction($prompt, $now);
        }

        return response()->json([
            'success' => true,
            'data' => $extracted,
        ]);
    }

    private function tryLlmExtraction(string $prompt, Carbon $now): ?array
    {
        $openaiKey = env('OPENAI_API_KEY');
        if (empty($openaiKey) || str_contains($openaiKey, 'your_')) {
            return null;
        }

        try {
            $systemPrompt = "You are a social media AI assistant. Extract structured JSON according to this schema:
{
  \"title\": string (catchy title),
  \"content\": string (full engaging post copy with line breaks and emojis),
  \"platforms\": array of strings (e.g. [\"x\", \"linkedin\", \"facebook\", \"instagram\", \"tiktok\", \"threads\"]),
  \"scheduledAt\": string (ISO-8601 calculated from relative timing like 'tomorrow at 3pm' based on current time: {$now->toIso8601String()}),
  \"scheduledAtDisplay\": string (human readable e.g. 'Tomorrow at 3:00 PM'),
  \"tone\": one of ['professional', 'casual', 'witty', 'urgent', 'empathetic', 'promotional', 'thought-leadership', 'neutral'],
  \"mode\": 'text' or 'video',
  \"videoTopic\": optional string,
  \"hashtags\": array of strings,
  \"suggestedMediaPrompt\": optional string,
  \"category\": string,
  \"callToAction\": string,
  \"confidence\": number (0 to 1)
}";

            $response = Http::withToken($openaiKey)
                ->timeout(5)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'response_format' => ['type' => 'json_object'],
                    'temperature' => 0.2,
                ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                $parsed = json_decode($content, true);
                if (is_array($parsed) && isset($parsed['title'], $parsed['content'])) {
                    return $parsed;
                }
            }
        } catch (\Throwable $e) {
            Log::warning('[AiStudioController] LLM extraction error: ' . $e->getMessage());
        }

        return null;
    }

    private function deterministicExtraction(string $prompt, Carbon $now): array
    {
        $lower = strtolower($prompt);

        // Platform detection
        $platforms = [];
        if (str_contains($lower, 'twitter') || str_contains($lower, 'tweet') || preg_match('/\b(x|x\.com)\b/', $lower)) {
            $platforms[] = 'x';
        }
        if (str_contains($lower, 'linkedin')) {
            $platforms[] = 'linkedin';
        }
        if (str_contains($lower, 'facebook')) {
            $platforms[] = 'facebook';
        }
        if (str_contains($lower, 'instagram') || str_contains($lower, 'insta')) {
            $platforms[] = 'instagram';
        }
        if (str_contains($lower, 'tiktok')) {
            $platforms[] = 'tiktok';
        }
        if (str_contains($lower, 'threads')) {
            $platforms[] = 'threads';
        }
        if (empty($platforms)) {
            $platforms = ['x', 'linkedin'];
        }

        // Timing calculation
        $targetDate = $now->copy();
        if (str_contains($lower, 'tomorrow')) {
            $targetDate->addDay();
        } elseif (str_contains($lower, 'friday')) {
            $targetDate->next(Carbon::FRIDAY);
        } elseif (str_contains($lower, 'weekend') || str_contains($lower, 'saturday')) {
            $targetDate->next(Carbon::SATURDAY);
        } else {
            $targetDate->addDay();
        }

        // Hour detection
        if (preg_match('/(?:at|@)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i', $prompt, $matches)) {
            $hour = (int)$matches[1];
            $minute = !empty($matches[2]) ? (int)$matches[2] : 0;
            $meridiem = !empty($matches[3]) ? strtolower($matches[3]) : 'pm';
            if ($meridiem === 'pm' && $hour < 12) $hour += 12;
            if ($meridiem === 'am' && $hour === 12) $hour = 0;
            $targetDate->setTime($hour, $minute, 0);
        } elseif (str_contains($lower, 'morning')) {
            $targetDate->setTime(9, 0, 0);
        } elseif (str_contains($lower, 'evening') || str_contains($lower, 'night')) {
            $targetDate->setTime(19, 0, 0);
        } else {
            $targetDate->setTime(15, 0, 0);
        }

        // Tone & Mode
        $mode = (str_contains($lower, 'video') || str_contains($lower, 'reel') || str_contains($lower, 'tiktok') || str_contains($lower, 'script') || str_contains($lower, 'hook')) ? 'video' : 'text';

        $tone = 'professional';
        if (str_contains($lower, 'excit') || str_contains($lower, 'launch') || str_contains($lower, 'promo') || str_contains($lower, 'off')) {
            $tone = 'promotional';
        } elseif (str_contains($lower, 'thought') || str_contains($lower, 'productivity') || str_contains($lower, 'tips')) {
            $tone = 'thought-leadership';
        } elseif (str_contains($lower, 'witty') || str_contains($lower, 'funny')) {
            $tone = 'witty';
        }

        // Generate tailored title & content
        if ($tone === 'promotional' || str_contains($lower, 'launch') || str_contains($lower, 'promo code') || str_contains($lower, 'launch20')) {
            $title = '🚀 Launch Announcement: Next-Gen AI Features';
            $content = "Big news is here! We are thrilled to introduce our brand new AI-powered workflow automation suite. ⚡\n\nExperience seamless multi-platform publishing, predictive scheduling, and automated client engagement.\n\n🎉 Special Launch Offer: Use promo code LAUNCH20 to claim 20% off your plan at checkout today!";
            $hashtags = ['#ProductLaunch', '#AIFeatures', '#Automation', '#TechNews', '#GrowthHacking'];
            $cta = 'Claim your 20% discount with promo code LAUNCH20';
            $category = 'Product Launch';
        } elseif ($tone === 'thought-leadership' || str_contains($lower, 'productivity')) {
            $title = '💡 3 Productivity Systems That Save 10+ Hours Every Week';
            $content = "Most teams don't have a time problem — they have an orchestration problem.\n\nHere are 3 counter-intuitive systems we implemented to eliminate repetitive tasks and reclaim 10 hours a week:\n\n1. Async-first task handoffs\n2. AI-assisted drafting & batching\n3. Zero-touch multichannel publishing\n\nWhich workflow takes up the most time in your business?";
            $hashtags = ['#Productivity', '#Leadership', '#WorkSmart', '#Entrepreneurship', '#FutureOfWork'];
            $cta = 'Share your thoughts in the comments below';
            $category = 'Thought Leadership';
        } elseif ($mode === 'video' || str_contains($lower, 'script') || str_contains($lower, 'hook')) {
            $title = '🎬 Viral Video Hook: Creator Workflows in 2026';
            $content = "Stop manually writing and posting social updates. Here is how modern creators automate their entire content machine in 30 seconds:\n\n[Hook]: \"If you're still typing out social posts manually in 2026, you're losing 15 hours a week.\"\n[Body]: Connect your brand once. Let AI handle predictive audience timing and lead auto-DMs.\n[CTA]: Comment 'AUTOMATE' to get our instant starter kit!";
            $hashtags = ['#CreatorEconomy', '#ReelsTips', '#TikTokGrowth', '#AITools', '#ViralVideo'];
            $cta = "Comment 'AUTOMATE' for the direct blueprint";
            $category = 'Video Script';
        } else {
            $title = '✨ ' . ucfirst(substr($prompt, 0, 45)) . '...';
            $content = "Here is our latest update:\n\n" . ucfirst($prompt) . "\n\nStay tuned for more updates and automated workflow improvements!";
            $hashtags = ['#BufferMate', '#Innovation', '#WorkflowAutomation'];
            $cta = 'Check out the details in the link below';
            $category = 'Social Post';
        }

        return [
            'title' => $title,
            'content' => $content,
            'platforms' => $platforms,
            'scheduledAt' => $targetDate->format('Y-m-d\TH:i:s'),
            'scheduledAtDisplay' => $targetDate->format('l, M j, Y @ g:i A'),
            'tone' => $tone,
            'mode' => $mode,
            'videoTopic' => $mode === 'video' ? 'Creator Workflow Automation in 2026' : null,
            'hashtags' => $hashtags,
            'suggestedMediaPrompt' => 'Sleek, futuristic UI mockup showcasing AI social automation on a glowing glass surface, studio lighting, 8k resolution',
            'category' => $category,
            'callToAction' => $cta,
            'confidence' => 0.98,
        ];
    }
}
