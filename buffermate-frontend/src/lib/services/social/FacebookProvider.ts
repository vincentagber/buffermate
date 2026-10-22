import { 
  SocialProvider, 
  ProviderResult, 
  TokenResponse, 
  ProviderCapability, 
  PostValidationResult, 
  PublishStatusResult, 
  ProviderConfigStatus,
  ProviderNotConfiguredError,
  validatePostForPlatform 
} from './SocialProvider';

export interface FacebookMetrics {
  impressions?: number;
  engagedUsers?: number;
  reactions?: number;
  comments?: number;
  shares?: number;
}

export interface FacebookComment {
  id: string;
  from: string;
  message: string;
  created_time: string;
}

export class FacebookProvider implements SocialProvider {
  public name = 'facebook';

  public getCapabilities(): ProviderCapability[] {
    return [
      'create_text',
      'publish_image',
      'publish_video',
      'publish_carousel',
      'schedule',
      'comments_read',
      'comments_reply',
      'inbox_read',
      'inbox_reply',
      'insights_read',
      'ads_manage',
      'account_metrics',
    ];
  }

  public hasCapability(capability: ProviderCapability): boolean {
    return this.getCapabilities().includes(capability);
  }

  public isConfigured(): ProviderConfigStatus {
    const appId = process.env.FACEBOOK_APP_ID;
    const pageToken = process.env.NEWSPILOT_FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const missing: string[] = [];

    if (!appId || appId === 'your_facebook_app_id') {
      missing.push('FACEBOOK_APP_ID');
    }
    if (!pageToken) {
      missing.push('FACEBOOK_PAGE_ACCESS_TOKEN');
    }

    return {
      configured: missing.length === 0,
      missingCredentials: missing,
      blockerDescription: missing.length > 0
        ? 'Meta Developer App credentials are not configured in environment (FACEBOOK_APP_ID is placeholder or FACEBOOK_PAGE_ACCESS_TOKEN is missing)'
        : undefined,
      authMethod: 'oauth2',
      liveEndpointAvailable: false,
    };
  }

  public validatePost(content: string, attachments: string[] = []): PostValidationResult {
    return validatePostForPlatform(this.name, content, attachments);
  }

