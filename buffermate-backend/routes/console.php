<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('news:run-autopilot {workspace_id?} {--force}', function ($workspaceId = null) {
    $force = (bool) $this->option('force');
    $query = \App\Models\Workspace::query();
    if ($workspaceId) {
        $query->where('id', $workspaceId);
    }

    $workspaces = $query->get();
    $this->info("Found {$workspaces->count()} workspace(s) for news autopilot.");

    foreach ($workspaces as $workspace) {
        $this->line("Processing workspace: {$workspace->name} ({$workspace->id})...");
        $job = new \App\Jobs\ProcessNewsAutopilotJob($workspace->id, $force);
        $result = app()->call([$job, 'handle']);
        $this->info("Completed for {$workspace->name}: " . json_encode($result));
    }
})->purpose('Run the NewsPilot discovery and auto-publishing cycle for workspaces');

\Illuminate\Support\Facades\Schedule::command('news:run-autopilot')
    ->hourly()
    ->withoutOverlapping();

