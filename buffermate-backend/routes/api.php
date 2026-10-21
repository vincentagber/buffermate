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

    // Dashboard Analytics (Real SQL)
    Route::get('/dashboard/stats', [DashboardStatsController::class, 'index']);

    // Posts & Content Lifecycle
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/posts/{id}', [PostController::class, 'show']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    Route::post('/posts/{id}/submit-for-approval', [PostController::class, 'submitForApproval']);
    Route::post('/posts/{id}/approve', [PostController::class, 'approve']);

    // Social Accounts & OAuth
    Route::get('/social/accounts', [SocialAccountController::class, 'index']);
    Route::post('/social/connect', [SocialAccountController::class, 'connect']);
    Route::get('/social/test-connection', [SocialAccountController::class, 'testConnection']);
    Route::post('/social/disconnect', [SocialAccountController::class, 'disconnect']);

    // Automations & CRM Funnels
    Route::get('/automations', [AutomationController::class, 'index']);
    Route::post('/automations', [AutomationController::class, 'store']);
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

    // AI Content Studio
    Route::post('/ai/social-post', [AiStudioController::class, 'generatePost']);
    Route::post('/ai/suggest', [AiStudioController::class, 'generateSuggestions']);

    // Realtime Server-Sent Events (SSE) & Integrations
    Route::get('/integrations', [IntegrationsStreamController::class, 'index']);
    Route::get('/integrations/stream', [IntegrationsStreamController::class, 'stream']);
});
