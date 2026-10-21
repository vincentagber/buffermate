<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Ai\GeminiDriver;
use App\Services\Ai\OpenAiDriver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
}
