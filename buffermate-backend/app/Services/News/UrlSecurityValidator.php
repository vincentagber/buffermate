<?php

namespace App\Services\News;

class UrlSecurityValidator
{
    /**
     * Checks if a URL is safe to fetch (prevents SSRF, private network requests, non-http protocols).
     */
    public static function isSafeUrl(string $url): bool
    {
        $url = trim($url);
        if (empty($url)) {
            return false;
        }

        $parsed = parse_url($url);
        if (!$parsed || empty($parsed['scheme']) || empty($parsed['host'])) {
            return false;
        }

        // Only allow HTTP and HTTPS
        $scheme = strtolower($parsed['scheme']);
        if (!in_array($scheme, ['http', 'https'], true)) {
            return false;
        }

        $host = strtolower($parsed['host']);

        // Check for localhost / loopback names
        if (in_array($host, ['localhost', '127.0.0.1', '::1', '0.0.0.0'], true) || str_ends_with($host, '.local') || str_ends_with($host, '.internal')) {
            return false;
        }

        // Resolve DNS and verify IP is not in private or reserved ranges
        $ips = @dns_get_record($host, DNS_A + DNS_AAAA);
        if (empty($ips)) {
            // Try gethostbynamel fallback
            $resolved = @gethostbynamel($host);
            if (empty($resolved)) {
                return false;
            }
            foreach ($resolved as $ip) {
                if (self::isPrivateIp($ip)) {
                    return false;
                }
            }
            return true;
        }

        foreach ($ips as $record) {
            $ip = $record['ip'] ?? $record['ipv6'] ?? null;
            if ($ip && self::isPrivateIp($ip)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Determines whether an IP address belongs to private or reserved subnets.
     */
    public static function isPrivateIp(string $ip): bool
    {
        return !filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        );
    }

    /**
     * Normalize URL for canonical deduplication.
     */
    public static function normalizeUrl(string $url): string
    {
        $url = trim($url);
        $url = explode('#', $url)[0];
        $parsed = parse_url($url);

        if (!$parsed || empty($parsed['host'])) {
            return strtolower($url);
        }

        $scheme = strtolower($parsed['scheme'] ?? 'https');
        $host = strtolower($parsed['host']);
        $path = $parsed['path'] ?? '/';
        $query = '';

        if (!empty($parsed['query'])) {
            // Strip tracking query params (utm_*, fbclid, gclid, etc.)
            parse_str($parsed['query'], $params);
            $filteredParams = [];
            foreach ($params as $key => $val) {
                if (!str_starts_with(strtolower($key), 'utm_') && !in_array(strtolower($key), ['fbclid', 'gclid', 'ref', 'source'], true)) {
                    $filteredParams[$key] = $val;
                }
            }
            if (!empty($filteredParams)) {
                ksort($filteredParams);
                $query = '?' . http_build_query($filteredParams);
            }
        }

        return "{$scheme}://{$host}{$path}{$query}";
    }
}
