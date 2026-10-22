<?php

namespace App\Services\News;

class EditorialValidatorService
{
    private const SENSATIONAL_MARKERS = [
        'shocking', 'bombshell', "you won't believe", 'mind-blowing',
        'jaw-dropping', 'unbelievable', 'miracle cure', 'secret exposed',
        'devastating news', 'outrageous', 'catastrophic truth',
    ];

    private const SENSITIVE_KEYWORDS = [
        'crime' => ['murder', 'homicide', 'arrested', 'indicted', 'pleaded guilty', 'fraud', 'embezzlement', 'sexual assault', 'alleged crime'],
        'health' => ['cancer cure', 'vaccine danger', 'deadly outbreak', 'unproven treatment', 'fda warned', 'fatal illness'],
        'legal' => ['lawsuit', 'sued', 'defamation', 'settlement', 'criminal trial', 'court injunction'],
        'controversy' => ['treason', 'conspiracy', 'whistleblower', 'rigged election', 'bribe'],
    ];

    /**
     * Evaluates content and returns editorial risk score, flags, and whether human approval is required.
     *
     * @param string $headline Post caption or headline
     * @param string $content Full content body
     * @param array $sources Source URLs/publishers
     * @return array{risk_score: int, risk_level: string, flags: array<string>, requires_human_approval: bool}
     */
    public function evaluate(string $headline, string $content = '', array $sources = []): array
    {
        $riskScore = 0;
        $flags = [];

        $lowerHeadline = strtolower($headline);
        $fullText = strtolower($headline . ' ' . $content);

        // 1. Single source check
        $sourceCount = count($sources);
        if ($sourceCount <= 1) {
            $riskScore += 20;
            $flags[] = 'Single-source story: claims rely on a single reporting publisher.';
        }

        // 2. Sensationalism / Clickbait markers
        $hasSensational = false;
        foreach (self::SENSATIONAL_MARKERS as $marker) {
            if (str_contains($lowerHeadline, $marker)) {
                $hasSensational = true;
                $flags[] = "Headline contains sensational or clickbait phrase: '{$marker}'.";
                break;
            }
        }

        if (str_ends_with(trim($headline), '!') || substr_count($headline, '!') > 1) {
            $hasSensational = true;
            $flags[] = 'Excessive exclamation marks detected.';
        }

        if ($hasSensational) {
            $riskScore += 25;
        }

        // 3. High-sensitivity categories (crime, legal, unverified medical claims)
        foreach (self::SENSITIVE_KEYWORDS as $category => $terms) {
            foreach ($terms as $term) {
                if (str_contains($fullText, $term)) {
                    $riskScore += 20;
                    $flags[] = "Sensitive {$category} topic detected: '{$term}'.";
                    break;
                }
            }
        }

        // 4. Determine risk level
        $riskLevel = match (true) {
            $riskScore >= 50 => 'high',
            $riskScore >= 25 => 'medium',
            default => 'low',
        };

        // If risk is high (score >= 40), human approval is mandatory
        $requiresHumanApproval = ($riskScore >= 40);

        return [
            'risk_score' => $riskScore,
            'risk_level' => $riskLevel,
            'flags' => $flags,
            'requires_human_approval' => $requiresHumanApproval,
        ];
    }
}
