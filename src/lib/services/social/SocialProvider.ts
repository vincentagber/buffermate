import { ProviderCapability, PostValidationResult, SocialChannel } from '../../types';

export { type ProviderCapability, type PostValidationResult };

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

export interface PublishStatusResult {
  status: 'published' | 'processing' | 'failed' | 'not_found';
  externalUrl?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface ProviderConfigStatus {
  configured: boolean;
  missingCredentials: string[];
  blockerDescription?: string;
  authMethod: 'oauth2' | 'oauth1' | 'bearer' | 'api_key';
  liveEndpointAvailable: boolean;
}

export interface SocialProvider {
  name: string;
  getCapabilities(): ProviderCapability[];
  hasCapability(capability: ProviderCapability): boolean;
  isConfigured(): ProviderConfigStatus;
  validatePost(content: string, attachments?: string[]): PostValidationResult;
  post(content: string, attachments: string[], accessToken: string, options?: any): Promise<ProviderResult>;
  getPublishStatus?(providerPostId: string, accessToken: string): Promise<PublishStatusResult>;
  reconcileTimeout?(contentHash: string, accessToken: string): Promise<{ published: boolean; providerPostId?: string; url?: string }>;
  fetchMetrics?(targetId: string, accessToken: string): Promise<Record<string, number> | any>;
  refreshTokens?(refreshToken: string): Promise<TokenResponse>;
}

export class ProviderNotConfiguredError extends Error {
  public code = 'PROVIDER_NOT_CONFIGURED';
  public platform: string;
  public missingCredentials: string[];
  public blockerDescription: string;

  constructor(platform: string, missingCredentials: string[], blockerDescription: string) {
    super(`Provider '${platform}' is not configured: ${blockerDescription}. Missing credentials: ${missingCredentials.join(', ')}`);
    this.name = 'ProviderNotConfiguredError';
    this.platform = platform;
    this.missingCredentials = missingCredentials;
    this.blockerDescription = blockerDescription;
  }

  toJSON() {
    return {
      success: false,
      error: this.code,
      platform: this.platform,
      missingCredentials: this.missingCredentials,
      blockerDescription: this.blockerDescription,
      message: this.message,
    };
  }
}

export class UnsupportedCapabilityError extends Error {
  public code = 'UNSUPPORTED_CAPABILITY';
  public platform: string;
  public capability: ProviderCapability;

  constructor(platform: string, capability: ProviderCapability) {
    super(`Provider '${platform}' does not support capability '${capability}'. Action was rejected.`);
    this.name = 'UnsupportedCapabilityError';
    this.platform = platform;
    this.capability = capability;
  }

  toJSON() {
    return {
      success: false,
      error: this.code,
      platform: this.platform,
      capability: this.capability,
      message: this.message,
    };
  }
}

/**
 * Standard Platform Constraints for Post Validation
 */
export const PLATFORM_CONSTRAINTS: Record<string, {
  maxCharacters: number;
  supportsTextOnly: boolean;
  requiresMedia: boolean;
  maxAttachments: number;
  allowedMediaTypes: Array<'image' | 'video' | 'gif'>;
}> = {
  x: {
    maxCharacters: 280,
    supportsTextOnly: true,
    requiresMedia: false,
    maxAttachments: 4,
    allowedMediaTypes: ['image', 'video', 'gif'],
  },
  twitter: {
    maxCharacters: 280,
    supportsTextOnly: true,
    requiresMedia: false,
    maxAttachments: 4,
    allowedMediaTypes: ['image', 'video', 'gif'],
  },
  instagram: {
    maxCharacters: 2200,
    supportsTextOnly: false,
    requiresMedia: true, // Feed posts strictly require image or video
    maxAttachments: 10,
    allowedMediaTypes: ['image', 'video'],
  },
  facebook: {
    maxCharacters: 63206,
    supportsTextOnly: true,
    requiresMedia: false,
    maxAttachments: 10,
    allowedMediaTypes: ['image', 'video', 'gif'],
  },
  linkedin: {
    maxCharacters: 3000,
    supportsTextOnly: true,
    requiresMedia: false,
    maxAttachments: 9,
    allowedMediaTypes: ['image', 'video'],
  },
  threads: {
    maxCharacters: 500,
    supportsTextOnly: true,
    requiresMedia: false,
    maxAttachments: 10,
    allowedMediaTypes: ['image', 'video', 'gif'],
  },
  tiktok: {
    maxCharacters: 2200,
    supportsTextOnly: false,
    requiresMedia: true, // TikTok strictly requires video
    maxAttachments: 1,
    allowedMediaTypes: ['video'],
  },
  mock: {
    maxCharacters: 10000,
    supportsTextOnly: true,
    requiresMedia: false,
    maxAttachments: 10,
    allowedMediaTypes: ['image', 'video', 'gif'],
  },
};

/**
 * Helper to validate post content per platform rules
 */
export function validatePostForPlatform(
  platformName: string,
  content: string,
  attachments: string[] = []
): PostValidationResult {
  const normPlatform = platformName.toLowerCase();
  const config = PLATFORM_CONSTRAINTS[normPlatform] || PLATFORM_CONSTRAINTS.mock;
  const errors: string[] = [];
  const warnings: string[] = [];
  const charCount = (content || '').length;

  if (charCount > config.maxCharacters) {
    errors.push(`Content exceeds ${normPlatform.toUpperCase()} limit of ${config.maxCharacters} characters (current: ${charCount}).`);
  }

  if (config.requiresMedia && attachments.length === 0) {
    errors.push(`${normPlatform.toUpperCase()} requires at least one media asset (image/video). Text-only publishing is not supported.`);
  }

  if (attachments.length > config.maxAttachments) {
    errors.push(`${normPlatform.toUpperCase()} supports a maximum of ${config.maxAttachments} media attachments (current: ${attachments.length}).`);
  }

  return {
    valid: errors.length === 0,
    platform: (normPlatform === 'x' ? 'x' : normPlatform) as SocialChannel,
    errors,
    warnings,
    characterCount: charCount,
    maxCharacters: config.maxCharacters,
    supportsMedia: config.maxAttachments > 0,
    requiresMedia: config.requiresMedia,
  };
}
