import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getMockSupabaseClient } from './mock-client'

export async function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key || url.includes('placeholder')) {
        return getMockSupabaseClient() as any;
    }

    try {
        const cookieStore = await cookies()

        return createServerClient(
            url,
            key,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value, ...options })
                        } catch (error) {
                            // The `set` method was called from a Server Component.
                        }
                    },
                    remove(name: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value: '', ...options })
                        } catch (error) {
                            // The `delete` method was called from a Server Component.
                        }
                    },
                },
            }
        )
    } catch {
        return getMockSupabaseClient() as any;
    }
}
