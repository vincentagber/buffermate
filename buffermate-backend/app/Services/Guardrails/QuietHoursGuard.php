<?php

namespace App\Services\Guardrails;

use Carbon\Carbon;

class QuietHoursGuard
{
    /**
     * Checks if current time in the workspace timezone (default Africa/Lagos)
     * falls within restricted Quiet Hours (22:00 to 07:00).
     */
    public function isQuietHours(string $timezone = 'Africa/Lagos'): bool
    {
        $now = Carbon::now($timezone);
        $hour = $now->hour;

        // Quiet hours: 22:00 (10 PM) until 07:00 (7 AM)
        return ($hour >= 22 || $hour < 7);
    }

    public function check(string $timezone = 'Africa/Lagos'): array
    {
        if ($this->isQuietHours($timezone)) {
            return [
                'passed' => false,
                'code' => 'QUIET_HOURS_ACTIVE',
                'message' => "Action blocked by Quiet Hours policy (22:00 to 07:00) in timezone {$timezone}.",
            ];
        }

        return [
            'passed' => true,
        ];
    }
}
