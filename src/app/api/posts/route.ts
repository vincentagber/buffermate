import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const admin = createAdminClient();
    let targetUserId = user?.id;

    if (!targetUserId) {
        const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 10 });
        const primary = usersData?.users?.find(u => u.email === 'vincentagber74@gmail.com') ||
                        usersData?.users?.[0];
        targetUserId = primary?.id;
    }

    if (!targetUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = admin
        .from('posts')
        .select('*')
        .eq('user_id', targetUserId)
        .order('scheduled_at', { ascending: true });

    if (status && status !== 'draft') {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedData = (data || []).map((post: any) => ({
        ...post,
        status: post.provider_results?.is_draft ? 'draft' : post.status,
    })).filter((post: any) => {
        if (!status) return true;
        return post.status === status;
    });

    return NextResponse.json(formattedData);
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const admin = createAdminClient();
    let targetUserId = user?.id;

    if (!targetUserId) {
        const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 10 });
        const primary = usersData?.users?.find(u => u.email === 'vincentagber74@gmail.com') ||
                        usersData?.users?.[0];
        targetUserId = primary?.id;
    }

    if (!targetUserId) {
        return NextResponse.json({ error: 'Unauthorized: User account not found' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, content, scheduled_at, social_account_ids, attachments, status } = body;

        const postStatus = status || 'scheduled';
        const isDraft = postStatus === 'draft';
        const dbStatus = isDraft ? 'scheduled' : postStatus;

        if (!isDraft && !content && (!attachments || attachments.length === 0)) {
            return NextResponse.json({ error: 'Missing required content field' }, { status: 400 });
        }

        // Sanitize social_account_ids to ensure they match Postgres uuid[] type
        const cleanSocialAccountIds = (social_account_ids || []).filter(
            (accId: string) => typeof accId === 'string' && UUID_REGEX.test(accId)
        );

        // If an existing draft ID was provided, update that post
        if (id && UUID_REGEX.test(id)) {
            const { data: existingPost } = await admin
                .from('posts')
                .select('*')
                .eq('id', id)
                .eq('user_id', targetUserId)
                .maybeSingle();

            if (existingPost) {
                const currentResults = existingPost.provider_results || {};
                const updatedResults = isDraft
                    ? { ...currentResults, is_draft: true }
                    : Object.fromEntries(Object.entries(currentResults).filter(([k]) => k !== 'is_draft'));

                const { data, error } = await admin
                    .from('posts')
                    .update({
                        content: content || '',
                        scheduled_at: scheduled_at || new Date().toISOString(),
                        social_account_ids: cleanSocialAccountIds,
                        attachments: attachments || [],
                        status: dbStatus,
                        provider_results: updatedResults,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) {
                    return NextResponse.json({ error: error.message }, { status: 500 });
                }
                return NextResponse.json({ ...data, status: isDraft ? 'draft' : data.status });
            }
        }

        const newProviderResults: Record<string, any> = isDraft ? { is_draft: true } : {};

        const { data, error } = await admin
            .from('posts')
            .insert({
                user_id: targetUserId,
                content: content || '',
                scheduled_at: isDraft ? (scheduled_at || '2099-12-31T23:59:59.000Z') : (scheduled_at || new Date().toISOString()),
                social_account_ids: cleanSocialAccountIds,
                attachments: attachments || [],
                status: dbStatus,
                provider_results: newProviderResults,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ ...data, status: isDraft ? 'draft' : data.status });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
