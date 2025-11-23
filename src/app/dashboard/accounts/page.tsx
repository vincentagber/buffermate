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
    ExternalLink,
    Youtube,
    Instagram,
    Video,
    Globe,
    AlertCircle
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
            color: 'text-black',
            bg: 'bg-black/5',
            description: 'Schedule tweets and threads.'
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'text-[#0077b5]',
            bg: 'bg-[#0077b5]/5',
            description: 'Share professional updates.'
        },
        {
            id: 'facebook',
            name: 'Facebook',
            icon: Facebook,
            color: 'text-[#1877f2]',
            bg: 'bg-[#1877f2]/5',
            description: 'Post to pages and groups.'
        },
        {
            id: 'instagram',
            name: 'Instagram',
            icon: Instagram,
            color: 'text-[#e1306c]',
            bg: 'bg-[#e1306c]/5',
            description: 'Post photos, reels, and stories.'
        },
        {
            id: 'tiktok',
            name: 'TikTok',
            icon: Video,
            color: 'text-black',
            bg: 'bg-black/5',
            description: 'Share short-form videos.'
        },
        {
            id: 'youtube',
            name: 'YouTube',
            icon: Youtube,
            color: 'text-[#FF0000]',
            bg: 'bg-[#FF0000]/5',
            description: 'Upload videos and shorts.'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-slate-900">Connected Accounts</h1>
                    <p className="text-slate-500">Manage your social media connections and permissions.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <Globe className="w-3 h-3 mr-1.5" />
                    {accounts.length} {accounts.length === 1 ? 'channel' : 'channels'} connected
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {providers.map((provider) => {
                        const connected = isConnected(provider.id);
                        return (
                            <div
                                key={provider.id}
                                className={`group relative bg-white border rounded-xl p-6 transition-all duration-200 ${connected
                                        ? 'border-primary/20 shadow-sm ring-1 ring-primary/5'
                                        : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${provider.bg} ${provider.color}`}>
                                        <provider.icon className="w-6 h-6" />
                                    </div>
                                    {connected && (
                                        <div className="bg-green-50 text-green-600 p-1.5 rounded-full">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">{provider.name}</h3>
                                    <p className="text-sm text-slate-500">
                                        {provider.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => connectProvider(provider.id)}
                                    disabled={connected}
                                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${connected
                                        ? 'bg-slate-50 text-slate-400 cursor-default border border-slate-100'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {connected ? (
                                        <span className="flex items-center">
                                            Connected
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Connect
                                        </span>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5 mr-3 shrink-0" />
                <div>
                    <h4 className="text-sm font-medium text-slate-900">About Permissions</h4>
                    <p className="text-sm text-slate-500 mt-1">
                        Buffermate uses official APIs to publish content on your behalf. We never store your passwords.
                        You can revoke access at any time from the respective platform's settings.
                    </p>
                </div>
            </div>
        </div>
    );
}
