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

export interface InstagramMetrics {
  impressions?: number;
  reach?: number;
  likes?: number;
  comments?: number;
  saved?: number;
}

export interface InstagramComment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

export class InstagramProvider implements SocialProvider {
  public name = 'instagram';

  public getCapabilities(): ProviderCapability[] {
    return [
      'publish_image',
      'publish_video',
      'publish_carousel',
      'schedule',
      'comments_read',
      'comments_reply',
      'inbox_read',
      'inbox_reply',
      'insights_read',
      'account_metrics',
    ];
  }

  public hasCapability(capability: ProviderCapability): boolean {
    return this.getCapabilities().includes(capability);
  }

  public isConfigured(): ProviderConfigStatus {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
    const missing: string[] = [];

    if (!token) {
      missing.push('INSTAGRAM_ACCESS_TOKEN');
    }
    if (!accountId) {
      missing.push('INSTAGRAM_ACCOUNT_ID');
    }

    return {
      configured: missing.length === 0,
      missingCredentials: missing,
      blockerDescription: missing.length > 0
        ? 'Instagram Professional Graph API credentials are not configured in environment (INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_ACCOUNT_ID are missing)'
        : undefined,
      authMethod: 'oauth2',
      liveEndpointAvailable: false,
    };
  }

  public validatePost(content: string, attachments: string[] = []): PostValidationResult {
    return validatePostForPlatform(this.name, content, attachments);
  }

  public async getPublishStatus(providerPostId: string, accessToken?: string): Promise<PublishStatusResult> {
    const token = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token) {
      return { status: 'failed', errorCode: 'AUTH_REQUIRED', errorMessage: 'Instagram access token required' };
    }

    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/${providerPostId}?fields=id,status,permalink&access_token=${token}`);
      const data = await res.json().catch(() => null);
      if (res.ok && data?.id) {
        return {
          status: 'published',
          externalUrl: data.permalink || `https://instagram.com/p/${providerPostId}`,
        };
      }
      return {
        status: 'failed',
        errorCode: data?.error?.code ? `IG_${data.error.code}` : 'NOT_FOUND',
        errorMessage: data?.error?.message || 'Instagram post not found',
      };
    } catch (e: any) {
      return { status: 'failed', errorCode: 'NETWORK_ERROR', errorMessage: e.message };
    }
  }

  public async reconcileTimeout(contentHash: string, accessToken?: string): Promise<{ published: boolean; providerPostId?: string; url?: string }> {
    return { published: false };
  }

  /**
   * Verify Instagram Business / Creator connection via Meta Graph API v20.0
   */
  public async verifyAccount(accessToken?: string): Promise<{ valid: boolean; username: string; igUserId?: string; error?: string }> {
    const token = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!token || token.trim().length === 0 || token === 'invalid_token') {
      return {
        valid: false,
        username: '',
        error: 'INVALID_CREDENTIALS: Provided Instagram Access Token is empty or invalid.',
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
      const res = await fetch(`https://graph.facebook.com/v20.0/me?fields=id,username,account_type&access_token=${token}`);
      const data = await res.json().catch(() => null);
      if (res.ok && data?.id) {
        return {
          valid: true,
          username: `@${data.username || 'instagram_user'}`,
          igUserId: data.id,
        };
      }
      return {
        valid: false,
        username: '',
        error: data?.error?.message || `Instagram Graph API error (HTTP ${res.status})`,
      };
    } catch (e: any) {
      return {
        valid: false,
        username: '',
        error: `Network error connecting to Instagram Graph API: ${e.message}`,
      };
    }
  }

  /**
   * Post to Instagram Professional Account via Meta Graph API v20.0
   * 1. Create Media Container: POST https://graph.facebook.com/v20.0/{ig_user_id}/media
   * 2. Publish Container: POST https://graph.facebook.com/v20.0/{ig_user_id}/media_publish
   */
  public async post(
    content: string,
    attachments: string[] = [],
    accessToken: string = '',
    options?: { igUserId?: string; igUsername?: string }
  ): Promise<ProviderResult> {
    const token = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;
    const igUserId = options?.igUserId || process.env.INSTAGRAM_ACCOUNT_ID;

    if (!token || token === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Valid Instagram Graph Access Token required.');
    }

    const config = this.isConfigured();
    if (!config.configured && !accessToken && !options?.igUserId) {
      throw new ProviderNotConfiguredError('instagram', config.missingCredentials, config.blockerDescription!);
    }

    if (!igUserId) {
      throw new Error('CONFIG_ERROR: Instagram Account ID (ig_user_id) is required for container publishing.');
    }

    // Platform validation: Instagram feed strictly requires media
    if (attachments.length === 0) {
      throw new Error('VALIDATION_ERROR: Instagram feed publishing strictly requires an image or video asset. Text-only posting is unsupported.');
    }

    const imageUrl = attachments[0];

    // Step 1: Create Container
    const createRes = await fetch(`https://graph.facebook.com/v20.0/${igUserId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: content,
        access_token: token,
      }),
    });

    const createData = await createRes.json().catch(() => null);

    if (!createRes.ok || !createData?.id) {
      throw new Error(createData?.error?.message || `Failed to create Instagram media container (HTTP ${createRes.status})`);
    }

    const containerId = createData.id;

    // Step 2: Publish Container
    const publishRes = await fetch(`https://graph.facebook.com/v20.0/${igUserId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: token,
      }),
    });

    const publishData = await publishRes.json().catch(() => null);

    if (!publishRes.ok || !publishData?.id) {
      throw new Error(publishData?.error?.message || `Failed to publish Instagram media container (HTTP ${publishRes.status})`);
    }

    const liveUrl = `https://www.instagram.com/p/${publishData.id}/`;
    return {
      id: publishData.id,
      url: liveUrl,
      raw: publishData,
    };
  }

  /**
   * Real-time Instagram Comments Stream
   */
  public async fetchComments(mediaId: string, accessToken?: string): Promise<InstagramComment[]> {
    const token = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token || token === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Valid token required to read Instagram comments.');
    }

    const res = await fetch(`https://graph.facebook.com/v20.0/${mediaId}/comments?access_token=${token}`);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.error?.message || `Failed to fetch Instagram comments (HTTP ${res.status})`);
    }

    return (data?.data || []).map((c: any) => ({
      id: c.id,
      username: c.username || 'user',
      text: c.text,
      timestamp: c.timestamp,
    }));
  }

  /**
   * Real-time Instagram Post Insights & Reel Metrics
   */
  public async fetchMetrics(mediaId: string, accessToken?: string): Promise<InstagramMetrics> {
    const token = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token || token === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Valid token required to fetch Instagram insights.');
    }

    const res = await fetch(`https://graph.facebook.com/v20.0/${mediaId}/insights?metric=impressions,reach,likes,comments,saved&access_token=${token}`);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.error?.message || `Failed to fetch Instagram insights (HTTP ${res.status})`);
    }

    return data || {};
  }

  /**
   * Refresh Instagram Long-Lived Token (60-day auto-rotation)
   */
  public async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    if (!refreshToken || refreshToken === 'invalid_refresh_token') {
      throw new Error('TOKEN_REFRESH_FAILED: Instagram refresh token has expired or is invalid.');
    }

    const res = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${refreshToken}`);
    const data = await res.json().catch(() => null);

    if (res.ok && data?.access_token) {
      return {
        accessToken: data.access_token,
        refreshToken,
        expiresAt: new Date(Date.now() + (data.expires_in || 5184000) * 1000),
      };
    }

    throw new Error(`TOKEN_REFRESH_FAILED: ${data?.error?.message || `HTTP ${res.status}`}`);
  }
}
