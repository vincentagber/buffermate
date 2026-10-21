/**
 * Magic Link Authentication Service
 * Email-based passwordless sign-in for Supabase
 */

import { createClient } from '@/lib/supabase/client';

export async function signInWithMagicLink(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to send magic link',
    };
  }
}

/**
 * Verify OTP code from magic link
 */
export async function verifyOtpCode(email: string, token: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to verify magic link',
    };
  }
}
