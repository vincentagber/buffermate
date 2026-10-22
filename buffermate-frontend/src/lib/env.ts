/**
 * Environment variable validation
 * Ensures all required env vars are present at build/runtime
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
];

const optionalEnvVars = [
  'DATABASE_URL',
  'GEMINI_API_KEY',
  'GEMINI_TEXT_MODEL',
  'GEMINI_IMAGE_MODEL',
  'OPENAI_API_KEY',
  'ENCRYPTION_KEY',
  'NEXT_PUBLIC_APP_URL',
  'AI_FORCE_MOCK',
];

/**
 * Validates that all required environment variables are set
 * Throws an error if any are missing
 */
export function validateEnv() {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env.local file.`
    );
  }
}

/**
 * Get environment variable with optional default
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value || defaultValue || '';
}

export const env = {
  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  databaseUrl: process.env.DATABASE_URL,

  // Google Gemini AI
  geminiApiKey: process.env.NEWSPILOT_GEMINI_API_KEY || process.env.GEMINI_API_KEY,
  geminiTextModel: process.env.NEWSPILOT_GEMINI_MODEL || process.env.GEMINI_TEXT_MODEL || 'gemini-3.1-flash-lite',
  geminiImageModel: process.env.GEMINI_IMAGE_MODEL || 'imagen-3.0-generate-002',

  // Meta / Facebook
  facebookPageId: process.env.NEWSPILOT_FB_PAGE_ID || process.env.FACEBOOK_PAGE_ID || '111006725414026',
  facebookPageAccessToken: process.env.NEWSPILOT_FB_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN,

  // NewsPilot Configuration
  newspilotPublicSiteUrl: process.env.NEWSPILOT_PUBLIC_SITE_URL || 'https://bokoti.com',
  newspilotPostStatus: process.env.NEWSPILOT_POST_STATUS || 'publish',
  newspilotHumanApprovalRequired: process.env.NEWSPILOT_HUMAN_APPROVAL_REQUIRED === '1',
  newspilotFbEnabled: process.env.NEWSPILOT_FB_ENABLED !== '0',

  // OpenAI (fallback/optional)
  openaiApiKey: process.env.OPENAI_API_KEY,

  // Encryption
  encryptionKey: process.env.ENCRYPTION_KEY,

  // App
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // AI
  aiMockForced: process.env.AI_FORCE_MOCK === 'true',

  // Derived
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};
