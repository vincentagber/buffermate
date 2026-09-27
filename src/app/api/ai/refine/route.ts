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
    const {
      content,
      mode = 'improve',
      tone,
      language,
      instruction,
    } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required for refinement.' }, { status: 400 });
    }

    const validModes = ['improve', 'shorten', 'expand', 'tone', 'rewrite', 'translate'];
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: `Invalid mode. Must be one of: ${validModes.join(', ')}` },
        { status: 400 }
      );
    }

    const refined = await GeminiService.rewriteContent({
      content: content.trim(),
      mode,
      tone,
      language,
      instruction,
    });

    return NextResponse.json({
      success: true,
      data: refined,
    });
  } catch (err: any) {
    console.error('[api/ai/refine] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to refine content.' },
      { status: 500 }
    );
  }
}
