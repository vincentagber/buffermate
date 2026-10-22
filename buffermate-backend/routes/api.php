<?php

use App\Http\Controllers\Api\AiStudioController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AutomationController;
use App\Http\Controllers\Api\AutopilotController;
use App\Http\Controllers\Api\DashboardStatsController;
use App\Http\Controllers\Api\IntegrationsStreamController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SocialAccountController;
use Illuminate\Support\Facades\Route;

// Public or OAuth callback routes
Route::get('/social/callback', [SocialAccountController::class, 'callback']);

// Protected API routes with tenant isolation
Route::middleware(['tenant.scope'])->group(function () {
    // Auth & Session
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/admin/users', [\App\Http\Controllers\Api\UserController::class, 'index']);

    // Dashboard Analytics (Real SQL)
    Route::get('/dashboard/stats', [DashboardStatsController::class, 'index']);

    // Posts & Content Lifecycle
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::post('/social/publish', [PostController::class, 'publish']);
    Route::get('/posts/{id}', [PostController::class, 'show']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    Route::post('/posts/{id}/submit-for-approval', [PostController::class, 'submitForApproval']);
    Route::post('/posts/{id}/approve', [PostController::class, 'approve']);

    // Social Accounts & OAuth
    Route::get('/social/accounts', [SocialAccountController::class, 'index']);
    Route::post('/social/connect', [SocialAccountController::class, 'connect']);
    Route::post('/social/refresh', [SocialAccountController::class, 'refresh']);
    Route::get('/social/test-connection', [SocialAccountController::class, 'testConnection']);
    Route::post('/social/disconnect', [SocialAccountController::class, 'disconnect']);

    // Automations & CRM Funnels
    Route::get('/automations', [AutomationController::class, 'index']);
    Route::post('/automations', [AutomationController::class, 'store']);
    Route::post('/automations/trigger', [AutomationController::class, 'trigger']);
    Route::put('/automations/{id}', [AutomationController::class, 'update']);
    Route::delete('/automations/{id}', [AutomationController::class, 'destroy']);

    // CRM Leads & Clients
    Route::get('/leads', [\App\Http\Controllers\Api\LeadController::class, 'index']);
    Route::post('/leads', [\App\Http\Controllers\Api\LeadController::class, 'store']);
    Route::put('/leads/{id}', [\App\Http\Controllers\Api\LeadController::class, 'update']);

    // Social Activity Stream
    Route::get('/activity', [\App\Http\Controllers\Api\ActivityController::class, 'index']);

    // Autopilot Engine & Guardrails
    Route::get('/autopilot/config', [AutopilotController::class, 'getConfig']);
    Route::post('/autopilot/config', [AutopilotController::class, 'updateConfig']);
    Route::post('/autopilot/kill-switch', [AutopilotController::class, 'killSwitch']);
    Route::post('/autopilot/dry-run', [AutopilotController::class, 'dryRun']);

    // AI Content Studio, Image & Video Pipeline
    Route::post('/generate', [AiStudioController::class, 'generateSuggestions']);
    Route::post('/ai/social-post', [AiStudioController::class, 'generatePost']);
    Route::post('/ai/suggest', [AiStudioController::class, 'generateSuggestions']);
    Route::post('/ai/extract-form', [AiStudioController::class, 'extractForm']);
    Route::post('/ai/image', [AiStudioController::class, 'generateImage']);
    Route::post('/ai/refine', [AiStudioController::class, 'refine']);
    Route::post('/ai/bulk', [AiStudioController::class, 'bulk']);
    Route::post('/ai/script', [AiStudioController::class, 'script']);
    Route::post('/ai/video', [AiStudioController::class, 'video']);

    // Realtime Server-Sent Events (SSE) & Integrations
    Route::get('/integrations', [IntegrationsStreamController::class, 'index']);
    Route::post('/integrations', [IntegrationsStreamController::class, 'store']);
    Route::patch('/integrations', [IntegrationsStreamController::class, 'update']);
    Route::delete('/integrations', [IntegrationsStreamController::class, 'destroy']);
    Route::post('/integrations/webhook-test', [IntegrationsStreamController::class, 'webhookTest']);
    Route::get('/integrations/stream', [IntegrationsStreamController::class, 'stream']);

    // NewsPilot: News Discovery, AI Post Generation & Automated Publishing
    Route::get('/news/feeds', [\App\Http\Controllers\Api\NewsPilotController::class, 'getFeeds']);
    Route::post('/news/feeds', [\App\Http\Controllers\Api\NewsPilotController::class, 'storeFeed']);
    Route::delete('/news/feeds/{id}', [\App\Http\Controllers\Api\NewsPilotController::class, 'destroyFeed']);
    Route::get('/news/topics', [\App\Http\Controllers\Api\NewsPilotController::class, 'getTopics']);
    Route::post('/news/topics/{id}/draft', [\App\Http\Controllers\Api\NewsPilotController::class, 'draftFromTopic']);
    Route::post('/news/topics/{id}/dismiss', [\App\Http\Controllers\Api\NewsPilotController::class, 'dismissTopic']);
    Route::get('/news/settings', [\App\Http\Controllers\Api\NewsPilotController::class, 'getSettings']);
    Route::post('/news/settings', [\App\Http\Controllers\Api\NewsPilotController::class, 'updateSettings']);
    Route::post('/news/pipeline/run', [\App\Http\Controllers\Api\NewsPilotController::class, 'runPipeline']);
    Route::post('/social/accounts/{id}/automation-settings', [\App\Http\Controllers\Api\NewsPilotController::class, 'updateAccountAutomation']);
});

