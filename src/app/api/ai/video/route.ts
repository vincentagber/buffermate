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
        const { script, style, voice } = body;

        if (!script) {
            return NextResponse.json({ error: 'Script is required' }, { status: 400 });
        }

        const aiService = AIService.getInstance();
        const result = await aiService.generateVideo({
            script,
            style,
            voice
        });

        // Log the generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            prompt: JSON.stringify({ script_snippet: script.substring(0, 50), style, voice, type: 'video' }),
            model: 'mock-video', // Always mock for now as OpenAI doesn't have video API
            result: result,
        });

        return NextResponse.json({
            ...result,
            status: 'completed'
        });

    } catch (err: any) {
        console.error('Video generation error:', err);
        return NextResponse.json({ error: err.message || 'Failed to generate video' }, { status: 500 });
    }
}
