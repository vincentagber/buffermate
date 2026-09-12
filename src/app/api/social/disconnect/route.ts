import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { provider, account_id } = body;

        if (!provider && !account_id) {
            return NextResponse.json({ error: 'provider or account_id is required' }, { status: 400 });
        }

        let query = supabase.from('social_accounts').delete().eq('user_id', user.id);

        if (account_id) {
            query = query.eq('id', account_id);
        } else if (provider) {
            query = query.eq('provider', provider);
        }

        const { error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Account disconnected successfully' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to disconnect account' }, { status: 500 });
    }
}
