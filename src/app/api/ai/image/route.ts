import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { GeminiService } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prompt, style = 'photorealistic', aspectRatio = '1:1', contentId } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Image prompt is required.' }, { status: 400 });
    }

    const result = await GeminiService.generateImage({
      prompt: prompt.trim(),
      style,
      aspectRatio,
    });

    // Update content record if contentId provided
    if (contentId) {
      try {
        await supabase
          .from('contents')
          .update({
            image_url: result.imageUrl,
            image_prompt: result.prompt,
            updated_at: new Date().toISOString(),
          })
          .eq('id', contentId)
          .eq('user_id', user.id);
      } catch (err) {
        console.warn('[api/ai/image] Updating content record notice:', err);
      }
    }

    // Log AI generation
    try {
      await supabase.from('ai_generations').insert({
        user_id: user.id,
        prompt: JSON.stringify({ prompt, style, aspectRatio, type: 'image' }),
        model: result.model,
        result: { image_url: result.imageUrl, prompt: result.prompt },
      });
    } catch (logErr) {
      // Ignored if table not created
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      image_url: result.imageUrl, // backwards compatibility
      prompt: result.prompt,
      model: result.model,
      status: 'completed',
    });
  } catch (err: any) {
    console.error('[api/ai/image] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Image generation failed.' },
      { status: 500 }
    );
  }
}
