import { NextRequest, NextResponse } from 'next/server';
import {
  integrationsManager,
  integrationLogger,
  ChannelProvider,
} from '@/lib/services/integrations-realtime';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const channels = integrationsManager.getAll();
    const summary = integrationsManager.getSummary();
    return NextResponse.json({
      success: true,
      channels,
      summary,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    integrationLogger.error('integrations_get_error', { error: err.message });
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch integrations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, activeProfile } = body as {
      provider: ChannelProvider;
      activeProfile?: string;
    };

    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Provider is required' },
        { status: 400 }
      );
    }

    const updated = integrationsManager.connectChannel(provider, activeProfile);
    const summary = integrationsManager.getSummary();

    return NextResponse.json({
      success: true,
      channel: updated,
      summary,
      message: `${updated.name} connected successfully`,
    });
  } catch (err: any) {
    integrationLogger.error('integrations_connect_error', { error: err.message });
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to connect channel' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, action, webhookUrl, verifyToken, subscribedEvents, feature, enabled } = body;

    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Provider is required' },
        { status: 400 }
      );
    }

    let updated;
    if (action === 'update_webhook') {
      updated = integrationsManager.updateWebhook(provider, {
        webhookUrl,
        verifyToken,
        subscribedEvents,
      });
    } else if (action === 'toggle_feature' && feature) {
      updated = integrationsManager.toggleFeature(provider, feature, Boolean(enabled));
    } else {
      // Default to webhook update if fields provided
      updated = integrationsManager.updateWebhook(provider, {
        webhookUrl,
        verifyToken,
        subscribedEvents,
      });
    }

    const summary = integrationsManager.getSummary();

    return NextResponse.json({
      success: true,
      channel: updated,
      summary,
      message: `${updated.name} updated successfully`,
    });
  } catch (err: any) {
    integrationLogger.error('integrations_patch_error', { error: err.message });
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update channel' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const providerParam = searchParams.get('provider');

    let provider = providerParam as ChannelProvider;
    if (!provider) {
      try {
        const body = await req.json();
        provider = body.provider;
      } catch (e) {}
    }

    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Provider is required to disconnect' },
        { status: 400 }
      );
    }

    const updated = integrationsManager.disconnectChannel(provider);
    const summary = integrationsManager.getSummary();

    return NextResponse.json({
      success: true,
      channel: updated,
      summary,
      message: `${updated.name} disconnected successfully`,
    });
  } catch (err: any) {
    integrationLogger.error('integrations_disconnect_error', { error: err.message });
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to disconnect channel' },
      { status: 500 }
    );
  }
}
