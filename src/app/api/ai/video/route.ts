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
        const { script, style, voice } = body;

        if (!script) {
            return NextResponse.json({ error: 'Script is required' }, { status: 400 });
        }

        // Mock Video Generation (XAI / Video AI)
        // Simulating a processing delay and returning a mock video URL

        const mockVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; // Placeholder
        const mockThumbnailUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";

        // Log the generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            prompt: JSON.stringify({ script_snippet: script.substring(0, 50), style, voice, type: 'video' }),
            model: 'xai-video-gen-1',
            result: { video_url: mockVideoUrl, thumbnail_url: mockThumbnailUrl },
        });

        return NextResponse.json({
            video_url: mockVideoUrl,
            thumbnail_url: mockThumbnailUrl,
            status: 'completed',
            duration: '00:30'
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
