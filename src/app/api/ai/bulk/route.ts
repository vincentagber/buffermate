import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { GeminiService } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const {
      campaignName = 'Automated Campaign',
      topic,
      targetAudience = 'businesses and creators',
      tone = 'authoritative and engaging',
      platforms = ['facebook', 'instagram', 'linkedin', 'x'],
      durationDays = 7,
      frequency = 'daily',
      startDate = new Date().toISOString().split('T')[0],
      preferredTime = '09:00',
      autoSchedule = false,
      socialAccountIds = [],
    } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required for bulk generation.' }, { status: 400 });
    }

    const campaignResult = await GeminiService.generateBulkCampaign({
      campaignName,
      topic: topic.trim(),
      targetAudience,
      tone,
      platforms,
      durationDays: Number(durationDays) || 7,
      frequency,
      startDate,
      preferredTime,
    });

    let campaignId: string | null = null;

    // Save Campaign to database if user is logged in
    if (user) {
      try {
        const { data: campaignRecord } = await supabase
          .from('campaigns')
          .insert({
            user_id: user.id,
            name: campaignName,
            topic: topic,
            target_audience: targetAudience,
            tone: tone,
            platforms: platforms,
            duration_days: durationDays,
            frequency: frequency,
            start_date: startDate,
            preferred_time: preferredTime,
            status: 'ACTIVE',
          })
          .select('id')
          .single();

        if (campaignRecord) {
          campaignId = campaignRecord.id;

          // Save each post
          for (const post of campaignResult.posts) {
            const scheduledIso = `${post.scheduledDate}T${post.scheduledTime}:00Z`;

            // Insert into contents table
            const { data: contentRecord } = await supabase
              .from('contents')
              .insert({
                user_id: user.id,
                campaign_id: campaignId,
                title: post.topicTitle,
                topic: topic,
                content: post.mainCaption,
                hook: post.hook,
                call_to_action: post.callToAction,
                hashtags: post.hashtags,
                content_type: 'bulk_campaign',
                tone: tone,
                image_prompt: post.imagePrompt,
                ai_model: campaignResult.aiModel,
                status: autoSchedule ? 'SCHEDULED' : 'READY',
              })
              .select('id')
              .single();

            if (contentRecord) {
              // Save platform variants
              const variantInserts = Object.entries(post.platformVariants).map(([pKey, cap]) => ({
                content_id: contentRecord.id,
                platform: pKey,
                caption: cap,
                hook: post.hook,
                body: cap,
                call_to_action: post.callToAction,
                hashtags: post.hashtags,
                character_count: cap.length,
                status: autoSchedule ? 'SCHEDULED' : 'READY',
              }));

              if (variantInserts.length > 0) {
                await supabase.from('content_variants').insert(variantInserts);
              }

              // If autoSchedule is selected, create scheduled_posts rows
              if (autoSchedule && socialAccountIds.length > 0) {
                for (const accId of socialAccountIds) {
                  await supabase.from('scheduled_posts').insert({
                    user_id: user.id,
                    content_id: contentRecord.id,
                    campaign_id: campaignId,
                    social_account_id: accId,
                    platform: platforms[0] || 'facebook',
                    scheduled_for: scheduledIso,
                    status: 'QUEUED',
                  });
                }
              }
            }
          }
        }
      } catch (dbErr) {
        console.warn('[api/ai/bulk] DB Save notice:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      campaignId,
      data: campaignResult,
    });
  } catch (err: any) {
    console.error('[api/ai/bulk] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Bulk campaign generation failed.' },
      { status: 500 }
    );
  }
}
