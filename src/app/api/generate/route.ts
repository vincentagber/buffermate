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
        const { topic, tone, length, platform } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const aiService = AIService.getInstance();
        const suggestions = await aiService.generateText({
            topic,
            tone,
            platform,
            length
        });

        // Log generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            prompt: JSON.stringify({ topic, tone, length, platform }),
            model: process.env.OPENAI_API_KEY ? 'openai' : 'mock',
            result: suggestions,
        });

        return NextResponse.json({ suggestions });

    } catch (err: any) {
        console.error('Generation error:', err);
        return NextResponse.json({ error: err.message || 'Failed to generate content' }, { status: 500 });
    }
}
