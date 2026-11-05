<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Jira Notifications
        Schema::create('jira_notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('workspace_id')->index();
            $table->uuid('project_id')->index();
            $table->uuid('work_item_id')->nullable()->index();
            $table->uuid('sprint_id')->nullable()->index();
            $table->string('user_id')->index();
            $table->string('actor_user_id')->index();
            $table->string('event_type')->index();
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable();
            $table->boolean('is_read')->default(false)->index();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_read', 'created_at']);
        });

        // 2. Work Item Watchers
        Schema::create('work_item_watchers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('work_item_id')->constrained('work_items')->onDelete('cascade');
            $table->string('user_id');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['work_item_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_item_watchers');
        Schema::dropIfExists('jira_notifications');
    }
};

