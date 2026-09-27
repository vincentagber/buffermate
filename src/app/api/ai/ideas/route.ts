import { NextResponse } from 'next/server';
import { GeminiService } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, targetAudience, count = 5, platform = 'all' } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const ideas = await GeminiService.generateContentIdeas({
      topic: topic.trim(),
      targetAudience,
      count: Number(count) || 5,
      platform,
    });

    return NextResponse.json({
      success: true,
      data: ideas,
    });
  } catch (err: any) {
    console.error('[api/ai/ideas] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate ideas.' },
      { status: 500 }
    );
  }
}
