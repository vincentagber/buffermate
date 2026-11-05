<?php

namespace Tests\Feature;

use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class SettingsControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_workspace_settings(): void
    {
        $workspace = Workspace::create([
            'name' => 'BufferMate AI Test',
            'slug' => 'buffermate-ai-test-' . Str::random(4),
            'timezone' => 'Africa/Lagos',
            'plan_id' => 'pro',
            'owner_user_id' => 'dev_user',
            'settings' => [
                'profile' => [
                    'display_name' => 'Vincent Test',
                    'handle' => 'vincenttest',
                ],
            ],
        ]);

        $response = $this->withHeader('X-Workspace-Id', $workspace->id)
            ->getJson('/api/settings');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.profile.display_name', 'Vincent Test')
            ->assertJsonPath('data.notifications.timezone', 'Africa/Lagos');
    }

    public function test_can_update_workspace_settings(): void
    {
        $workspace = Workspace::create([
            'name' => 'BufferMate AI Test',
            'slug' => 'buffermate-ai-test-' . Str::random(4),
            'timezone' => 'Africa/Lagos',
            'plan_id' => 'starter',
            'owner_user_id' => 'dev_user',
            'settings' => [],
        ]);

        $payload = [
            'profile' => [
                'display_name' => 'Updated Name',
                'handle' => 'updatedhandle',
                'bio' => 'New bio description',
            ],
            'automations' => [
                'default_link' => 'https://example.com/growth',
                'auto_reply_delay' => '45s',
                'ai_tone' => 'direct_response',
                'daily_dm_limit' => 500,
            ],
            'ai_guidelines' => [
                'default_language' => 'French',
                'default_content_length' => 'long',
                'target_audience' => 'Enterprise Marketers',
                'default_cta' => 'Schedule a demo',
            ],
            'notifications' => [
                'timezone' => 'Europe/Paris',
                'audio_alerts' => true,
            ],
        ];

        $response = $this->withHeader('X-Workspace-Id', $workspace->id)
            ->postJson('/api/settings', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $workspace->refresh();
        $this->assertEquals('Europe/Paris', $workspace->timezone);
        $this->assertEquals('Updated Name', $workspace->settings['profile']['display_name']);
        $this->assertEquals('French', $workspace->settings['ai_guidelines']['default_language']);
    }

    public function test_can_cancel_subscription(): void
    {
        $workspace = Workspace::create([
            'name' => 'BufferMate AI Test',
            'slug' => 'buffermate-ai-test-' . Str::random(4),
            'timezone' => 'Africa/Lagos',
            'plan_id' => 'pro',
            'owner_user_id' => 'dev_user',
            'settings' => [],
        ]);

        $response = $this->withHeader('X-Workspace-Id', $workspace->id)
            ->postJson('/api/settings/cancel-subscription');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('subscription.plan_id', 'starter')
            ->assertJsonPath('subscription.status', 'cancelled');

        $workspace->refresh();
        $this->assertEquals('starter', $workspace->plan_id);
    }
}

