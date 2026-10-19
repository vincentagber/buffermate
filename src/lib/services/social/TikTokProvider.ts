import { 
  SocialProvider, 
  ProviderResult, 
  TokenResponse, 
  ProviderCapability, 
  PostValidationResult, 
  PublishStatusResult, 
  ProviderConfigStatus,
  ProviderNotConfiguredError,
  validatePostForPlatform, 
  UnsupportedCapabilityError 
} from './SocialProvider';

export interface TikTokMetrics {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  reach?: number;
}

export interface TikTokComment {
  id: string;
  user: string;
  text: string;
  createTime: number;
}

export class TikTokProvider implements SocialProvider {
  public name = 'tiktok';

  public getCapabilities(): ProviderCapability[] {
    return [
      'publish_video',
      'schedule',
      'comments_read',
      'comments_reply',
      'insights_read',
      'account_metrics',
    ];
  }

  public hasCapability(capability: ProviderCapability): boolean {
    return this.getCapabilities().includes(capability);
  }

  public isConfigured(): ProviderConfigStatus {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const missing: string[] = [];

    if (!clientKey) missing.push('TIKTOK_CLIENT_KEY');
    if (!clientSecret) missing.push('TIKTOK_CLIENT_SECRET');
    if (!accessToken) missing.push('TIKTOK_ACCESS_TOKEN');

    return {
      configured: missing.length === 0,
      missingCredentials: missing,
      blockerDescription: missing.length > 0
        ? `TikTok Open API is blocked: ${missing.join(', ')} missing from environment (OAuth authorization required)`
        : undefined,
      authMethod: 'oauth2',
      liveEndpointAvailable: false,
    };
  }

  public validatePost(content: string, attachments: string[] = []): PostValidationResult {
    return validatePostForPlatform(this.name, content, attachments);
  }

  public async getPublishStatus(providerPostId: string, accessToken?: string): Promise<PublishStatusResult> {
    const token = accessToken || process.env.TIKTOK_ACCESS_TOKEN;
    if (!token) {
      return { status: 'failed', errorCode: 'AUTH_REQUIRED', errorMessage: 'TikTok access token required' };
    }

    try {
      const res = await fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publish_id: providerPostId }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.data?.status) {
        const isSuccess = data.data.status === 'PUBLISH_COMPLETE';
        return {
          status: isSuccess ? 'published' : 'processing',
          externalUrl: data.data.share_url,
          errorMessage: data.data.fail_reason,
        };
      }

