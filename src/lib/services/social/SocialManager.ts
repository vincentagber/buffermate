import { SocialProvider, ProviderResult } from './SocialProvider';
import { MockProvider } from './MockProvider';

export class SocialManager {
    private static instance: SocialManager;
    private providers: Map<string, SocialProvider> = new Map();

    private constructor() {
        const mock = new MockProvider();
        this.providers.set('mock', mock);
        this.providers.set('x', mock);
        this.providers.set('twitter', mock);
        this.providers.set('linkedin', mock);
        this.providers.set('facebook', mock);
        this.providers.set('instagram', mock);
        this.providers.set('tiktok', mock);
        this.providers.set('youtube', mock);
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
            // Fallback to mock provider for demo resilience
            return this.providers.get('mock')!;
        }
        return provider;
    }

    public async publish(providerName: string, content: string, attachments: string[] = [], accessToken: string = 'token', options?: any): Promise<ProviderResult> {
        const provider = this.getProvider(providerName);
        return provider.post(content, attachments, accessToken, options);
    }
}