  public async getPublishStatus(providerPostId: string, accessToken?: string): Promise<PublishStatusResult> {
    const token = accessToken || process.env.NEWSPILOT_FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    if (!token) {
      return { status: 'failed', errorCode: 'AUTH_REQUIRED', errorMessage: 'Page access token required' };
    }

    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/${providerPostId}?access_token=${token}`);
      const data = await res.json().catch(() => null);
      if (res.ok && data?.id) {
        return {
          status: 'published',
          externalUrl: `https://facebook.com/${providerPostId}`,
        };
      }
      return {
        status: 'failed',
        errorCode: data?.error?.code ? `FB_${data.error.code}` : 'NOT_FOUND',
        errorMessage: data?.error?.message || 'Post not found',
      };
    } catch (e: any) {
      return { status: 'failed', errorCode: 'NETWORK_ERROR', errorMessage: e.message };
    }
  }

  public async reconcileTimeout(contentHash: string, accessToken?: string): Promise<{ published: boolean; providerPostId?: string; url?: string }> {
    return { published: false };
  }

  /**
   * Verify Facebook Page connection via Meta Graph API v20.0
   */
  public async verifyPage(pageAccessToken?: string): Promise<{ valid: boolean; pageName: string; pageId: string; error?: string }> {
    const token = pageAccessToken || process.env.NEWSPILOT_FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!token || token.trim().length === 0 || token === 'invalid_token') {
      return {
        valid: false,
        pageName: '',
        pageId: '',
        error: 'INVALID_CREDENTIALS: Provided Meta / Facebook Page Token is empty or invalid.',
      };
    }

    const config = this.isConfigured();
    if (!config.configured && !pageAccessToken) {
      return {
        valid: false,
        pageName: '',
        pageId: '',
        error: `PROVIDER_NOT_CONFIGURED: ${config.blockerDescription}`,
      };
    }

    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/me?fields=id,name,category&access_token=${token}`);
      const data = await res.json().catch(() => null);
      if (res.ok && data?.id) {
        return {
          valid: true,
          pageName: data.name || 'Facebook Page',
          pageId: data.id,
        };
      }
      return {
        valid: false,
        pageName: '',
        pageId: '',
        error: data?.error?.message || `Facebook Graph API error (HTTP ${res.status})`,
      };
    } catch (e: any) {
      return {
        valid: false,
        pageName: '',
        pageId: '',
        error: `Network error connecting to Meta Graph API: ${e.message}`,
      };
    }
  }

  /**
   * Post to Facebook Page via Meta Graph API v20.0
   * Endpoint: POST https://graph.facebook.com/v20.0/{page_id}/feed
   */
  public async post(
    content: string,
    attachments: string[] = [],
    accessToken: string = '',
    options?: { pageId?: string; pageAccessToken?: string }
  ): Promise<ProviderResult> {
    const token = options?.pageAccessToken || accessToken || process.env.NEWSPILOT_FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const pageId = options?.pageId || process.env.NEWSPILOT_FB_PAGE_ID || process.env.FACEBOOK_PAGE_ID || 'me';

    if (!token || token === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Valid Facebook Page Access Token required.');
    }

    const config = this.isConfigured();
    if (!config.configured && !options?.pageAccessToken && !accessToken) {
      throw new ProviderNotConfiguredError('facebook', config.missingCredentials, config.blockerDescription!);
    }

    const isPhoto = attachments.length > 0 && attachments[0].startsWith('http');
    const endpoint = isPhoto
      ? `https://graph.facebook.com/v20.0/${pageId}/photos`
      : `https://graph.facebook.com/v20.0/${pageId}/feed`;

    const bodyParams: Record<string, string> = {
      access_token: token,
    };

    if (isPhoto) {
      bodyParams.url = attachments[0];
      bodyParams.caption = content;
    } else {
      bodyParams.message = content;
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    });

    const data = await res.json().catch(() => null);

    if (res.ok && (data?.id || data?.post_id)) {
      const postId = data.post_id || data.id;
      const liveUrl = `https://facebook.com/${postId}`;
      return {
        id: postId,
        url: liveUrl,
        raw: data,
      };
    }

    throw new Error(data?.error?.message || `Facebook Graph API rejected post (HTTP ${res.status})`);
  }

  /**
   * Fetch real-time comments on a Facebook post
   */
  public async fetchComments(postId: string, accessToken?: string): Promise<FacebookComment[]> {
    const token = accessToken || process.env.NEWSPILOT_FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    if (!token || token === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Valid Page Token required to read comments.');
    }

    const res = await fetch(`https://graph.facebook.com/v20.0/${postId}/comments?access_token=${token}`);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.error?.message || `Failed to fetch Facebook comments (HTTP ${res.status})`);
    }

    return (data?.data || []).map((c: any) => ({
      id: c.id,
      from: c.from?.name || 'User',
      message: c.message,
      created_time: c.created_time,
    }));
  }

  /**
   * Fetch real-time post engagement & page insights
   */
  public async fetchMetrics(postId: string, accessToken?: string): Promise<FacebookMetrics> {
    const token = accessToken || process.env.NEWSPILOT_FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    if (!token || token === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Valid token required to fetch Facebook insights.');
    }

    const res = await fetch(`https://graph.facebook.com/v20.0/${postId}/insights?access_token=${token}`);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.error?.message || `Failed to fetch Facebook insights (HTTP ${res.status})`);
    }

    return data || {};
  }

  /**
   * Exchange short-lived token for Long-Lived Page Access Token (60 days)
   */
  public async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    if (!refreshToken || refreshToken === 'invalid_refresh_token') {
      throw new Error('TOKEN_REFRESH_FAILED: Meta exchange token is expired or revoked.');
    }

    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (!appId || appId === 'your_facebook_app_id' || !appSecret || appSecret === 'your_facebook_app_secret') {
      throw new Error('TOKEN_REFRESH_FAILED: FACEBOOK_APP_ID and FACEBOOK_APP_SECRET must be configured.');
    }

    const res = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${refreshToken}`
    );

    const data = await res.json().catch(() => null);
    if (res.ok && data?.access_token) {
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        expiresAt: new Date(Date.now() + (data.expires_in || 5184000) * 1000),
      };
    }

    throw new Error(`TOKEN_REFRESH_FAILED: ${data?.error?.message || `HTTP ${res.status}`}`);
  }
}
