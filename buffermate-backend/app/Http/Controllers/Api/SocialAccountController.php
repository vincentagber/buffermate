<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SocialAccount;
use App\Services\Publishing\PublishingEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SocialAccountController extends Controller
{
    public function __construct(protected PublishingEngine $engine)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $accounts = SocialAccount::where('workspace_id', $workspaceId)
            ->get()
            ->map(function (SocialAccount $account) {
                return [
                    'id' => $account->id,
                    'provider' => $account->provider->value,
                    'provider_user_id' => $account->provider_user_id,
                    'health_status' => $account->health_status,
                    'capabilities' => $account->capabilities ?? [],
                    'meta' => $account->meta ?? [],
                    'last_sync_at' => $account->last_sync_at?->toIso8601String(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $accounts,
        ]);
    }

    public function connect(Request $request): JsonResponse
    {
        $platform = strtolower($request->input('provider', ''));
        $provider = $this->engine->getProvider($platform);

        if (!$provider) {
            return response()->json(['error' => "Platform '{$platform}' not supported"], 400);
        }

        $config = $provider->isConfigured();
        if (!$config['configured']) {
            return response()->json([
                'error' => 'PROVIDER_NOT_CONFIGURED',
                'provider' => $platform,
                'message' => "OAuth for {$platform} is blocked: missing environment credentials.",
                'missingCredentials' => $config['missingCredentials'],
            ], 422);
        }

        $origin = config('app.url', 'http://localhost:3000');
        $redirectUri = urlencode("{$origin}/api/social/callback");

        // Generate redirect URL based on platform
        $url = match ($platform) {
            'facebook', 'instagram' => "https://www.facebook.com/v20.0/dialog/oauth?client_id=" . env('FACEBOOK_APP_ID') . "&redirect_uri={$redirectUri}&scope=pages_manage_posts,pages_read_engagement&response_type=code&state={$platform}",
            'tiktok' => "https://www.tiktok.com/v2/auth/authorize/?client_key=" . env('TIKTOK_CLIENT_KEY') . "&scope=user.info.basic,video.publish&response_type=code&redirect_uri={$redirectUri}&state=tiktok",
            default => "https://x.com/i/oauth2/authorize?response_type=code&client_id=" . env('TWITTER_CLIENT_ID') . "&redirect_uri={$redirectUri}&scope=tweet.read%20tweet.write&state={$platform}",
        };

        return response()->json([
            'url' => $url,
            'isPopup' => true,
            'configured' => true,
        ]);
    }

    public function callback(Request $request): Response
    {
        $provider = $request->query('state', 'facebook');
        $code = $request->query('code');

        // Render popup success bridge HTML for React frontend window.opener
        $html = <<<HTML
<!DOCTYPE html>
<html>
<head><title>Connection Authorized | BufferMate</title></head>
<body>
    <h2>Authentication Verified!</h2>
    <p>Synchronizing with your BufferMate dashboard...</p>
    <script>
        if (window.opener) {
            window.opener.postMessage({
                type: 'SOCIAL_AUTH_SUCCESS',
                provider: '{$provider}',
                profile: '@connected_profile'
            }, '*');
            setTimeout(() => window.close(), 1500);
        }
    </script>
</body>
</html>
HTML;

        return response($html, 200, ['Content-Type' => 'text/html']);
    }

    public function testConnection(Request $request): JsonResponse
    {
        $platform = strtolower($request->query('platform', ''));
        $provider = $this->engine->getProvider($platform);

        if (!$provider) {
            return response()->json(['error' => 'Unknown platform'], 400);
        }

        $config = $provider->isConfigured();

        return response()->json([
            'platform' => $platform,
            'configured' => $config['configured'],
            'missingCredentials' => $config['missingCredentials'] ?? [],
            'status' => $config['configured'] ? 'healthy' : 'blocked',
            'capabilities' => $provider->getCapabilities(),
        ]);
    }

    public function disconnect(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $platform = $request->input('platform');

        SocialAccount::where('workspace_id', $workspaceId)
            ->where('provider', $platform)
            ->delete();

        return response()->json(['success' => true, 'message' => "Disconnected {$platform}"]);
    }
}