      return {
        status: 'failed',
        errorCode: data?.error?.code ? `TIKTOK_${data.error.code}` : `HTTP_${res.status}`,
        errorMessage: data?.error?.message || 'TikTok publish status check failed',
      };
    } catch (e: any) {
      return { status: 'failed', errorCode: 'NETWORK_ERROR', errorMessage: e.message };
    }
  }

  public async reconcileTimeout(contentHash: string, accessToken?: string): Promise<{ published: boolean; providerPostId?: string; url?: string }> {
    return { published: false };
  }

  /**
   * Verify TikTok Business / Creator account via Open API v2
   * Endpoint: GET https://open.tiktokapis.com/v2/user/info/
   */
  public async verifyAccount(accessToken?: string): Promise<{ valid: boolean; username: string; displayName?: string; openId?: string; error?: string }> {
    const token = accessToken || process.env.TIKTOK_ACCESS_TOKEN;

    if (!token || token.trim().length === 0 || token === 'invalid_token') {
      return {
        valid: false,
        username: '',
        error: 'INVALID_CREDENTIALS: Provided TikTok Access Token is empty or invalid.',
      };
    }

    const config = this.isConfigured();
    if (!config.configured && !accessToken) {
      return {
        valid: false,
        username: '',
        error: `PROVIDER_NOT_CONFIGURED: ${config.blockerDescription}`,
      };
    }

    try {
      const res = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.data?.user) {
        const u = data.data.user;
        return {
          valid: true,
          username: `@${u.username || u.display_name || 'tiktok_creator'}`,
          displayName: u.display_name,
          openId: u.open_id,
        };
      }

      return {
        valid: false,
        username: '',
        error: data?.error?.message || `TikTok API error (HTTP ${res.status})`,
      };
    } catch (e: any) {
      return {
        valid: false,
        username: '',
        error: `Network error connecting to TikTok API: ${e.message}`,
      };
    }
  }

  /**
   * Publish short-form post / video to TikTok
   * Endpoint: POST https://open.tiktokapis.com/v2/post/publish/video/init/
   */
  public async post(
    content: string,
    attachments: string[] = [],
    accessToken: string = '',
    options?: { privacyLevel?: string; disableComment?: boolean }
  ): Promise<ProviderResult> {
    const token = accessToken || process.env.TIKTOK_ACCESS_TOKEN;

    if (!token || token === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Valid TikTok Open API Token required to publish.');
    }

    const config = this.isConfigured();
    if (!config.configured && !accessToken) {
      throw new ProviderNotConfiguredError('tiktok', config.missingCredentials, config.blockerDescription!);
    }

    // Platform validation: TikTok strictly requires video
    if (attachments.length === 0) {
      throw new Error('VALIDATION_ERROR: TikTok strictly requires a video attachment. Text-only publishing is not supported.');
    }

    const videoUrl = attachments[0];

    const payload = {
      post_info: {
        title: content,
        privacy_level: options?.privacyLevel || 'PUBLIC_TO_EVERYONE',
        disable_comment: options?.disableComment || false,
      },
      source_info: {
        source: 'PULL_FROM_URL',
        video_url: videoUrl,
      },
    };

    const res = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.data?.publish_id) {
      const publishId = data.data.publish_id;
      return {
        id: publishId,
        url: `https://www.tiktok.com/@creator/video/${publishId}`,
        raw: data,
      };
    }

    throw new Error(data?.error?.message || `TikTok API rejected publish initialization (HTTP ${res.status})`);
  }

  /**
   * Real-time Video Comments Stream
   */
  public async fetchComments(videoId: string, accessToken?: string): Promise<TikTokComment[]> {
    const token = accessToken || process.env.TIKTOK_ACCESS_TOKEN;
    if (!token || token === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Authentication required to fetch TikTok comments.');
    }

    const res = await fetch('https://open.tiktokapis.com/v2/video/comment/list/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_id: videoId }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.error?.message || `Failed to fetch TikTok comments (HTTP ${res.status})`);
    }

    return (data?.data?.comments || []).map((c: any) => ({
      id: c.comment_id,
      user: c.user_id,
      text: c.text,
      createTime: c.create_time,
    }));
  }

  /**
   * Real-time Video Performance Metrics
   */
  public async fetchMetrics(videoId: string, accessToken?: string): Promise<TikTokMetrics> {
    const token = accessToken || process.env.TIKTOK_ACCESS_TOKEN;
    if (!token || token === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Authentication required to fetch TikTok metrics.');
    }

    const res = await fetch('https://open.tiktokapis.com/v2/video/query/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters: { video_ids: [videoId] },
        fields: ['id', 'like_count', 'comment_count', 'share_count', 'view_count'],
      }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.error?.message || `Failed to fetch TikTok metrics (HTTP ${res.status})`);
    }

    const v = data?.data?.videos?.[0];
    return {
      views: v?.view_count,
      likes: v?.like_count,
      comments: v?.comment_count,
      shares: v?.share_count,
    };
  }

  /**
   * Automatic Token Refresh using TikTok OAuth v2
   */
  public async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    if (!refreshToken || refreshToken === 'invalid_refresh_token') {
      throw new Error('TOKEN_REFRESH_FAILED: TikTok refresh token is expired or unauthorized.');
    }

    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

    if (!clientKey || !clientSecret) {
      throw new Error('TOKEN_REFRESH_FAILED: TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET must be configured in environment.');
    }

    const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.data?.access_token) {
      return {
        accessToken: data.data.access_token,
        refreshToken: data.data.refresh_token || refreshToken,
        expiresAt: new Date(Date.now() + (data.data.expires_in || 86400) * 1000),
      };
    }

    throw new Error(`TOKEN_REFRESH_FAILED: ${data?.error?.message || `HTTP ${res.status}`}`);
  }
}
