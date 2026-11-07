<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\SocialConversation;
use App\Models\SocialMessage;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocialInboxTest extends TestCase
{
    use RefreshDatabase;

    private Workspace $workspace;
    private Project $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->workspace = Workspace::firstOrCreate(
            ['id' => '11111111-2222-3333-4444-555555555555'],
            [
                'name' => 'BufferMate Creator Studio',
                'slug' => 'buffermate_creator_studio',
                'timezone' => 'America/New_York',
                'default_locale' => 'en',
                'plan_id' => 'pro',
                'owner_user_id' => '260d11f7-3bd6-4a40-9902-6018573129be',
            ]
        );

        $this->project = Project::firstOrCreate(
            ['workspace_id' => $this->workspace->id, 'key' => 'BM'],
            [
                'name' => 'BufferMate Core Platform',
                'template' => 'scrum',
                'category' => 'Core Architecture',
            ]
        );
    }

    public function test_can_fetch_inbox_stats(): void
    {
        $response = $this->withHeaders(['X-Workspace-Id' => $this->workspace->id])
            ->getJson('/api/inbox/stats');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'avg_reply_time',
                    'unread_inquiries',
                    'unread_count',
                    'high_priority_count',
                    'resolution_rate',
                    'pipeline_value',
                ],
            ]);
    }

    public function test_can_list_and_filter_conversations(): void
    {
        $response = $this->withHeaders(['X-Workspace-Id' => $this->workspace->id])
            ->getJson('/api/inbox/conversations?channel=all&queue=all');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
        $this->assertIsArray($response->json('data'));
    }

    public function test_can_reply_with_customer_message_and_internal_note(): void
    {
        $conv = SocialConversation::create([
            'workspace_id' => $this->workspace->id,
            'channel' => 'instagram',
            'sender_name' => 'Test Customer',
            'sender_handle' => '@test_customer',
            'status' => 'open',
            'priority' => 'normal',
            'unread' => true,
        ]);

        // Customer reply (public)
        $replyResponse = $this->withHeaders(['X-Workspace-Id' => $this->workspace->id])
            ->postJson("/api/inbox/conversations/{$conv->id}/reply", [
                'content' => 'Thanks for reaching out! We will take care of this.',
                'is_internal_note' => false,
                'sender_name' => 'Alex Morgan',
            ]);

        $replyResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        // Internal note
        $noteResponse = $this->withHeaders(['X-Workspace-Id' => $this->workspace->id])
            ->postJson("/api/inbox/conversations/{$conv->id}/reply", [
                'content' => 'Internal Note: Checked user account, premium plan active.',
                'is_internal_note' => true,
                'sender_name' => 'Elena Rostova',
            ]);

        $noteResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $messages = SocialMessage::where('conversation_id', $conv->id)->get();
        $this->assertCount(2, $messages);
        $this->assertTrue($messages->where('is_internal_note', true)->isNotEmpty());
    }

    public function test_can_convert_inquiry_to_project_work_item(): void
    {
        $conv = SocialConversation::create([
            'workspace_id' => $this->workspace->id,
            'channel' => 'linkedin',
            'sender_name' => 'Enterprise Buyer',
            'sender_handle' => 'Buyer · VP Ops',
            'status' => 'open',
            'priority' => 'high',
            'last_message_preview' => 'Need 50 enterprise licenses with SOC2 compliance.',
        ]);

        $response = $this->withHeaders(['X-Workspace-Id' => $this->workspace->id])
            ->postJson("/api/inbox/conversations/{$conv->id}/convert-to-project-task", [
                'type' => 'story',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $conv->refresh();
        $this->assertNotNull($conv->work_item_id);
        $this->assertNotNull($conv->work_item_key);
        $this->assertStringStartsWith('BM-', $conv->work_item_key);
    }
}
