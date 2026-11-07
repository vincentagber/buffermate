<?php

namespace Tests\Feature;

use App\Models\Workspace;
use App\Services\Ai\GeminiDriver;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeminiIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected Workspace $workspace;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.gemini.api_key' => 'test_gemini_key_12345']);
        config(['services.gemini.model' => 'gemini-1.5-flash']);
        config(['services.gemini.image_model' => 'imagen-3.0-generate-002']);

        $this->workspace = Workspace::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'name' => 'Gemini AI Test Workspace',
            'slug' => 'gemini-test-' . \Illuminate\Support\Str::random(6),
            'owner_user_id' => 'usr_test_123',
            'plan_id' => 'pro',
        ]);
    }

    protected function authenticatedHeaders(): array
    {
        return [
            'Accept' => 'application/json',
            'X-Workspace-Id' => $this->workspace->id,
            'X-User-Id' => 'usr_test_123',
        ];
    }

    // =========================================================================
    // 1. CAPABILITY 1: CONTENT POSTING
    // =========================================================================

    public function test_content_posting_generates_multi_platform_copy_successfully(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent*' => Http::response([
                'candidates' => [
                    [
                        'finishReason' => 'STOP',
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'hook' => 'Stop doing manual social posting in 2026 🚀',
                                        'body' => 'Autonomous publishing saves high-velocity growth teams 15+ hours weekly.',
                                        'caption' => "Stop doing manual social posting in 2026 🚀\n\nAutonomous publishing saves teams 15+ hours weekly.\n\nDrop PLAYBOOK below! 👇\n\n#BufferMate #Growth",
                                        'call_to_action' => 'Drop PLAYBOOK below!',
                                        'hashtags' => ['#BufferMate', '#Growth', '#Automation'],
                                        'suggested_media' => 'image',
                                        'image_prompt' => 'Futuristic holographic command center, neon chartreuse lighting, 8k resolution',
                                        'platform_posts' => [
                                            'x' => [
                                                'caption' => 'Stop doing manual posting. Let AI handle predictive queues. 🧵👇 #Growth',
                                                'hook' => 'Stop manual posting.',
                                                'hashtags' => ['#Growth'],
                                            ],
                                            'linkedin' => [
                                                'caption' => 'Strategic Insight: Social automation is no longer optional in 2026.',
                                                'hook' => 'Strategic Insight',
                                                'hashtags' => ['#Leadership'],
                                            ],
                                        ],
                                    ]),
                                ],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->withHeaders($this->authenticatedHeaders())->postJson('/api/ai/social-post', [
            'topic' => 'Autonomous Social Scheduling',
            'tone' => 'persuasive',
            'platform' => 'all',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);
        $response->assertJsonStructure([
            'data' => [
                'mainCaption',
                'hook',
                'body',
                'callToAction',
                'hashtags',
                'platformVariants',
                'imageUrl',
                'aiModel',
            ],
        ]);

        $data = $response->json('data');
        $this->assertEquals('Stop doing manual social posting in 2026 🚀', $data['hook']);
        $this->assertArrayHasKey('x', $data['platformVariants']);
        $this->assertArrayHasKey('linkedin', $data['platformVariants']);
    }

    public function test_content_posting_handles_rate_limit_explicitly(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent*' => Http::response([
                'error' => [
                    'code' => 429,
                    'message' => 'Resource has been exhausted (e.g. check quota).',
                    'status' => 'RESOURCE_EXHAUSTED',
                ],
            ], 429),
        ]);

        $response = $this->withHeaders($this->authenticatedHeaders())->postJson('/api/ai/social-post', [
            'topic' => 'High-Volume Posting',
        ]);

        $response->assertStatus(200);
        $this->assertFalse($response->json('success'));
        $this->assertEquals('RATE_LIMIT_EXCEEDED', $response->json('code'));
        $this->assertStringContainsString('rate limit', strtolower($response->json('error')));
        $this->assertNotEmpty($response->json('data.mainCaption'));
    }

    public function test_content_posting_handles_safety_blocked_topic(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent*' => Http::response([
                'promptFeedback' => [
                    'blockReason' => 'SAFETY',
                    'safetyRatings' => [
                        ['category' => 'HARM_CATEGORY_DANGEROUS_CONTENT', 'probability' => 'HIGH'],
                    ],
                ],
                'candidates' => [],
            ], 200),
        ]);

        $response = $this->withHeaders($this->authenticatedHeaders())->postJson('/api/ai/social-post', [
            'topic' => 'Explosive dangerous materials',
        ]);

        $response->assertStatus(200);
        $this->assertFalse($response->json('success'));
        $this->assertEquals('BLOCKED_BY_SAFETY', $response->json('code'));
        $this->assertStringContainsString('safety', strtolower($response->json('error')));
    }

    // =========================================================================
    // 2. CAPABILITY 2: VOICE FEATURE (Speech Input & Form Extraction)
    // =========================================================================

    public function test_voice_feature_extracts_fields_from_audio_file(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent*' => Http::response([
                'candidates' => [
                    [
                        'finishReason' => 'STOP',
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'transcript' => 'Schedule our launch post for tomorrow at 3pm on Twitter and LinkedIn with 20% off',
                                        'title' => '🚀 Launch Announcement: Next-Gen AI Suite',
                                        'content' => "Exciting news! We are launching our brand new AI workflow automation suite.\n\nClaim 20% off today!",
                                        'platforms' => ['x', 'linkedin'],
                                        'scheduledAt' => '2026-11-08T15:00:00',
                                        'scheduledAtDisplay' => 'Tomorrow at 3:00 PM',
                                        'tone' => 'promotional',
                                        'mode' => 'text',
                                        'hashtags' => ['#Launch', '#Automation'],
                                        'confidence' => 0.99,
                                    ]),
                                ],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $fakeAudio = UploadedFile::fake()->create('voice_brief.webm', 150, 'audio/webm');

        $response = $this->withHeaders($this->authenticatedHeaders())->post('/api/ai/extract-form', [
            'audio' => $fakeAudio,
            'now' => '2026-11-07T14:00:00Z',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);
        $response->assertJsonPath('data.title', '🚀 Launch Announcement: Next-Gen AI Suite');
        $response->assertJsonPath('data.platforms', ['x', 'linkedin']);
        $this->assertEquals('promotional', $response->json('data.tone'));
    }

    public function test_voice_feature_rejects_unsupported_audio_format(): void
    {
        $invalidFile = UploadedFile::fake()->create('malicious.exe', 50, 'application/x-msdownload');

        $response = $this->withHeaders($this->authenticatedHeaders())->post('/api/ai/extract-form', [
            'audio' => $invalidFile,
        ]);

        $response->assertStatus(422);
        $this->assertFalse($response->json('success'));
        $this->assertEquals('UNSUPPORTED_AUDIO_FORMAT', $response->json('code'));
        $this->assertStringContainsString('Unsupported audio format', $response->json('error'));
    }

    public function test_voice_feature_extracts_fields_from_text_brief(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent*' => Http::response([
                'candidates' => [
                    [
                        'finishReason' => 'STOP',
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'title' => '💡 3 Productivity Systems That Reclaim 10 Hours',
                                        'content' => "Most teams don't have a time problem — they have an orchestration problem.\n\nComment below!",
                                        'platforms' => ['linkedin', 'threads'],
                                        'scheduledAt' => '2026-11-13T09:00:00',
                                        'scheduledAtDisplay' => 'Friday at 9:00 AM',
                                        'tone' => 'thought-leadership',
                                        'mode' => 'text',
                                        'hashtags' => ['#Productivity', '#Leadership'],
                                        'confidence' => 0.97,
                                    ]),
                                ],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->withHeaders($this->authenticatedHeaders())->postJson('/api/ai/extract-form', [
            'text' => 'Write a thought leadership post for LinkedIn and Threads on Friday morning at 9am about 3 productivity tips that save 10 hours a week.',
            'now' => '2026-11-07T10:00:00Z',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);
        $response->assertJsonPath('data.tone', 'thought-leadership');
        $response->assertJsonPath('data.platforms', ['linkedin', 'threads']);
    }

    // =========================================================================
    // 3. CAPABILITY 3: TEXT AND IMAGE GENERATION (Modality Separation)
    // =========================================================================

    public function test_image_generation_operates_independently_from_text_modality(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict*' => Http::response([
                'predictions' => [
                    [
                        'bytesBase64Encoded' => base64_encode('fake_synthetic_jpeg_bytes_for_test'),
                    ],
                ],
            ], 200),
        ]);

        $response = $this->withHeaders($this->authenticatedHeaders())->postJson('/api/ai/image', [
            'prompt' => 'A glowing futuristic smart watch showing social analytics',
            'style' => 'photorealistic',
            'aspectRatio' => '1:1',
        ]);

        $response->assertStatus(200);
        $this->assertTrue($response->json('success'));
        $this->assertStringStartsWith('data:image/jpeg;base64,', $response->json('imageUrl'));
        $this->assertEquals('imagen-3.0-generate-002', $response->json('model'));
        $this->assertEquals('1:1', $response->json('aspectRatio'));
    }

    public function test_image_generation_handles_rate_limit_gracefully(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict*' => Http::response([
                'error' => [
                    'code' => 429,
                    'message' => 'Quota exceeded for Imagen visual generation.',
                ],
            ], 429),
        ]);

        $response = $this->withHeaders($this->authenticatedHeaders())->postJson('/api/ai/image', [
            'prompt' => 'High frequency visual rendering',
            'style' => 'cinematic',
            'aspectRatio' => '16:9',
        ]);

        $response->assertStatus(200);
        $this->assertFalse($response->json('success'));
        $this->assertEquals('RATE_LIMIT_EXCEEDED', $response->json('code'));
        $this->assertStringContainsString('quota', strtolower($response->json('error')));
        $this->assertNotEmpty($response->json('imageUrl'));
    }
}
