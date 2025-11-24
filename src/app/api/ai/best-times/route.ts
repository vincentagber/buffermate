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
        const times = await aiService.generateBestTimes(topic);

        // Log the generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            prompt: JSON.stringify({ topic, type: 'best_times' }),
            model: process.env.OPENAI_API_KEY ? 'openai-gpt-3.5-turbo' : 'mock-best-times',
            result: times,
        });

        return NextResponse.json({ times });

    } catch (err: any) {
        console.error('Best times generation error:', err);
        return NextResponse.json({ error: err.message || 'Failed to generate best times' }, { status: 500 });
    }
}
