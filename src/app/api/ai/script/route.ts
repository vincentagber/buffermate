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
        const { topic, tone, duration } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        // Mock OpenAI Script Generation
        // In a real implementation, we would call the OpenAI API here.

        const generatedScript = `
[SCENE START]

**INT. STUDIO - DAY**

HOST (Excited)
Welcome back! Today we're talking about ${topic}. You won't believe how this changes everything.

[CUT TO GRAPHICS]

NARRATOR (V.O.)
${topic} is revolutionizing the industry. Here's why...

[SCENE END]
        `.trim();

        const scenes = [
            {
                scene_number: 1,
                description: "Host introduction in a modern studio setting.",
                dialogue: `Welcome back! Today we're talking about ${topic}. You won't believe how this changes everything.`
            },
            {
                scene_number: 2,
                description: "Motion graphics explaining the core concept.",
                dialogue: `${topic} is revolutionizing the industry. Here's why...`
            }
        ];

        // Log the generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            prompt: JSON.stringify({ topic, tone, duration, type: 'script' }),
            model: 'openai-gpt-4',
            result: { script: generatedScript, scenes },
        });

        return NextResponse.json({
            script: generatedScript,
            scenes: scenes
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
