import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/services/encryption';
import { integrationsManager } from '@/lib/services/integrations-realtime';

function renderSuccessHtml(provider: string, providerKey: string, providerUserId: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connection Authorized | BufferMate</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #FAF7F2;
      color: #1E293B;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 16px;
      box-sizing: border-box;
    }
    .card {
      background: #FFFFFF;
      padding: 36px 28px;
      border-radius: 24px;
      border: 2px dashed #CBD5E1;
      text-align: center;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 12px 30px rgba(0,0,0,0.06);
    }
    .icon-badge {
      width: 56px;
      height: 56px;
      background: #EDE9FE;
      border: 1px solid #DDD6FE;
      color: #8B5CF6;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 24px;
    }
    h2 {
      font-size: 19px;
      font-weight: 800;
      margin: 0 0 8px;
      color: #0F172A;
    }
    p {
      font-size: 13px;
      color: #64748B;
      margin: 0 0 20px;
      line-height: 1.5;
    }
    .account-pill {
      display: inline-block;
      padding: 6px 14px;
      background: #EDE9FE;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      color: #6D28D9;
      margin-bottom: 20px;
    }
    .spinner {
      width: 22px;
      height: 22px;
      border: 2.5px solid #DDD6FE;
      border-top: 2.5px solid #141416;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-badge">✨</div>
    <h2>${provider.toUpperCase()} Connected!</h2>
    <div class="account-pill">${providerUserId}</div>
    <p>Authentication handshake verified. Synchronizing with your BufferMate dashboard in real-time...</p>
    <div class="spinner"></div>
  </div>

  <script>
    const payload = {
      type: 'SOCIAL_AUTH_SUCCESS',
      provider: '${providerKey}',
      profile: '${providerUserId}',
      status: 'connected',
      timestamp: Date.now()
    };

    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(payload, '*');
        setTimeout(() => {
          window.close();
        }, 1200);
      } else {
        setTimeout(() => {
          window.location.href = '/dashboard/accounts';
        }, 1500);
      }
    } catch (err) {
      setTimeout(() => {
        window.location.href = '/dashboard/accounts';
      }, 1500);
    }
  </script>
