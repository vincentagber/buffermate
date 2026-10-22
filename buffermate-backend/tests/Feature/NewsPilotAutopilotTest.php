<?php

namespace Tests\Feature;

use App\Enums\PostStatus;
use App\Models\NewsFeed;
use App\Models\NewsTopic;
use App\Models\Post;
use App\Models\PublishJob;
use App\Models\SocialAccount;
use App\Models\Workspace;
use App\Models\WorkspaceMember;
use App\Services\News\EditorialValidatorService;
use App\Services\News\FeedReaderService;
use App\Services\News\TopicRankerService;
use App\Services\News\UrlSecurityValidator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NewsPilotAutopilotTest extends TestCase
{
    use RefreshDatabase;

    protected Workspace $workspace;
    protected string $userId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userId = 'user_pilot_test_001';
        $this->workspace = Workspace::create([
            'name' => 'Apex Media Hub',
            'slug' => 'ws_apex_media',
            'timezone' => 'Africa/Lagos',
            'owner_user_id' => $this->userId,
            'settings' => [
                'autopilot_enabled' => true,
                'autopilot_killed' => false,
                'require_approval' => false,
                'news_pilot' => [
                    'enabled' => true,
                    'trends_enabled' => true,
                    'trends_geo' => 'US',
                    'keywords' => ['AI', 'Tech', 'BufferMate'],
                    'preferred_categories' => ['Technology', 'General'],
                    'min_score' => 30.0,
                ],
            ],
        ]);

        WorkspaceMember::create([
            'workspace_id' => $this->workspace->id,
            'user_id' => $this->userId,
            'role' => 'owner',
            'status' => 'active',
        ]);
    }

    public function test_url_security_validator_blocks_internal_ips(): void
    {
        $this->assertFalse(UrlSecurityValidator::isSafeUrl('http://localhost:8000/feed.xml'));
        $this->assertFalse(UrlSecurityValidator::isSafeUrl('http://127.0.0.1:3000/api'));
        $this->assertFalse(UrlSecurityValidator::isSafeUrl('http://169.254.169.254/latest/meta-data'));
        $this->assertFalse(UrlSecurityValidator::isSafeUrl('ftp://example.com/feed.xml'));
        $this->assertTrue(UrlSecurityValidator::isSafeUrl('https://techcrunch.com/feed/'));
    }

    public function test_feed_reader_parses_rss_correctly(): void
    {
        $rssXml = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Global Tech Daily</title>
    <link>https://globaltechdaily.com</link>
    <description>Daily tech news</description>
    <item>
      <title>NextGen AI Breakthrough Accelerates Automation</title>
      <link>https://globaltechdaily.com/breakthrough-2026</link>
      <description>Scientists and engineers deploy transformative model with unprecedented latency reductions.</description>
      <pubDate>Thu, 22 Oct 2026 07:00:00 +0000</pubDate>
      <author>Dr. Jane Doe</author>
    </item>
  </channel>
</rss>
XML;

        $reader = new FeedReaderService();
        $items = $reader->parse($rssXml, 5);

        $this->assertCount(1, $items);
        $this->assertEquals('NextGen AI Breakthrough Accelerates Automation', $items[0]['title']);
        $this->assertEquals('https://globaltechdaily.com/breakthrough-2026', $items[0]['link']);
        $this->assertStringContainsString('breakthrough-2026', $items[0]['normalized_link']);
        $this->assertEquals('Dr. Jane Doe', $items[0]['publisher']);
    }

    public function test_topic_ranker_scores_and_detects_similarity(): void
    {
        $ranker = new TopicRankerService();

        $topic = [
            'title' => 'Breakthrough in AI and Social Media Automation',
            'summary' => 'Comprehensive evaluation of productivity tools in 2026.',
            'category' => 'Technology',
            'published_at' => now()->toIso8601String(),
            'source_priority' => 3,
            'source_urls' => [
                ['publisher' => 'Tech Source A', 'url' => 'https://a.com/1'],
                ['publisher' => 'Tech Source B', 'url' => 'https://b.com/2'],
            ],
        ];

        $config = [
            'keywords' => ['AI', 'Social Media'],
            'preferred_categories' => ['Technology'],
        ];

        $res = $ranker->evaluate($topic, $config);

        $this->assertGreaterThan(70, $res['score']);
        $this->assertArrayHasKey('relevance', $res['breakdown']);
        $this->assertArrayHasKey('freshness', $res['breakdown']);
        $this->assertArrayHasKey('quality', $res['breakdown']);

        // Similarity check
        $sim = $ranker->computeTitleSimilarity(
            'Breakthrough in AI and Social Media Automation',
            'Breakthrough in AI and Social Media Automations!'
        );
        $this->assertGreaterThan(0.85, $sim);
    }

    public function test_editorial_validator_detects_clickbait_and_sensitivity(): void
    {
        $validator = new EditorialValidatorService();

        // High-risk clickbait and sensitive crime topic
        $res = $validator->evaluate(
            'SHOCKING: You won\'t believe this massive fraud scandal and arrest!',
            'An alleged crime and fraud investigation unfolded in court today.',
            [['publisher' => 'Single Tabloid', 'url' => 'https://tabloid.com/1']]
        );

        $this->assertGreaterThanOrEqual(40, $res['risk_score']);
        $this->assertEquals('high', $res['risk_level']);
        $this->assertTrue($res['requires_human_approval']);
        $this->assertNotEmpty($res['flags']);

        // Objective balanced news topic
        $cleanRes = $validator->evaluate(
            'Tech Industry Report Outlines Cloud Computing Trends',
            'Market analysis shows increased adoption of edge computing across enterprise teams.',
            [
                ['publisher' => 'Reuters', 'url' => 'https://reuters.com/1'],
                ['publisher' => 'Bloomberg', 'url' => 'https://bloomberg.com/2'],
            ]
        );

        $this->assertEquals('low', $cleanRes['risk_level']);
        $this->assertFalse($cleanRes['requires_human_approval']);
    }

    public function test_per_account_automation_settings_enforce_manual_review_vs_auto_publish(): void
    {
        // 1. Create Facebook Page account with manual_review
        $fbAccount = SocialAccount::create([
            'workspace_id' => $this->workspace->id,
            'user_id' => $this->userId,
            'provider' => 'facebook',
            'provider_user_id' => 'fb_page_123',
            'access_token_encrypted' => 'fake_encrypted_token',
            'health_status' => 'connected',
            'meta' => [
                'news_automation' => [
                    'enabled' => true,
                    'publishing_mode' => 'manual_review',
                ],
            ],
        ]);

        // 2. Create X (Twitter) account with auto_publish
        $xAccount = SocialAccount::create([
            'workspace_id' => $this->workspace->id,
            'user_id' => $this->userId,
            'provider' => 'x',
            'provider_user_id' => 'x_profile_456',
            'access_token_encrypted' => 'fake_encrypted_token',
            'health_status' => 'connected',
            'meta' => [
                'news_automation' => [
                    'enabled' => true,
                    'publishing_mode' => 'auto_publish',
                ],
            ],
        ]);

        $this->assertTrue($fbAccount->isNewsAutomationEnabled());
        $this->assertTrue($fbAccount->requiresManualReview());
        $this->assertEquals('manual_review', $fbAccount->getNewsPublishingMode());

        $this->assertTrue($xAccount->isNewsAutomationEnabled());
        $this->assertFalse($xAccount->requiresManualReview());
        $this->assertEquals('auto_publish', $xAccount->getNewsPublishingMode());

        // 3. Create a candidate topic
        $topic = NewsTopic::create([
            'workspace_id' => $this->workspace->id,
            'topic_hash' => NewsTopic::generateHash('Automated Social Strategy Emerges'),
            'title' => 'Automated Social Strategy Emerges in 2026',
            'summary' => 'New workflows allow businesses to scale organic distribution.',
            'category' => 'Technology',
            'discovery_source' => 'rss:TechNews',
            'source_urls' => [
                ['publisher' => 'Tech Weekly', 'url' => 'https://technews.com/strategy'],
            ],
            'score' => 85.0,
            'editorial_risk_score' => 10,
            'status' => 'discovered',
        ]);

        // 4. Run ProcessNewsAutopilotJob
        $job = new \App\Jobs\ProcessNewsAutopilotJob($this->workspace->id, forceRun: true, maxTopicsToProcess: 1);
        $result = app()->call([$job, 'handle']);

        $this->assertTrue($result['success']);
        $this->assertEquals(1, $result['processed_topics']);

        // Verify Facebook post was created with DRAFT & in_review status (manual review enforced)
        $fbPost = Post::where('workspace_id', $this->workspace->id)
            ->whereHas('publishJobs', fn($q) => $q->where('social_account_id', $fbAccount->id))
            ->first();

        $this->assertNotNull($fbPost);
        $this->assertEquals(PostStatus::DRAFT, $fbPost->status);
        $this->assertEquals('in_review', $fbPost->approval_state);

        // Verify X post was created with SCHEDULED & approved status (auto-publish enabled)
        $xPost = Post::where('workspace_id', $this->workspace->id)
            ->whereHas('publishJobs', fn($q) => $q->where('social_account_id', $xAccount->id))
            ->first();

        $this->assertNotNull($xPost);
        $this->assertEquals(PostStatus::SCHEDULED, $xPost->status);
        $this->assertEquals('approved', $xPost->approval_state);

        // Verify topic is marked as drafted/scheduled
        $topic->refresh();
        $this->assertContains($topic->status, ['drafted', 'scheduled']);
    }

    public function test_api_endpoints_manage_feeds_and_topics(): void
    {
        // 1. Mock feed HTTP response for feed creation
        Http::fake([
            'https://trustedtech.io/rss.xml*' => Http::response(<<<XML
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Trusted Tech News</title>
    <link>https://trustedtech.io</link>
    <item>
      <title>Latest Innovations in Social Computing</title>
      <link>https://trustedtech.io/article-1</link>
      <description>Fresh update on social networks.</description>
    </item>
  </channel>
</rss>
XML, 200),
        ]);

        $headers = [
            'X-Workspace-Id' => $this->workspace->id,
            'X-User-Id' => $this->userId,
        ];

        // 2. Add feed via API
        $resStore = $this->withHeaders($headers)->postJson('/api/news/feeds', [
            'name' => 'Trusted Tech',
            'url' => 'https://trustedtech.io/rss.xml',
            'category' => 'Technology',
            'priority' => 3,
        ]);

        $resStore->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Trusted Tech');

        $feedId = $resStore->json('data.id');

        // 3. List feeds
        $resList = $this->withHeaders($headers)->getJson('/api/news/feeds');
        $resList->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data');

        // 4. Update per-account news automation settings via API
        $account = SocialAccount::create([
            'workspace_id' => $this->workspace->id,
            'user_id' => $this->userId,
            'provider' => 'facebook',
            'provider_user_id' => 'page_777',
            'access_token_encrypted' => 'token_secret',
            'health_status' => 'connected',
        ]);

        $resAcc = $this->withHeaders($headers)->postJson("/api/social/accounts/{$account->id}/automation-settings", [
            'enabled' => true,
            'publishing_mode' => 'auto_publish',
            'custom_instructions' => 'Highlight B2B software benefits',
        ]);

        $resAcc->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('news_automation.enabled', true)
            ->assertJsonPath('news_automation.publishing_mode', 'auto_publish');

        // 5. Delete feed
        $resDel = $this->withHeaders($headers)->deleteJson("/api/news/feeds/{$feedId}");
        $resDel->assertStatus(200)->assertJsonPath('success', true);
        $this->assertEquals(0, NewsFeed::count());
    }
}
