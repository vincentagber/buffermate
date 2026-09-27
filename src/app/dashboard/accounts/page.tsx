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
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchAccounts();
    }, []);

    async function fetchAccounts() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('social_accounts')
                    .select('*')
                    .eq('user_id', user.id);
                if (data) setAccounts(data);
            }
        } catch (e) {
            console.error('Error fetching accounts:', e);
        } finally {
            setLoading(false);
        }
    }

    async function connectProvider(provider: string) {
        setActionLoading(provider);
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
                // If mock or simulated connect
                setAccounts((prev) => [
                    ...prev,
                    {
                        id: `acc-${Date.now()}`,
                        provider,
                        username: `@${provider}_brand`,
                        created_at: new Date().toISOString(),
                    },
                ]);
            }
        } catch (err) {
            alert('Error connecting provider');
        } finally {
            setActionLoading(null);
        }
    }

    async function disconnectProvider(provider: string) {
        if (!confirm(`Are you sure you want to disconnect ${provider}?`)) return;
        setActionLoading(provider);
        try {
            const res = await fetch('/api/social/disconnect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider }),
            });
            setAccounts((prev) => prev.filter((acc) => acc.provider !== provider));
        } catch (err) {
            alert('Error disconnecting provider');
        } finally {
            setActionLoading(null);
        }
    }

    const isConnected = (provider: string) => {
        return accounts.some(acc => acc.provider === provider);
    };

    const providers = [
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
            id: 'facebook',
            name: 'Facebook',
            icon: Facebook,
            color: 'text-[#1877f2]',
            bg: 'bg-[#1877f2]/5',
            description: 'Post to pages and groups.'
        },
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
            id: 'youtube',
            name: 'YouTube',
            icon: Youtube,
            color: 'text-[#FF0000]',
            bg: 'bg-[#FF0000]/5',
            description: 'Upload videos and shorts.'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">Connected Accounts</h1>
                    <p className="text-xs sm:text-sm text-slate-500">Manage your social media connections and channel permissions.</p>
                </div>
                <div className="bg-orange-50 text-[#E05A2B] border border-[#FED7AA] px-3 py-1.5 rounded-full text-xs font-semibold flex items-center self-start sm:self-auto">
                    <Globe className="w-3 h-3 mr-1.5" />
                    {accounts.length} {accounts.length === 1 ? 'channel' : 'channels'} active
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#E05A2B]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {providers.map((provider) => {
                        const connected = isConnected(provider.id);
                        return (
                            <div
                                key={provider.id}
                                className={`group relative bg-white border-2 border-dashed rounded-2xl p-5 sm:p-6 transition-all duration-200 ${connected
                                        ? 'border-emerald-300 shadow-sm ring-1 ring-emerald-100'
                                        : 'border-[#CBD5E1] shadow-xs hover:shadow-md hover:border-[#FED7AA]'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${provider.bg} ${provider.color}`}>
                                        <provider.icon className="w-6 h-6" />
                                    </div>
                                    {connected && (
                                        <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1">{provider.name}</h3>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        {provider.description}
                                    </p>
                                </div>

                                {connected ? (
                                    <div className="flex gap-2">
                                        <div className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                                            Active
                                        </div>
                                        <button
                                            onClick={() => disconnectProvider(provider.id)}
                                            disabled={actionLoading === provider.id}
                                            className="py-2 px-3 rounded-xl text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            {actionLoading === provider.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Disconnect'}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => connectProvider(provider.id)}
                                        disabled={actionLoading === provider.id}
                                        className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center bg-white text-slate-700 border border-[#E2D9CF] hover:border-[#E05A2B] hover:bg-[#FAF6F0] hover:text-[#E05A2B] disabled:opacity-50"
                                    >
                                        {actionLoading === provider.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Connect
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-8 bg-white border-2 border-dashed border-[#CBD5E1] rounded-2xl p-4 sm:p-5 flex items-start shadow-xs">
                <AlertCircle className="w-5 h-5 text-[#E05A2B] mt-0.5 mr-3 shrink-0" />
                <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">About Permissions & Security</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Buffermate and SocialFlow use official OAuth & webhook APIs to automate comments, DMs, and scheduling. We never store raw passwords and all tokens are AES-256 encrypted.
                    </p>
                </div>
            </div>
        </div>
    );
}
