import { 
  SocialProvider, 
  ProviderResult, 
  ProviderCapability, 
  PostValidationResult, 
  PublishStatusResult, 
  ProviderConfigStatus,
  ProviderNotConfiguredError,
  validatePostForPlatform 
} from './SocialProvider';

export class ThreadsProvider implements SocialProvider {
  public name = 'threads';

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
    const token = process.env.THREADS_ACCESS_TOKEN;
    const missing: string[] = [];

    if (!token) {
      missing.push('THREADS_ACCESS_TOKEN');
    }

    return {
      configured: missing.length === 0,
      missingCredentials: missing,
      blockerDescription: missing.length > 0
        ? 'Meta Threads API credentials are not configured in environment (THREADS_ACCESS_TOKEN is missing)'
        : undefined,
      authMethod: 'oauth2',
      liveEndpointAvailable: false,
    };
  }

  public validatePost(content: string, attachments: string[] = []): PostValidationResult {
    return validatePostForPlatform(this.name, content, attachments);
  }

  public async getPublishStatus(providerPostId: string, accessToken?: string): Promise<PublishStatusResult> {
    const token = accessToken || process.env.THREADS_ACCESS_TOKEN;
    if (!token) {
      return { status: 'failed', errorCode: 'AUTH_REQUIRED', errorMessage: 'Threads access token required' };
    }

    try {
      const res = await fetch(`https://graph.threads.net/v1.0/${providerPostId}?fields=id,permalink,status&access_token=${token}`);
      const data = await res.json().catch(() => null);
      if (res.ok && data?.id) {
        return {
          status: 'published',
          externalUrl: data.permalink || `https://threads.net/post/${providerPostId}`,
        };
      }
      return {
        status: 'failed',
        errorCode: `HTTP_${res.status}`,
        errorMessage: data?.error?.message || 'Threads post not found',
      };
    } catch (e: any) {
      return { status: 'failed', errorCode: 'NETWORK_ERROR', errorMessage: e.message };
    }
  }

  public async reconcileTimeout(contentHash: string, accessToken?: string): Promise<{ published: boolean; providerPostId?: string; url?: string }> {
    return { published: false };
  }

  /**
   * Post to Threads via Meta Threads API v1.0
   * 1. Create Container: POST https://graph.threads.net/v1.0/me/threads
   * 2. Publish Container: POST https://graph.threads.net/v1.0/me/threads_publish
   */
  public async post(
    content: string,
    attachments: string[] = [],
    accessToken: string = '',
    options?: { threadsUserId?: string; username?: string }
  ): Promise<ProviderResult> {
    const token = accessToken || process.env.THREADS_ACCESS_TOKEN;
    const username = options?.username?.replace('@', '') || 'user';

    if (!token || token === 'invalid_token') {
      throw new Error('INVALID_CREDENTIALS: Valid Threads Access Token required.');
    }

    const config = this.isConfigured();
    if (!config.configured && !accessToken) {
      throw new ProviderNotConfiguredError('threads', config.missingCredentials, config.blockerDescription!);
    }

    const isMedia = attachments.length > 0;
    const mediaType = isMedia ? 'IMAGE' : 'TEXT';

    const containerBody: Record<string, string> = {
      media_type: mediaType,
      text: content,
      access_token: token,
    };

    if (isMedia) {
      containerBody.image_url = attachments[0];
    }

    const createRes = await fetch('https://graph.threads.net/v1.0/me/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(containerBody),
    });

    const createData = await createRes.json().catch(() => null);

    if (!createRes.ok || !createData?.id) {
      throw new Error(createData?.error?.message || `Failed to create Threads container (HTTP ${createRes.status})`);
    }

    const creationId = createData.id;

    const publishRes = await fetch('https://graph.threads.net/v1.0/me/threads_publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: token,
      }),
    });

    const publishData = await publishRes.json().catch(() => null);

    if (!publishRes.ok || !publishData?.id) {
      throw new Error(publishData?.error?.message || `Failed to publish Threads post (HTTP ${publishRes.status})`);
    }

    const liveUrl = `https://threads.net/@${username}/post/${publishData.id}`;
    return {
      id: publishData.id,
      url: liveUrl,
      raw: publishData,
    };
  }
}
