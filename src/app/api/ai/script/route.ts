import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/service';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { topic, tone, duration } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const aiService = AIService.getInstance();
        const result = await aiService.generateScript({
            topic,
            tone,
            duration
        });

        // Log the generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            prompt: JSON.stringify({ topic, tone, duration, type: 'script' }),
            model: process.env.OPENAI_API_KEY ? 'openai-gpt-4' : 'mock-script',
            result: result,
        });

        return NextResponse.json(result);

    } catch (err: any) {
        console.error('Script generation error:', err);
        return NextResponse.json({ error: err.message || 'Failed to generate script' }, { status: 500 });
    }
}
