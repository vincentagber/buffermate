'use client';

import React, { useState } from 'react';
import { X, Bot, Play, CheckCircle2, MessageSquare, Send, RefreshCw } from 'lucide-react';
import { SocialAutomation, SocialChannel, ActivityEvent, SocialLead } from '@/lib/types';
import { SocialPlatformIcon } from '@/components/SocialIcons';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  automations: SocialAutomation[];
  onTriggerEvent: (event: ActivityEvent, lead?: SocialLead, updatedAutomation?: SocialAutomation) => void;
}

export default function SimulatorModal({
  isOpen,
  onClose,
  automations,
  onTriggerEvent,
}: SimulatorModalProps) {
  if (!isOpen) return null;

  const [channel, setChannel] = useState<SocialChannel>('instagram');
  const [userHandle, setUserHandle] = useState('@clara_creator');
  const [commentText, setCommentText] = useState('How much does this cost? Can you send me the price link?');
  const [postTitle, setPostTitle] = useState('Reel: 5 AI Automation Hacks for 2026');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    matched: boolean;
    matchedKeyword?: string;
    flowName?: string;
    publicReply?: string;
    privateDm?: string;
    leadSaved?: boolean;
  } | null>(null);

  const handleSimulate = async () => {
    setIsProcessing(true);
    setExecutionResult(null);

    try {
      // Call real backend API engine
      const res = await fetch('/api/automations/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          user_handle: userHandle,
          comment_text: commentText,
          post_reference: postTitle,
        }),
      });

      const result = await res.json();

      if (result.success && result.matched) {
        setExecutionResult({
          matched: true,
          matchedKeyword: result.matched_keyword,
          flowName: result.automation?.name || 'Keyword Trigger Rule',
          publicReply: result.public_reply,
          privateDm: result.private_dm,
          leadSaved: true,
        });

        if (result.activity) {
          onTriggerEvent(result.activity, result.lead, result.automation);
        }
      } else {
        setExecutionResult({
          matched: false,
        });
      }
    } catch (err: any) {
      console.error('Trigger API error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const sampleComments = [
    { text: 'How much is this? Drop the price!', kw: 'price' },
    { text: 'Can you send the booking link please?', kw: 'book' },
    { text: 'Where can I get the guide PDF?', kw: 'guide' },
    { text: 'Link please! Super interested', kw: 'link' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-dashed border-[#CBD5E1] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#F5EFE8] flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FFF0E6] border border-[#FED7AA] flex items-center justify-center text-[#E05A2B] shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1E293B] leading-snug">Live Engine Simulator</h2>
              <p className="text-[11px] sm:text-xs text-[#64748B]">
                Real server-side keyword detection & automated DM response.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#FAF6F0] flex items-center justify-center text-[#64748B] hover:text-[#1E293B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Channel selector */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              Simulate on Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['instagram', 'tiktok', 'facebook', 'threads', 'whatsapp'] as SocialChannel[]).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setChannel(ch)}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold capitalize transition-all flex flex-col items-center justify-center space-y-1 ${
                    channel === ch
                      ? ch === 'instagram'
                        ? 'border-[#E1306C] bg-gradient-to-tr from-[#FFF0F5] to-[#FFF5F8] text-[#E1306C] shadow-xs'
                        : ch === 'tiktok'
                        ? 'border-neutral-900 bg-neutral-100 text-neutral-900 shadow-xs'
                        : ch === 'facebook'
                        ? 'border-[#1877F2] bg-[#EFF6FF] text-[#1877F2] shadow-xs'
                        : ch === 'threads'
                        ? 'border-neutral-900 bg-neutral-100 text-neutral-900 shadow-xs'
                        : 'border-[#25D366] bg-[#F0FDF4] text-[#16A34A] shadow-xs'
                      : 'border-[#E2D9CF] bg-white text-[#64748B] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <SocialPlatformIcon channel={ch} className="w-3.5 h-3.5" />
                  <span>{ch}</span>
                </button>
              ))}
            </div>
          </div>

          {/* User & Post Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Follower Handle
              </label>
              <input
                type="text"
                value={userHandle}
                onChange={(e) => setUserHandle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2D9CF] text-xs bg-[#FCFAF7]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Target Post / Reel
              </label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2D9CF] text-xs bg-[#FCFAF7]"
              />
            </div>
          </div>

          {/* Comment input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">
                Follower Comment Text
              </label>
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8]">Tap preset below</span>
            </div>
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B] bg-[#FCFAF7]"
            />
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sampleComments.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCommentText(s.text)}
                  className="px-2 py-1 bg-[#FAF6F0] hover:bg-[#F3EBE1] border border-[#F0E8DF] rounded-lg text-[10px] sm:text-[11px] font-medium text-[#475569] transition-colors"
                >
                  "{s.kw}"
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={handleSimulate}
            disabled={isProcessing}
            className="w-full py-2.5 sm:py-3 bg-[#E05A2B] hover:bg-[#C8491E] disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            )}
            <span>Execute Real Keyword Trigger API</span>
          </button>

          {/* Live Execution Result */}
          {executionResult && (
            <div className="p-3.5 sm:p-4 rounded-2xl border border-[#FED7AA] bg-[#FFFBF7] space-y-2.5 sm:space-y-3 animate-fade-in">
              {executionResult.matched ? (
                <>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Keyword Matched: "{executionResult.matchedKeyword}"</span>
                    <span className="text-[#94A3B8]">•</span>
                    <span className="text-[#E05A2B] font-semibold">{executionResult.flowName}</span>
                  </div>

                  {/* Public Reply Card */}
                  <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-[#F0E8DF] space-y-1">
                    <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] font-bold text-[#64748B]">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>Step 1: Real Comment Reply Sent</span>
                    </div>
                    <p className="text-xs text-[#1E293B] pl-4 sm:pl-5 font-medium leading-relaxed">
                      "{executionResult.publicReply}"
                    </p>
                  </div>

                  {/* Private DM Card */}
                  <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-[#F0E8DF] space-y-1">
                    <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] font-bold text-[#64748B]">
                      <Send className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Step 2: Real Private DM Dispatched</span>
                    </div>
                    <p className="text-xs text-[#1E293B] pl-4 sm:pl-5 font-medium leading-relaxed">
                      "{executionResult.privateDm}"
                    </p>
                  </div>

                  {/* CRM Lead Confirmation */}
                  <div className="flex items-center justify-between text-xs text-[#78350F] bg-[#FEF3E2] px-3 py-2 rounded-xl">
                    <span className="text-[11px] sm:text-xs">✨ Persisted to Supabase CRM & Live Activity Stream!</span>
                    <span className="font-bold text-[#E05A2B]">Saved</span>
                  </div>
                </>
              ) : (
                <div className="text-xs font-medium text-amber-700">
                  No active automation matched the keywords in this comment.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
