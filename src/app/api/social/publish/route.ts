import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { SocialManager } from '@/lib/services/social/SocialManager';
import { decrypt } from '@/lib/services/encryption';
import { integrationsManager } from '@/lib/services/integrations-realtime';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const body = await request.json();
    const { 
      post_id, 
      content: directContent, 
      channels: directChannels, 
      social_account_ids: directAccountIds, 
      account_ids, 
      attachments: directAttachments 
    } = body;

    let content = directContent || '';
    let attachments: string[] = directAttachments || [];
    let channelsToPublish: string[] = directChannels || [];
    let targetAccountIds: string[] = directAccountIds || account_ids || [];
    let postId = post_id || `post_${Date.now()}`;

    // If post_id provided, fetch post details from database if available
    let dbPost: any = null;
    if (post_id && user) {
      const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('id', post_id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (post) {
        dbPost = post;
        content = post.content || content;
        attachments = (post.attachments || []).map((a: any) => (typeof a === 'string' ? a : a.url || a.thumbnail)).filter(Boolean);
        if (post.social_account_ids && post.social_account_ids.length > 0 && targetAccountIds.length === 0) {
          targetAccountIds = post.social_account_ids;
        }
      }
    }

    if (!content && attachments.length === 0) {
      return NextResponse.json({ error: 'Content or media attachment is required' }, { status: 400 });
    }

    // Fetch user's social accounts if authenticated
    let accounts: any[] = [];
    if (user) {
      const { data } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', user.id);
      accounts = data || [];
    }

    const socialManager = SocialManager.getInstance();
    const publishResults = [];

    // Determine targeted accounts to publish to
    let accountsToPublish: any[] = [];

    if (targetAccountIds.length > 0) {
      // Find accounts by explicit IDs
      accountsToPublish = accounts.filter((a) => targetAccountIds.includes(a.id));
      // If some IDs weren't found in DB (e.g. mock IDs in demo mode), construct fallback entries
      for (const id of targetAccountIds) {
        if (!accountsToPublish.some((a) => a.id === id)) {
          const providerGuess = id.includes('fb') ? 'facebook' : id.includes('ig') ? 'instagram' : id.includes('tt') ? 'tiktok' : id.includes('li') ? 'linkedin' : 'x';
          accountsToPublish.push({
            id,
            provider: providerGuess,
            provider_user_id: `Account_${id}`,
          });
        }
      }
    } else if (channelsToPublish.length > 0) {
      // Match by channel/provider name
      for (const ch of channelsToPublish) {
        const norm = ch.toLowerCase() === 'twitter' ? 'x' : ch.toLowerCase();
        const matched = accounts.filter((a) => a.provider?.toLowerCase() === norm);
        if (matched.length > 0) {
          accountsToPublish.push(...matched);
        } else {
          accountsToPublish.push({
            provider: norm,
            provider_user_id: norm === 'x' ? '@agber120' : `BufferMate_${norm}`,
          });
        }
      }
    } else if (accounts.length > 0) {
      accountsToPublish = accounts;
    } else {
      accountsToPublish = [
        { provider: 'x', provider_user_id: '@agber120' },
        { provider: 'facebook', provider_user_id: 'BufferMate Growth Page' },
        { provider: 'instagram', provider_user_id: '@buffermate.official' },
      ];
    }

    let successCount = 0;

    for (const account of accountsToPublish) {
      const provider = (account.provider || 'x').toLowerCase();
      let decryptedToken = '';

      if (account.access_token_encrypted) {
        try {
          decryptedToken = decrypt(account.access_token_encrypted);
        } catch {
          decryptedToken = `oauth_token_${provider}_${Date.now()}`;
        }
      } else {
        decryptedToken = `oauth_token_${provider}_${Date.now()}`;
      }

      const activeProfile = account.provider_user_id || (provider === 'x' ? '@agber120' : 'BufferMate');
      const pageId = account.meta?.page_id || account.provider_user_id;

      try {
        const result = await socialManager.publish(
          provider,
          content,
          attachments,
          decryptedToken,
          {
            username: activeProfile,
            pageId,
            pageAccessToken: decryptedToken,
          }
        );

        publishResults.push({
          provider,
          account_id: account.id,
          profile: activeProfile,
          status: 'success',
          post_id: result.id,
          url: result.url,
          timestamp: new Date().toISOString(),
        });
        successCount++;

        // Audit log in post_attempts if valid UUID post_id
        if (dbPost?.id) {
          try {
            await supabase.from('post_attempts').insert({
              post_id: dbPost.id,
              provider,
              success: true,
              response: result,
            });
          } catch (e) {
            console.warn('post_attempts insert skipped:', e);
          }
        }
      } catch (err: any) {
        publishResults.push({
          provider,
          account_id: account.id,
          profile: activeProfile,
          status: 'failed',
          error: err.message || 'Publishing error',
        });

        if (dbPost?.id) {
          try {
            await supabase.from('post_attempts').insert({
              post_id: dbPost.id,
              provider,
              success: false,
              error: err.message || 'Publishing error',
            });
          } catch (e) {
            console.warn('post_attempts failure insert skipped:', e);
          }
        }
      }
    }

    const now = new Date().toISOString();
    const finalStatus = successCount > 0 ? 'posted' : 'failed';

    // If post existed in database, update status and provider_results
    if (dbPost?.id && user) {
      const resultsMap: Record<string, any> = {};
      for (const r of publishResults) {
        resultsMap[r.profile || r.provider] = r;
      }

      await supabase
        .from('posts')
        .update({
          status: finalStatus,
          posted_at: now,
          provider_results: resultsMap,
        })
        .eq('id', dbPost.id);
    }

    return NextResponse.json({
      success: successCount > 0,
      post_id: postId,
      status: finalStatus,
      published_at: now,
      results: publishResults,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to publish post' }, { status: 500 });
  }
}
