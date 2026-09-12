import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: true });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, content, scheduled_at, social_account_ids, attachments, status } = body;

        const postStatus = status || 'scheduled';

        if (postStatus !== 'draft' && !content) {
            return NextResponse.json({ error: 'Missing required content field' }, { status: 400 });
        }

        // If an existing draft ID was provided, update that post
        if (id) {
            const { data: existingPost } = await supabase
                .from('posts')
                .select('id')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (existingPost) {
                const { data, error } = await supabase
                    .from('posts')
                    .update({
                        content: content || '',
                        scheduled_at: scheduled_at || new Date().toISOString(),
                        social_account_ids: social_account_ids || [],
                        attachments: attachments || [],
                        status: postStatus,
                    })
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .select()
                    .single();

                if (error) {
                    return NextResponse.json({ error: error.message }, { status: 500 });
                }
                return NextResponse.json(data);
            }
        }

        const { data, error } = await supabase
            .from('posts')
            .insert({
                user_id: user.id,
                content: content || '',
                scheduled_at: scheduled_at || new Date().toISOString(),
                social_account_ids: social_account_ids || [], // Array of UUIDs
                attachments: attachments || [],
                status: postStatus,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
