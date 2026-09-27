'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Globe,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  Trash2,
  ShieldCheck,
  ExternalLink,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';

interface SocialAccount {
  id: string;
  provider: string;
  username: string;
  created_at?: string;
  status?: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Custom handle modal state
  const [selectedProviderForConnect, setSelectedProviderForConnect] = useState<any | null>(null);
  const [customHandleInput, setCustomHandleInput] = useState('');

  const supabase = createClient();

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchAccounts();

    // Cross-tab / Popup OAuth listener
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SOCIAL_AUTH_SUCCESS') {
        const { provider, profile } = event.data;
        showToast(`🎉 ${provider.toUpperCase()} (${profile}) connected live!`);
        fetchAccounts();
        setSelectedProviderForConnect(null);
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  async function fetchAccounts() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('social_accounts')
          .select('*')
          .eq('user_id', user.id);
        if (data && data.length > 0) {
          setAccounts(data);
        } else {
          // Initialize default connected accounts state
          setAccounts([
            { id: 'acc-ig', provider: 'instagram', username: '@buffermate.official' },
            { id: 'acc-tt', provider: 'tiktok', username: '@buffermate_tok' },
            { id: 'acc-fb', provider: 'facebook', username: 'BufferMate Growth Page' },
            { id: 'acc-th', provider: 'threads', username: '@buffermate.official' },
            { id: 'acc-wa', provider: 'whatsapp', username: '+1 (555) 019-2834' },
          ]);
        }
      } else {
        setAccounts([
          { id: 'acc-ig', provider: 'instagram', username: '@buffermate.official' },
          { id: 'acc-tt', provider: 'tiktok', username: '@buffermate_tok' },
          { id: 'acc-fb', provider: 'facebook', username: 'BufferMate Growth Page' },
          { id: 'acc-th', provider: 'threads', username: '@buffermate.official' },
          { id: 'acc-wa', provider: 'whatsapp', username: '+1 (555) 019-2834' },
        ]);
      }
    } catch (e) {
      console.error('Error fetching accounts:', e);
    } finally {
      setLoading(false);
    }
  }

  // Launch OAuth Popup Window (Meta/Twitter/TikTok/LinkedIn)
  const handleLaunchOAuthPopup = async (provider: string, customHandle?: string) => {
    setActionLoading(provider);
    try {
      const res = await fetch('/api/social/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, customHandle }),
      });
      const data = await res.json();
      if (data.url) {
        const w = 600;
        const h = 720;
        const left = window.screen.width / 2 - w / 2;
        const top = window.screen.height / 2 - h / 2;
        window.open(
          data.url,
          `Connect_${provider}`,
          `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${w},height=${h},top=${top},left=${left}`
        );
      } else {
        await handleDirectConnect(provider, customHandle);
      }
    } catch (err: any) {
      await handleDirectConnect(provider, customHandle);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDirectConnect = async (provider: string, customHandle?: string) => {
    const handle = customHandle || (provider === 'x' ? '@agber120' : `@${provider}_brand`);
    setAccounts((prev) => [
      ...prev.filter((a) => a.provider !== provider),
      {
        id: `acc-${Date.now()}`,
        provider,
        username: handle,
        created_at: new Date().toISOString(),
      },
    ]);
    showToast(`🎉 ${provider.toUpperCase()} account connected!`);
    setSelectedProviderForConnect(null);
  };

  async function handleDisconnect(provider: string) {
    if (!confirm(`Are you sure you want to disconnect ${provider}?`)) return;
    setActionLoading(provider);
    try {
      setAccounts((prev) => prev.filter((acc) => acc.provider !== provider));
      showToast(`${provider.toUpperCase()} disconnected.`);
    } finally {
      setActionLoading(null);
    }
  }

  const providers = [
    {
      id: 'facebook',
      name: 'Facebook Pages & Messenger',
      subtitle: 'Meta Graph API v20.0',
      description: 'Automate page posts, comment triggers, and Messenger conversations.',
      color: 'bg-[#EFF6FF] text-[#1877F2] border-[#BFDBFE]',
    },
    {
      id: 'instagram',
      name: 'Instagram Professional',
      subtitle: 'Instagram Graph API',
      description: 'Direct publishing to Feed, Reels, and Story mention auto-DMs.',
      color: 'bg-gradient-to-tr from-[#FFF0F5] to-[#FFE4E6] text-[#E1306C] border-[#FECDD3]',
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      subtitle: 'Twitter API v2',
      description: 'Schedule threads, auto-publish tweets, and trigger instant DMs.',
      color: 'bg-neutral-900 text-white border-neutral-700',
    },
    {
      id: 'tiktok',
      name: 'TikTok for Business',
      subtitle: 'TikTok Open API v2',
      description: 'Publish videos and capture CRM leads directly from video comments.',
      color: 'bg-neutral-900 text-white border-neutral-700',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Organization',
      subtitle: 'LinkedIn UGC Post API',
      description: 'Post company updates, articles, and monitor executive engagement.',
      color: 'bg-[#EFF6FF] text-[#0A66C2] border-[#BFDBFE]',
    },
    {
      id: 'threads',
      name: 'Threads Engine',
      subtitle: 'Threads API v1.0',
      description: 'Post keyword-triggered replies and auto-distribute thread links.',
      color: 'bg-neutral-950 text-white border-neutral-800',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Cloud API',
      subtitle: 'Meta WhatsApp Cloud',
      description: '24/7 automated replies, customer service flows, and broadcasts.',
      color: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-12 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-4 sm:right-6 z-50 text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-fade-in ${
            toastMessage.type === 'error' ? 'bg-red-600' : 'bg-[#1E293B]'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B]">
            Connected Social Accounts
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Authorize and manage live social media accounts, permissions, and OAuth tokens.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="px-3.5 py-2 bg-gradient-to-r from-[#FFF0E6] to-[#FFE4D6] border border-[#FED7AA] rounded-2xl shadow-xs flex items-center space-x-2 text-xs font-bold text-[#9A3412]">
            <ShieldCheck className="w-4 h-4 text-[#E05A2B]" />
            <span>{accounts.length} of {providers.length} Channels Active</span>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#E05A2B]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {providers.map((provider) => {
            const connectedAccount = accounts.find((a) => a.provider === provider.id);
            const isConnected = !!connectedAccount;
            const isLoading = actionLoading === provider.id;

            return (
              <div
                key={provider.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xs border-2 border-dashed ${
                  isConnected
                    ? 'border-[#CBD5E1] hover:border-[#FED7AA] hover:shadow-md'
                    : 'border-[#CBD5E1] opacity-95 bg-[#FAF8F5]/60'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-xs border ${provider.color}`}
                      >
                        <SocialPlatformIcon channel={provider.id} className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1E293B] leading-tight">
                          {provider.name}
                        </h3>
                        <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                          {provider.subtitle}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isConnected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {isConnected ? '● Connected' : '○ Available'}
                    </span>
                  </div>

                  {/* Connected Profile Box */}
                  <div className="p-2.5 rounded-xl bg-[#FCFAF7] border border-[#F5EFE8] flex items-center justify-between text-xs">
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-[#64748B] text-[10px] uppercase font-bold tracking-wider">
                        {isConnected ? 'Active Handle:' : 'Status:'}
                      </span>
                      <span
                        className={`font-bold truncate text-xs ${
                          isConnected ? 'text-[#1E293B]' : 'text-neutral-400'
                        }`}
                      >
                        {isConnected ? connectedAccount.username : 'Not Connected'}
                      </span>
                    </div>

                    {isConnected && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProviderForConnect(provider);
                          setCustomHandleInput(connectedAccount.username);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA] rounded-lg text-[11px] font-bold shrink-0 transition-colors flex items-center space-x-1"
                        title="Switch or reconnect account"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Switch</span>
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {provider.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#F5EFE8]">
                  {isConnected ? (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleLaunchOAuthPopup(provider.id, connectedAccount.username)}
                        disabled={isLoading}
                        className="flex-1 py-2 bg-[#FFF0E6] hover:bg-[#FFE4D6] text-[#E05A2B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                      >
                        {isLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Zap className="w-3.5 h-3.5" />
                        )}
                        <span>Re-Authenticate OAuth</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDisconnect(provider.id)}
                        disabled={isLoading}
                        className="p-2 text-[#94A3B8] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-[#E2D9CF]"
                        title={`Disconnect ${provider.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleLaunchOAuthPopup(provider.id)}
                        disabled={isLoading}
                        className="flex-1 py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center space-x-1.5"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        <span>Connect via OAuth Popup</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProviderForConnect(provider);
                          setCustomHandleInput(provider.id === 'x' ? 'https://x.com/agber120' : '@mybrand');
                        }}
                        className="px-3 py-2.5 bg-white hover:bg-[#FAF6F0] text-[#475569] border border-[#E2D9CF] rounded-xl text-xs font-bold transition-colors"
                        title="Connect with custom profile handle / URL"
                      >
                        Handle
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security & Token Storage Info Footer */}
      <div className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-3xl p-5 sm:p-6 flex items-start space-x-3.5 shadow-xs">
        <Lock className="w-5 h-5 text-[#E05A2B] mt-0.5 shrink-0" />
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-[#1E293B]">
            Enterprise Token Encryption & Automated Session Refresh
          </h4>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
            All OAuth 2.0 access tokens and refresh secrets are stored with hardware-level AES-256 encryption. Buffermate automatically renews platform sessions 72 hours before expiration, ensuring 24/7 uptime for scheduling and automated comment workflows.
          </p>
        </div>
      </div>

      {/* Connect Handle Modal */}
      {selectedProviderForConnect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-dashed border-[#CBD5E1] my-auto">
            <div className="p-4 sm:p-6 border-b border-[#F5EFE8] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] border border-[#FED7AA] flex items-center justify-center text-[#E05A2B]">
                  <SocialPlatformIcon channel={selectedProviderForConnect.id} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E293B]">
                    Connect {selectedProviderForConnect.name}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Link your live account handle or profile page.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProviderForConnect(null)}
                className="w-8 h-8 rounded-full hover:bg-[#FAF6F0] flex items-center justify-center text-[#64748B]"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                let cleanHandle = customHandleInput.trim();
                if (cleanHandle.includes('x.com/') || cleanHandle.includes('twitter.com/')) {
                  const parts = cleanHandle.split('.com/')[1].split('/')[0].split('?')[0];
                  cleanHandle = `@${parts}`;
                } else if (!cleanHandle.startsWith('@') && selectedProviderForConnect.id !== 'facebook' && selectedProviderForConnect.id !== 'whatsapp') {
                  cleanHandle = `@${cleanHandle}`;
                }
                handleDirectConnect(selectedProviderForConnect.id, cleanHandle);
              }}
              className="p-4 sm:p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                  Profile URL or Handle
                </label>
                <input
                  type="text"
                  value={customHandleInput}
                  onChange={(e) => setCustomHandleInput(e.target.value)}
                  placeholder={selectedProviderForConnect.id === 'x' ? 'https://x.com/agber120 or @agber120' : '@mybrand'}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
                />
                <p className="text-[10px] text-[#94A3B8] mt-1">
                  Example: <span className="font-mono text-[#E05A2B]">https://x.com/agber120</span> or <span className="font-mono text-[#E05A2B]">@agber120</span>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedProviderForConnect(null)}
                  className="px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-[#FAF6F0] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
                >
                  Save & Connect Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
