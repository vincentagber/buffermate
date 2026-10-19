'use client';

import React, { useState, useEffect } from 'react';
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
  Send,
  HelpCircle,
  Check,
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';

interface SocialAccount {
  id: string;
  provider: string;
  username: string;
  created_at?: string;
  token_expires_at?: string;
  status: 'PUBLISHING_ENABLED' | 'CONNECTED' | 'TOKEN_EXPIRED' | 'BLOCKED' | 'FAILED';
  status_details?: string;
  publishing_enabled: boolean;
  meta?: Record<string, any>;
}

interface PlatformConfig {
  configured: boolean;
  free_tier: boolean;
  missing: string[];
  portal_url: string;
  paywall?: boolean;
  notice?: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [platformStatus, setPlatformStatus] = useState<Record<string, PlatformConfig>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Test Post Confirmation Modal
  const [testPostTarget, setTestPostTarget] = useState<{ accountId: string; provider: string; username: string } | null>(null);
  const [testPostResult, setTestPostResult] = useState<{ success: boolean; postId?: string; url?: string; error?: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  useEffect(() => {
    fetchAccounts();

    // Cross-tab / Popup OAuth listener
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SOCIAL_AUTH_SUCCESS') {
        const { provider, profile } = event.data;
        showToast(`🎉 ${provider.toUpperCase()} (${profile}) connected successfully!`, 'success');
        fetchAccounts();
      } else if (event.data?.type === 'SOCIAL_AUTH_ERROR') {
        const { provider, error } = event.data;
        showToast(`⚠️ ${provider?.toUpperCase() || 'OAuth'} Error: ${error}`, 'error');
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  async function fetchAccounts() {
    try {
      const res = await fetch('/api/social/accounts');
      if (res.ok) {
        const data = await res.json();
        if (data.accounts && Array.isArray(data.accounts)) {
          setAccounts(data.accounts);
        }
        if (data.platform_status) {
          setPlatformStatus(data.platform_status);
        }
      }
    } catch (e) {
      console.error('Error fetching accounts:', e);
    } finally {
      setLoading(false);
    }
  }

  // Launch Official OAuth Popup
  const handleLaunchOAuthPopup = async (provider: string) => {
    setActionLoading(`connect_${provider}`);
    try {
      const res = await fetch('/api/social/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });

      const data = await res.json();

      if (data.url) {
        const w = 620;
        const h = 740;
        const left = window.screen.width / 2 - w / 2;
        const top = window.screen.height / 2 - h / 2;
        window.open(
          data.url,
          `Connect_${provider}`,
          `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${w},height=${h},top=${top},left=${left}`
        );
      } else {
        const missingText = data.missingCredentials?.join(', ') || 'Developer credentials required';
        showToast(`⚠️ ${provider.toUpperCase()} is blocked: ${data.message || missingText}`, 'error');
      }
    } catch (err: any) {
      showToast(`Connection failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Run Real Connection Test Handshake
  const handleTestConnection = async (platform: string, accountId?: string) => {
    setActionLoading(`test_${accountId || platform}`);
    try {
      const res = await fetch(`/api/social/test-connection?platform=${platform}`);
      const data = await res.json();
      const report = data.report;

      if (data.success) {
        showToast(`✅ ${platform.toUpperCase()} verified! Live API handshake passed (${report?.overallLatencyMs || 0}ms).`, 'success');
      } else {
        const reason = report?.errorDetails || report?.blockerDescription || 'API rejected authentication';
        showToast(`⚠️ ${platform.toUpperCase()} Test Result: ${reason}`, 'error');
      }
      fetchAccounts();
    } catch (err: any) {
      showToast(`Test error: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Refresh OAuth Token
  const handleRefreshToken = async (accountId: string, provider: string) => {
    setActionLoading(`refresh_${accountId}`);
    try {
      const res = await fetch('/api/social/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId, provider }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`🎉 ${provider.toUpperCase()} token refreshed successfully! Valid for 60 days.`, 'success');
        fetchAccounts();
      } else {
        showToast(`Refresh failed: ${data.error || 'Re-authorization required'}`, 'error');
      }
    } catch (err: any) {
      showToast(`Refresh exception: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Disconnect Account
  async function handleDisconnect(provider: string, accountId?: string) {
    if (!confirm(`Are you sure you want to disconnect this ${provider.toUpperCase()} account? Tokens will be revoked and deleted.`)) {
      return;
    }
    const loadingKey = `disconnect_${accountId || provider}`;
    setActionLoading(loadingKey);
    try {
      await fetch('/api/social/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, account_id: accountId }),
      });
      showToast(`${provider.toUpperCase()} disconnected successfully.`, 'info');
      fetchAccounts();
    } catch (err: any) {
      showToast(`Disconnect failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  }

  // Publish Real Test Post
  const handleExecuteTestPost = async () => {
    if (!testPostTarget) return;
    setActionLoading(`testpost_${testPostTarget.accountId}`);
    setTestPostResult(null);

    const testContent = `BufferMate Real-Account Connection Test (${new Date().toLocaleTimeString()} WAT). Live official API verification passed! 🚀 #buffermate`;

    try {
      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: testContent,
          social_account_ids: [testPostTarget.accountId],
          attachments: testPostTarget.provider === 'instagram' ? ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&q=85'] : [],
        }),
      });

      const data = await res.json();
      const firstResult = data.results?.[0];

      if (res.ok && data.success) {
        setTestPostResult({
          success: true,
          postId: firstResult?.post_id || 'confirmed',
          url: firstResult?.url,
        });
        showToast(`🎉 Test post published live to ${testPostTarget.provider.toUpperCase()}!`, 'success');
      } else {
        setTestPostResult({
          success: false,
          error: data.error || firstResult?.error || 'Provider rejected test dispatch.',
        });
        showToast(`⚠️ Test post failed: ${data.error || firstResult?.error}`, 'error');
      }
    } catch (err: any) {
      setTestPostResult({
        success: false,
        error: err.message || 'Network exception during test publishing.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const providers = [
    {
      id: 'facebook',
      name: 'Facebook Pages',
      subtitle: 'Meta Graph API v20.0',
      description: 'Official free tier for developer-managed Pages. Direct feed updates, photo attachments, and comment funnels.',
      color: 'bg-[#EFF6FF] text-[#1877F2] border-[#BFDBFE]',
      free: true,
      mediaRequired: 'Optional (Images supported)',
    },
    {
      id: 'instagram',
      name: 'Instagram Professional',
      subtitle: 'Instagram Graph API via Meta',
      description: 'Official free container publishing for linked Business or Creator accounts. Requires public HTTPS image/video assets.',
      color: 'bg-gradient-to-tr from-[#FFF0F5] to-[#FFE4E6] text-[#E1306C] border-[#FECDD3]',
      free: true,
      mediaRequired: 'Mandatory (Image or Video)',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Organization & Member',
      subtitle: 'Community Management / UGC API',
      description: 'Official free publishing API for individual member profiles and verified company organization pages.',
      color: 'bg-[#EFF6FF] text-[#0A66C2] border-[#BFDBFE]',
      free: true,
      mediaRequired: 'Optional (Text or Images)',
    },
    {
      id: 'tiktok',
      name: 'TikTok for Business',
      subtitle: 'TikTok Content Posting API v2',
      description: 'Official free video distribution API for authorized creators and business accounts. Strictly requires video files.',
      color: 'bg-neutral-900 text-white border-neutral-700',
      free: true,
      mediaRequired: 'Mandatory (Video Only)',
    },
    {
      id: 'threads',
      name: 'Meta Threads',
      subtitle: 'Threads API v1.0',
      description: 'Official free Meta Threads publishing API. Direct post creation, text threads, and photo shares.',
      color: 'bg-neutral-950 text-white border-neutral-800',
      free: true,
      mediaRequired: 'Optional (Text or Image)',
    },
    {
      id: 'x',
      name: 'X (Twitter API v2)',
      subtitle: 'Twitter Developer v2 (Paywalled)',
      description: 'Write access requires paid developer credits or Basic plan ($100/mo). Free publishing is disabled by X platform.',
      color: 'bg-neutral-900 text-neutral-400 border-neutral-800',
      free: false,
      mediaRequired: 'Optional',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-12 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-4 sm:right-6 z-50 text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-fade-in ${
            toastMessage.type === 'error' ? 'bg-red-600' : toastMessage.type === 'info' ? 'bg-blue-600' : 'bg-[#1E293B]'
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
            Official Social API Connections
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Free-first direct official OAuth integrations. Authenticate real accounts without paid intermediary tools.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="px-3.5 py-2 bg-gradient-to-r from-[#FFF0E6] to-[#FFE4D6] border border-[#FED7AA] rounded-2xl shadow-xs flex items-center space-x-2 text-xs font-bold text-[#9A3412]">
            <ShieldCheck className="w-4 h-4 text-[#E05A2B]" />
            <span>{accounts.filter((a) => a.publishing_enabled).length} Live Publishing Accounts</span>
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
            const providerAccounts = accounts.filter((a) => a.provider === provider.id);
            const isConnected = providerAccounts.length > 0;
            const primaryAccount = providerAccounts[0];
            const pConfig = platformStatus[provider.id] || { configured: false, missing: [] };
            const isBlocked = !pConfig.configured || provider.id === 'x';
            const isPublishingReady = isConnected && primaryAccount?.publishing_enabled;
            const isExpired = isConnected && primaryAccount?.status === 'TOKEN_EXPIRED';
            const isLoading = actionLoading?.includes(provider.id);

            return (
              <div
                key={provider.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xs border-2 border-dashed ${
                  isPublishingReady
                    ? 'border-emerald-300 hover:border-emerald-400 bg-white'
                    : isConnected
                    ? 'border-amber-300 bg-[#FFFDF9]'
                    : isBlocked
                    ? 'border-[#E2D9CF] bg-[#FAF8F5]/80'
                    : 'border-[#CBD5E1] hover:border-[#FED7AA]'
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
                        <div className="flex items-center space-x-1.5">
                          <h3 className="text-sm font-bold text-[#1E293B] leading-tight">
                            {provider.name}
                          </h3>
                          {provider.free && (
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-md text-[9px] font-extrabold uppercase">
                              Free API
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                          {provider.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        isPublishingReady
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isExpired
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : isConnected
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : isBlocked
                          ? 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}
                    >
                      {isPublishingReady
                        ? '● PUBLISHING READY'
                        : isExpired
                        ? '⚠️ TOKEN EXPIRED'
                        : isConnected
                        ? '○ CONNECTED (READ ONLY)'
                        : isBlocked
                        ? '🚫 BLOCKED'
                        : 'READY TO CONNECT'}
                    </span>
                  </div>

                  {/* Connected Profiles List */}
                  {isConnected ? (
                    <div className="space-y-2">
                      {providerAccounts.map((acc) => (
                        <div
                          key={acc.id}
                          className="p-3 rounded-2xl bg-[#FCFAF7] border border-[#F5EFE8] flex items-center justify-between text-xs"
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-[#64748B] text-[10px] uppercase font-bold tracking-wider">
                              Verified Identity:
                            </span>
                            <span className="font-bold truncate text-xs text-[#1E293B]">
                              {acc.username}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] mt-0.5">
                              {acc.status_details || 'Official OAuth verified'}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            {acc.status === 'TOKEN_EXPIRED' && (
                              <button
                                type="button"
                                onClick={() => handleRefreshToken(acc.id, provider.id)}
                                disabled={isLoading}
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center space-x-1"
                                title="Renew expired token"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Refresh</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDisconnect(provider.id, acc.id)}
                              className="p-1.5 text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                              title="Disconnect account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#F1E9DF] text-xs">
                      {isBlocked ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-1.5 text-rose-600 font-bold text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Missing Server Credentials</span>
                          </div>
                          <p className="text-[10px] text-[#64748B] leading-relaxed">
                            {provider.id === 'x'
                              ? 'X API v2 write endpoints require a paid developer plan or credits. BufferMate prioritizes free official platform APIs.'
                              : `Configure ${pConfig.missing?.join(', ')} in your server environment to enable official OAuth.`}
                          </p>
                          {pConfig.portal_url && (
                            <a
                              href={pConfig.portal_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 text-[10px] font-bold text-[#E05A2B] hover:underline pt-0.5"
                            >
                              <span>Open Developer Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-emerald-700">
                          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                          <span className="text-[11px] font-bold">Official OAuth app configured. Ready to authorize.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Platform Specifications */}
                  <div className="text-[11px] text-[#64748B] space-y-1">
                    <p className="leading-relaxed">{provider.description}</p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-[#94A3B8]">
                      <span>Media spec:</span>
                      <span className="font-semibold text-[#475569]">{provider.mediaRequired}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-3 border-t border-[#F5EFE8]">
                  {isConnected ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleTestConnection(provider.id, primaryAccount.id)}
                        disabled={isLoading}
                        className="py-2 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                      >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-[#E05A2B]" />}
                        <span>Verify API</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTestPostTarget({
                            accountId: primaryAccount.id,
                            provider: provider.id,
                            username: primaryAccount.username,
                          });
                          setTestPostResult(null);
                        }}
                        disabled={isLoading || !isPublishingReady}
                        className="py-2 px-3 bg-[#FFF0E6] hover:bg-[#FFE4D6] text-[#E05A2B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Test Post</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleLaunchOAuthPopup(provider.id)}
                      disabled={isLoading || isBlocked}
                      className="w-full py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>
                        {isBlocked ? 'Setup Required to Connect' : `Authorize ${provider.name}`}
                      </span>
                    </button>
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
            AES-256-GCM Token Encryption & Free-First Official Policy
          </h4>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
            OAuth access tokens are encrypted at rest with distinct initialization vectors and decrypted only server-side during authorized dispatches. Buffermate connects directly to official platform endpoints (Meta Graph API, LinkedIn UGC API, TikTok Content Posting API) without third-party publishing surcharges.
          </p>
        </div>
      </div>

      {/* Real Test Post Confirmation Modal */}
      {testPostTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-dashed border-[#CBD5E1] my-auto">
            <div className="p-4 sm:p-6 border-b border-[#F5EFE8] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] border border-[#FED7AA] flex items-center justify-center text-[#E05A2B]">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E293B]">
                    Send Test Post: {testPostTarget.provider.toUpperCase()}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Destination: <span className="font-bold text-[#1E293B]">{testPostTarget.username}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTestPostTarget(null)}
                className="w-8 h-8 rounded-full hover:bg-[#FAF6F0] flex items-center justify-center text-[#64748B]"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 text-xs">
              <div className="bg-[#FAF8F5] border border-[#FED7AA] rounded-2xl p-4 space-y-2">
                <span className="font-bold text-[#334155] block">Post Payload Preview:</span>
                <p className="text-xs text-[#1E293B] font-mono bg-white p-3 rounded-xl border border-[#E2D9CF] leading-relaxed">
                  BufferMate Real-Account Connection Test ({new Date().toLocaleTimeString()} WAT). Live official API verification passed! 🚀 #buffermate
                </p>
                <p className="text-[10px] text-[#64748B]">
                  This post will be dispatched live to your connected account using the official provider API. You can delete it on your social profile afterwards.
                </p>
              </div>

              {testPostResult && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs ${
                    testPostResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {testPostResult.success ? (
                    <div className="space-y-1">
                      <div className="font-bold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Post Dispatched & Confirmed by Platform!</span>
                      </div>
                      <p className="text-[11px]">External Post ID: <span className="font-mono">{testPostResult.postId}</span></p>
                      {testPostResult.url && (
                        <a
                          href={testPostResult.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 font-bold underline pt-1 text-emerald-700"
                        >
                          <span>View on {testPostTarget.provider.toUpperCase()}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="font-bold flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>Publishing Error from Provider</span>
                      </div>
                      <p className="text-[11px]">{testPostResult.error}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setTestPostTarget(null)}
                  className="px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-[#FAF6F0] rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleExecuteTestPost}
                  disabled={actionLoading?.startsWith('testpost_')}
                  className="px-5 py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center space-x-1.5"
                >
                  {actionLoading?.startsWith('testpost_') ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Publish Real Test Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
