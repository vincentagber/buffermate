import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/services/encryption';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const provider = searchParams.get('provider');

    if (!code || !provider) {
        return NextResponse.json({ error: 'Missing code or provider' }, { status: 400 });
    }

    try {
        let accessToken = '';
        let refreshToken = '';
        let expiresAt = new Date();
        let providerUserId = '';

        if (provider === 'mock') {
            accessToken = 'mock_access_token_' + Date.now();
            refreshToken = 'mock_refresh_token_' + Date.now();
            expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour
            providerUserId = 'mock_user_' + Date.now();
        } else {
            // Implement real OAuth token exchange here
            return NextResponse.json({ error: 'Provider not supported yet' }, { status: 400 });
        }

        // Save to social_accounts
        const { error } = await supabase
            .from('social_accounts')
            .upsert({
                user_id: user.id,
                provider,
                provider_user_id: providerUserId,
                access_token_encrypted: encrypt(accessToken),
                refresh_token_encrypted: refreshToken ? encrypt(refreshToken) : null,
                token_expires_at: expiresAt.toISOString(),
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id, provider, provider_user_id' });

        if (error) {
            throw error;
        }

        // Redirect back to accounts page
        return NextResponse.redirect(new URL('/dashboard/accounts', request.url));

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
