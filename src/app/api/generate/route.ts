import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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

        // Call AI Service (Mock for now, or real if key provided)
        // In a real implementation, we'd import the AI service here.

        const suggestions = [
            {
                title: `Post about ${topic}`,
                text: `Here is a suggested post about ${topic} with a ${tone || 'neutral'} tone. #AI #Buffermate`,
                platform: platform || 'all',
            },
            {
                title: `Alternative for ${topic}`,
                text: `Another angle on ${topic}. This one is shorter.`,
                platform: platform || 'all',
            }
        ];

        // Log generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            prompt: JSON.stringify({ topic, tone, length, platform }),
            model: process.env.AI_PROVIDER || 'openai',
            result: suggestions,
        });

        return NextResponse.json({ suggestions });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
