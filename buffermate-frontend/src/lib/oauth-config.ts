/**
 * OAuth Configuration for Supabase Authentication
 * Supports Google and GitHub sign-in
 */

export const OAUTH_PROVIDERS = {
  google: {
    id: 'google',
    name: 'Google',
    icon: 'Mail',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    icon: 'Github',
  },
} as const;

export type OAuthProvider = keyof typeof OAUTH_PROVIDERS;

/**
 * Get the redirect URL for OAuth callback
 */
export function getOAuthRedirectUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/auth/callback`;
}

/**
 * OAuth configuration for Supabase
 */
export function getOAuthConfig(provider: OAuthProvider) {
  return {
    provider,
    options: {
      redirectTo: getOAuthRedirectUrl(),
    },
  };
}
