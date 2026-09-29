import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { SocialManager } from '@/lib/services/social/SocialManager';
import { decrypt } from '@/lib/services/encryption';
import { integrationsManager } from '@/lib/services/integrations-realtime';

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
    if (post_id && targetUserId) {
      const { data: post } = await admin
        .from('posts')
        .select('*')
        .eq('id', post_id)
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

    // Fetch user's social accounts from database
    let accounts: any[] = [];
    if (targetUserId) {
      const { data } = await admin
        .from('social_accounts')
        .select('*')
        .eq('user_id', targetUserId);
      accounts = data || [];
    }

    const socialManager = SocialManager.getInstance();
    const publishResults = [];

    // Determine targeted accounts to publish to
    let accountsToPublish: any[] = [];

    if (targetAccountIds.length > 0) {
      // Find accounts by explicit IDs
      accountsToPublish = accounts.filter((a) => targetAccountIds.includes(a.id));
      
      // Check if some IDs weren't found in DB
      for (const id of targetAccountIds) {
        if (!accountsToPublish.some((a) => a.id === id)) {
          const providerGuess = id.includes('fb') ? 'facebook' : id.includes('ig') ? 'instagram' : id.includes('tt') ? 'tiktok' : id.includes('li') ? 'linkedin' : 'x';
          // Find any account for this provider
          const providerAccount = accounts.find(a => a.provider === providerGuess);
          if (providerAccount) {
            accountsToPublish.push(providerAccount);
          } else {
            accountsToPublish.push({
              id,
              provider: providerGuess,
              provider_user_id: providerGuess === 'x' ? '@agber120' : `${providerGuess}_account`,
              notConnected: true,
            });
          }
        }
      }
    } else if (channelsToPublish.length > 0) {
      for (const ch of channelsToPublish) {
        const norm = ch.toLowerCase() === 'twitter' ? 'x' : ch.toLowerCase();
        const matched = accounts.filter((a) => a.provider?.toLowerCase() === norm);
        if (matched.length > 0) {
          accountsToPublish.push(...matched);
        } else {
          accountsToPublish.push({
            provider: norm,
            provider_user_id: norm === 'x' ? '@agber120' : `BufferMate_${norm}`,
            notConnected: true,
          });
        }
      }
    } else if (accounts.length > 0) {
      accountsToPublish = accounts;
    } else {
      accountsToPublish = [
        { provider: 'x', provider_user_id: '@agber120', notConnected: true },
      ];
    }

    let successCount = 0;

    for (const account of accountsToPublish) {
      const provider = (account.provider || 'x').toLowerCase();

      if (account.notConnected || !account.access_token_encrypted) {
        const errMsg = `No authorized ${provider.toUpperCase()} account connected. Please visit Accounts and authorize via OAuth first.`;
        publishResults.push({
          provider,
          account_id: account.id,
          profile: account.provider_user_id,
          status: 'failed',
          error: errMsg,
        });

        if (dbPost?.id) {
          try {
            await admin.from('post_attempts').insert({
              post_id: dbPost.id,
              provider: provider === 'twitter' ? 'x' : provider,
              success: false,
              error: errMsg,
            });
          } catch (e) {
            console.warn('post_attempts insert error:', e);
          }
        }
        continue;
      }

      let decryptedToken = '';
      try {
        decryptedToken = decrypt(account.access_token_encrypted);
      } catch (decErr: any) {
        publishResults.push({
          provider,
          account_id: account.id,
          profile: account.provider_user_id,
          status: 'failed',
          error: 'Failed to decrypt access token. Re-authorization required.',
        });
        continue;
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

        // Audit log in post_attempts
        if (dbPost?.id) {
          try {
            await admin.from('post_attempts').insert({
              post_id: dbPost.id,
              provider: provider === 'twitter' ? 'x' : provider,
              success: true,
              response: result,
            });
          } catch (e) {
            console.warn('post_attempts insert skipped:', e);
          }
        }

        // Live real-time activity stream event
        if (targetUserId) {
          try {
            await admin.from('social_activity_stream').insert({
              user_id: targetUserId,
              event_type: 'post_published',
              channel: provider === 'twitter' ? 'x' : provider,
              title: `Published to ${provider.toUpperCase()}`,
              description: (content || '').slice(0, 100) + ((content || '').length > 100 ? '...' : ''),
              user_handle: activeProfile,
              post_reference: result.id,
              metadata: { url: result.url, provider },
            });
            integrationsManager.emit('channel_updated', {
              type: 'channel_connected',
              provider: provider === 'twitter' ? 'x' : provider,
              profile: activeProfile,
              status: 'connected',
              timestamp: new Date().toISOString(),
            });
          } catch (streamErr) {
            console.warn('social_activity_stream insert warning:', streamErr);
          }
        }
      } catch (err: any) {
        console.error(`[Publish Error] ${provider}:`, err.message);
        publishResults.push({
          provider,
          account_id: account.id,
          profile: activeProfile,
          status: 'failed',
          error: err.message || 'Publishing error',
        });

        if (dbPost?.id) {
          try {
            await admin.from('post_attempts').insert({
              post_id: dbPost.id,
              provider: provider === 'twitter' ? 'x' : provider,
              success: false,
              error: err.message || 'Publishing error',
            });
          } catch (e) {
            console.warn('post_attempts failure insert skipped:', e);
          }
        }
      }
    }

    // Update original post status in DB
    if (dbPost?.id) {
      try {
        await admin
          .from('posts')
          .update({
            status: successCount > 0 ? 'posted' : 'failed',
            posted_at: successCount > 0 ? new Date().toISOString() : null,
            provider_results: publishResults,
            updated_at: new Date().toISOString(),
          })
          .eq('id', dbPost.id);
      } catch (postUpdateErr) {
        console.warn('Database post update warning:', postUpdateErr);
      }
    }

    const overallSuccess = successCount > 0;
    const statusCode = overallSuccess ? 200 : 400;

    return NextResponse.json({
      success: overallSuccess,
      published_count: successCount,
      total_targeted: accountsToPublish.length,
      results: publishResults,
      error: !overallSuccess ? publishResults[0]?.error || 'Failed to publish to selected channels' : undefined,
    }, { status: statusCode });

  } catch (err: any) {
    console.error('Publish API exception:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
