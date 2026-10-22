import { EventEmitter } from 'events';

export type ChannelProvider = 'instagram' | 'tiktok' | 'facebook' | 'threads' | 'whatsapp' | 'x';

export interface ChannelFeature {
  id: string;
  name: string;
  enabled: boolean;
}

export interface ChannelIntegrationState {
  id: string;
  provider: ChannelProvider;
  name: string;
  api: string;
  category: string;
  status: 'connected' | 'disconnected';
  activeProfile: string;
  features: string[];
  autoCommentReply: boolean;
  leadCaptureFunnel: boolean;
  newsAutomation?: {
    enabled: boolean;
    publishing_mode: 'auto_publish' | 'manual_review';
    custom_instructions?: string;
  };
  webhookUrl: string;
  verifyToken: string;
  subscribedEvents: string[];
  lastSyncedAt: string;
  latencyMs: number;
}

// Structured Logger
export const integrationLogger = {
  info: (event: string, meta: Record<string, any> = {}) => {
    console.log(JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      service: 'social-integrations-engine',
      event,
      ...meta,
    }));
  },
  warn: (event: string, meta: Record<string, any> = {}) => {
    console.warn(JSON.stringify({
      level: 'WARN',
      timestamp: new Date().toISOString(),
      service: 'social-integrations-engine',
      event,
      ...meta,
    }));
  },
  error: (event: string, meta: Record<string, any> = {}) => {
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      service: 'social-integrations-engine',
      event,
      ...meta,
    }));
  },
};

// Initial state as explicitly requested in specification
const INITIAL_CHANNELS: ChannelIntegrationState[] = [
  {
    id: 'int-ig',
    provider: 'instagram',
    name: 'Instagram Professional',
    api: 'Meta Graph API v20.0',
    category: 'Meta Business Platform',
    status: 'connected',
    activeProfile: '@buffermate.official',
    features: [
      'Comment-to-DM Triggers',
      'Story Mention Replies',
      'Reels Lead Capture',
      'Post Auto-Publish',
      'Auto Comment Reply',
    ],
    autoCommentReply: true,
    leadCaptureFunnel: true,
    webhookUrl: 'https://buffermate.ai/api/webhooks/instagram',
    verifyToken: 'bm_ig_live_token_889210',
    subscribedEvents: ['comments', 'mentions', 'messages', 'messaging_postbacks'],
    lastSyncedAt: new Date().toISOString(),
    latencyMs: 34,
  },
  {
    id: 'int-tt',
    provider: 'tiktok',
    name: 'TikTok for Business',
    api: 'TikTok Open API v2',
    category: 'TikTok Commercial API',
    status: 'connected',
    activeProfile: '@buffermate_tok',
    features: [
      'Video Comment Bots',
      'Instant Lead Funnel',
      'Creator Marketplace Sync',
      'Auto Comment Reply',
    ],
    autoCommentReply: true,
    leadCaptureFunnel: true,
    webhookUrl: 'https://buffermate.ai/api/webhooks/tiktok',
    verifyToken: 'bm_tt_live_token_773129',
    subscribedEvents: ['video.comment', 'direct.message', 'lead.submit'],
    lastSyncedAt: new Date().toISOString(),
    latencyMs: 42,
  },
  {
    id: 'int-fb',
    provider: 'facebook',
    name: 'Facebook Pages & Messenger',
    api: 'Meta Business Suite',
    category: 'Meta Graph API v20.0',
    status: 'connected',
    activeProfile: 'BufferMate Growth Page',
    features: [
      'Page Comment Auto-Replies',
      'Messenger DM Funnels',
      'Meta Ad Lead Sync',
      'Auto Comment Reply',
    ],
    autoCommentReply: true,
    leadCaptureFunnel: true,
    webhookUrl: 'https://buffermate.ai/api/webhooks/facebook',
    verifyToken: 'bm_fb_live_token_991823',
    subscribedEvents: ['feed', 'messages', 'leadgen', 'messaging_postbacks'],
    lastSyncedAt: new Date().toISOString(),
    latencyMs: 29,
  },
  {
    id: 'int-th',
    provider: 'threads',
    name: 'Threads Engine',
    api: 'Meta Threads API',
    category: 'Meta Threads Graph v1.0',
    status: 'connected',
    activeProfile: '@buffermate.threads',
    features: [
      'Keyword Link Mentions',
      'Direct Responses',
      'Thread Post Publishing',
      'Auto Comment Reply',
    ],
    autoCommentReply: true,
    leadCaptureFunnel: true,
    webhookUrl: 'https://buffermate.ai/api/webhooks/threads',
    verifyToken: 'sf_th_live_token_664192',
    subscribedEvents: ['threads_mentions', 'threads_replies', 'messages'],
    lastSyncedAt: new Date().toISOString(),
    latencyMs: 38,
  },
];

