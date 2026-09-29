import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { SocialManager } from '../src/lib/services/social/SocialManager';

import { decrypt } from '../src/lib/services/encryption';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in worker');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const POLL_INTERVAL = 60000; // 1 minute
const MAX_CONCURRENT = parseInt(process.env.SCHEDULER_MAX_CONCURRENT || '10');

const socialManager = SocialManager.getInstance();

async function processPosts() {
    console.log('Checking for scheduled posts...');

    // 1. Find posts due for publishing
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'scheduled')
        .lte('scheduled_at', new Date().toISOString())
        .limit(MAX_CONCURRENT);

    if (error) {
        console.error('Error fetching posts:', error);
        return;
    }

    if (!posts || posts.length === 0) {
        console.log('No posts to schedule.');
        return;
    }

    console.log(`Found ${posts.length} posts to process.`);

    for (const post of posts) {
        if (post.provider_results?.is_draft) {
            continue;
        }
        await processSinglePost(post);
    }
}

async function processSinglePost(post: any) {
    // Optimistic locking: set to 'posting'
    const { error: updateError } = await supabase
        .from('posts')
        .update({ status: 'posting' })
        .eq('id', post.id)
        .eq('status', 'scheduled');

    if (updateError) {
        console.log(`Post ${post.id} already picked up or error:`, updateError);
        return;
    }

    try {
        // Fetch user's connected social accounts
        const { data: accounts, error: accountsError } = await supabase
            .from('social_accounts')
            .select('*')
            .eq('user_id', post.user_id);

        if (accountsError || !accounts) {
            throw new Error('No social accounts found for user');
        }

        // Filter accounts that are in the post's target list
        const targetAccountIds = post.social_account_ids || [];
        const accountsToPost = targetAccountIds.length > 0
            ? accounts.filter((acc: any) => targetAccountIds.includes(acc.id))
            : accounts;

        if (accountsToPost.length === 0) {
            console.warn(`No matching social accounts found for post ${post.id}`);
            await supabase.from('posts').update({ 
                status: 'failed', 
                provider_results: { error: 'No matching social accounts configured' } 
            }).eq('id', post.id);
            return;
        }

        // Extract attachment URLs
        const attachments: string[] = Array.isArray(post.attachments)
            ? post.attachments.map((a: any) => (typeof a === 'string' ? a : a.url || a.thumbnail)).filter(Boolean)
            : [];

        const results: Record<string, any> = {};
        let successCount = 0;

        for (const account of accountsToPost) {
            const providerName = account.provider.toLowerCase();
            let decryptedToken = '';

            if (account.access_token_encrypted) {
                try {
                    decryptedToken = decrypt(account.access_token_encrypted);
                } catch (err: any) {
                    console.warn(`Failed to decrypt token for ${account.provider} (${account.provider_user_id}):`, err.message);
                    decryptedToken = `oauth_token_${providerName}_${Date.now()}`;
                }
            } else {
                decryptedToken = `oauth_token_${providerName}_${Date.now()}`;
            }

            try {
                const result = await socialManager.publish(
                    providerName,
                    post.content,
                    attachments,
                    decryptedToken,
                    {
                        username: account.provider_user_id,
                        pageId: account.meta?.page_id || account.provider_user_id,
                        pageAccessToken: decryptedToken,
                    }
                );

                results[account.provider_user_id || providerName] = {
                    provider: providerName,
                    success: true,
                    id: result.id,
                    url: result.url,
                    published_at: new Date().toISOString(),
                };
                successCount++;

                // Log attempt in audit table
                try {
                    await supabase.from('post_attempts').insert({
                        post_id: post.id,
                        provider: account.provider,
                        success: true,
                        response: result,
                    });

                    await supabase.from('social_activity_stream').insert({
                        user_id: post.user_id,
                        event_type: 'post_published',
                        channel: account.provider === 'twitter' ? 'x' : account.provider,
                        title: `Scheduled post published to ${account.provider.toUpperCase()}`,
                        description: (post.content || '').slice(0, 100) + ((post.content || '').length > 100 ? '...' : ''),
                        user_handle: account.provider_user_id,
                        post_reference: result.id,
                        metadata: { url: result.url, provider: account.provider },
                    });
                } catch (logErr) {
                    console.warn('Failed to insert post_attempt or stream:', logErr);
                }

            } catch (err: any) {
                console.error(`Failed to post to ${account.provider}:`, err);
                results[account.provider_user_id || providerName] = {
                    provider: providerName,
                    success: false,
                    error: err.message || 'Publishing error',
                };

                try {
                    await supabase.from('post_attempts').insert({
                        post_id: post.id,
                        provider: account.provider,
                        success: false,
                        error: err.message || 'Unknown error',
                    });
                } catch (logErr) {
                    console.warn('Failed to insert failed post_attempt:', logErr);
                }
            }
        }

        // Determine final status
        const finalStatus = successCount > 0 ? 'posted' : 'failed';
        await supabase
            .from('posts')
            .update({
                status: finalStatus,
                posted_at: new Date().toISOString(),
                provider_results: results,
            })
            .eq('id', post.id);

    } catch (err: any) {
        console.error(`Critical error processing post ${post.id}:`, err);
        await supabase
            .from('posts')
            .update({ status: 'failed', provider_results: { error: err.message } })
            .eq('id', post.id);
    }
}

function startWorker() {
    console.log('Worker started.');
    setInterval(processPosts, POLL_INTERVAL);
    processPosts(); // Run immediately
}

startWorker();
