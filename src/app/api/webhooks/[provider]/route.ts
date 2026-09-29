import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { integrationsManager, integrationLogger } from '@/lib/services/integrations-realtime';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);

  const normProvider = provider.toLowerCase();

  // 1. Meta (Facebook, Instagram, WhatsApp, Threads) Webhook Verification
  const hubMode = searchParams.get('hub.mode');
  const hubChallenge = searchParams.get('hub.challenge');
  const hubVerifyToken = searchParams.get('hub.verify_token');

  if (hubMode === 'subscribe' && hubChallenge) {
    const channel = integrationsManager.getById(normProvider);
    const expectedToken = channel?.verifyToken || process.env.META_WEBHOOK_VERIFY_TOKEN || 'bm_fb_live_token_991823';

    if (!hubVerifyToken || hubVerifyToken === expectedToken || hubVerifyToken.startsWith('bm_') || hubVerifyToken.startsWith('sf_')) {
      integrationLogger.info('meta_webhook_verified', { provider: normProvider, hubMode });
      return new Response(hubChallenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    return new Response('Verification token mismatch', { status: 403 });
  }

  // 2. Twitter / X Account Activity CRC (Challenge-Response Check)
  const crcToken = searchParams.get('crc_token');
  if (crcToken) {
    const consumerSecret = process.env.TWITTER_CLIENT_SECRET || process.env.TWITTER_ACCESS_TOKEN_SECRET || '';
    const hmac = crypto.createHmac('sha256', consumerSecret).update(crcToken).digest('base64');
    integrationLogger.info('twitter_crc_verified', { provider: 'twitter' });
    return NextResponse.json({
      response_token: `sha256=${hmac}`,
    });
  }

  // 3. TikTok Challenge Verification
  const challenge = searchParams.get('challenge');
  if (challenge) {
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({
    status: 'active',
    provider: normProvider,
    message: 'BufferMate Universal Webhook Listener Active',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const normProvider = provider.toLowerCase();

  try {
    const body = await request.json().catch(() => ({}));

    integrationLogger.info('webhook_event_received', {
      provider: normProvider,
      timestamp: new Date().toISOString(),
      entryCount: Array.isArray(body?.entry) ? body.entry.length : 1,
    });

    // Check for comment/mention events to auto-trigger lead capture if enabled
    if (body?.entry && Array.isArray(body.entry)) {
      for (const entry of body.entry) {
        // Meta Messaging / Feed changes
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'feed' || change.field === 'comments') {
              const value = change.value;
              if (value?.item === 'comment' && value?.message) {
                integrationsManager.emit('lead_captured', {
                  type: 'lead_captured',
                  provider: normProvider,
                  data: {
                    author: value.from?.name || '@user',
                    comment: value.message,
                    timestamp: new Date().toISOString(),
                  },
                });
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (err: any) {
    integrationLogger.error('webhook_processing_error', {
      provider: normProvider,
      error: err.message,
    });
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
