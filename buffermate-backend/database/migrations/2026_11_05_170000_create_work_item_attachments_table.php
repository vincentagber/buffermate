<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_item_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('work_item_id')->constrained('work_items')->onDelete('cascade');
            $table->string('user_id')->default('dev_user');
            $table->string('user_name')->default('Alex Morgan');
            $table->string('filename');
            $table->string('file_path');
            $table->string('file_type')->default('image/png');
            $table->bigInteger('file_size')->default(0); // in bytes
            $table->string('thumbnail_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_item_attachments');
    }
};
