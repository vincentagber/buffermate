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

  // OpenAI
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
