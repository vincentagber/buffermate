'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    Twitter,
    Facebook,
    Linkedin,
    CheckCircle2,
    Plus,
    Loader2,
    ExternalLink
} from 'lucide-react';

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchAccounts();
    }, []);

    async function fetchAccounts() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('social_accounts')
            .select('*')
            .eq('user_id', user.id);

        if (data) setAccounts(data);
        setLoading(false);
    }

    async function connectProvider(provider: string) {
        try {
            const res = await fetch('/api/social/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Error connecting: ' + data.error);
            }
        } catch (err) {
            alert('Error connecting provider');
        }
    }

    const isConnected = (provider: string) => {
        return accounts.some(acc => acc.provider === provider);
    };

    const providers = [
        {
            id: 'x',
            name: 'X (Twitter)',
            icon: Twitter,
            color: 'bg-black text-white',
            description: 'Connect to schedule tweets and threads.'
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'bg-[#0077b5] text-white',
            description: 'Share professional updates and articles.'
        },
        {
            id: 'facebook',
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-[#1877f2] text-white',
            description: 'Post to your pages and groups.'
        },
        {
            id: 'mock',
            name: 'Mock Provider',
            icon: ExternalLink,
            color: 'bg-gray-600 text-white',
            description: 'Test the connection flow.'
        }
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold">Connected Accounts</h1>
                <p className="text-muted-foreground">Manage your social media connections and permissions.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {providers.map((provider) => {
                        const connected = isConnected(provider.id);
                        return (
                            <div key={provider.id} className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                {connected && (
                                    <div className="absolute top-4 right-4 text-green-500">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                )}
                                <div className="flex items-start space-x-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${provider.color}`}>
                                        <provider.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{provider.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {provider.description}
                                        </p>
                                        <button
                                            onClick={() => connectProvider(provider.id)}
                                            disabled={connected}
                                            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${connected
                                                    ? 'bg-secondary text-muted-foreground cursor-default'
                                                    : 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg'
                                                }`}
                                        >
                                            {connected ? 'Connected' : 'Connect Account'}
                                            {!connected && <Plus className="w-4 h-4 ml-2" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
