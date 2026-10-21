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
      throw new Error(`Social provider '${name}' is not recognized or supported.`);
    }
    return provider;
  }

  public getProviderConfigStatus(name: string): import('./SocialProvider').ProviderConfigStatus {
    const provider = this.getProvider(name);
    return provider.isConfigured();
  }

  public getCapabilityRegistry(): Record<string, import('./SocialProvider').ProviderCapability[]> {
    const registry: Record<string, import('./SocialProvider').ProviderCapability[]> = {};
    for (const [key, provider] of this.providers.entries()) {
      registry[key] = provider.getCapabilities();
    }
    return registry;
  }

  public getCapabilitiesForPlatform(platform: string): import('./SocialProvider').ProviderCapability[] {
    const provider = this.getProvider(platform);
    return provider.getCapabilities();
  }

  public hasCapability(platform: string, capability: import('./SocialProvider').ProviderCapability): boolean {
    const provider = this.getProvider(platform);
    return provider.hasCapability(capability);
  }

  public validateForPlatforms(
    platforms: string[],
    content: string,
    attachments: string[] = []
  ): { allValid: boolean; results: Record<string, import('./SocialProvider').PostValidationResult> } {
    const results: Record<string, import('./SocialProvider').PostValidationResult> = {};
    let allValid = true;

    for (const p of platforms) {
      const provider = this.getProvider(p);
      const res = provider.validatePost(content, attachments);
      results[p] = res;
      if (!res.valid) {
        allValid = false;
      }
    }

    return { allValid, results };
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

