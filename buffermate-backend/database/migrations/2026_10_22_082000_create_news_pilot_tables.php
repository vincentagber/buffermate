<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. News Feeds
        Schema::create('news_feeds', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->string('name');
            $table->text('url');
            $table->string('category')->default('General');
            $table->text('keywords')->nullable();
            $table->integer('priority')->default(5);
            $table->boolean('enabled')->default(true);
            $table->timestamp('last_fetch_at')->nullable();
            $table->text('last_error')->nullable();
            $table->timestamps();

            $table->index(['workspace_id', 'enabled']);
        });

        // 2. Discovered News Topics & Stories
        Schema::create('news_topics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->onDelete('cascade');
            $table->string('topic_hash');
            $table->string('title');
            $table->text('summary')->nullable();
            $table->string('category')->default('News');
            $table->string('discovery_source')->default('rss');
            $table->json('source_urls')->nullable();
            $table->float('score')->default(50.0);
            $table->json('score_breakdown')->nullable();
            $table->integer('editorial_risk_score')->default(0);
            $table->json('editorial_flags')->nullable();
            $table->string('status')->default('discovered'); // discovered, drafted, scheduled, published, dismissed
            $table->foreignUuid('post_id')->nullable()->constrained('posts')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->unique(['workspace_id', 'topic_hash']);
            $table->index(['workspace_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_topics');
        Schema::dropIfExists('news_feeds');
    }
};
