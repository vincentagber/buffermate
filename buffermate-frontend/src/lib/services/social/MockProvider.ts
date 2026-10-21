import { 
  SocialProvider, 
  ProviderResult, 
  TokenResponse, 
  ProviderCapability, 
  PostValidationResult, 
  PublishStatusResult,
  validatePostForPlatform,
  UnsupportedCapabilityError
} from './SocialProvider';

export class MockProvider implements SocialProvider {
  public name = 'mock';

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

  public isConfigured(): import('./SocialProvider').ProviderConfigStatus {
    return {
      configured: true,
      missingCredentials: [],
      blockerDescription: 'Test Harness Provider (Unit Testing Only)',
      authMethod: 'api_key',
      liveEndpointAvailable: true,
    };
  }

  public validatePost(content: string, attachments: string[] = []): PostValidationResult {
    return validatePostForPlatform(this.name, content, attachments);
  }

  public async post(
    content: string, 
    attachments: string[], 
    accessToken: string, 
    options?: any
  ): Promise<ProviderResult> {
    console.log('[MockProvider] Posting:', { content, attachments, options });

    // Validate post before publishing
    const validation = this.validatePost(content, attachments);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(' ')}`);
    }

    if (content.includes('SIMULATE_UNSUPPORTED_CAPABILITY')) {
      throw new UnsupportedCapabilityError(this.name, 'ads_manage');
    }

    if (content.includes('FAIL_ONCE') && !options?.isRetry) {
      throw new Error('Simulated transient provider network failure');
    }

    if (content.includes('PERMANENT_FAIL')) {
      throw new Error('PERMANENT_ERROR: Account permissions revoked by user');
    }

    if (content.includes('AMBIGUOUS_TIMEOUT')) {
      throw new Error('TIMEOUT: Provider read timeout after 30000ms');
    }

    // Normal successful execution
    const postId = 'mock-post-' + Date.now();
    return {
      id: postId,
      url: 'https://mock-social.com/post/' + postId,
      raw: { success: true, timestamp: new Date().toISOString() },
    };
  }

  public async getPublishStatus(providerPostId: string, accessToken: string): Promise<PublishStatusResult> {
    if (providerPostId.includes('failed')) {
      return { status: 'failed', errorCode: 'REJECTED_BY_PLATFORM', errorMessage: 'Media failed transcoding' };
    }
    return {
      status: 'published',
      externalUrl: `https://mock-social.com/post/${providerPostId}`,
    };
  }

  public async reconcileTimeout(
    contentHash: string, 
    accessToken: string
  ): Promise<{ published: boolean; providerPostId?: string; url?: string }> {
    // Reconcile status without re-posting
    return {
      published: true,
      providerPostId: `reconciled-${contentHash.slice(0, 8)}`,
      url: `https://mock-social.com/post/reconciled-${contentHash.slice(0, 8)}`,
    };
  }

  public async fetchMetrics(providerAccountId: string, accessToken: string): Promise<Record<string, number>> {
    return {
      impressions: 1250,
      engagements: 84,
      clicks: 32,
      reach: 980,
    };
  }

  public async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    return {
      accessToken: 'mock-new-access-token',
      refreshToken: 'mock-new-refresh-token',
      expiresAt: new Date(Date.now() + 3600 * 1000),
    };
  }
}
