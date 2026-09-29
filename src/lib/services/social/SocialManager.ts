import { SocialProvider, ProviderResult } from './SocialProvider';
import { MockProvider } from './MockProvider';
import { TwitterProvider } from './TwitterProvider';
import { FacebookProvider } from './FacebookProvider';
import { InstagramProvider } from './InstagramProvider';
import { ThreadsProvider } from './ThreadsProvider';
import { LinkedInProvider } from './LinkedInProvider';
import { TikTokProvider } from './TikTokProvider';

export class SocialManager {
  private static instance: SocialManager;
  private providers: Map<string, SocialProvider> = new Map();

  private constructor() {
    const mock = new MockProvider();
    const twitter = new TwitterProvider();
    const facebook = new FacebookProvider();
    const instagram = new InstagramProvider();
    const threads = new ThreadsProvider();
    const linkedin = new LinkedInProvider();
    const tiktok = new TikTokProvider();

    // Register real live providers
    this.providers.set('x', twitter);
    this.providers.set('twitter', twitter);
    this.providers.set('facebook', facebook);
    this.providers.set('instagram', instagram);
    this.providers.set('threads', threads);
    this.providers.set('linkedin', linkedin);
    this.providers.set('tiktok', tiktok);
    this.providers.set('whatsapp', mock);
    this.providers.set('youtube', mock);
    this.providers.set('mock', mock);
  }

  public static getInstance(): SocialManager {
    if (!SocialManager.instance) {
      SocialManager.instance = new SocialManager();
    }
    return SocialManager.instance;
  }

  public getProvider(name: string): SocialProvider {
    const provider = this.providers.get(name.toLowerCase());
    if (!provider) {
      return this.providers.get('mock')!;
    }
    return provider;
  }

  public async publish(
    providerName: string,
    content: string,
    attachments: string[] = [],
    accessToken: string = 'token',
    options?: any
  ): Promise<ProviderResult> {
    const provider = this.getProvider(providerName);
    return provider.post(content, attachments, accessToken, options);
  }
}
