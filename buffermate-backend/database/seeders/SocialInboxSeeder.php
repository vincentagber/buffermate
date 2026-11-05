<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\SocialConversation;
use App\Models\SocialMessage;
use App\Models\WorkItem;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SocialInboxSeeder extends Seeder
{
    public function run(): void
    {
        $workspace = Workspace::first();
        if (!$workspace) return;

        // Clean existing
        SocialMessage::truncate();
        SocialConversation::truncate();

        $project = Project::where('workspace_id', $workspace->id)->first();
        $sampleWorkItem = null;
        if ($project) {
            $sampleWorkItem = WorkItem::where('project_id', $project->id)->first();
        }

        $now = Carbon::now();

        $inquiries = [
            [
                'channel' => 'instagram',
                'sender_name' => 'Sophia Miller',
                'sender_handle' => '@sophia_m',
                'sender_avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
                'status' => 'open',
                'priority' => 'high',
                'assignee_name' => null,
                'unread' => true,
                'response_time_minutes' => 6,
                'pipeline_value' => 24500.00,
                'last_message_at' => $now->copy()->subMinutes(12),
                'messages' => [
                    [
                        'sender_type' => 'customer',
                        'sender_name' => 'Sophia Miller',
                        'is_internal_note' => false,
                        'content' => 'Hey! Loved the scorecard launch. Where can I sign up for the enterprise tier?',
                        'created_at' => $now->copy()->subMinutes(12),
                    ]
                ],
            ],
            [
                'channel' => 'linkedin',
                'sender_name' => 'David Chen',
                'sender_handle' => 'David Chen · VP Growth',
                'sender_avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                'status' => 'open',
                'priority' => 'high',
                'assignee_name' => null,
                'unread' => true,
                'response_time_minutes' => 14,
                'pipeline_value' => 18000.00,
                'last_message_at' => $now->copy()->subMinutes(34),
                'messages' => [
                    [
                        'sender_type' => 'customer',
                        'sender_name' => 'David Chen',
                        'is_internal_note' => false,
                        'content' => 'Interested in partnering on your Q3 webinar series. Do you have 15 mins this Friday?',
                        'created_at' => $now->copy()->subMinutes(34),
                    ]
                ],
            ],
            [
                'channel' => 'tiktok',
                'sender_name' => 'Alex Creative',
                'sender_handle' => '@alex_creative',
                'sender_avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                'status' => 'in_progress',
                'priority' => 'high',
                'assignee_name' => 'Liam Patel',
                'unread' => true,
                'response_time_minutes' => 10,
                'pipeline_value' => 5700.00,
                'last_message_at' => $now->copy()->subHours(1),
                'messages' => [
                    [
                        'sender_type' => 'customer',
                        'sender_name' => 'Alex Creative',
                        'is_internal_note' => false,
                        'content' => 'Can you DM me the template link mentioned in your latest video?',
                        'created_at' => $now->copy()->subHours(1),
                    ],
                    [
                        'sender_type' => 'agent',
                        'sender_name' => 'Liam Patel',
                        'is_internal_note' => true,
                        'content' => 'Internal Note: Checking if creator package v3 is currently accessible to public leads.',
                        'created_at' => $now->copy()->subMinutes(50),
                    ]
                ],
            ],
            [
                'channel' => 'linkedin',
                'sender_name' => 'Marcus Vance',
                'sender_handle' => '@marcus_v',
                'sender_avatar' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
                'status' => 'in_progress',
                'priority' => 'normal',
                'assignee_name' => 'Alex Morgan',
                'unread' => false,
                'response_time_minutes' => 8,
                'pipeline_value' => 0.00,
                'last_message_at' => $now->copy()->subHours(2),
                'messages' => [
                    [
                        'sender_type' => 'customer',
                        'sender_name' => 'Marcus Vance',
                        'is_internal_note' => false,
                        'content' => 'Great thread on B2B social attribution! Agree with point #3.',
                        'created_at' => $now->copy()->subHours(2),
                    ],
                    [
                        'sender_type' => 'agent',
                        'sender_name' => 'Alex Morgan',
                        'is_internal_note' => false,
                        'content' => 'Thanks Marcus! Point #3 is usually where attribution breaks down. Full deep-dive framework coming Tuesday.',
                        'created_at' => $now->copy()->subHours(1)->subMinutes(45),
                    ]
                ],
            ],
            [
                'channel' => 'whatsapp',
                'sender_name' => 'Elena Rostova',
                'sender_handle' => 'Elena Rostova',
                'sender_avatar' => 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&auto=format&fit=crop&q=80',
                'status' => 'resolved',
                'priority' => 'normal',
                'assignee_name' => 'Elena Rostova',
                'work_item_id' => $sampleWorkItem ? $sampleWorkItem->id : null,
                'work_item_key' => $sampleWorkItem ? $sampleWorkItem->key : 'BM-2',
                'unread' => false,
                'response_time_minutes' => 4,
                'pipeline_value' => 0.00,
                'last_message_at' => $now->copy()->subHours(3),
                'messages' => [
                    [
                        'sender_type' => 'customer',
                        'sender_name' => 'Elena Rostova',
                        'is_internal_note' => false,
                        'content' => 'Invoice received and approved by our procurement department. Thank you!',
                        'created_at' => $now->copy()->subHours(3),
                    ],
                    [
                        'sender_type' => 'agent',
                        'sender_name' => 'Alex Morgan',
                        'is_internal_note' => false,
                        'content' => 'Wonderful news Elena! We have marked invoice #4092 as confirmed and closed.',
                        'created_at' => $now->copy()->subHours(2)->subMinutes(55),
                    ],
                    [
                        'sender_type' => 'agent',
                        'sender_name' => 'Elena Rostova',
                        'is_internal_note' => true,
                        'content' => 'Jira Work Item linked: Verified SLA adherence (4 mins reply).',
                        'created_at' => $now->copy()->subHours(2)->subMinutes(50),
                    ]
                ],
            ],
            [
                'channel' => 'instagram',
                'sender_name' => 'Lucas Thorne',
                'sender_handle' => '@lucas_t',
                'sender_avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
                'status' => 'open',
                'priority' => 'urgent',
                'assignee_name' => null,
                'unread' => true,
                'response_time_minutes' => 5,
                'pipeline_value' => 12000.00,
                'last_message_at' => $now->copy()->subHours(4),
                'messages' => [
                    [
                        'sender_type' => 'customer',
                        'sender_name' => 'Lucas Thorne',
                        'is_internal_note' => false,
                        'content' => 'Our clinic team needs 25 seats for social scheduling and analytics. Can we do a custom invoice?',
                        'created_at' => $now->copy()->subHours(4),
                    ]
                ],
            ],
            [
                'channel' => 'linkedin',
                'sender_name' => 'Maya Lin',
                'sender_handle' => 'Maya Lin · Marketing Director',
                'sender_avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
                'status' => 'waiting_customer',
                'priority' => 'normal',
                'assignee_name' => 'Sarah Chen',
                'unread' => true,
                'response_time_minutes' => 7,
                'pipeline_value' => 9500.00,
                'last_message_at' => $now->copy()->subHours(5),
                'messages' => [
                    [
                        'sender_type' => 'customer',
                        'sender_name' => 'Maya Lin',
                        'is_internal_note' => false,
                        'content' => 'Sent the brief over for the aesthetic launch campaign. Looking forward to review!',
                        'created_at' => $now->copy()->subHours(5),
                    ]
                ],
            ],
            [
                'channel' => 'whatsapp',
                'sender_name' => 'Dr. Julian Ross',
                'sender_handle' => '+1 (555) 234-8901',
                'sender_avatar' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=80',
                'status' => 'open',
                'priority' => 'urgent',
                'assignee_name' => null,
                'unread' => true,
                'response_time_minutes' => 3,
                'pipeline_value' => 16000.00,
                'last_message_at' => $now->copy()->subHours(6),
                'messages' => [
                    [
                        'sender_type' => 'customer',
                        'sender_name' => 'Dr. Julian Ross',
                        'is_internal_note' => false,
                        'content' => 'Urgent: Can we integrate our clinic EHR patient booking flow directly into the Instagram DM automation?',
                        'created_at' => $now->copy()->subHours(6),
                    ]
                ],
            ],
            [
                'channel' => 'tiktok',
                'sender_name' => 'Kylie Gomez',
                'sender_handle' => '@kylie_glow',
                'sender_avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
                'status' => 'open',
                'priority' => 'normal',
                'assignee_name' => null,
                'unread' => true,
                'response_time_minutes' => 9,
                'pipeline_value' => 3500.00,
                'last_message_at' => $now->copy()->subHours(7),
                'messages' => [
                    [
                        'sender_type' => 'customer',
                        'sender_name' => 'Kylie Gomez',
                        'is_internal_note' => false,
                        'content' => 'Obsessed with your hydrafacial video! Do you offer creator affiliate discounts?',
                        'created_at' => $now->copy()->subHours(7),
                    ]
                ],
            ],
            [
                'channel' => 'instagram',
                'sender_name' => 'Liam Sterling',
                'sender_handle' => '@sterling_media',
                'sender_avatar' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
                'status' => 'open',
                'priority' => 'normal',
                'assignee_name' => null,
                'unread' => true,
                'response_time_minutes' => 11,
                'pipeline_value' => 8900.00,
                'last_message_at' => $now->copy()->subHours(8),
                'messages' => [
                    [
                        'sender_type' => 'customer',
                        'sender_name' => 'Liam Sterling',
                        'is_internal_note' => false,
                        'content' => 'Quick question on the multi-channel scheduler: does it support video carousels on LinkedIn yet?',
                        'created_at' => $now->copy()->subHours(8),
                    ]
                ],
            ],
        ];

        foreach ($inquiries as $data) {
            $messages = $data['messages'];
            unset($data['messages']);

            $data['workspace_id'] = $workspace->id;
            $data['last_message_preview'] = $messages[count($messages) - 1]['content'];

            $conv = SocialConversation::create($data);

            foreach ($messages as $msg) {
                $conv->messages()->create($msg);
            }
        }
    }
}
