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
    const { post_id, content: directContent, channels: directChannels, attachments: directAttachments } = body;

    let content = directContent || '';
    let attachments: string[] = directAttachments || [];
    let channelsToPublish: string[] = directChannels || [];
    let postId = post_id || `post_${Date.now()}`;

    // If post_id provided, fetch post details from database if available
    if (post_id && user) {
      const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('id', post_id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (post) {
        content = post.content || content;
        attachments = (post.attachments || []).map((a: any) => a.url || a.thumbnail).filter(Boolean);
        if (post.channels && post.channels.length > 0) {
          channelsToPublish = post.channels;
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

    // If specific channels were targeted (e.g. ['x', 'facebook'])
    const targetProviders = channelsToPublish.length > 0
      ? channelsToPublish.map((c) => c.toLowerCase())
      : accounts.length > 0
      ? accounts.map((a) => a.provider.toLowerCase())
      : ['x', 'facebook', 'instagram'];

    for (const provider of targetProviders) {
      const matchedAccount = accounts.find((a) => a.provider?.toLowerCase() === provider);
      
      let decryptedToken = '';
      if (matchedAccount?.access_token_encrypted) {
        try {
          decryptedToken = decrypt(matchedAccount.access_token_encrypted);
        } catch {
          decryptedToken = '';
        }
      }

      const activeProfile = matchedAccount?.provider_user_id || (provider === 'x' ? '@agber120' : 'SocialFlow');

      try {
        const result = await socialManager.publish(
          provider,
          content,
          attachments,
          decryptedToken,
          {
            username: activeProfile,
            pageId: matchedAccount?.page_id,
            pageAccessToken: decryptedToken,
          }
        );

        publishResults.push({
          provider,
          profile: activeProfile,
          status: 'success',
          post_id: result.id,
          url: result.url,
          timestamp: new Date().toISOString(),
        });
      } catch (err: any) {
        publishResults.push({
          provider,
          profile: activeProfile,
          status: 'failed',
          error: err.message || 'Publishing error',
        });
      }
    }

    const now = new Date().toISOString();

    // If post existed in database, update status to posted
    if (post_id && user) {
      await supabase
        .from('posts')
        .update({
          status: 'posted',
          posted_at: now,
        })
        .eq('id', post_id);
    }

    return NextResponse.json({
      success: true,
      post_id: postId,
      status: 'posted',
      published_at: now,
      results: publishResults,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to publish post' }, { status: 500 });
  }
}
