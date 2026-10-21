<?php

namespace App\Services\Guardrails;

class KeywordFilterGuard
{
    protected array $restrictedKeywords = [
        'crypto giveaway',
        '100% risk free',
        'double your money',
        'fastfollow',
        'dm me for crypto',
        'guaranteed returns',
        'get rich quick',
    ];

    public function check(string $content, array $customKeywords = []): array
    {
        $allKeywords = array_merge($this->restrictedKeywords, $customKeywords);
        $lowerContent = mb_strtolower($content);

        foreach ($allKeywords as $keyword) {
            if (str_contains($lowerContent, mb_strtolower($keyword))) {
                return [
                    'passed' => false,
                    'code' => 'RESTRICTED_KEYWORD',
                    'keyword' => $keyword,
                    'message' => "Content contains prohibited keyword/phrase: '{$keyword}'.",
                ];
            }
        }

        return [
            'passed' => true,
        ];
    }
}