</body>
</html>`;
}

function renderErrorHtml(provider: string, errorMessage: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connection Failed | BufferMate</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #FAF7F2;
      color: #1E293B;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 16px;
      box-sizing: border-box;
    }
    .card {
      background: #FFFFFF;
      padding: 36px 28px;
      border-radius: 24px;
      border: 2px dashed #FECDD3;
      text-align: center;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 12px 30px rgba(225,29,72,0.06);
    }
    .icon-badge {
      width: 56px;
      height: 56px;
      background: #FFE4E6;
      border: 1px solid #FECDD3;
      color: #E11D48;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 24px;
    }
    h2 {
      font-size: 19px;
      font-weight: 800;
      margin: 0 0 8px;
      color: #9F1239;
    }
    p {
      font-size: 13px;
      color: #475569;
      margin: 0 0 20px;
      line-height: 1.5;
      word-break: break-word;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      background: #E11D48;
      color: #FFFFFF;
      text-decoration: none;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-badge">⚠️</div>
    <h2>${provider.toUpperCase()} Authorization Failed</h2>
    <p>${errorMessage}</p>
    <button class="btn" onclick="window.close()">Close Window</button>
  </div>

  <script>
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: 'SOCIAL_AUTH_ERROR',
          provider: '${provider}',
          error: ${JSON.stringify(errorMessage)},
        }, '*');
      }
    } catch (e) {}
  </script>
</body>
</html>`;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error') || searchParams.get('error_description');
  const stateParam = (searchParams.get('state') || '').toLowerCase();
  let providerParam = (searchParams.get('provider') || '').toLowerCase();

  // Extract clean provider name if passed via state (e.g. x:userid, x_auth_state, x, fb_auth)
  if (!providerParam) {
    if (stateParam.startsWith('x') || stateParam.includes('twitter')) {
      providerParam = 'x';
    } else if (stateParam.startsWith('fb') || stateParam.includes('facebook')) {
      providerParam = 'facebook';
    } else if (stateParam.startsWith('ig') || stateParam.includes('instagram')) {
      providerParam = 'instagram';
    } else if (stateParam.includes('tiktok')) {
      providerParam = 'tiktok';
    } else if (stateParam.includes('linkedin')) {
      providerParam = 'linkedin';
    } else if (stateParam.includes('threads')) {
      providerParam = 'threads';
    } else {
      providerParam = 'facebook';
    }
  }

  const provider = providerParam;
  const providerKey = (provider === 'twitter' ? 'x' : provider).toLowerCase();

  if (errorParam) {
    return new Response(renderErrorHtml(providerKey, errorParam), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (!code) {
    return new Response(renderErrorHtml(providerKey, 'Missing authorization code from OAuth provider.'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Reject simulated or fake authorization codes
  if (code.endsWith('_auth_live') || code === 'live_code' || code.startsWith('mock_')) {
    return new Response(
      renderErrorHtml(
        providerKey,
        'Invalid or simulated authorization code. Live OAuth authorization directly from the external social provider is required.'
      ),
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  // Extract user ID from state parameter if present (e.g. x:uuid)
  let stateUserId = '';
  if (stateParam.includes(':')) {
    const parts = stateParam.split(':');
    if (parts.length >= 2) {
      stateUserId = parts[1];
    }
  }

  // Resolve target user
  const admin = createAdminClient();
  let targetUserId = user?.id;

  if (!targetUserId && stateUserId && stateUserId !== 'primary_user' && stateUserId !== 'default') {
    targetUserId = stateUserId;
  }

  if (!targetUserId) {
    const { data: usersData } = await admin.auth.admin.listUsers({ page: 1, perPage: 10 });
    const primary = usersData?.users?.find(u => u.email === 'vincentagber74@gmail.com') ||
                    usersData?.users?.[0];
    targetUserId = primary?.id;
  }

  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const redirectUri = `${origin}/api/social/callback`;

    let accessToken = '';
    let refreshToken = '';
    let providerUserId = '';
    let expiresAt = new Date(Date.now() + 60 * 86400 * 1000); // 60 days default

    // 1. Real X (Twitter) OAuth 2.0 Token Exchange Handshake
    if (providerKey === 'x' || providerKey === 'twitter') {
      if (!process.env.TWITTER_CLIENT_ID) {
        return new Response(renderErrorHtml('x', 'TWITTER_CLIENT_ID is not configured in environment.'), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      const basicAuth = Buffer.from(
        `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET || ''}`
      ).toString('base64');
      const pkceVerifier = 'buffermate_pkce_challenge_verifier_secure_token_1234567890';

      const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code_verifier: pkceVerifier,
          client_id: process.env.TWITTER_CLIENT_ID,
        }).toString(),
      });

      const tokenData = await tokenRes.json().catch(() => null);

      if (tokenRes.ok && tokenData?.access_token) {
        accessToken = tokenData.access_token;
        if (tokenData.refresh_token) refreshToken = tokenData.refresh_token;
        if (tokenData.expires_in) {
          expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
        }

        // Fetch verified Twitter username
        try {
          const meRes = await fetch('https://api.twitter.com/2/users/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const meData = await meRes.json().catch(() => null);
          if (meRes.ok && meData?.data?.username) {
            providerUserId = `@${meData.data.username}`;
          }
        } catch (meErr) {
          console.warn('[Twitter] Error fetching /users/me:', meErr);
        }
        if (!providerUserId) providerUserId = '@twitter_user';
      } else {
        const errMsg = tokenData?.error_description || tokenData?.error || `X OAuth token exchange failed (HTTP ${tokenRes.status})`;
        return new Response(renderErrorHtml('x', errMsg), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
    }

    // 2. Real Meta (Facebook & Instagram) Token & Pages Extraction Handshake
    else if (providerKey === 'facebook' || providerKey === 'instagram') {
      const fbAppId = process.env.FACEBOOK_APP_ID;
      const fbAppSecret = process.env.FACEBOOK_APP_SECRET;

      if (!fbAppId || fbAppId === 'your_facebook_app_id' || !fbAppSecret || fbAppSecret === 'your_facebook_app_secret') {
        return new Response(renderErrorHtml(providerKey, 'FACEBOOK_APP_ID and FACEBOOK_APP_SECRET are not configured in environment.'), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      const tokenRes = await fetch(
        `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${fbAppId}&client_secret=${fbAppSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`
      );
      const tokenData = await tokenRes.json().catch(() => null);

      if (tokenRes.ok && tokenData?.access_token) {
        accessToken = tokenData.access_token;

        const pagesRes = await fetch(
          `https://graph.facebook.com/v20.0/me/accounts?fields=id,name,access_token,category,instagram_business_account{id,username}&access_token=${accessToken}`
        );
        const pagesData = await pagesRes.json().catch(() => null);

        if (pagesRes.ok && pagesData?.data && pagesData.data.length > 0 && targetUserId) {
          for (const page of pagesData.data) {
            if (providerKey === 'facebook') {
              await admin.from('social_accounts').upsert({
                user_id: targetUserId,
                provider: 'facebook',
                provider_user_id: page.name || 'Facebook Page',
                access_token_encrypted: encrypt(page.access_token || accessToken),
                refresh_token_encrypted: encrypt(refreshToken),
                token_expires_at: expiresAt.toISOString(),
                meta: { page_id: page.id, category: page.category },
                updated_at: new Date().toISOString(),
              }, { onConflict: 'user_id, provider, provider_user_id' });
              providerUserId = page.name;
            }

            if (page.instagram_business_account?.id && (providerKey === 'instagram' || providerKey === 'facebook')) {
              const igHandle = page.instagram_business_account.username
                ? `@${page.instagram_business_account.username}`
                : `@${(page.name || 'brand').toLowerCase().replace(/\s+/g, '')}.ig`;

              await admin.from('social_accounts').upsert({
                user_id: targetUserId,
                provider: 'instagram',
                provider_user_id: igHandle,
                access_token_encrypted: encrypt(page.access_token || accessToken),
                refresh_token_encrypted: encrypt(refreshToken),
                token_expires_at: expiresAt.toISOString(),
                meta: { ig_user_id: page.instagram_business_account.id, page_id: page.id },
                updated_at: new Date().toISOString(),
              }, { onConflict: 'user_id, provider, provider_user_id' });

              if (providerKey === 'instagram') {
                providerUserId = igHandle;
              }
            }
          }
        } else {
          providerUserId = 'Meta User';
        }
      } else {
        const errMsg = tokenData?.error?.message || `Meta OAuth token exchange failed (HTTP ${tokenRes.status})`;
        return new Response(renderErrorHtml(providerKey, errMsg), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
    }

    // 3. Real TikTok Token Handshake
    else if (providerKey === 'tiktok') {
      const clientKey = process.env.TIKTOK_CLIENT_KEY;
      const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

      if (!clientKey || !clientSecret) {
        return new Response(renderErrorHtml('tiktok', 'TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET are not configured in environment.'), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_key: clientKey,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }).toString(),
      });

      const tokenData = await tokenRes.json().catch(() => null);

      if (tokenRes.ok && tokenData?.data?.access_token) {
        accessToken = tokenData.data.access_token;
        refreshToken = tokenData.data.refresh_token || '';
        if (tokenData.data.expires_in) {
          expiresAt = new Date(Date.now() + tokenData.data.expires_in * 1000);
        }

        // Fetch real TikTok user profile — open_id alone is not a stable identifier
        let tiktokOpenId = tokenData.data.open_id || '';
        let tiktokUsername = '';
        try {
          const profileRes = await fetch(
            'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,display_name,username',
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const profileData = await profileRes.json().catch(() => null);
          if (profileRes.ok && profileData?.data?.user) {
            const u = profileData.data.user;
            tiktokOpenId = u.open_id || tiktokOpenId;
            tiktokUsername = u.username || u.display_name || '';
          }
        } catch (profileErr) {
          console.warn('[TikTok Callback] Error fetching user profile:', profileErr);
        }

        providerUserId = tiktokUsername ? `@${tiktokUsername}` : (tiktokOpenId ? `tt_${tiktokOpenId.slice(0, 12)}` : '@tiktok_user');

        // Store open_id and username in meta for future API calls
        if (targetUserId) {
          await admin.from('social_accounts').upsert({
            user_id: targetUserId,
            provider: 'tiktok',
            provider_user_id: providerUserId,
            access_token_encrypted: encrypt(accessToken),
            refresh_token_encrypted: encrypt(refreshToken),
            token_expires_at: expiresAt.toISOString(),
            meta: {
              open_id: tiktokOpenId,
              username: tiktokUsername,
              auto_connected_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id, provider, provider_user_id' });
        }
      } else {
        const errMsg = tokenData?.error?.message || `TikTok token exchange failed (HTTP ${tokenRes.status})`;
        return new Response(renderErrorHtml('tiktok', errMsg), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
    }

    // 4. Real LinkedIn Token Handshake
    else if (providerKey === 'linkedin') {
      const clientId = process.env.LINKEDIN_CLIENT_ID;
      const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

      if (!clientId || clientId === 'your_linkedin_client_id' || !clientSecret || clientSecret === 'your_linkedin_client_secret') {
        return new Response(renderErrorHtml('linkedin', 'LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET are not configured in environment.'), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }).toString(),
      });

      const tokenData = await tokenRes.json().catch(() => null);

      if (tokenRes.ok && tokenData?.access_token) {
        accessToken = tokenData.access_token;
        refreshToken = tokenData.refresh_token || '';
        if (tokenData.expires_in) {
          expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
        }

        // Fetch real LinkedIn member profile and URN
        let linkedinSub = '';
        let linkedinName = '';
        let memberUrn = '';
        try {
          const meRes = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const meData = await meRes.json().catch(() => null);
          if (meRes.ok && meData?.sub) {
            linkedinSub = meData.sub;
            linkedinName = meData.name || `${meData.given_name || ''} ${meData.family_name || ''}`.trim();
            memberUrn = `urn:li:person:${meData.sub}`;
            providerUserId = linkedinName || `linkedin:${linkedinSub}`;
          } else {
            providerUserId = 'LinkedIn Member';
          }
        } catch (meErr) {
          console.warn('[LinkedIn Callback] Error fetching member profile:', meErr);
          providerUserId = 'LinkedIn Member';
        }

        // Store LinkedIn member data with URN in meta for publisher
        if (targetUserId) {
          await admin.from('social_accounts').upsert({
            user_id: targetUserId,
            provider: 'linkedin',
            provider_user_id: providerUserId,
            access_token_encrypted: encrypt(accessToken),
            refresh_token_encrypted: encrypt(refreshToken),
            token_expires_at: expiresAt.toISOString(),
            meta: {
              linkedin_id: linkedinSub,
              member_urn: memberUrn,
              name: linkedinName,
              auto_connected_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id, provider, provider_user_id' });
        }
      } else {
        const errMsg = tokenData?.error_description || tokenData?.error || `LinkedIn token exchange failed (HTTP ${tokenRes.status})`;
        return new Response(renderErrorHtml('linkedin', errMsg), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
    } else {
      return new Response(renderErrorHtml(providerKey, `OAuth callback for provider '${providerKey}' is not supported.`), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Persist verified account to Supabase social_accounts table
    if (targetUserId) {
      const { error: upsertErr } = await admin
        .from('social_accounts')
        .upsert({
          user_id: targetUserId,
          provider: providerKey === 'twitter' ? 'x' : providerKey,
          provider_user_id: providerUserId,
          access_token_encrypted: encrypt(accessToken),
          refresh_token_encrypted: encrypt(refreshToken),
          token_expires_at: expiresAt.toISOString(),
          meta: { 
            auto_connected_at: new Date().toISOString(),
            channel_name: providerKey === 'x' ? 'X (Twitter)' : providerKey,
          },
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id, provider, provider_user_id' });

      if (upsertErr) {
        console.error('[Callback] Failed to upsert social_accounts:', upsertErr);
      } else {
        console.log(`[Callback] Successfully saved ${providerKey} account for user ${targetUserId}: ${providerUserId}`);
      }
    }

    // Connect in Real-Time Manager and broadcast to SSE stream
    try {
      if (['instagram', 'tiktok', 'facebook', 'threads', 'whatsapp', 'x'].includes(providerKey)) {
        integrationsManager.connectChannel(providerKey as any, providerUserId);
      }
    } catch (sseErr) {
      console.warn('Real-time SSE broadcast warning:', sseErr);
    }

    return new Response(renderSuccessHtml(provider, providerKey, providerUserId), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err: any) {
    console.error('[Callback Exception]:', err);
    return new Response(renderErrorHtml(providerKey, err.message), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}
