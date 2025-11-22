export interface SocialProvider {
    name: string;
    post(content: string, attachments: string[], accessToken: string, options?: any): Promise<ProviderResult>;
    refreshTokens?(refreshToken: string): Promise<TokenResponse>;
}

export interface ProviderResult {
    id: string; // Post ID on the platform
    url?: string; // URL to the post
    raw?: any; // Raw response
}

export interface TokenResponse {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
}
