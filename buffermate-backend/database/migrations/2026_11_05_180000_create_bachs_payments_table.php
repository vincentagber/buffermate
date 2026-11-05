<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bachs_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('workspace_id')->index();
            $table->string('user_id')->nullable()->index();
            $table->string('session_id')->unique()->index();
            $table->text('checkout_url');
            $table->string('customer_email');
            $table->string('customer_name')->nullable();
            $table->string('plan_id')->default('pro');
            $table->string('billing_cycle')->default('monthly'); // monthly, annual
            $table->decimal('amount', 10, 2)->default(29.00);
            $table->string('currency', 10)->default('USD');
            $table->string('status')->default('open'); // open, completed, cancelled, expired, failed
            $table->string('subscription_id')->nullable()->index();
            $table->string('product_id')->nullable();
            $table->json('metadata')->nullable();
            $table->json('raw_payload')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bachs_payments');
    }
};
