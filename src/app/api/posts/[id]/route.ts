import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

async function resolveTargetUser() {
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

    return { admin, targetUserId };
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { admin, targetUserId } = await resolveTargetUser();

    if (!targetUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await admin
        .from('posts')
        .select('*')
        .eq('id', id)
        .eq('user_id', targetUserId)
        .maybeSingle();

    if (error || !data) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
        ...data,
        status: data.provider_results?.is_draft ? 'draft' : data.status,
    });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { admin, targetUserId } = await resolveTargetUser();

    if (!targetUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const updateData: Record<string, any> = {};

        if (body.content !== undefined) updateData.content = body.content;
        if (body.scheduled_at !== undefined) updateData.scheduled_at = body.scheduled_at;
        
        if (body.status !== undefined) {
            if (body.status === 'draft') {
                updateData.status = 'scheduled';
                updateData.provider_results = { ...(body.provider_results || {}), is_draft: true };
            } else {
                updateData.status = body.status;
                // If moving away from draft, remove is_draft flag
                const { data: currentPost } = await admin.from('posts').select('provider_results').eq('id', id).maybeSingle();
                const curResults = currentPost?.provider_results || {};
                const cleanedResults = Object.fromEntries(Object.entries(curResults).filter(([k]) => k !== 'is_draft'));
                updateData.provider_results = { ...cleanedResults, ...(body.provider_results || {}) };
            }
        }
        
        if (body.social_account_ids !== undefined) updateData.social_account_ids = body.social_account_ids;
        if (body.attachments !== undefined) updateData.attachments = body.attachments;
        if (body.status === 'posted' && !body.posted_at) {
            updateData.posted_at = new Date().toISOString();
        }
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await admin
            .from('posts')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', targetUserId)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const isDraft = data.provider_results?.is_draft;
        return NextResponse.json({ ...data, status: isDraft ? 'draft' : data.status });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { admin, targetUserId } = await resolveTargetUser();

    if (!targetUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { error } = await admin
            .from('posts')
            .delete()
            .eq('id', id)
            .eq('user_id', targetUserId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Post deleted successfully' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to delete post' }, { status: 500 });
    }
}
