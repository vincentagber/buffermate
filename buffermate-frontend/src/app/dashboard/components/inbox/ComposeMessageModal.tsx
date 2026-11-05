'use client';

import React, { useState } from 'react';
import { X, Send, User, MessageSquare, DollarSign, AlertCircle, Sparkles, FolderGit2 } from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';
import { triggerConfetti } from '@/components/ui/Confetti';

interface ComposeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (conversation: any) => void;
}

export default function ComposeMessageModal({
  isOpen,
  onClose,
  onCreated,
}: ComposeMessageModalProps) {
  const [channel, setChannel] = useState<'instagram' | 'linkedin' | 'whatsapp' | 'tiktok'>('instagram');
  const [senderName, setSenderName] = useState('');
  const [senderHandle, setSenderHandle] = useState('');
  const [priority, setPriority] = useState<'urgent' | 'high' | 'normal' | 'low'>('normal');
  const [pipelineValue, setPipelineValue] = useState('');
  const [message, setMessage] = useState('');
  const [createJiraIssue, setCreateJiraIssue] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderHandle.trim() || !message.trim()) {
      setError('Please fill in recipient name, handle, and message.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/inbox/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          sender_name: senderName.trim(),
          sender_handle: senderHandle.trim(),
          priority,
          pipeline_value: pipelineValue ? parseFloat(pipelineValue) : 0,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to create outbound conversation');
      }

      let conv = data.data;

      // Optional convert to Jira issue immediately
      if (createJiraIssue && conv?.id) {
        try {
          const jiraRes = await fetch(`/api/inbox/conversations/${conv.id}/convert-to-jira`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'task', priority }),
          });
          const jiraData = await jiraRes.json();
          if (jiraData.success && jiraData.data?.conversation) {
            conv = jiraData.data.conversation;
          }
        } catch (err) {
          console.error('Failed to auto-create Jira issue:', err);
        }
      }

      triggerConfetti();
      onCreated(conv);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating outbound message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs font-sans animate-fade-in flex flex-col justify-end sm:justify-center p-0 sm:p-4 md:p-6">
      <div className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/80 my-0 sm:my-auto flex flex-col max-h-[94dvh] sm:max-h-[calc(100dvh-3.5rem)] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200/60 shadow-2xs font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Compose Outbound Message</h2>
              <p className="text-xs text-slate-500">Dispatch direct communication across social channels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200/80 hover:bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0 flex-1 pb-10">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Channel Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Delivery Channel</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'instagram', label: 'Instagram' },
                  { id: 'linkedin', label: 'LinkedIn' },
                  { id: 'whatsapp', label: 'WhatsApp' },
                  { id: 'tiktok', label: 'TikTok' },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setChannel(ch.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      channel === ch.id
                        ? 'bg-[#141416] text-white border-[#141416] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <SocialPlatformIcon channel={ch.id} className="w-3.5 h-3.5" />
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Recipient Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sophia Miller"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all font-medium text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Handle / Phone / Profile</label>
                <input
                  type="text"
                  placeholder="e.g. @sophia_m or phone"
                  value={senderHandle}
                  onChange={(e) => setSenderHandle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Priority & Pipeline Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Inquiry Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 font-medium cursor-pointer shadow-2xs"
                >
                  <option value="urgent">Urgent · Immediate SLA</option>
                  <option value="high">High Priority</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Estimated Pipeline ($)</label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    value={pipelineValue}
                    onChange={(e) => setPipelineValue(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-900 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Initial Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Outbound Message Content</label>
              <textarea
                rows={4}
                placeholder="Write your direct outbound message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all font-medium text-slate-900 leading-relaxed"
              />
            </div>

            {/* Jira Auto-Creation Toggle */}
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-900 block">Create Jira Work Item</span>
                  <span className="text-[10px] text-blue-700">Track in Jira Backlog & Agile Scrum Board</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={createJiraIssue}
                onChange={(e) => setCreateJiraIssue(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-5 py-2.5 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs transition-all disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Dispatching...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

