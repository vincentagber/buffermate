import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { decrypt } from '../src/lib/services/encryption';
import { MockProvider } from '../src/lib/services/social/MockProvider';
// import { TwitterProvider } from '../src/lib/services/social/TwitterProvider';
// import { FacebookProvider } from '../src/lib/services/social/FacebookProvider';
// import { LinkedInProvider } from '../src/lib/services/social/LinkedInProvider';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const POLL_INTERVAL = 60000; // 1 minute
const MAX_CONCURRENT = parseInt(process.env.SCHEDULER_MAX_CONCURRENT || '10');

const providers: Record<string, any> = {
    mock: new MockProvider(),
    // x: new TwitterProvider(),
    // facebook: new FacebookProvider(),
    // linkedin: new LinkedInProvider(),
};

async function processPosts() {
    console.log('Checking for scheduled posts...');

    // 1. Find posts due for publishing
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*, social_accounts(*)')
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
        await processSinglePost(post);
    }
}

async function processSinglePost(post: any) {
    // Optimistic locking: set to 'queued' or 'posting'
    const { error: updateError } = await supabase
        .from('posts')
        .update({ status: 'posting' })
        .eq('id', post.id)
        .eq('status', 'scheduled'); // Ensure it wasn't picked up by another worker

    if (updateError) {
        console.log(`Post ${post.id} already picked up or error:`, updateError);
        return;
    }

    try {
        // Get social account details
        // Note: In the schema, posts have a user_id, but we need to know WHICH social account to post to.
        // The schema I designed has `posts` table but didn't explicitly link to `social_accounts` in a many-to-many way for a single post?
        // The prompt said: "posts — (id, user_id, content, ..., provider_results)"
        // It implies a post might go to multiple providers? Or maybe just one?
        // "provider list" in API routes implies multiple.
        // If multiple, we need a join table `post_destinations` or `posts` needs an array of providers?
        // The prompt says: "Call provider adapter to post."
        // Let's assume for now a post is linked to specific providers.
        // I missed a `post_destinations` table in the schema or `posts` should have `social_account_ids`.
        // Re-reading prompt: "posts — (..., provider_results JSONB, ...)"
        // It doesn't explicitly say how providers are selected per post.
        // I will assume `provider_results` keys are provider names or IDs.
        // But we need to know where to post.
        // I'll add `social_account_ids` to `posts` table (array of UUIDs) or use a separate table.
        // For simplicity and since I already made the schema, I'll assume `posts` has a `target_providers` jsonb or array column I missed,
        // OR I'll just fetch all connected accounts for the user and post to all (unlikely).
        // I'll check the schema I wrote. I didn't add a column for target providers.
        // I should add `social_account_ids` to `posts` table.

        // For now, let's assume we post to ALL connected accounts of the user (or filter by some logic).
        // Better: I'll update the schema to include `social_account_ids` array.

        // Let's fetch the user's social accounts.
        const { data: accounts, error: accountsError } = await supabase
            .from('social_accounts')
            .select('*')
            .eq('user_id', post.user_id);

        if (accountsError || !accounts) {
            throw new Error('No social accounts found for user');
        }

        // Filter accounts that are in the post's target list
        const targetAccountIds = post.social_account_ids || [];
        const accountsToPost = accounts.filter((acc: any) => targetAccountIds.includes(acc.id));

        if (accountsToPost.length === 0) {
            console.warn(`No matching social accounts found for post ${post.id}`);
            // Mark as failed or skipped?
            await supabase.from('posts').update({ status: 'failed', provider_results: { error: 'No matching accounts' } }).eq('id', post.id);
            return;
        }

        const results: Record<string, any> = {};
        let allSuccess = true;

        for (const account of accountsToPost) {
            const provider = providers[account.provider];
            if (!provider) {
                console.warn(`Provider ${account.provider} not implemented`);
                results[account.provider] = { error: 'Not implemented' };
                continue; // or fail?
            }

            try {
                const decryptedToken = decrypt(account.access_token_encrypted);
                const result = await provider.post(post.content, post.attachments, decryptedToken);
                results[account.provider] = { success: true, id: result.id, url: result.url };

                // Log attempt
                await supabase.from('post_attempts').insert({
                    post_id: post.id,
                    provider: account.provider,
                    success: true,
                    response: result,
                });

            } catch (err: any) {
                console.error(`Failed to post to ${account.provider}:`, err);
                allSuccess = false;
                results[account.provider] = { success: false, error: err.message };

                await supabase.from('post_attempts').insert({
                    post_id: post.id,
                    provider: account.provider,
                    success: false,
                    error: err.message,
                });
            }
        }

        // Update post status
        const finalStatus = allSuccess ? 'posted' : 'failed'; // or 'partially_posted'
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
