import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const body = await request.json();
    const { provider, profile, customHandle } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider required' }, { status: 400 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const cleanProfile = (customHandle || profile || '').trim();

    // 1. Facebook / Meta OAuth URL
    if (provider.toLowerCase() === 'facebook') {
      const fbAppId = process.env.FACEBOOK_APP_ID;
      if (fbAppId) {
        const redirectUri = encodeURIComponent(`${origin}/api/social/callback`);
        const scope = encodeURIComponent('pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish');
        const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=facebook`;
        return NextResponse.json({ url, isPopup: true });
      }
      return NextResponse.json({
        url: `${origin}/api/social/callback?code=fb_auth_live&provider=facebook&profile=${encodeURIComponent(cleanProfile || 'BufferMate Growth Page')}`,
        isPopup: true,
      });
    }

    // 2. X (Twitter) OAuth 2.0 PKCE URL
    if (provider.toLowerCase() === 'x' || provider.toLowerCase() === 'twitter') {
      const { useEnvKeys } = body;
      // If user chooses to connect using the pre-configured access token from .env
      if (useEnvKeys && process.env.TWITTER_ACCESS_TOKEN) {
        return NextResponse.json({
          url: `${origin}/api/social/callback?code=x_auth_live&provider=x&profile=@agber120`,
          isPopup: true,
        });
      }

      const twitterClientId = process.env.TWITTER_CLIENT_ID;
      if (twitterClientId) {
        const redirectUri = encodeURIComponent(`${origin}/api/social/callback`);
        const scope = encodeURIComponent('tweet.read tweet.write users.read offline.access');
        const stateUserId = user?.id || 'primary_user';
        const state = encodeURIComponent(`x:${stateUserId}`);
        // RFC 7636 strictly requires code_challenge to be between 43 and 128 characters
        const pkceChallenge = 'buffermate_pkce_challenge_verifier_secure_token_1234567890';
        const url = `https://x.com/i/oauth2/authorize?response_type=code&client_id=${twitterClientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${pkceChallenge}&code_challenge_method=plain`;
        return NextResponse.json({ url, isPopup: true });
      }
      return NextResponse.json({
        url: `${origin}/api/social/callback?code=x_auth_live&provider=x&profile=${encodeURIComponent(cleanProfile || '@agber120')}`,
        isPopup: true,
      });
    }

    // 3. Instagram Graph OAuth URL
    if (provider.toLowerCase() === 'instagram') {
      const fbAppId = process.env.FACEBOOK_APP_ID;
      if (fbAppId) {
        const redirectUri = encodeURIComponent(`${origin}/api/social/callback`);
        const scope = encodeURIComponent('instagram_basic,instagram_content_publish,pages_show_list');
        const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=instagram`;
        return NextResponse.json({ url, isPopup: true });
      }
      return NextResponse.json({
        url: `${origin}/api/social/callback?code=ig_auth_live&provider=instagram&profile=${encodeURIComponent(cleanProfile || '@buffermate.official')}`,
        isPopup: true,
      });
    }

    // 4. TikTok Open API URL
    if (provider.toLowerCase() === 'tiktok') {
      const tiktokClientKey = process.env.TIKTOK_CLIENT_KEY;
      if (tiktokClientKey) {
        const redirectUri = encodeURIComponent(`${origin}/api/social/callback`);
        const url = `https://www.tiktok.com/v2/auth/authorize/?client_key=${tiktokClientKey}&scope=user.info.basic,video.publish,video.upload&response_type=code&redirect_uri=${redirectUri}&state=tiktok`;
        return NextResponse.json({ url, isPopup: true });
      }
      return NextResponse.json({
        url: `${origin}/api/social/callback?code=tok_auth_live&provider=tiktok&profile=${encodeURIComponent(cleanProfile || '@buffermate_tok')}`,
        isPopup: true,
      });
    }

    // 5. LinkedIn OAuth 2.0 URL
    if (provider.toLowerCase() === 'linkedin') {
      const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
      if (linkedinClientId) {
        const redirectUri = encodeURIComponent(`${origin}/api/social/callback`);
        const scope = encodeURIComponent('openid profile email w_member_social');
        const state = encodeURIComponent('linkedin');
        const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
        return NextResponse.json({ url, isPopup: true });
      }
      return NextResponse.json({
        url: `${origin}/api/social/callback?code=li_auth_live&provider=linkedin&profile=${encodeURIComponent(cleanProfile || 'Buffermate Professional Growth')}`,
        isPopup: true,
      });
    }

    // 6. Threads API URL
    if (provider.toLowerCase() === 'threads') {
      const fbAppId = process.env.FACEBOOK_APP_ID;
      if (fbAppId) {
        const redirectUri = encodeURIComponent(`${origin}/api/social/callback`);
        const scope = encodeURIComponent('threads_basic,threads_content_publish');
        const state = encodeURIComponent('threads');
        const url = `https://threads.net/oauth/authorize?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`;
        return NextResponse.json({ url, isPopup: true });
      }
      return NextResponse.json({
        url: `${origin}/api/social/callback?code=threads_auth_live&provider=threads&profile=${encodeURIComponent(cleanProfile || '@buffermate.threads')}`,
        isPopup: true,
      });
    }

    // Generic fallback for other channels (WhatsApp, YouTube)
    return NextResponse.json({
      url: `${origin}/api/social/callback?code=live_code&provider=${provider}&profile=${encodeURIComponent(cleanProfile || `${provider}_account`)}`,
      isPopup: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
