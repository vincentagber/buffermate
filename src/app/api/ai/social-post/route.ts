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
      topic,
      contentType = 'social_post',
      targetAudience = 'Business owners & creators',
      tone = 'professional but engaging',
      platform = 'all',
      language = 'English',
      desiredLength = 'medium',
      callToAction = 'Share your thoughts in the comments!',
      keywords = [],
      brandInfo,
      additionalInstructions = '',
      autoSave = true,
    } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic or content idea is required.' },
        { status: 400 }
      );
    }

    // Call server-side Gemini service
    const generated = await GeminiService.generateSocialPost({
      topic: topic.trim(),
      contentType,
      targetAudience,
      tone,
      platform,
      language,
      desiredLength,
      callToAction,
      keywords,
      brandInfo,
      additionalInstructions,
    });

    let savedContentId: string | null = null;

    // Persist to contents and content_variants tables if user is logged in
    if (user && autoSave) {
      try {
        const { data: contentRecord, error: contentError } = await supabase
          .from('contents')
          .insert({
            user_id: user.id,
            title: topic.slice(0, 120),
            topic: topic,
            content: generated.mainCaption,
            hook: generated.hook,
            call_to_action: generated.callToAction,
            hashtags: generated.hashtags,
            content_type: contentType,
            tone: tone,
            language: language,
            platform: platform,
            image_prompt: generated.imagePrompt,
            ai_model: generated.aiModel,
            status: 'READY',
          })
          .select('id')
          .single();

        if (!contentError && contentRecord) {
          savedContentId = contentRecord.id;

          // Save platform variants
          const variantInserts = Object.entries(generated.platformVariants).map(
            ([pKey, variant]) => ({
              content_id: contentRecord.id,
              platform: pKey,
              caption: variant.caption,
              hook: variant.hook,
              body: variant.body,
              call_to_action: variant.callToAction,
              hashtags: variant.hashtags,
              character_count: variant.characterCount,
              status: 'READY',
            })
          );

          if (variantInserts.length > 0) {
            await supabase.from('content_variants').insert(variantInserts);
          }
        }
      } catch (dbErr) {
        console.warn('[api/ai/social-post] Optional database persistence notice:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      contentId: savedContentId,
      data: generated,
    });
  } catch (err: any) {
    console.error('[api/ai/social-post] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate social post.' },
      { status: 500 }
    );
  }
}
