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
        const { topic } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const aiService = AIService.getInstance();
        const trends = await aiService.generateTrendingIdeas(topic);

        // Log the generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            prompt: JSON.stringify({ topic, type: 'trends' }),
            model: process.env.OPENAI_API_KEY ? 'openai-gpt-3.5-turbo' : 'mock-trends',
            result: trends,
        });

        return NextResponse.json({ trends });

    } catch (err: any) {
        console.error('Trend generation error:', err);
        return NextResponse.json({ error: err.message || 'Failed to generate trends' }, { status: 500 });
    }
}
