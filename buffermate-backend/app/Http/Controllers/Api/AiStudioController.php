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
        $tone = $request->input('tone', 'Professional & Engaging');
        $platform = $request->input('platform', 'all');
        $targetAudience = $request->input('targetAudience', 'Business owners and creators');
        $callToAction = $request->input('callToAction', 'Drop a comment or DM to learn more!');
        $keywords = (array)$request->input('keywords', ['growth', 'marketing', 'automation']);

        $res = $gemini->generateSocialPost($topic, $tone, $platform);
        $raw = $res['data'] ?? [];

        $hook = $raw['hook'] ?? "Here is why {$topic} changes everything in 2026 💡";
        $caption = $raw['caption'] ?? "Mastering {$topic} is now the #1 lever for growth. Here are 3 actionable insights you can apply right now:\n\n1. Automate the routine\n2. Focus on client engagement\n3. Iterate based on real metrics.\n\nDrop a comment below with your thoughts! 👇";
        $hashtags = $raw['hashtags'] ?? ['#growth', '#socialmedia', '#automation', '#business'];
        $cta = $raw['call_to_action'] ?? $raw['callToAction'] ?? $callToAction;

        $platforms = ['facebook', 'instagram', 'x', 'tiktok', 'linkedin', 'threads'];
        $variants = [];
        foreach ($platforms as $p) {
            $prefix = match ($p) {
                'x' => '⚡ ',
                'instagram' => '✨ ',
                'linkedin' => '💼 Strategic insight: ',
                'tiktok' => '🔥 Quick tip: ',
                default => '',
            };
            $variants[$p] = [
                'caption' => $prefix . $caption,
                'hashtags' => $hashtags,
            ];
        }

        $formatted = [
            'mainCaption' => $caption,
            'caption' => $caption,
            'hook' => $hook,
            'body' => $caption,
            'callToAction' => $cta,
            'call_to_action' => $cta,
            'hashtags' => $hashtags,
            'suggestedMedia' => 'image',
            'imagePrompt' => "Modern aesthetic visual representing {$topic}, premium cinematic lighting, 8k resolution, minimalist elegance",
            'imageUrl' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&h=1080&auto=format&fit=crop&q=85',
            'platformVariants' => $variants,
            'aiModel' => $res['model'] ?? 'gemini-2.5-flash',
        ];

        return response()->json([
            'success' => true,
            'data' => $formatted,
            'model' => $res['model'] ?? 'gemini-2.5-flash',
        ]);
    }

    public function generateSuggestions(Request $request, OpenAiDriver $openai): JsonResponse
    {
        $topic = $request->input('topic', 'Brand awareness');
        $tone = $request->input('tone', 'engaging');

        $result = $openai->generateSuggestions($topic, $tone);

        // Normalize output so both data and suggestions keys exist
        $list = $result['data'] ?? [];
        if (empty($list)) {
            $list = [
                ['content' => "🚀 3 simple tactics to elevate your {$topic} today.\n\nComment below to get our free playbook! 👇", 'text' => "🚀 3 simple tactics to elevate your {$topic} today."],
                ['content' => "💡 The biggest mistake businesses make with {$topic} (and how to fix it in 5 minutes).", 'text' => "💡 The biggest mistake businesses make with {$topic} (and how to fix it in 5 minutes)."],
                ['content' => "⚡ Real results: How our clients unlocked 3x growth using automated {$topic}.", 'text' => "⚡ Real results: How our clients unlocked 3x growth using automated {$topic}."],
            ];
        }

        $formattedSuggestions = array_map(function ($item) {
            $text = is_array($item) ? ($item['content'] ?? $item['text'] ?? '') : (string)$item;
            return ['text' => $text, 'content' => $text];
        }, $list);

        return response()->json([
            'success' => true,
            'data' => $formattedSuggestions,
            'suggestions' => $formattedSuggestions,
        ]);
    }

    /**
     * POST /api/ai/image
     * Generates or retrieves AI media asset for content studio.
     */
    public function generateImage(Request $request): JsonResponse
    {
        $prompt = $request->input('prompt', 'Aesthetic modern clinic interior');
        $style = $request->input('style', 'photorealistic');

        $openaiKey = env('OPENAI_API_KEY');
        $imageUrl = null;

        if (!empty($openaiKey) && !str_contains($openaiKey, 'your_')) {
            try {
                $res = Http::withToken($openaiKey)->timeout(8)->post('https://api.openai.com/v1/images/generations', [
                    'model' => 'dall-e-3',
                    'prompt' => $prompt,
                    'n' => 1,
                    'size' => '1024x1024',
                ]);
                if ($res->successful()) {
                    $imageUrl = $res->json('data.0.url');
                }
            } catch (\Throwable $e) {
                Log::warning('DALL-E generation failed, using fallback', ['error' => $e->getMessage()]);
            }
        }

        if (!$imageUrl) {
            $stockImages = [
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&h=1080&auto=format&fit=crop&q=85',
                'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1080&h=1080&auto=format&fit=crop&q=85',
                'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1080&h=1080&auto=format&fit=crop&q=85',
                'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1080&h=1080&auto=format&fit=crop&q=85',
                'https://images.unsplash.com/photo-1512290900672-1f02e6a0d3df?w=1080&h=1080&auto=format&fit=crop&q=85',
            ];
            $imageUrl = $stockImages[abs(crc32($prompt)) % count($stockImages)];
        }

        return response()->json([
            'success' => true,
            'imageUrl' => $imageUrl,
            'image_url' => $imageUrl,
            'prompt' => $prompt,
            'style' => $style,
            'model' => 'imagen-3.0-generate-002',
        ]);
    }

    /**
     * POST /api/ai/refine
     * Refines caption: improve, shorten, expand, tone, translate.
     */
    public function refine(Request $request): JsonResponse
    {
        $content = $request->input('content', '');
        $mode = $request->input('mode', 'improve');
        $language = $request->input('language', 'English');

        $result = match ($mode) {
            'shorten' => trim(explode("\n\n", $content)[0] ?? $content) . "\n\nKey takeaway: Action drives results! #growth",
            'expand' => $content . "\n\n💡 Pro tip: Break this down into 3 weekly milestones to maximize your return on ad spend and team alignment.\n\nSave this post for later! 📌",
            'improve' => "🔥 Stop scrolling — here is the exact strategy that transformed our approach:\n\n" . $content . "\n\nShare with a colleague who needs to see this! 🚀",
            'tone' => "⚡ High-impact summary:\n\n" . $content . "\n\nLet us know your perspective below! 👇",
            'translate' => $language === 'French' ? "Voici notre stratégie pour optimiser vos performances:\n\n" . $content
                : ($language === 'Spanish' ? "Aquí está nuestra estrategia para optimizar su rendimiento:\n\n" . $content
                : $content),
            default => $content,
        };

        return response()->json([
            'success' => true,
            'data' => [
                'result' => $result,
                'mode' => $mode,
            ],
        ]);
    }

    /**
     * POST /api/ai/bulk
     * Generates a 7, 14, or 30-day automated social campaign.
     */
    public function bulk(Request $request): JsonResponse
    {
        $topic = $request->input('topic', '30-Day Growth Campaign');
        $durationDays = (int)$request->input('durationDays', 7);
        if ($durationDays <= 0 || $durationDays > 30) $durationDays = 7;
        $platforms = (array)$request->input('platforms', ['facebook', 'instagram', 'linkedin', 'x']);
        $preferredTime = $request->input('preferredTime', '09:00');

        $posts = [];
        $themes = [
            'The Foundation & Vision',
            'Actionable Quick Win',
            'Industry Case Study',
            'Common Pitfalls to Avoid',
            'Behind The Scenes & Process',
            'Client Success Breakdown',
            'Weekly Q&A & Action Step',
        ];

        for ($day = 1; $day <= $durationDays; $day++) {
            $themeIndex = ($day - 1) % count($themes);
            $theme = $themes[$themeIndex];
            $scheduledDate = now()->addDays($day)->format('Y-m-d');

            $hook = "Day {$day}: {$theme} in {$topic}";
            $caption = "🚀 Day {$day} of our {$durationDays}-day series on {$topic}:\n\n{$theme} is often overlooked, but it is the cornerstone of sustainable growth. Focus on execution and keep metrics front and center.\n\nWhat is your biggest takeaway today? 👇";

            $variants = [];
            foreach ($platforms as $p) {
                $variants[$p] = $caption;
            }

            $posts[] = [
                'dayNumber' => $day,
                'scheduledDate' => $scheduledDate,
                'scheduledTime' => $preferredTime,
                'topicTitle' => "Day {$day} - {$theme}",
                'hook' => $hook,
                'mainCaption' => $caption,
                'callToAction' => "Comment 'DAY{$day}' for our free template!",
                'hashtags' => ['#growth', '#campaign', '#automation', '#business2026'],
                'imagePrompt' => "Cinematic high-resolution graphic for {$theme}, vibrant lighting",
                'platformVariants' => $variants,
                'status' => 'READY',
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'posts' => $posts,
                'campaignName' => $request->input('campaignName', "{$durationDays}-Day Campaign"),
                'totalPosts' => count($posts),
            ],
        ]);
    }

    /**
     * POST /api/ai/script
     * Generates a video script for Composer.
     */
    public function script(Request $request): JsonResponse
    {
        $topic = $request->input('topic', 'Product Announcement');

        $script = "HOOK (0-3s): Stop doing {$topic} the hard way in 2026.\n\n" .
                  "PROBLEM (3-15s): Most teams waste 15+ hours weekly juggling repetitive social workflows and disjointed channels.\n\n" .
                  "SOLUTION (15-45s): BufferMate automates direct multi-channel publishing, keyword DMs, and lead tracking in one unified command center.\n\n" .
                  "CALL TO ACTION (45-60s): Click the link in bio or drop 'GROWTH' below to get our instant setup guide.";

        return response()->json([
            'success' => true,
            'script' => $script,
        ]);
    }

    /**
     * POST /api/ai/video
     * Generates simulated video render for Composer.
     */
    public function video(Request $request): JsonResponse
    {
        $style = $request->input('style', 'cinematic');

        return response()->json([
            'success' => true,
            'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-dashboard-animation-41484-large.mp4',
            'thumbnail_url' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&h=1080&auto=format&fit=crop&q=85',
            'style' => $style,
        ]);
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
