<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_conversations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->string('channel')->default('instagram'); // instagram, linkedin, whatsapp, tiktok
            $table->string('sender_name');
            $table->string('sender_handle');
            $table->string('sender_avatar')->nullable();
            $table->string('status')->default('open'); // open, in_progress, waiting_customer, resolved, closed
            $table->string('priority')->default('normal'); // urgent, high, normal, low
            $table->string('assignee_id')->nullable();
            $table->string('assignee_name')->nullable();
            $table->foreignUuid('work_item_id')->nullable()->constrained('work_items')->nullOnDelete();
            $table->string('work_item_key')->nullable();
            $table->boolean('unread')->default(true);
            $table->integer('response_time_minutes')->default(8);
            $table->decimal('pipeline_value', 12, 2)->default(0.00);
            $table->text('last_message_preview')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['workspace_id', 'status']);
            $table->index(['workspace_id', 'channel']);
            $table->index(['workspace_id', 'unread']);
        });

        Schema::create('social_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('conversation_id')->constrained('social_conversations')->onDelete('cascade');
            $table->string('sender_type')->default('customer'); // customer, agent, system
            $table->string('sender_name');
            $table->boolean('is_internal_note')->default(false); // Jira parity: internal team note
            $table->text('content');
            $table->timestamps();

            $table->index(['conversation_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_messages');
        Schema::dropIfExists('social_conversations');
    }
};
