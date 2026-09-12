import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { SocialManager } from '@/lib/services/social/SocialManager';
import { decrypt } from '@/lib/services/encryption';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { post_id } = body;

        if (!post_id) {
            return NextResponse.json({ error: 'post_id is required' }, { status: 400 });
        }

        // Fetch post
        const { data: post, error: postError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', post_id)
            .eq('user_id', user.id)
            .single();

        if (postError || !post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Fetch user's social accounts
        const { data: accounts } = await supabase
            .from('social_accounts')
            .select('*')
            .eq('user_id', user.id);

        const targetAccountIds: string[] = post.social_account_ids || [];
        const accountsToPublish = (accounts || []).filter((acc: any) =>
            targetAccountIds.length === 0 || targetAccountIds.includes(acc.id)
        );

        const socialManager = SocialManager.getInstance();
        const publishResults = [];

        for (const account of accountsToPublish) {
            try {
                let decryptedToken = 'mock_token';
                if (account.access_token_encrypted) {
                    try {
                        decryptedToken = decrypt(account.access_token_encrypted);
                    } catch {
                        decryptedToken = 'token';
                    }
                }

                const attachments = (post.attachments || []).map((a: any) => a.url || a.thumbnail).filter(Boolean);
                const result = await socialManager.publish(account.provider, post.content, attachments, decryptedToken);

                publishResults.push({
                    account_id: account.id,
                    provider: account.provider,
                    status: 'success',
                    post_id: result.id,
                    url: result.url,
                });
            } catch (err: any) {
                publishResults.push({
                    account_id: account.id,
                    provider: account.provider,
                    status: 'failed',
                    error: err.message,
                });
            }
        }

        // Mark post as posted
        const now = new Date().toISOString();
        await supabase
            .from('posts')
            .update({
                status: 'posted',
                posted_at: now,
            })
            .eq('id', post.id);

        return NextResponse.json({
            success: true,
            post_id: post.id,
            status: 'posted',
            published_at: now,
            results: publishResults,
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to publish post' }, { status: 500 });
    }
}
