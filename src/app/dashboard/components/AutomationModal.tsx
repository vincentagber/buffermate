'use client';

import React, { useState } from 'react';
import { X, Bot, Sparkles, MessageCircle, Instagram, Facebook, AtSign, Check, Plus, Trash2, RefreshCw } from 'lucide-react';
import { SocialAutomation, SocialChannel } from '@/lib/types';
import { SocialPlatformIcon } from '@/components/SocialIcons';

interface AutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (automation: SocialAutomation) => void;
  initialData?: SocialAutomation | null;
  defaultChannel?: SocialChannel;
  defaultTriggerType?: string;
}

export default function AutomationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultChannel,
  defaultTriggerType,
}: AutomationModalProps) {
  if (!isOpen) return null;

  const [channel, setChannel] = useState<SocialChannel>(initialData?.channel || defaultChannel || 'instagram');
  const [name, setName] = useState(initialData?.name || '');
  const [triggerType, setTriggerType] = useState(initialData?.trigger_type || defaultTriggerType || 'comment_keyword');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(initialData?.keywords || ['price', 'link', 'book', 'info']);
  const [replyComment, setReplyComment] = useState(
    initialData?.reply_comment || 'Thanks for commenting! Just sent you a private DM with the direct link 🚀'
  );
  const [dmMessage, setDmMessage] = useState(
    initialData?.dm_message || 'Hey there! Here is the exclusive link you requested: https://buffermate.ai/deal 🎉 Let us know if you have any questions!'
  );
  const [linkUrl, setLinkUrl] = useState(initialData?.link_url || 'https://buffermate.ai/deal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim().toLowerCase())) {
      setKeywords([...keywords, keywordInput.trim().toLowerCase()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: name || `${channel.toUpperCase()} ${triggerType === 'comment_keyword' ? 'Keyword Bot' : 'Auto Responder'}`,
      channel,
      trigger_type: triggerType,
      keywords,
      reply_comment: replyComment,
      dm_message: dmMessage,
      link_url: linkUrl,
      status: 'active',
    };

    try {
      if (initialData?.id) {
        // Update existing in database
        const res = await fetch(`/api/automations/${initialData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.data) {
          onSave(data.data);
        } else {
          onSave({ id: initialData.id, ...payload, runs_today: initialData.runs_today, runs_total: initialData.runs_total, leads_captured: initialData.leads_captured } as any);
        }
      } else {
        // Create new in database
        const res = await fetch('/api/automations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.data) {
          onSave(data.data);
        } else {
          onSave({ id: `flow-${Date.now()}`, ...payload, runs_today: 0, runs_total: 0, leads_captured: 0 } as any);
        }
      }
    } catch (err) {
      console.error('Save automation error:', err);
      onSave({ id: initialData?.id || `flow-${Date.now()}`, ...payload, runs_today: initialData?.runs_today || 0, runs_total: initialData?.runs_total || 0, leads_captured: initialData?.leads_captured || 0 } as any);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const channelsList: { id: SocialChannel; name: string }[] = [
    { id: 'instagram', name: 'Instagram' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'twitter', name: 'X (Twitter)' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'threads', name: 'Threads' },
    { id: 'whatsapp', name: 'WhatsApp' },
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
              <h2 className="text-base sm:text-lg font-bold text-[#1E293B] leading-snug">
                {initialData ? 'Edit Automation Flow' : 'Create Real Automation'}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#64748B]">
                Auto-reply to comments & send DMs on keyword match.
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

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Flow Name */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              Automation Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Promo Keyword Funnel"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B] bg-[#FCFAF7]"
            />
          </div>

          {/* Target Channel */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              Select Social Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {channelsList.map((ch) => (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => setChannel(ch.id)}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                    channel === ch.id
                      ? ch.id === 'instagram'
                        ? 'border-[#E1306C] bg-gradient-to-tr from-[#FFF0F5] to-[#FFF5F8] text-[#E1306C] shadow-xs'
                        : ch.id === 'tiktok'
                        ? 'border-neutral-900 bg-neutral-100 text-neutral-900 shadow-xs'
                        : ch.id === 'facebook'
                        ? 'border-[#1877F2] bg-[#EFF6FF] text-[#1877F2] shadow-xs'
                        : ch.id === 'threads'
                        ? 'border-neutral-900 bg-neutral-100 text-neutral-900 shadow-xs'
                        : 'border-[#25D366] bg-[#F0FDF4] text-[#16A34A] shadow-xs'
                      : 'border-[#E2D9CF] bg-white text-[#64748B] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <SocialPlatformIcon channel={ch.id} className="w-4 h-4" />
                  <span className="capitalize">{ch.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Type */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              Trigger Event
            </label>
            <select
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B] bg-[#FCFAF7]"
            >
              <option value="comment_keyword">Comment with Specific Keywords (Recommended)</option>
              <option value="dm_received">Direct Message (DM) Received</option>
              <option value="story_reply">Story Reply Received</option>
              <option value="spam_filter">Spam Filter & Hide Comment</option>
            </select>
          </div>

          {/* Keywords List */}
          {triggerType === 'comment_keyword' && (
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Trigger Keywords
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add keyword (e.g., price, link, book)"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#E2D9CF] text-xs bg-[#FCFAF7]"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-3.5 py-2 bg-[#E05A2B] text-white rounded-xl text-xs font-bold hover:bg-[#C8491E] transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Tags Cloud */}
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-[#FAF6F0] border border-[#F0E8DF] min-h-[44px]">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA]"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => removeKeyword(kw)}
                      className="ml-1.5 text-[#E05A2B] hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {keywords.length === 0 && (
                  <span className="text-xs text-[#94A3B8]">No keywords added yet.</span>
                )}
              </div>
            </div>
          )}

          {/* Public Comment Reply */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              1. Public Auto-Reply to Comment
            </label>
            <input
              type="text"
              value={replyComment}
              onChange={(e) => setReplyComment(e.target.value)}
              placeholder="e.g., Sent you a DM! Check your inbox 🚀"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B] bg-[#FCFAF7]"
            />
          </div>

          {/* Private DM Message */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              2. Private Direct Message (DM) Sent to Inbox
            </label>
            <textarea
              rows={3}
              value={dmMessage}
              onChange={(e) => setDmMessage(e.target.value)}
              placeholder="e.g., Hey @user! Here is your exclusive link..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B] bg-[#FCFAF7]"
            />
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              Landing Page / Product Link
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://buffermate.ai/deal"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B] bg-[#FCFAF7]"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#F5EFE8] flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-[#FAF6F0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5"
            >
              {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>{initialData ? 'Save Changes' : 'Activate Automation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
