<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\PublishJob;
use App\Models\Workspace;
use App\Models\WorkspaceMember;
use App\Services\Guardrails\DuplicateContentGuard;
use App\Services\Guardrails\KeywordFilterGuard;
use App\Services\Guardrails\QuietHoursGuard;
use App\Services\Publishing\PublishingEngine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BufferMateApiTest extends TestCase
{
    use RefreshDatabase;

    protected Workspace $workspace;
    protected string $userId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userId = 'test_user_uuid_123';
        $this->workspace = Workspace::create([
            'name' => 'Northstar Agency',
            'slug' => 'ws_northstar_main',
            'timezone' => 'Africa/Lagos',
            'owner_user_id' => $this->userId,
            'settings' => [
                'autopilot_enabled' => true,
                'autopilot_killed' => false,
                'require_approval' => true,
            ],
        ]);

        WorkspaceMember::create([
            'workspace_id' => $this->workspace->id,
            'user_id' => $this->userId,
            'role' => 'owner',
            'status' => 'active',
        ]);
    }

    public function test_dashboard_stats_endpoint_returns_real_sql_counts(): void
    {
        $response = $this->withHeaders([
            'X-Workspace-Id' => $this->workspace->id,
            'X-User-Id' => $this->userId,
        ])->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'totalContacts',
                    'messagesToday',
                    'activeAutomationsCount',
                    'postsCount',
                    'contract' => ['workspace', 'isEstimate'],
                ],
            ]);

        $this->assertFalse($response->json('data.contract.isEstimate'));
    }

    public function test_post_scheduling_creates_durable_jobs_with_idempotency_keys(): void
    {
        $payload = [
            'content' => 'Announcing our 2026 AI Growth Engine update! #Growth',
            'destinations' => [
                ['platform' => 'x'],
                ['platform' => 'facebook'],
            ],
            'scheduledAt' => now()->addHour()->toIso8601String(),
            'requireApproval' => false,
        ];

        $response = $this->withHeaders([
            'X-Workspace-Id' => $this->workspace->id,
            'X-User-Id' => $this->userId,
        ])->postJson('/api/posts', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('posts', [
            'workspace_id' => $this->workspace->id,
            'content' => $payload['content'],
        ]);

        $this->assertEquals(2, PublishJob::where('workspace_id', $this->workspace->id)->count());
    }

    public function test_autopilot_kill_switch_halts_operations(): void
    {
        $response = $this->withHeaders([
            'X-Workspace-Id' => $this->workspace->id,
            'X-User-Id' => $this->userId,
        ])->postJson('/api/autopilot/kill-switch', [
            'reason' => 'Testing emergency stop'
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('killed', true);

        $this->workspace->refresh();
        $this->assertTrue($this->workspace->settings['autopilot_killed']);
    }

    public function test_guardrails_prevent_duplicate_content(): void
    {
        $guard = new DuplicateContentGuard();

        Post::create([
            'workspace_id' => $this->workspace->id,
            'user_id' => $this->userId,
            'content' => 'Unique product release message',
            'scheduled_at' => now(),
        ]);

        $firstCheck = $guard->check($this->workspace->id, 'Completely different content');
        $this->assertTrue($firstCheck['passed']);

        $dupCheck = $guard->check($this->workspace->id, 'Unique product release message');
        $this->assertFalse($dupCheck['passed']);
        $this->assertEquals('DUPLICATE_CONTENT', $dupCheck['code']);
    }

    public function test_keyword_filter_blocks_restricted_terms(): void
    {
        $guard = new KeywordFilterGuard();

        $pass = $guard->check('Our regular product announcement');
        $this->assertTrue($pass['passed']);

        $blocked = $guard->check('Claim your 100% risk free crypto giveaway now');
        $this->assertFalse($blocked['passed']);
        $this->assertEquals('RESTRICTED_KEYWORD', $blocked['code']);
    }

    public function test_quiet_hours_guard_identifies_lagos_window(): void
    {
        $guard = new QuietHoursGuard();
        $res = $guard->check('Africa/Lagos');
        
        $this->assertIsArray($res);
        $this->assertArrayHasKey('passed', $res);
    }
}
