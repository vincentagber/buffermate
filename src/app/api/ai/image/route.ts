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
        const { prompt, style, ratio } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Mock Image Generation (MetaAI)

        const mockImageUrl = `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/450`;

        // Log the generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            prompt: JSON.stringify({ prompt, style, ratio, type: 'image' }),
            model: 'meta-ai-image-gen',
            result: { image_url: mockImageUrl },
        });

        return NextResponse.json({
            image_url: mockImageUrl,
            status: 'completed'
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