class IntegrationsManager extends EventEmitter {
  private channels: ChannelIntegrationState[] = [...INITIAL_CHANNELS];

  constructor() {
    super();
    this.setMaxListeners(100);
  }

  public getAll(): ChannelIntegrationState[] {
    return [...this.channels];
  }

  public getById(id: string): ChannelIntegrationState | undefined {
    return this.channels.find((c) => c.id === id || c.provider === id);
  }

  public connectChannel(provider: ChannelProvider, activeProfile?: string): ChannelIntegrationState {
    const channel = this.channels.find((c) => c.provider === provider);
    if (!channel) {
      throw new Error(`Channel provider ${provider} not found`);
    }

    channel.status = 'connected';
    if (activeProfile) {
      channel.activeProfile = activeProfile;
    }
    channel.lastSyncedAt = new Date().toISOString();
    channel.autoCommentReply = true;
    channel.leadCaptureFunnel = true;
    channel.latencyMs = Math.floor(Math.random() * 20) + 25;

    integrationLogger.info('channel_connected', {
      provider,
      profile: channel.activeProfile,
      status: channel.status,
    });

    this.emit('channel_updated', {
      type: 'channel_connected',
      channel,
      channels: this.getAll(),
      timestamp: new Date().toISOString(),
    });

    return channel;
  }

  public disconnectChannel(provider: ChannelProvider): ChannelIntegrationState {
    const channel = this.channels.find((c) => c.provider === provider);
    if (!channel) {
      throw new Error(`Channel provider ${provider} not found`);
    }

    channel.status = 'disconnected';
    channel.autoCommentReply = false;
    channel.leadCaptureFunnel = false;
    channel.latencyMs = 0;

    integrationLogger.info('channel_disconnected', {
      provider,
      profile: channel.activeProfile,
      status: channel.status,
    });

    this.emit('channel_updated', {
      type: 'channel_disconnected',
      channel,
      channels: this.getAll(),
      timestamp: new Date().toISOString(),
    });

    return channel;
  }

  public updateWebhook(
    provider: ChannelProvider,
    updates: { webhookUrl?: string; verifyToken?: string; subscribedEvents?: string[] }
  ): ChannelIntegrationState {
    const channel = this.channels.find((c) => c.provider === provider);
    if (!channel) {
      throw new Error(`Channel provider ${provider} not found`);
    }

    if (updates.webhookUrl) channel.webhookUrl = updates.webhookUrl;
    if (updates.verifyToken) channel.verifyToken = updates.verifyToken;
    if (updates.subscribedEvents) channel.subscribedEvents = updates.subscribedEvents;
    channel.lastSyncedAt = new Date().toISOString();

    integrationLogger.info('webhook_configured', {
      provider,
      webhookUrl: channel.webhookUrl,
      verifyTokenMasked: channel.verifyToken ? `${channel.verifyToken.slice(0, 4)}***` : '',
    });

    this.emit('channel_updated', {
      type: 'webhook_updated',
      channel,
      channels: this.getAll(),
      timestamp: new Date().toISOString(),
    });

    return channel;
  }

  public toggleFeature(
    provider: ChannelProvider,
    feature: 'autoCommentReply' | 'leadCaptureFunnel',
    enabled: boolean
  ): ChannelIntegrationState {
    const channel = this.channels.find((c) => c.provider === provider);
    if (!channel) {
      throw new Error(`Channel provider ${provider} not found`);
    }

    channel[feature] = enabled;
    channel.lastSyncedAt = new Date().toISOString();

    integrationLogger.info('feature_toggled', {
      provider,
      feature,
      enabled,
    });

    this.emit('channel_updated', {
      type: 'feature_toggled',
      channel,
      feature,
      enabled,
      channels: this.getAll(),
      timestamp: new Date().toISOString(),
    });

    return channel;
  }

  public getSummary() {
    const total = this.channels.length;
    const connected = this.channels.filter((c) => c.status === 'connected').length;
    const disconnected = total - connected;
    return {
      total,
      connected,
      disconnected,
      activeProgressText: `${connected} of ${total} Channels Active`,
      healthStatus: connected >= Math.max(1, total - 1) ? 'HEALTHY' : 'DEGRADED',
    };
  }
}

// Global Singleton Instance across Node execution
declare global {
  var __integrationsManager: IntegrationsManager | undefined;
}

export const integrationsManager = globalThis.__integrationsManager ?? new IntegrationsManager();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__integrationsManager = integrationsManager;
}
