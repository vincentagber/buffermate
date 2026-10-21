<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifySupabaseToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() ?: $request->cookie('sb-access-token');

        if (!$token) {
            // Check for mock user header during automated testing or development
            $devUser = $request->header('X-User-Id');
            if ($devUser) {
                $request->attributes->set('supabase_user_id', $devUser);
                return $next($request);
            }

            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Missing Supabase authorization bearer token',
            ], 401);
        }

        // Parse JWT payload without external library dependencies
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Invalid JWT format',
            ], 401);
        }

        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);

        if (!$payload || !isset($payload['sub'])) {
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

        $request->attributes->set('supabase_user_id', $payload['sub']);
        $request->attributes->set('supabase_user_email', $payload['email'] ?? null);

        return $next($request);
    }
}
