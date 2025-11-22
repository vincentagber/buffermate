import { SocialProvider, ProviderResult, TokenResponse } from './SocialProvider';

export class MockProvider implements SocialProvider {
    name = 'mock';

    async post(content: string, attachments: string[], accessToken: string, options?: any): Promise<ProviderResult> {
        console.log('[MockProvider] Posting:', { content, attachments, options });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (content.includes('FAIL')) {
            throw new Error('Simulated failure');
        }

        return {
            id: 'mock-post-' + Date.now(),
            url: 'https://mock-social.com/post/' + Date.now(),
            raw: { success: true }
        };
    }

    async refreshTokens(refreshToken: string): Promise<TokenResponse> {
        return {
            accessToken: 'mock-new-access-token',
            refreshToken: 'mock-new-refresh-token',
            expiresAt: new Date(Date.now() + 3600 * 1000)
        };
    }
}
