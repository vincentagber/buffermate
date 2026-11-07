import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gvmpxbqoetzlftclfbpl.supabase.co';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_GqNAtFAASo6Gy0Vbs9sMUw_xSRRbOLR';

    if (!url || !key) {
        throw new Error('Supabase URL or Anon key is missing from environment variables.');
    }

    return createBrowserClient(url, key);
}
