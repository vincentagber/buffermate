<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Projects
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->string('name');
            $table->string('key', 10);
            $table->text('description')->nullable();
            $table->string('template')->default('scrum'); // scrum, kanban, basic
            $table->string('category')->nullable();
            $table->string('lead_user_id')->nullable();
            $table->string('default_assignee_id')->nullable();
            $table->integer('issue_counter')->default(0);
            $table->string('status')->default('active'); // active, archived
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['workspace_id', 'key']);
            $table->index(['workspace_id', 'status']);
        });

        // 2. Project Members
        Schema::create('project_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('user_id');
            $table->string('role')->default('developer'); // project_admin, scrum_master, developer, viewer
            $table->timestamps();

            $table->unique(['project_id', 'user_id']);
        });

        // 3. Sprints
        Schema::create('sprints', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->string('name');
            $table->text('goal')->nullable();
            $table->string('status')->default('future'); // future, active, closed
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'status']);
        });

        // 4. Work Items (Jira Issues / Tasks)
        Schema::create('work_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->foreignUuid('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignUuid('sprint_id')->nullable()->constrained('sprints')->nullOnDelete();
            $table->foreignUuid('parent_id')->nullable()->constrained('work_items')->nullOnDelete();
            $table->string('key', 20)->index(); // e.g. "BM-10"
            $table->integer('issue_number')->index();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('type')->default('task'); // epic, story, task, bug, subtask, feature, improvement
            $table->string('status')->default('todo'); // backlog, todo, in_progress, in_review, blocked, done, cancelled
            $table->string('priority')->default('medium'); // highest, high, medium, low, lowest
            $table->integer('story_points')->nullable();
            $table->decimal('estimated_hours', 8, 2)->nullable();
            $table->decimal('logged_hours', 8, 2)->default(0);
            $table->string('assignee_user_id')->nullable()->index();
            $table->string('reporter_user_id')->nullable();
            $table->json('labels')->nullable();
            $table->json('components')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->string('resolution')->nullable();
            $table->integer('board_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['project_id', 'status']);
            $table->index(['project_id', 'sprint_id']);
        });

        // 5. Work Item Links (Dependencies & Relations)
        Schema::create('work_item_links', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->foreignUuid('source_work_item_id')->constrained('work_items')->onDelete('cascade');
            $table->foreignUuid('target_work_item_id')->constrained('work_items')->onDelete('cascade');
            $table->string('relationship')->default('relates_to'); // blocks, is_blocked_by, relates_to, duplicates
            $table->timestamps();
        });

        // 6. Work Item Comments
        Schema::create('work_item_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('work_item_id')->constrained('work_items')->onDelete('cascade');
            $table->string('user_id');
            $table->string('author_name')->nullable();
            $table->text('content');
            $table->timestamps();
        });

        // 7. Work Item History (Audit Trail)
        Schema::create('work_item_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('work_item_id')->constrained('work_items')->onDelete('cascade');
            $table->string('user_id');
            $table->string('field');
            $table->text('from_value')->nullable();
            $table->text('to_value')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        // 8. Boards
        Schema::create('boards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->foreignUuid('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('name');
            $table->string('type')->default('kanban'); // kanban, scrum
            $table->text('filter_query')->nullable();
            $table->timestamps();
        });

        // 9. Board Columns
        Schema::create('board_columns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('board_id')->constrained('boards')->onDelete('cascade');
            $table->string('name');
            $table->string('mapped_status');
            $table->integer('wip_limit')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 10. Jira Automation Rules
        Schema::create('jira_automation_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->foreignUuid('project_id')->nullable()->constrained('projects')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('trigger_event'); // issue_created, status_changed, subtasks_completed
            $table->json('conditions')->nullable();
            $table->json('actions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('execution_count')->default(0);
            $table->timestamp('last_executed_at')->nullable();
            $table->timestamps();
        });

        // 11. Jira Automation Executions
        Schema::create('jira_automation_executions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rule_id')->constrained('jira_automation_rules')->onDelete('cascade');
            $table->json('trigger_payload')->nullable();
            $table->string('status'); // success, skipped, failed
            $table->text('execution_log')->nullable();
            $table->timestamp('executed_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jira_automation_executions');
        Schema::dropIfExists('jira_automation_rules');
        Schema::dropIfExists('board_columns');
        Schema::dropIfExists('boards');
        Schema::dropIfExists('work_item_history');
        Schema::dropIfExists('work_item_comments');
        Schema::dropIfExists('work_item_links');
        Schema::dropIfExists('work_items');
        Schema::dropIfExists('sprints');
        Schema::dropIfExists('project_members');
        Schema::dropIfExists('projects');
    }
};

