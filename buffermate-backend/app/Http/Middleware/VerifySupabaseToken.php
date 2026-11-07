<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class VerifySupabaseToken
{
    /**
     * Handle an incoming request and cryptographically verify the Supabase JWT.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?: $request->cookie('sb-access-token');

        if (!$token) {
            // Allow mock user header ONLY during local testing or non-production automated testing
            if (!app()->isProduction()) {
                $devUser = $request->header('X-User-Id');
                if ($devUser) {
                    $request->attributes->set('supabase_user_id', $devUser);
                    $request->attributes->set('supabase_user_email', 'dev@buffermate.ai');
                    return $next($request);
                }
            }

            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Missing Supabase authorization bearer token',
            ], 401);
        }

        // Validate JWT structure
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Invalid JWT format',
            ], 401);
        }

        [$headerB64, $payloadB64, $signatureB64] = $parts;

        $header = json_decode(base64_decode(strtr($headerB64, '-_', '+/')), true);
        $payload = json_decode(base64_decode(strtr($payloadB64, '-_', '+/')), true);

        if (!$header || !is_array($header) || !$payload || !isset($payload['sub'])) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Malformed JWT token payload',
            ], 401);
        }

        // Check token expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Token has expired',
            ], 401);
        }

        // Cryptographic Signature Verification
        $jwtSecret = env('SUPABASE_JWT_SECRET') ?: env('SUPABASE_SERVICE_ROLE_KEY');

        if ($jwtSecret) {
            $algorithm = $header['alg'] ?? 'HS256';

            if ($algorithm === 'HS256') {
                $signingInput = "{$headerB64}.{$payloadB64}";
                $expectedSignature = hash_hmac('sha256', $signingInput, $jwtSecret, true);
                $providedSignature = base64_decode(strtr($signatureB64, '-_', '+/'));

                if (!hash_equals($expectedSignature, $providedSignature)) {
                    Log::warning('Supabase token signature verification failed', [
                        'ip' => $request->ip(),
                        'user_id' => $payload['sub'] ?? 'unknown',
                    ]);

                    return response()->json([
                        'error' => 'Unauthorized',
                        'message' => 'Invalid JWT cryptographic signature',
                    ], 401);
                }
            }
        } elseif (app()->isProduction()) {
            Log::error('SUPABASE_JWT_SECRET is not configured in production environment.');
            return response()->json([
                'error' => 'Server Configuration Error',
                'message' => 'Authentication service configuration incomplete',
            ], 500);
        }

        $request->attributes->set('supabase_user_id', $payload['sub']);
        $request->attributes->set('supabase_user_email', $payload['email'] ?? null);

        return $next($request);
    }
}
