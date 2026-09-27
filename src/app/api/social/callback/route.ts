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

        const supportedProviders = ['mock', 'x', 'twitter', 'linkedin', 'facebook', 'youtube', 'tiktok', 'instagram', 'threads', 'whatsapp'];
        if (supportedProviders.includes(provider.toLowerCase())) {
            accessToken = `access_token_${provider}_` + Date.now();
            refreshToken = `refresh_token_${provider}_` + Date.now();
            expiresAt = new Date(Date.now() + 30 * 86400 * 1000); // 30 days
            
            const handleMap: Record<string, string> = {
                x: '@buffermate_ai',
                twitter: '@buffermate_ai',
                linkedin: 'buffermate-company',
                facebook: 'SocialFlow Facebook Page',
                instagram: '@socialflow.official',
                tiktok: '@socialflow_tok',
                threads: '@socialflow.threads',
                whatsapp: '+1 (555) 019-2834',
                youtube: 'BuffermateChannel',
            };
            providerUserId = handleMap[provider.toLowerCase()] || `${provider}_creator`;
        } else {
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
