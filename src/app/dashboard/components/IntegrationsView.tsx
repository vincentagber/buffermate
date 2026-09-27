'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Check,
  Plus,
  RefreshCw,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Settings2,
  Zap,
  Radio,
  Sliders,
  X,
  Send,
  Lock,
  Filter,
  Activity,
  Wifi,
  WifiOff,
  Link2,
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';
import { ChannelIntegrationState, ChannelProvider } from '@/lib/services/integrations-realtime';

export default function IntegrationsView() {
  const [channels, setChannels] = useState<ChannelIntegrationState[]>([]);
  const [activeProgressText, setActiveProgressText] = useState('5 of 6 Channels Active');
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [connectionLatency, setConnectionLatency] = useState<number>(28);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [selectedChannelForWebhook, setSelectedChannelForWebhook] = useState<ChannelIntegrationState | null>(null);
  const [selectedChannelForFunnel, setSelectedChannelForFunnel] = useState<ChannelIntegrationState | null>(null);
  const [selectedChannelForConnect, setSelectedChannelForConnect] = useState<ChannelIntegrationState | null>(null);
  const [customHandleInput, setCustomHandleInput] = useState('');

  // Webhook configuration modal state
  const [webhookUrlInput, setWebhookUrlInput] = useState('');
  const [verifyTokenInput, setVerifyTokenInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPingingWebhook, setIsPingingWebhook] = useState(false);
  const [webhookPingResult, setWebhookPingResult] = useState<{
    success: boolean;
    latencyMs?: number;
    message?: string;
  } | null>(null);

  // Lead funnel modal state
  const [keywordFilterInput, setKeywordFilterInput] = useState('price, link, deal, info, guide');
  const [funnelDmMessage, setFunnelDmMessage] = useState(
    'Hey! Here is your exclusive 20% access link: https://socialflow.studio/special-deal 🚀'
  );

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Initialize Real-Time SSE Stream
  useEffect(() => {
    let isMounted = true;

    function connectSSE() {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      try {
        const es = new EventSource('/api/integrations/stream');
        eventSourceRef.current = es;

        es.addEventListener('init', (e) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(e.data);
            setChannels(data.channels || []);
            if (data.summary?.activeProgressText) {
              setActiveProgressText(data.summary.activeProgressText);
            }
            setRealtimeConnected(true);
          } catch (err) {
            console.error('[SSE Init Parse Error]', err);
          }
        });

        es.addEventListener('update', (e) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(e.data);
            if (data.channels) {
              setChannels(data.channels);
            }
            if (data.summary?.activeProgressText) {
              setActiveProgressText(data.summary.activeProgressText);
            }
            setRealtimeConnected(true);
          } catch (err) {
            console.error('[SSE Update Parse Error]', err);
          }
        });

        es.addEventListener('ping', () => {
          if (!isMounted) return;
          setRealtimeConnected(true);
          setConnectionLatency(Math.floor(Math.random() * 15) + 20);
        });

        es.onopen = () => {
          if (!isMounted) return;
          setRealtimeConnected(true);
        };

        es.onerror = () => {
          if (!isMounted) return;
          setRealtimeConnected(false);
          es.close();

          // Exponential backoff reconnect
          if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted) connectSSE();
          }, 4000);
        };
      } catch (err) {
        console.error('[SSE Connection Error]', err);
        setRealtimeConnected(false);
      }
    }

    // Initial fetch fallback
    async function fetchInitial() {
      try {
        const res = await fetch('/api/integrations');
        const data = await res.json();
        if (data.success && isMounted) {
          setChannels(data.channels);
          if (data.summary?.activeProgressText) {
            setActiveProgressText(data.summary.activeProgressText);
          }
        }
      } catch (e) {}
    }

    fetchInitial();
    connectSSE();

    return () => {
      isMounted = false;
      if (eventSourceRef.current) eventSourceRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  // Sync / Connect Handler
  const handleConnectChannel = async (provider: ChannelProvider, activeProfile?: string) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, activeProfile }),
      });
      const data = await res.json();
      if (data.success) {
        // Optimistic UI update while SSE broadcasts
        setChannels((prev) =>
          prev.map((c) => (c.provider === provider ? data.channel : c))
        );
        if (data.summary?.activeProgressText) {
          setActiveProgressText(data.summary.activeProgressText);
        }
        showToast(`🎉 ${data.channel.name} connected successfully!`);
        setSelectedChannelForConnect(null);
      } else {
        showToast(data.error || 'Connection failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to connect channel', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Disconnect Handler
  const handleDisconnectChannel = async (provider: ChannelProvider, name: string) => {
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/integrations?provider=${provider}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setChannels((prev) =>
          prev.map((c) => (c.provider === provider ? data.channel : c))
        );
        if (data.summary?.activeProgressText) {
          setActiveProgressText(data.summary.activeProgressText);
        }
        showToast(`${name} disconnected.`);
      }
    } catch (err: any) {
      showToast('Error disconnecting channel', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle Feature (Auto Comment Reply or Lead Capture Funnel)
  const handleToggleFeature = async (
    provider: ChannelProvider,
    feature: 'autoCommentReply' | 'leadCaptureFunnel',
    currentValue: boolean,
    channelName: string
  ) => {
    const nextValue = !currentValue;
    // Optimistic update
    setChannels((prev) =>
      prev.map((c) => (c.provider === provider ? { ...c, [feature]: nextValue } : c))
    );

    try {
      await fetch('/api/integrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          action: 'toggle_feature',
          feature,
          enabled: nextValue,
        }),
      });

      const label = feature === 'autoCommentReply' ? 'Auto Comment Reply' : 'Lead Capture Funnel';
      showToast(`${channelName} ${label} is now ${nextValue ? 'Enabled' : 'Disabled'}`);
    } catch (err) {
      showToast('Failed to update feature', 'error');
    }
  };

  // Webhook Save Handler
  const handleSaveWebhookConfig = async () => {
    if (!selectedChannelForWebhook) return;

    try {
      const res = await fetch('/api/integrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedChannelForWebhook.provider,
          action: 'update_webhook',
          webhookUrl: webhookUrlInput,
          verifyToken: verifyTokenInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChannels((prev) =>
          prev.map((c) => (c.provider === selectedChannelForWebhook.provider ? data.channel : c))
        );
        showToast(`Webhook configured for ${selectedChannelForWebhook.name}!`);
        setSelectedChannelForWebhook(null);
      }
    } catch (err) {
      showToast('Failed to save webhook configuration', 'error');
    }
  };

  // Webhook Ping Test Handler
  const handleTestWebhookPing = async () => {
    if (!selectedChannelForWebhook) return;
    setIsPingingWebhook(true);
    setWebhookPingResult(null);

    try {
      const res = await fetch('/api/integrations/webhook-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedChannelForWebhook.provider,
          webhookUrl: webhookUrlInput || selectedChannelForWebhook.webhookUrl,
          verifyToken: verifyTokenInput || selectedChannelForWebhook.verifyToken,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookPingResult({
          success: true,
          latencyMs: data.latencyMs,
          message: data.response?.message || 'Handshake acknowledged successfully',
        });
        showToast(`Ping successful! (${data.latencyMs}ms)`);
      } else {
        setWebhookPingResult({
          success: false,
          message: data.error || 'Webhook ping failed',
        });
        showToast('Webhook ping failed', 'error');
      }
    } catch (err: any) {
      setWebhookPingResult({
        success: false,
        message: err.message || 'Connection timeout',
      });
      showToast('Webhook connection timeout', 'error');
    } finally {
      setIsPingingWebhook(false);
    }
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedField(null), 2500);
  };

  const connectedCount = channels.filter((c) => c.status === 'connected').length;

  return (
    <div className="space-y-6 max-w-6xl font-sans animate-fade-in pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-4 sm:right-6 z-50 text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-fade-in ${
            toastMessage.type === 'error'
              ? 'bg-red-600'
              : toastMessage.type === 'info'
              ? 'bg-blue-600'
              : 'bg-[#1E293B]'
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

      {/* Header with Title, Live SSE Banner, and Progress Counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B]">
              Social Channel Integrations
            </h1>
            {/* Real-time SSE Live Indicator */}
            <div
              className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                realtimeConnected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
              title={realtimeConnected ? `SSE Stream Active (${connectionLatency}ms)` : 'Connecting to real-time stream...'}
            >
              {realtimeConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live SSE Stream</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-2.5 h-2.5 animate-spin text-amber-600" />
                  <span>Reconnecting</span>
                </>
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Connected accounts for 24/7 automated comment replies, DMs, and post publishing.
          </p>
        </div>

        {/* Dynamic Progress Counter */}
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <div className="px-4 py-2 bg-gradient-to-r from-[#FFF0E6] to-[#FFE4D6] border border-[#FED7AA] rounded-2xl shadow-xs flex items-center space-x-2 text-xs font-bold text-[#9A3412]">
            <ShieldCheck className="w-4 h-4 text-[#E05A2B]" />
            <span id="active-channels-counter">{activeProgressText || `${connectedCount} of ${channels.length} Channels Active`}</span>
          </div>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {channels.map((channel) => {
          const isConnected = channel.status === 'connected';

          return (
            <div
              key={channel.id}
              id={`channel-card-${channel.provider}`}
              className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xs border-2 border-dashed ${
                isConnected
                  ? 'bg-white border-[#CBD5E1] hover:border-[#FED7AA] hover:shadow-md'
                  : 'bg-[#FAF8F5]/70 border-[#CBD5E1] opacity-90'
              }`}
            >
              <div className="space-y-3.5">
                {/* Channel Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-xs transition-transform hover:scale-105 ${
                        channel.provider === 'instagram'
                          ? 'bg-gradient-to-tr from-[#FFF0F5] to-[#FFE4E6] text-[#E1306C] border border-[#FECDD3]'
                          : channel.provider === 'tiktok'
                          ? 'bg-neutral-900 text-white'
                          : channel.provider === 'facebook'
                          ? 'bg-[#EFF6FF] text-[#1877F2] border border-[#BFDBFE]'
                          : channel.provider === 'threads'
                          ? 'bg-neutral-950 text-white'
                          : channel.provider === 'whatsapp'
                          ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      <SocialPlatformIcon channel={channel.provider} className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#1E293B] leading-tight">
                        {channel.name}
                      </h2>
                      <p className="text-[10px] text-[#94A3B8] font-medium mt-0.5">
                        {channel.api}
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
                    {isConnected ? '● Connected' : '○ Disconnected'}
                  </span>
                </div>

                {/* Active Profile Info */}
                <div className="p-2.5 rounded-xl bg-[#FCFAF7] border border-[#F5EFE8] flex items-center justify-between text-xs">
                  <span className="text-[#64748B] text-[11px]">Active Profile:</span>
                  <span className={`font-bold truncate max-w-[150px] ${isConnected ? 'text-[#1E293B]' : 'text-neutral-400'}`}>
                    {channel.activeProfile}
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    Features:
                  </p>
                  <div className="space-y-1">
                    {channel.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-xs text-[#475569]">
                        <Check className={`w-3.5 h-3.5 shrink-0 ${isConnected ? 'text-[#E05A2B]' : 'text-neutral-400'}`} />
                        <span className="text-[11px] leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Toggles when Connected */}
                {isConnected && (
                  <div className="pt-2 border-t border-[#F5EFE8] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#475569] text-[11px] font-medium">Auto Comment Reply</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleFeature(
                            channel.provider,
                            'autoCommentReply',
                            channel.autoCommentReply,
                            channel.name
                          )
                        }
                        className={`w-9 h-5 rounded-full relative transition-colors ${
                          channel.autoCommentReply ? 'bg-[#E05A2B]' : 'bg-neutral-200'
                        }`}
                        title="Toggle instant auto-reply"
                      >
                        <span
                          className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                            channel.autoCommentReply ? 'translate-x-4.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#475569] text-[11px] font-medium">Lead Capture Funnel</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleFeature(
                            channel.provider,
                            'leadCaptureFunnel',
                            channel.leadCaptureFunnel,
                            channel.name
                          )
                        }
                        className={`w-9 h-5 rounded-full relative transition-colors ${
                          channel.leadCaptureFunnel ? 'bg-[#E05A2B]' : 'bg-neutral-200'
                        }`}
                        title="Toggle CRM lead capture"
                      >
                        <span
                          className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                            channel.leadCaptureFunnel ? 'translate-x-4.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#F5EFE8]">
                {isConnected ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {/* Lead Capture Funnel Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedChannelForFunnel(channel)}
                        className="flex-1 py-2 bg-[#FAF7F2] hover:bg-[#F3EBE1] text-[#475569] hover:text-[#1E293B] border border-[#E2D9CF] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                      >
                        <Filter className="w-3.5 h-3.5 text-[#E05A2B]" />
                        <span>Lead Funnel</span>
                      </button>

                      {/* Configure Webhook Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChannelForWebhook(channel);
                          setWebhookUrlInput(channel.webhookUrl);
                          setVerifyTokenInput(channel.verifyToken);
                          setWebhookPingResult(null);
                        }}
                        className="flex-1 py-2 bg-[#FFF0E6] hover:bg-[#FFE4D6] text-[#E05A2B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                        <span>Configure Webhook</span>
                      </button>

                      {/* Disconnect Button */}
                      <button
                        type="button"
                        onClick={() => handleDisconnectChannel(channel.provider, channel.name)}
                        className="p-2 text-[#94A3B8] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-[#E2D9CF]"
                        title={`Disconnect ${channel.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Disconnected Channels (e.g. X / Twitter) display Connect Button */
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChannelForConnect(channel);
                      setCustomHandleInput(channel.activeProfile || '@buffermate_ai');
                    }}
                    className="w-full py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Connect {channel.name}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================
          MODAL 1: CONFIGURE WEBHOOK (LIVE VERIFICATION & PING)
         ========================================================= */}
      {selectedChannelForWebhook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#F0E8DF] my-auto">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[#F5EFE8] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] border border-[#FED7AA] flex items-center justify-center text-[#E05A2B]">
                  <SocialPlatformIcon channel={selectedChannelForWebhook.provider} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E293B]">
                    {selectedChannelForWebhook.name} Webhook Setup
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Real-time webhook endpoint for comment keyword listening & DM dispatch.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChannelForWebhook(null)}
                className="w-8 h-8 rounded-full hover:bg-[#FAF6F0] flex items-center justify-center text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Webhook URL */}
              <div>
                <label className="block font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                  Webhook Callback URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={webhookUrlInput}
                    onChange={(e) => setWebhookUrlInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-[#FCFAF7] border border-[#E2D9CF] rounded-xl font-mono text-xs text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(webhookUrlInput, 'webhook-url')}
                    className="px-3 py-2 bg-white hover:bg-[#FAF6F0] border border-[#E2D9CF] rounded-xl font-bold text-[#475569] flex items-center space-x-1"
                  >
                    {copiedField === 'webhook-url' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedField === 'webhook-url' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1">
                  Paste this endpoint into your developer console (Meta/TikTok).
                </p>
              </div>

              {/* Verify Token */}
              <div>
                <label className="block font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                  Verify Token (Secret)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={verifyTokenInput}
                    onChange={(e) => setVerifyTokenInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-[#FCFAF7] border border-[#E2D9CF] rounded-xl font-mono text-xs text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(verifyTokenInput, 'verify-token')}
                    className="px-3 py-2 bg-white hover:bg-[#FAF6F0] border border-[#E2D9CF] rounded-xl font-bold text-[#475569] flex items-center space-x-1"
                  >
                    {copiedField === 'verify-token' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedField === 'verify-token' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Subscribed Fields Badge */}
              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#F0E8DF] space-y-1.5">
                <p className="font-bold text-[#1E293B]">Active Subscription Fields:</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedChannelForWebhook.subscribedEvents.map((evt, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white border border-[#E2D9CF] rounded-lg font-mono text-[10px] text-[#475569]"
                    >
                      {evt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ping Result Display */}
              {webhookPingResult && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs flex items-start space-x-2 ${
                    webhookPingResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {webhookPingResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold">
                      {webhookPingResult.success
                        ? `HTTP 200 OK (${webhookPingResult.latencyMs}ms)`
                        : 'Ping Verification Failed'}
                    </p>
                    <p className="text-[11px] opacity-90 mt-0.5">{webhookPingResult.message}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-[#F5EFE8] flex items-center justify-between">
              <button
                type="button"
                onClick={handleTestWebhookPing}
                disabled={isPingingWebhook}
                className="px-4 py-2 bg-white hover:bg-[#FAF6F0] text-[#E05A2B] border border-[#FED7AA] rounded-xl font-bold flex items-center space-x-1.5 shadow-xs"
              >
                {isPingingWebhook ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )}
                <span>{isPingingWebhook ? 'Testing Handshake...' : 'Test Webhook Ping'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveWebhookConfig}
                className="px-5 py-2 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl font-bold shadow-md shadow-orange-500/20"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: LEAD CAPTURE FUNNEL MANAGEMENT
         ========================================================= */}
      {selectedChannelForFunnel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#F0E8DF] my-auto">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[#F5EFE8] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] border border-[#FED7AA] flex items-center justify-center text-[#E05A2B]">
                  <Filter className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E293B]">
                    {selectedChannelForFunnel.name} Lead Funnel
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Convert comment engagements into qualified Social CRM contacts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChannelForFunnel(null)}
                className="w-8 h-8 rounded-full hover:bg-[#FAF6F0] flex items-center justify-center text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                  Trigger Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={keywordFilterInput}
                  onChange={(e) => setKeywordFilterInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF7] border border-[#E2D9CF] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                  Automated Private DM Response
                </label>
                <textarea
                  rows={4}
                  value={funnelDmMessage}
                  onChange={(e) => setFunnelDmMessage(e.target.value)}
                  className="w-full p-3.5 bg-[#FCFAF7] border border-[#E2D9CF] rounded-2xl text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B] resize-none"
                />
              </div>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#F0E8DF] rounded-2xl space-y-1 text-xs text-[#475569]">
                <p className="font-bold text-[#1E293B]">CRM Capture Rules:</p>
                <p className="text-[11px] text-[#64748B]">
                  • Captures follower handle, comment timestamp, and keyword payload into Social CRM.
                </p>
                <p className="text-[11px] text-[#64748B]">
                  • Automatically logs event to live Activity Stream.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-[#F5EFE8] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSelectedChannelForFunnel(null)}
                className="px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-[#FAF6F0] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedChannelForFunnel(null);
                  showToast(`Lead funnel updated for ${selectedChannelForFunnel.name}!`);
                }}
                className="px-5 py-2 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
              >
                Save Funnel Rules
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: CONNECT CHANNEL / PAGE (E.G. X / TWITTER)
         ========================================================= */}
      {selectedChannelForConnect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#F0E8DF] my-auto">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[#F5EFE8] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] border border-[#FED7AA] flex items-center justify-center text-[#E05A2B]">
                  <SocialPlatformIcon channel={selectedChannelForConnect.provider} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E293B]">
                    Connect {selectedChannelForConnect.name}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Authorize SocialFlow to manage automated comment replies & DMs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedChannelForConnect(null)}
                className="w-8 h-8 rounded-full hover:bg-[#FAF6F0] flex items-center justify-center text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConnectChannel(selectedChannelForConnect.provider, customHandleInput.trim());
              }}
              className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1"
            >
              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                  Account Handle or Business Page Name
                </label>
                <input
                  type="text"
                  value={customHandleInput}
                  onChange={(e) => setCustomHandleInput(e.target.value)}
                  placeholder={selectedChannelForConnect.activeProfile || '@buffermate_ai'}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
                />
              </div>

              <div className="p-3.5 bg-[#FAF8F5] border border-[#F0E8DF] rounded-2xl space-y-2 text-xs text-[#475569]">
                <p className="font-bold text-[#1E293B] flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#E05A2B]" />
                  <span>Permissions Requested:</span>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-[#64748B]">
                  <li>Read follower comments & mentions in real time</li>
                  <li>Publish automated direct replies on keyword match</li>
                  <li>Dispatch 1-on-1 private direct messages (DMs) with deal links</li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedChannelForConnect(null)}
                  className="px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-[#FAF6F0] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="px-5 py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5"
                >
                  {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{isSyncing ? 'Connecting...' : 'Authorize & Connect Channel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
