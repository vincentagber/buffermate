<?php

namespace App\Jobs;

use App\Models\PublishJob;
use App\Services\Publishing\PublishingEngine;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PublishPostJob implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public int $tries = 5;
    public int $timeout = 60;

    public function __construct(public string $publishJobId)
    {
    }

    public function handle(PublishingEngine $engine): void
    {
        $job = PublishJob::with(['post', 'socialAccount'])->find($this->publishJobId);

        if (!$job || in_array($job->status, ['published', 'canceled'])) {
            return;
        }

        $engine->executeSingleJob($job);
    }
}
