<?php

namespace Database\Seeders;

use App\Enums\PostStatus;
use App\Enums\SocialChannel;
use App\Enums\WorkspaceRole;
use App\Models\Post;
use App\Models\SocialAccount;
use App\Models\SocialAutomation;
use App\Models\SocialLead;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceMember;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@buffermate.app'],
            ['name' => 'Demo User', 'password' => bcrypt('Demo@12345')]
        );

        // 1. Create Default Workspace
        $workspace = Workspace::firstOrCreate(
            ['slug' => 'ws_northstar_main'],
            [
                'id' => Str::uuid()->toString(),
                'name' => 'Northstar Agency',
                'timezone' => 'Africa/Lagos',
                'default_locale' => 'en',
                'plan_id' => 'pro',
                'owner_user_id' => (string)$user->id,
                'settings' => [
                    'autopilot_enabled' => true,
                    'autopilot_killed' => false,
                    'require_approval' => false,
                ],
            ]
        );

        // 2. Add Workspace Membership
        WorkspaceMember::firstOrCreate(
            ['workspace_id' => $workspace->id, 'user_id' => (string)$user->id],
            [
                'id' => Str::uuid()->toString(),
                'role' => WorkspaceRole::OWNER,
                'status' => 'active',
                'joined_at' => now(),
            ]
        );

        // 3. Add Connected Social Channels
        foreach ([SocialChannel::INSTAGRAM, SocialChannel::FACEBOOK, SocialChannel::TIKTOK, SocialChannel::X] as $channel) {
            SocialAccount::firstOrCreate(
                ['workspace_id' => $workspace->id, 'provider' => $channel->value],
                [
                    'id' => Str::uuid()->toString(),
                    'user_id' => (string)$user->id,
                    'provider_user_id' => '@buffermate.' . $channel->value,
                    'access_token_encrypted' => encrypt('demo_token_' . $channel->value),
                    'health_status' => 'connected',
                    'capabilities' => ['create_text', 'publish_image', 'schedule'],
                    'meta' => ['followers' => 12500, 'verified' => true],
                    'last_sync_at' => now(),
                ]
            );
        }

        // 4. Seed Automations
        SocialAutomation::firstOrCreate(
            ['workspace_id' => $workspace->id, 'name' => 'New DM Welcome'],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => (string)$user->id,
                'channel' => 'instagram',
                'trigger_type' => 'dm_received',
                'keywords' => [],
                'reply_comment' => 'Thanks for connecting 👋',
                'dm_message' => 'Welcome to BufferMate! Check our resources: https://buffermate.ai/start',
                'link_url' => 'https://buffermate.ai/start',
                'status' => 'active',
                'runs_today' => 24,
                'runs_total' => 1840,
                'leads_captured' => 412,
            ]
        );

        // 5. Seed Leads
        SocialLead::firstOrCreate(
            ['workspace_id' => $workspace->id, 'handle' => '@sophia_growth'],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => (string)$user->id,
                'name' => 'Sophia Martinez',
                'channel' => 'instagram',
                'keyword_triggered' => 'growth',
                'status' => 'qualified',
                'last_interaction' => now(),
                'notes' => 'Inquired about Q4 multi-channel automation package.',
            ]
        );

        // 6. Seed Sample Posts
        Post::firstOrCreate(
            ['workspace_id' => $workspace->id, 'content' => 'How we automated 100% of our customer DMs with AI in 3 simple steps 🚀'],
            [
                'id' => Str::uuid()->toString(),
                'user_id' => (string)$user->id,
                'status' => PostStatus::PUBLISHED,
                'approval_state' => 'approved',
                'scheduled_at' => now()->subDay(),
                'posted_at' => now()->subDay(),
            ]
        );
    }
}
