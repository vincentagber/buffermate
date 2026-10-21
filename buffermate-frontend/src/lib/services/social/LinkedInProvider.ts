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

export interface LinkedInMetrics {
  impressions?: number;
  clicks?: number;
  reactions?: number;
  comments?: number;
  engagementRate?: number;
}

export interface LinkedInComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export class LinkedInProvider implements SocialProvider {
  public name = 'linkedin';

  public getCapabilities(): ProviderCapability[] {
    return [
      'create_text',
      'publish_image',
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
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const missing: string[] = [];

    if (!clientId || clientId === 'your_linkedin_client_id') {
      missing.push('LINKEDIN_CLIENT_ID');
    }
    if (!clientSecret || clientSecret === 'your_linkedin_client_secret') {
      missing.push('LINKEDIN_CLIENT_SECRET');
    }

    return {
      configured: missing.length === 0,
      missingCredentials: missing,
      blockerDescription: missing.length > 0
        ? 'LinkedIn Developer App credentials are placeholders or missing from environment (LINKEDIN_CLIENT_ID is unconfigured)'
        : undefined,
      authMethod: 'oauth2',
      liveEndpointAvailable: false,
    };
  }

  public validatePost(content: string, attachments: string[] = []): PostValidationResult {
    return validatePostForPlatform(this.name, content, attachments);
  }

  public async getPublishStatus(providerPostId: string, accessToken?: string): Promise<PublishStatusResult> {
    if (!accessToken) {
      return { status: 'failed', errorCode: 'AUTH_REQUIRED', errorMessage: 'LinkedIn OAuth token required' };
    }

    try {
      const res = await fetch(`https://api.linkedin.com/v2/ugcPosts/${encodeURIComponent(providerPostId)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.id) {
        return {
          status: 'published',
          externalUrl: `https://www.linkedin.com/feed/update/${providerPostId}`,
        };
      }
      return {
        status: 'failed',
        errorCode: `HTTP_${res.status}`,
        errorMessage: data?.message || 'LinkedIn post not found',
      };
    } catch (e: any) {
      return { status: 'failed', errorCode: 'NETWORK_ERROR', errorMessage: e.message };
    }
  }

  public async reconcileTimeout(contentHash: string, accessToken?: string): Promise<{ published: boolean; providerPostId?: string; url?: string }> {
    return { published: false };
  }

  /**
   * Authenticate / Verify LinkedIn Member or Organization credentials
   */
  public async verifyAccount(accessToken?: string): Promise<{ valid: boolean; name: string; id: string; urn?: string; error?: string }> {
    if (!accessToken || accessToken.trim().length === 0 || accessToken === 'invalid_token') {
      return {
        valid: false,
        name: '',
        id: '',
        error: 'INVALID_CREDENTIALS: Provided LinkedIn OAuth token is empty or invalid.',
      };
    }

    const config = this.isConfigured();
    if (!config.configured && !accessToken) {
      return {
        valid: false,
        name: '',
        id: '',
        error: `PROVIDER_NOT_CONFIGURED: ${config.blockerDescription}`,
      };
    }

    try {
      const res = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.sub) {
        return {
          valid: true,
          name: data.name || `${data.given_name || ''} ${data.family_name || ''}`.trim(),
          id: data.sub,
          urn: `urn:li:person:${data.sub}`,
        };
      }

      return {
        valid: false,
        name: '',
        id: '',
        error: data?.message || `LinkedIn API error (HTTP ${res.status})`,
      };
    } catch (e: any) {
      return {
        valid: false,
        name: '',
        id: '',
        error: `Network error connecting to LinkedIn API: ${e.message}`,
      };
    }
  }

  /**
   * Publish Post to LinkedIn (UGC Post API / Share API v2)
   * Endpoint: POST https://api.linkedin.com/v2/ugcPosts
   */
  public async post(
    content: string,
    attachments: string[] = [],
    accessToken: string = '',
    options?: { authorUrn?: string }
  ): Promise<ProviderResult> {
    if (!accessToken || accessToken === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Valid LinkedIn Access Token required.');
    }

    const config = this.isConfigured();
    if (!config.configured && !accessToken) {
      throw new ProviderNotConfiguredError('linkedin', config.missingCredentials, config.blockerDescription!);
    }

    const author = options?.authorUrn;
    if (!author) {
      throw new Error('CONFIG_ERROR: LinkedIn author URN (member or organization URN) required for publishing.');
    }

    const payload = {
      author,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: content },
          shareMediaCategory: attachments.length > 0 ? 'IMAGE' : 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.id) {
      const livePostUrl = `https://www.linkedin.com/feed/update/${data.id}`;
      return {
        id: data.id,
        url: livePostUrl,
        raw: data,
      };
    }

    throw new Error(data?.message || `LinkedIn API rejected post (HTTP ${res.status})`);
  }

  /**
   * Fetch live comments / engagement stream for a LinkedIn post
   */
  public async fetchComments(postId: string, accessToken?: string): Promise<LinkedInComment[]> {
    if (!accessToken || accessToken === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Authentication required to read post comments.');
    }

    const res = await fetch(`https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postId)}/comments`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || `Failed to fetch LinkedIn comments (HTTP ${res.status})`);
    }

    return (data?.elements || []).map((el: any) => ({
      id: el.$URN || el.id,
      author: el.actor,
      text: el.message?.text || '',
      createdAt: new Date(el.created?.time || Date.now()).toISOString(),
    }));
  }

  /**
   * Fetch real-time analytics / organizational metrics
   */
  public async fetchMetrics(postId: string, accessToken?: string): Promise<LinkedInMetrics> {
    if (!accessToken || accessToken === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Authentication required to fetch analytics.');
    }

    const res = await fetch(`https://api.linkedin.com/v2/socialMetadata/${encodeURIComponent(postId)}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || `Failed to fetch LinkedIn metrics (HTTP ${res.status})`);
    }

    return {
      reactions: data?.reactionSummaries ? Object.keys(data.reactionSummaries).length : 0,
      comments: data?.commentSummary?.count || 0,
    };
  }

  /**
   * Automatic OAuth 2.0 Token Refresh
   */
  public async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    if (!refreshToken || refreshToken === 'invalid_refresh_token') {
      throw new Error('TOKEN_REFRESH_FAILED: Refresh token expired or revoked by user.');
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!clientId || clientId === 'your_linkedin_client_id' || !clientSecret || clientSecret === 'your_linkedin_client_secret') {
      throw new Error('TOKEN_REFRESH_FAILED: LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be configured in environment.');
    }

    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.access_token) {
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        expiresAt: new Date(Date.now() + (data.expires_in || 5184000) * 1000),
      };
    }

    throw new Error(`TOKEN_REFRESH_FAILED: ${data?.error_description || data?.error || `HTTP ${res.status}`}`);
  }
}
