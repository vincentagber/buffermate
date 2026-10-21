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
        $userId = '260d11f7-3bd6-4a40-9902-6018573129be';
        $user = User::firstOrCreate(
            ['email' => 'vincentagber74@gmail.com'],
            [
                'name' => 'Vincent Agber',
                'password' => bcrypt('Vincent@12345'),
            ]
        );

        // 1. Create Lumière Aesthetics Workspace
        $workspace = Workspace::firstOrCreate(
            ['slug' => 'lumiere_aesthetics'],
            [
                'id' => '11111111-2222-3333-4444-555555555555',
                'name' => 'Lumière Aesthetics',
                'timezone' => 'America/New_York',
                'default_locale' => 'en',
                'plan_id' => 'pro',
                'owner_user_id' => $userId,
                'settings' => [
                    'location' => 'Soho, New York',
                    'clinic' => 'Soho Clinic',
                    'autopilot_enabled' => true,
                    'autopilot_killed' => false,
                    'require_approval' => true,
                ],
            ]
        );

        // Alias for backward compatibility if any client queries ws_northstar_main
        Workspace::firstOrCreate(
            ['slug' => 'ws_northstar_main'],
            [
                'id' => '99999999-8888-7777-6666-555555555555',
                'name' => 'Northstar Agency',
                'timezone' => 'Africa/Lagos',
                'default_locale' => 'en',
                'plan_id' => 'pro',
                'owner_user_id' => $userId,
                'settings' => [
                    'location' => 'Tribeca, New York',
                    'clinic' => 'Tribeca Clinic',
                ],
            ]
        );

        // 2. Add Workspace Membership
        WorkspaceMember::firstOrCreate(
            ['workspace_id' => $workspace->id, 'user_id' => $userId],
            [
                'id' => Str::uuid()->toString(),
                'role' => WorkspaceRole::OWNER,
                'status' => 'active',
                'joined_at' => now(),
            ]
        );

        // 3. Add Connected Social Channels for Lumière Aesthetics
        foreach ([SocialChannel::INSTAGRAM, SocialChannel::FACEBOOK, SocialChannel::TIKTOK, SocialChannel::X] as $channel) {
            $isFacebook = $channel === SocialChannel::FACEBOOK;
            $providerUserId = $isFacebook ? '111006725414026' : '@lumiere.' . $channel->value;
            $token = $isFacebook 
                ? (env('FACEBOOK_PAGE_ACCESS_TOKEN') ?: 'EAAecOATPTb4BSwmZC7VXXHUOkkHEfrK24EXDJtBWZAIVRQsMLKQyxWr1hFgw06XrmrtLGQ6bnlSffxMoObEZAKftQ5xFMMtL9I3VNHXwf4PpaNAd70EqWBGV98sMpWcEwpvVV9Is2dTRjldBQgewZAwAZAX7kaWTi8G1uS48yRfZBgI1ZBPPVSzeGQC1ATDZAjbGbhED4ZCgRNX1a5HZAEGia9a8QKP8lGy9rGkPVnxJLQ5rqEWplXC7MA5X2LtCcZD')
                : 'lumiere_token_' . $channel->value;
            $meta = $isFacebook
                ? [
                    'name' => 'Jija-Bokoti Media',
                    'category' => 'Newspaper',
                    'followers' => 14494,
                    'fan_count' => 14494,
                    'link' => 'https://www.facebook.com/111006725414026',
                    'verified' => true,
                ]
                : ['followers' => 12500, 'verified' => true];

            SocialAccount::updateOrCreate(
                ['workspace_id' => $workspace->id, 'provider' => $channel->value],
                [
                    'id' => Str::uuid()->toString(),
                    'user_id' => $userId,
                    'provider_user_id' => $providerUserId,
                    'access_token_encrypted' => encrypt($token),
                    'health_status' => 'connected',
                    'capabilities' => ['create_text', 'publish_image', 'publish_video', 'publish_carousel', 'schedule', 'comments_read', 'comments_reply', 'account_metrics'],
                    'meta' => $meta,
                    'last_sync_at' => now(),
                ]
            );
        }

        // 4. Seed Automations & Retention Nudges
        $automations = [
            [
                'name' => 'Rebooking nudge',
                'channel' => 'instagram',
                'trigger_type' => 'comment_keyword',
                'keywords' => ['book', 'botox', 'rebook'],
                'reply_comment' => 'Thanks for checking in! Check your DM for our priority booking calendar.',
                'dm_message' => 'Hi, we noticed it has been 10 weeks since your last visit. We saved a spot for you at Lumière Soho!',
                'link_url' => 'https://lumiere.com/book-botox',
                'status' => 'active',
                'runs_today' => 12,
                'runs_total' => 340,
                'leads_captured' => 84,
            ],
            [
                'name' => 'Aftercare check-in',
                'channel' => 'instagram',
                'trigger_type' => 'dm_received',
                'keywords' => ['aftercare', 'recovery'],
                'reply_comment' => 'Sending you the medical aftercare guide right now!',
                'dm_message' => 'Hi from Lumière Aesthetics! Here is your post-treatment care guide: stay hydrated and avoid sun exposure for 48h.',
                'link_url' => 'https://lumiere.com/aftercare',
                'status' => 'active',
                'runs_today' => 8,
                'runs_total' => 210,
                'leads_captured' => 45,
            ],
            [
                'name' => 'Renewal reminder',
                'channel' => 'facebook',
                'trigger_type' => 'comment_keyword',
                'keywords' => ['membership', 'credits', 'renew'],
                'reply_comment' => 'Your VIP membership renewal perks have been sent to your inbox!',
                'dm_message' => 'Your Lumière VIP Membership renews in 7 days. You have 2 treatment credits available to redeem this month.',
                'link_url' => 'https://lumiere.com/vip-membership',
                'status' => 'active',
                'runs_today' => 5,
                'runs_total' => 95,
                'leads_captured' => 38,
            ],
            [
                'name' => 'Win-back Campaign',
                'channel' => 'tiktok',
                'trigger_type' => 'comment_keyword',
                'keywords' => ['offer', 'promo', 'lumiere'],
                'reply_comment' => 'We miss you at Lumière! Use code VIPWELCOME for 15% off your next session.',
                'dm_message' => 'It has been 90 days since your last facial. Book by Friday and get a complimentary hydration boost on us!',
                'link_url' => 'https://lumiere.com/welcome-back',
                'status' => 'active',
                'runs_today' => 3,
                'runs_total' => 64,
                'leads_captured' => 21,
            ],
        ];

        foreach ($automations as $auto) {
            SocialAutomation::firstOrCreate(
                ['workspace_id' => $workspace->id, 'name' => $auto['name']],
                array_merge($auto, [
                    'id' => Str::uuid()->toString(),
                    'user_id' => $userId,
                ])
            );
        }

        // 5. Seed Leads (Including the 6 clients due to rebook for Flow Assist)
        $leads = [
            ['name' => 'Elena Rostova', 'handle' => '@elena_r', 'channel' => 'instagram', 'status' => 'new', 'notes' => 'Due for Botox touch-up (10 weeks elapsed)'],
            ['name' => 'Chloe Bennett', 'handle' => '@chloeb_nyc', 'channel' => 'instagram', 'status' => 'qualified', 'notes' => 'Hydrafacial cycle due this week'],
            ['name' => 'Sarah Jenkins', 'handle' => '@sarahj_skin', 'channel' => 'facebook', 'status' => 'contacted', 'notes' => 'Laser skin rejuvenation follow-up due'],
            ['name' => 'Mia Thompson', 'handle' => '@mia_thompson', 'channel' => 'instagram', 'status' => 'new', 'notes' => 'Lip filler maintenance cycle reached'],
            ['name' => 'Jessica Alba-Cross', 'handle' => '@jess_ac', 'channel' => 'tiktok', 'status' => 'qualified', 'notes' => 'Chemical Peel follow-up consult due'],
            ['name' => 'Olivia Wilde-Chen', 'handle' => '@olivia_wc', 'channel' => 'instagram', 'status' => 'new', 'notes' => 'Microneedling session 3 due'],
            ['name' => 'Sophia Martinez', 'handle' => '@sophia_m', 'channel' => 'instagram', 'status' => 'converted', 'notes' => 'Active VIP member at Soho clinic'],
            ['name' => 'Alex Rivera', 'handle' => '@alex_creative', 'channel' => 'tiktok', 'status' => 'qualified', 'notes' => 'Inquired about full skin revision journey'],
            ['name' => 'Marcus Chen', 'handle' => '@marcus_dev', 'channel' => 'facebook', 'status' => 'contacted', 'notes' => 'Downloaded Men Aesthetics care guide'],
        ];

        foreach ($leads as $lead) {
            SocialLead::firstOrCreate(
                ['workspace_id' => $workspace->id, 'handle' => $lead['handle']],
                [
                    'id' => Str::uuid()->toString(),
                    'user_id' => $userId,
                    'name' => $lead['name'],
                    'channel' => $lead['channel'],
                    'keyword_triggered' => 'book',
                    'status' => $lead['status'],
                    'last_interaction' => now()->subHours(rand(1, 48)),
                    'notes' => $lead['notes'],
                ]
            );
        }

        // 6. Seed Posts (Matching Top Performing Posts in UI)
        $posts = [
            [
                'content' => '5 Tips for Better Productivity in 2026',
                'status' => PostStatus::PUBLISHED,
                'approval_state' => 'approved',
                'scheduled_at' => now()->subDay(),
                'posted_at' => now()->subDay(),
                'provider_results' => ['views' => 1200, 'engagement_rate' => '4.5%', 'reach' => 950],
            ],
            [
                'content' => 'Behind the scenes of our latest product update',
                'status' => PostStatus::PUBLISHED,
                'approval_state' => 'approved',
                'scheduled_at' => now()->subDays(3),
                'posted_at' => now()->subDays(3),
                'provider_results' => ['views' => 980, 'engagement_rate' => '3.9%', 'reach' => 740],
            ],
            [
                'content' => 'The ultimate guide to creator workflow automation',
                'status' => PostStatus::PUBLISHED,
                'approval_state' => 'approved',
                'scheduled_at' => now()->subDays(5),
                'posted_at' => now()->subDays(5),
                'provider_results' => ['views' => 2400, 'engagement_rate' => '5.1%', 'reach' => 1890],
            ],
            [
                'content' => 'VIP Hydration & Skin Glow Masterclass — Reserve your seat for this Friday @ 10:00 AM',
                'status' => PostStatus::SCHEDULED,
                'approval_state' => 'approved',
                'scheduled_at' => now()->next('Wednesday')->setTime(10, 0),
                'posted_at' => null,
                'provider_results' => ['target_channels' => ['instagram', 'facebook']],
            ],
        ];

        foreach ($posts as $postData) {
            Post::firstOrCreate(
                ['workspace_id' => $workspace->id, 'content' => $postData['content']],
                array_merge($postData, [
                    'id' => Str::uuid()->toString(),
                    'user_id' => $userId,
                ])
            );
        }

        // 7. Seed Activity Stream Logs
        $activities = [
            [
                'event_type' => 'auto_dm',
                'channel' => 'instagram',
                'title' => 'Instagram Rebooking DM Sent',
                'description' => 'Auto-sent 10-week Botox follow-up invite to @elena_r with priority Soho booking link.',
                'user_handle' => '@elena_r',
                'post_reference' => 'Rebooking Nudge',
            ],
            [
                'event_type' => 'lead_captured',
                'channel' => 'tiktok',
                'title' => 'New Treatment Lead Captured',
                'description' => 'Keyword "book" detected on viral Hydrafacial video from @alex_creative.',
                'user_handle' => '@alex_creative',
                'post_reference' => 'Video: 3 Glow Habits',
            ],
            [
                'event_type' => 'comment_replied',
                'channel' => 'facebook',
                'title' => 'Facebook Treatment Comment Replied',
                'description' => 'Responded to @marcus_dev: "Check your inbox for our treatment options! 📅"',
                'user_handle' => '@marcus_dev',
                'post_reference' => 'Post: Laser Rejuvenation Q&A',
            ],
            [
                'event_type' => 'post_published',
                'channel' => 'instagram',
                'title' => 'Scheduled Reel Published',
                'description' => 'Successfully published "5 Tips for Better Productivity in 2026" to Instagram & Facebook.',
                'user_handle' => '@lumiere.instagram',
                'post_reference' => '5 Tips for Better Productivity in 2026',
            ],
        ];

        foreach ($activities as $act) {
            \App\Models\SocialActivityStream::firstOrCreate(
                ['workspace_id' => $workspace->id, 'title' => $act['title']],
                array_merge($act, [
                    'id' => Str::uuid()->toString(),
                    'user_id' => $userId,
                    'created_at' => now()->subMinutes(rand(5, 120)),
                ])
            );
        }
    }
}
