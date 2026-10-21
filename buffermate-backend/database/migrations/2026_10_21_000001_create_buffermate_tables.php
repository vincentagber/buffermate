<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Workspaces
        Schema::create('workspaces', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('timezone')->default('Africa/Lagos');
            $table->string('default_locale')->default('en');
            $table->string('plan_id')->default('pro');
            $table->string('owner_user_id')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        // 2. Workspace Members & RBAC
        Schema::create('workspace_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->string('user_id');
            $table->string('role')->default('creator');
            $table->string('status')->default('active');
            $table->string('invited_by')->nullable();
            $table->timestamp('joined_at')->nullable();
            $table->timestamps();

            $table->unique(['workspace_id', 'user_id']);
        });

        // 3. Social Accounts
        Schema::create('social_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->nullable()->constrained('workspaces')->onDelete('cascade');
            $table->string('user_id');
            $table->string('provider');
            $table->string('provider_user_id');
            $table->text('access_token_encrypted');
            $table->text('refresh_token_encrypted')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->string('health_status')->default('connected');
            $table->json('capabilities')->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('last_sync_at')->nullable();
            $table->timestamps();
        });

        // 4. Posts
        Schema::create('posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->nullable()->constrained('workspaces')->onDelete('cascade');
            $table->string('user_id');
            $table->text('content');
            $table->json('attachments')->nullable();
            $table->string('status')->default('scheduled');
            $table->string('approval_state')->default('approved'); // draft, in_review, approved, changes_requested
            $table->string('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('posted_at')->nullable();
            $table->json('provider_results')->nullable();
            $table->timestamps();
        });

        // 5. Durable Publish Jobs
        Schema::create('publish_jobs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->foreignUuid('post_id')->constrained('posts')->onDelete('cascade');
            $table->foreignUuid('social_account_id')->nullable()->constrained('social_accounts')->onDelete('cascade');
            $table->string('platform');
            $table->timestamp('scheduled_at');
            $table->string('status')->default('scheduled');
            $table->string('idempotency_key')->unique();
            $table->integer('attempts')->default(0);
            $table->integer('max_retries')->default(5);
            $table->timestamp('next_attempt_at')->nullable();
            $table->timestamp('lock_acquired_at')->nullable();
            $table->string('external_post_id')->nullable();
            $table->string('error_code')->nullable();
            $table->text('error_message')->nullable();
            $table->json('result_payload')->nullable();
            $table->timestamps();
        });

        // 6. Social Automations
        Schema::create('social_automations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->nullable()->constrained('workspaces')->onDelete('cascade');
            $table->string('user_id')->nullable();
            $table->string('name');
            $table->string('channel');
            $table->string('trigger_type')->default('comment_keyword');
            $table->json('keywords')->nullable();
            $table->text('reply_comment')->nullable();
            $table->text('dm_message')->nullable();
            $table->string('link_url')->nullable();
            $table->string('status')->default('active');
            $table->integer('runs_today')->default(0);
            $table->integer('runs_total')->default(0);
            $table->integer('leads_captured')->default(0);
            $table->timestamps();
        });

        // 7. Social Leads CRM
        Schema::create('social_leads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->nullable()->constrained('workspaces')->onDelete('cascade');
            $table->string('user_id')->nullable();
            $table->string('handle');
            $table->string('name')->nullable();
            $table->string('channel');
            $table->string('keyword_triggered')->nullable();
            $table->foreignUuid('automation_id')->nullable()->constrained('social_automations')->onDelete('set null');
            $table->string('status')->default('new');
            $table->timestamp('last_interaction')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 8. Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->string('actor_id')->nullable();
            $table->string('action');
            $table->string('resource_type');
            $table->string('resource_id')->nullable();
            $table->json('metadata_redacted')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('social_leads');
        Schema::dropIfExists('social_automations');
        Schema::dropIfExists('publish_jobs');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('social_accounts');
        Schema::dropIfExists('workspace_members');
        Schema::dropIfExists('workspaces');
    }
};
