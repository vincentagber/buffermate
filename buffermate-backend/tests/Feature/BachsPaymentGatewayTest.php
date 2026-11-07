<?php

namespace Tests\Feature;

use App\Models\BachsPayment;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BachsPaymentGatewayTest extends TestCase
{
    use RefreshDatabase;

    protected Workspace $workspace;

    protected function setUp(): void
    {
        parent::setUp();

        $this->workspace = Workspace::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'name' => 'Bachs Test Clinic',
            'slug' => 'bachs-test-' . \Illuminate\Support\Str::random(6),
            'owner_user_id' => 'dev_user',
            'plan_id' => 'free',
        ]);
    }

    public function test_can_fetch_bachs_plans_and_gateway_environment(): void
    {
        $response = $this->withHeaders([
            'X-Workspace-Id' => $this->workspace->id,
            'X-User-Id' => 'dev_user',
        ])->getJson('/api/payments/bachs/plans');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('gateway.provider', 'bachs')
            ->assertJsonStructure([
                'gateway' => ['provider', 'environment', 'docs_url'],
                'current_plan',
                'plans' => [
                    'pro' => ['name', 'monthly', 'annual'],
                    'agency' => ['name', 'monthly', 'annual'],
                ],
            ]);
    }

    public function test_can_create_bachs_checkout_session(): void
    {
        \Illuminate\Support\Facades\Http::fake([
            '*bachs.io*' => \Illuminate\Support\Facades\Http::response([
                'id' => 'cs_mock_test_1234567890',
                'checkout_url' => 'https://checkout.bachs.io/session/cs_mock_test_1234567890',
                'status' => 'open',
            ], 200),
        ]);

        $response = $this->withHeaders([
            'X-Workspace-Id' => $this->workspace->id,
            'X-User-Id' => 'dev_user',
        ])->postJson('/api/payments/bachs/checkout-session', [
            'plan_id' => 'pro',
            'billing_cycle' => 'annual',
            'customer_email' => 'alex@example.com',
            'customer_name' => 'Alex Morgan',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'session_id',
                    'checkout_url',
                    'plan_id',
                    'billing_cycle',
                    'amount',
                    'currency',
                ],
            ]);

        $data = $response->json('data');
        $this->assertNotEmpty($data['session_id']);
        $this->assertStringContainsString('checkout', $data['checkout_url']);
        $this->assertEquals('pro', $data['plan_id']);
        $this->assertEquals('annual', $data['billing_cycle']);

        $this->assertDatabaseHas('bachs_payments', [
            'session_id' => $data['session_id'],
            'plan_id' => 'pro',
            'customer_email' => 'alex@example.com',
            'status' => 'open',
        ]);
    }

    public function test_can_verify_and_complete_session_on_return(): void
    {
        $payment = BachsPayment::create([
            'workspace_id' => $this->workspace->id,
            'session_id' => 'cs_test_return_123',
            'checkout_url' => 'https://checkout.bachs.io/session/cs_test_return_123',
            'customer_email' => 'alex@example.com',
            'customer_name' => 'Alex Morgan',
            'plan_id' => 'agency',
            'billing_cycle' => 'monthly',
            'amount' => 79.00,
            'currency' => 'USD',
            'status' => 'open',
        ]);

        $response = $this->withHeaders([
            'X-Workspace-Id' => $this->workspace->id,
        ])->getJson("/api/payments/bachs/session/{$payment->session_id}?confirm=1");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'completed')
            ->assertJsonPath('data.plan_id', 'agency');

        $this->assertEquals('agency', $this->workspace->fresh()->plan_id);
    }

    public function test_can_process_bachs_webhook_with_valid_hmac_signature(): void
    {
        $payload = [
            'type' => 'collection.succeeded',
            'data' => [
                'session_id' => 'cs_test_webhook_456',
                'id' => 'cs_test_webhook_456',
                'status' => 'succeeded',
                'metadata' => [
                    'workspace_id' => $this->workspace->id,
                    'plan_id' => 'pro',
                    'billing_cycle' => 'monthly',
                ],
            ],
        ];

        $payment = BachsPayment::create([
            'workspace_id' => $this->workspace->id,
            'session_id' => 'cs_test_webhook_456',
            'checkout_url' => 'https://checkout.bachs.io/session/cs_test_webhook_456',
            'customer_email' => 'alex@example.com',
            'plan_id' => 'pro',
            'amount' => 29.00,
            'currency' => 'USD',
            'status' => 'open',
        ]);

        $rawBody = json_encode($payload);
        $timestamp = (string) time();
        $secret = config('bachs.webhook_secret');
        $signature = hash_hmac('sha256', "{$timestamp}.{$rawBody}", $secret);

        $response = $this->call(
            'POST',
            '/api/webhooks/bachs',
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_X_BACHS_SIGNATURE' => $signature,
                'HTTP_X_BACHS_TIMESTAMP' => $timestamp,
            ],
            $rawBody
        );

        $response->assertStatus(200)
            ->assertJsonPath('received', true)
            ->assertJsonPath('result.action', 'plan_activated');

        $this->assertEquals('completed', $payment->fresh()->status);
        $this->assertEquals('pro', $this->workspace->fresh()->plan_id);
    }

    public function test_rejects_webhook_with_tampered_signature(): void
    {
        $payload = ['type' => 'collection.succeeded', 'data' => []];
        $rawBody = json_encode($payload);

        $response = $this->call(
            'POST',
            '/api/webhooks/bachs',
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_X_BACHS_SIGNATURE' => 'invalid_tampered_signature_hex',
                'HTTP_X_BACHS_TIMESTAMP' => (string) time(),
            ],
            $rawBody
        );

        $response->assertStatus(401);
    }
}
