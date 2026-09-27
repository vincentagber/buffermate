import { NextRequest } from 'next/server';
import { integrationsManager, integrationLogger } from '@/lib/services/integrations-realtime';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  integrationLogger.info('sse_client_connected', { clientId });

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send initial state immediately
      const initialPayload = JSON.stringify({
        type: 'init',
        clientId,
        channels: integrationsManager.getAll(),
        summary: integrationsManager.getSummary(),
        timestamp: new Date().toISOString(),
      });
      controller.enqueue(encoder.encode(`event: init\ndata: ${initialPayload}\n\n`));

      // 2. Real-time broadcast listener
      const onChannelUpdated = (eventData: any) => {
        try {
          const payload = JSON.stringify({
            ...eventData,
            summary: integrationsManager.getSummary(),
          });
          controller.enqueue(encoder.encode(`event: update\ndata: ${payload}\n\n`));
        } catch (err) {
          integrationLogger.error('sse_encode_error', { clientId, error: String(err) });
        }
      };

      integrationsManager.on('channel_updated', onChannelUpdated);

      // 3. Keep-alive heartbeat ping every 15 seconds
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`event: ping\ndata: {"time":"${new Date().toISOString()}"}\n\n`));
        } catch (err) {
          clearInterval(pingInterval);
        }
      }, 15000);

      // 4. Cleanup on stream cancel
      req.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        integrationsManager.off('channel_updated', onChannelUpdated);
        integrationLogger.info('sse_client_disconnected', { clientId });
        try {
          controller.close();
        } catch (e) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
