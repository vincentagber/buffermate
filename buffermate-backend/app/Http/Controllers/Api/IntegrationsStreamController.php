<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class IntegrationsStreamController extends Controller
{
    /**
     * Streams integration status and activity events via Server-Sent Events (SSE).
     */
    public function stream(Request $request): StreamedResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');

        $response = new StreamedResponse(function () use ($workspaceId) {
            // Send initial connection event
            $initialAccounts = SocialAccount::where('workspace_id', $workspaceId)->get();
            echo "event: initial_state\n";
            echo "data: " . json_encode(['accounts' => $initialAccounts]) . "\n\n";
            ob_flush();
            flush();

            // Heartbeat loop
            for ($i = 0; $i < 3; $i++) {
                if (connection_aborted()) {
                    break;
                }

                echo "event: heartbeat\n";
                echo "data: " . json_encode(['time' => now()->toIso8601String()]) . "\n\n";
                ob_flush();
                flush();
                sleep(2);
            }
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('X-Accel-Buffering', 'no');

        return $response;
    }

    /**
     * Return current integrations status.
     */
    public function index(Request $request)
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $accounts = SocialAccount::where('workspace_id', $workspaceId)->get();
        return response()->json([
            'success' => true,
            'accounts' => $accounts,
            'channels' => $accounts->map(fn($a) => [
                'id' => $a->provider instanceof \BackedEnum ? $a->provider->value : (string)$a->provider,
                'name' => $a->meta['name'] ?? ucfirst($a->provider instanceof \BackedEnum ? $a->provider->value : (string)$a->provider),
                'connected' => $a->health_status === 'connected',
                'handle' => $a->provider_user_id,
                'followers' => $a->meta['followers'] ?? null,
                'meta' => $a->meta ?? [],
            ]),
        ]);
    }
}
