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
    Route::post('/posts/bulk-delete', [PostController::class, 'bulkDestroy']);
    Route::post('/posts/bulk-publish', [PostController::class, 'bulkPublish']);
    Route::get('/posts/{id}', [PostController::class, 'show']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
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

    // Jira Project & Task Management API
    Route::get('/jira/projects', [\App\Http\Controllers\Api\Jira\JiraProjectController::class, 'index']);
    Route::post('/jira/projects', [\App\Http\Controllers\Api\Jira\JiraProjectController::class, 'store']);
    Route::get('/jira/projects/{idOrKey}', [\App\Http\Controllers\Api\Jira\JiraProjectController::class, 'show']);
    Route::put('/jira/projects/{id}', [\App\Http\Controllers\Api\Jira\JiraProjectController::class, 'update']);
    Route::put('/jira/projects/{id}/workflow', [\App\Http\Controllers\Api\Jira\JiraProjectController::class, 'updateWorkflow']);
    Route::put('/jira/projects/{id}/members', [\App\Http\Controllers\Api\Jira\JiraProjectController::class, 'updateMembers']);
    Route::delete('/jira/projects/{id}', [\App\Http\Controllers\Api\Jira\JiraProjectController::class, 'destroy']);

    Route::get('/jira/projects/{projectId}/issues', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'index']);
    Route::post('/jira/projects/{projectId}/issues', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'store']);
    Route::get('/jira/issues/{idOrKey}', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'show']);
    Route::patch('/jira/issues/{id}', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'update']);
    Route::delete('/jira/issues/{id}', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'destroy']);
    Route::post('/jira/issues/{id}/comments', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'storeComment']);
    Route::put('/jira/issues/{id}/comments/{commentId}', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'updateComment']);
    Route::delete('/jira/issues/{id}/comments/{commentId}', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'deleteComment']);
    Route::post('/jira/issues/{id}/attachments', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'addAttachment']);
    Route::delete('/jira/issues/{id}/attachments/{attachmentId}', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'deleteAttachment']);
    Route::post('/jira/issues/{id}/links', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'linkIssue']);
    Route::get('/jira/issues/{id}/watchers', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'getWatchers']);
    Route::post('/jira/issues/{id}/watchers/toggle', [\App\Http\Controllers\Api\Jira\JiraIssueController::class, 'toggleWatcher']);

    // Jira Automation Engine API
    Route::get('/jira/projects/{projectId}/automations', [\App\Http\Controllers\Api\Jira\JiraAutomationController::class, 'index']);
    Route::post('/jira/projects/{projectId}/automations', [\App\Http\Controllers\Api\Jira\JiraAutomationController::class, 'store']);
    Route::patch('/jira/projects/{projectId}/automations/{ruleId}/toggle', [\App\Http\Controllers\Api\Jira\JiraAutomationController::class, 'toggle']);
    Route::post('/jira/projects/{projectId}/automations/{ruleId}/test', [\App\Http\Controllers\Api\Jira\JiraAutomationController::class, 'testRun']);
    Route::delete('/jira/projects/{projectId}/automations/{ruleId}', [\App\Http\Controllers\Api\Jira\JiraAutomationController::class, 'destroy']);

    // Jira Notifications API
    Route::get('/jira/notifications', [\App\Http\Controllers\Api\Jira\JiraNotificationController::class, 'index']);
    Route::patch('/jira/notifications/{id}/read', [\App\Http\Controllers\Api\Jira\JiraNotificationController::class, 'markAsRead']);
    Route::post('/jira/notifications/mark-all-read', [\App\Http\Controllers\Api\Jira\JiraNotificationController::class, 'markAllAsRead']);
    Route::delete('/jira/notifications/{id}', [\App\Http\Controllers\Api\Jira\JiraNotificationController::class, 'destroy']);

    Route::get('/jira/projects/{projectId}/sprints', [\App\Http\Controllers\Api\Jira\JiraSprintController::class, 'index']);
    Route::post('/jira/projects/{projectId}/sprints', [\App\Http\Controllers\Api\Jira\JiraSprintController::class, 'store']);
    Route::post('/jira/sprints/{id}/start', [\App\Http\Controllers\Api\Jira\JiraSprintController::class, 'start']);
    Route::post('/jira/sprints/{id}/complete', [\App\Http\Controllers\Api\Jira\JiraSprintController::class, 'complete']);
    Route::post('/jira/sprints/reorder-issues', [\App\Http\Controllers\Api\Jira\JiraSprintController::class, 'reorderIssues']);

    Route::get('/jira/projects/{projectId}/board', [\App\Http\Controllers\Api\Jira\JiraBoardController::class, 'show']);
    Route::patch('/jira/board-columns/{columnId}', [\App\Http\Controllers\Api\Jira\JiraBoardController::class, 'updateColumn']);

    Route::get('/jira/projects/{projectId}/reports/summary', [\App\Http\Controllers\Api\Jira\JiraReportController::class, 'summary']);
    Route::get('/jira/projects/{projectId}/reports/burndown', [\App\Http\Controllers\Api\Jira\JiraReportController::class, 'burndown']);
    Route::get('/jira/projects/{projectId}/reports/velocity', [\App\Http\Controllers\Api\Jira\JiraReportController::class, 'velocity']);
    Route::get('/jira/projects/{projectId}/reports/cfd', [\App\Http\Controllers\Api\Jira\JiraReportController::class, 'cumulativeFlow']);
    Route::get('/jira/projects/{projectId}/reports/epics', [\App\Http\Controllers\Api\Jira\JiraReportController::class, 'epicReport']);

    // Social Inbox & Jira Service Management Queues
    Route::get('/inbox/conversations', [\App\Http\Controllers\Api\SocialInboxController::class, 'index']);
    Route::post('/inbox/conversations', [\App\Http\Controllers\Api\SocialInboxController::class, 'store']);
    Route::get('/inbox/conversations/{id}', [\App\Http\Controllers\Api\SocialInboxController::class, 'show']);
    Route::patch('/inbox/conversations/{id}', [\App\Http\Controllers\Api\SocialInboxController::class, 'update']);
    Route::post('/inbox/conversations/{id}/reply', [\App\Http\Controllers\Api\SocialInboxController::class, 'reply']);
    Route::post('/inbox/conversations/{id}/convert-to-jira', [\App\Http\Controllers\Api\SocialInboxController::class, 'convertToJira']);
    Route::get('/inbox/stats', [\App\Http\Controllers\Api\SocialInboxController::class, 'stats']);

    // Real-Time Clinic Intelligence & Executive Reports
    Route::get('/reports/clinic-kpi', [\App\Http\Controllers\Api\ClinicReportController::class, 'index']);
    Route::post('/reports/apply-utilization-lift', [\App\Http\Controllers\Api\ClinicReportController::class, 'applyUtilizationLift']);

    // Real-Time Analytics & Audience Intelligence
    Route::get('/analytics/audience', [\App\Http\Controllers\Api\AudienceAnalyticsController::class, 'index']);
    Route::post('/analytics/workspace-plan', [\App\Http\Controllers\Api\AudienceAnalyticsController::class, 'updatePlan']);
});

