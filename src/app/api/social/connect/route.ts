import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const body = await request.json();
    const { provider } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider parameter is required' }, { status: 400 });
    }

    const normProvider = provider.toLowerCase();
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const redirectUri = encodeURIComponent(`${origin}/api/social/callback`);

    // 1. X (Twitter API v2) — Fully Configured
    if (normProvider === 'x' || normProvider === 'twitter') {
      const twitterClientId = process.env.TWITTER_CLIENT_ID;
      if (twitterClientId && !twitterClientId.includes('your_')) {
        const scope = encodeURIComponent('tweet.read tweet.write users.read offline.access');
        const stateUserId = user?.id || 'primary_user';
        const state = encodeURIComponent(`x:${stateUserId}`);
        const pkceChallenge = 'buffermate_pkce_challenge_verifier_secure_token_1234567890';
        const url = `https://x.com/i/oauth2/authorize?response_type=code&client_id=${twitterClientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${pkceChallenge}&code_challenge_method=plain`;
        return NextResponse.json({ url, isPopup: true, configured: true });
      }

      return NextResponse.json({
        error: 'PROVIDER_NOT_CONFIGURED',
        provider: 'x',
        message: 'X (Twitter) OAuth 2.0 is blocked: TWITTER_CLIENT_ID is missing from environment.',
        missingCredentials: ['TWITTER_CLIENT_ID'],
      }, { status: 422 });
    }

    // 2. Facebook / Meta Graph API
    if (normProvider === 'facebook') {
      const fbAppId = process.env.FACEBOOK_APP_ID;
      if (fbAppId && !fbAppId.includes('your_')) {
        const scope = encodeURIComponent('pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish');
        const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=facebook`;
        return NextResponse.json({ url, isPopup: true, configured: true });
      }

      return NextResponse.json({
        error: 'PROVIDER_NOT_CONFIGURED',
        provider: 'facebook',
        message: 'Meta (Facebook) integration is blocked: FACEBOOK_APP_ID is a placeholder or not configured. Live Meta Developer App registration is required.',
        missingCredentials: ['FACEBOOK_APP_ID', 'FACEBOOK_APP_SECRET', 'FACEBOOK_PAGE_ACCESS_TOKEN'],
      }, { status: 422 });
    }

    // 3. Instagram Professional
    if (normProvider === 'instagram') {
      const fbAppId = process.env.FACEBOOK_APP_ID;
      if (fbAppId && !fbAppId.includes('your_')) {
        const scope = encodeURIComponent('instagram_basic,instagram_content_publish,pages_show_list');
        const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=instagram`;
        return NextResponse.json({ url, isPopup: true, configured: true });
      }

      return NextResponse.json({
        error: 'PROVIDER_NOT_CONFIGURED',
        provider: 'instagram',
        message: 'Instagram Professional integration is blocked: Meta App ID and Instagram Professional Account ID are not configured in environment.',
        missingCredentials: ['FACEBOOK_APP_ID', 'INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_ACCOUNT_ID'],
      }, { status: 422 });
    }

    // 4. TikTok for Business
    if (normProvider === 'tiktok') {
      const tiktokClientKey = process.env.TIKTOK_CLIENT_KEY;
      if (tiktokClientKey && !tiktokClientKey.includes('your_')) {
        const url = `https://www.tiktok.com/v2/auth/authorize/?client_key=${tiktokClientKey}&scope=user.info.basic,video.publish,video.upload&response_type=code&redirect_uri=${redirectUri}&state=tiktok`;
        return NextResponse.json({ url, isPopup: true, configured: true });
      }

      return NextResponse.json({
        error: 'PROVIDER_NOT_CONFIGURED',
        provider: 'tiktok',
        message: 'TikTok integration is blocked: TIKTOK_CLIENT_KEY is missing from environment.',
        missingCredentials: ['TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET'],
      }, { status: 422 });
    }

    // 5. LinkedIn
    if (normProvider === 'linkedin') {
      const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
      if (linkedinClientId && !linkedinClientId.includes('your_')) {
        const scope = encodeURIComponent('openid profile email w_member_social');
        const state = encodeURIComponent('linkedin');
        const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
        return NextResponse.json({ url, isPopup: true, configured: true });
      }

      return NextResponse.json({
        error: 'PROVIDER_NOT_CONFIGURED',
        provider: 'linkedin',
        message: 'LinkedIn integration is blocked: LINKEDIN_CLIENT_ID is a placeholder. Developer App registration on linkedin.com/developers is required.',
        missingCredentials: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET'],
      }, { status: 422 });
    }

    // 6. Threads API
    if (normProvider === 'threads') {
      const fbAppId = process.env.FACEBOOK_APP_ID;
      if (fbAppId && !fbAppId.includes('your_')) {
        const scope = encodeURIComponent('threads_basic,threads_content_publish');
        const state = encodeURIComponent('threads');
        const url = `https://threads.net/oauth/authorize?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`;
        return NextResponse.json({ url, isPopup: true, configured: true });
      }

      return NextResponse.json({
        error: 'PROVIDER_NOT_CONFIGURED',
        provider: 'threads',
        message: 'Threads API integration is blocked: THREADS_ACCESS_TOKEN and Meta App credentials are not configured.',
        missingCredentials: ['FACEBOOK_APP_ID', 'THREADS_ACCESS_TOKEN'],
      }, { status: 422 });
    }

    return NextResponse.json({
      error: 'PROVIDER_UNSUPPORTED',
      provider: normProvider,
      message: `Social platform '${normProvider}' does not have an OAuth connection handler.`,
    }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
