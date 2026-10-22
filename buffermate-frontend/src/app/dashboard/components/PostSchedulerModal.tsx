'use client';

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Send,
  Image as ImageIcon,
  Sparkles,
  Clock,
  Check,
  RefreshCw,
  Upload,
  Trash2,
  Link as LinkIcon,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { Post, SocialChannel } from '@/lib/types';
import { SocialPlatformIcon } from '@/components/SocialIcons';
import { triggerConfetti } from '@/components/ui/Confetti';
import AiVoiceFormModal from '@/components/ai/AiVoiceFormModal';

import { ExtractedFormData } from '@/lib/ai/form-schema';

interface PostSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePost: (post: Post) => void;
}

export default function PostSchedulerModal({
  isOpen,
  onClose,
  onSavePost,
}: PostSchedulerModalProps) {
  const [content, setContent] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<SocialChannel[]>([
    'instagram',
    'tiktok',
    'facebook',
    'threads',
  ]);
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16)
  );
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80');
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [activePreview, setActivePreview] = useState<SocialChannel>('instagram');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const handleApplyAiData = (data: ExtractedFormData) => {
    if (data.content) setContent(data.content);
    if (data.scheduledAt) setScheduledDate(data.scheduledAt);
    if (data.platforms && data.platforms.length > 0) {
      const validChannels: SocialChannel[] = [];
      data.platforms.forEach((p) => {
        const norm = (p === 'x' || p === 'twitter') ? 'x' : p.toLowerCase();
        if (['instagram', 'tiktok', 'facebook', 'threads', 'whatsapp', 'x'].includes(norm)) {
          validChannels.push(norm as SocialChannel);
        }
      });
      if (validChannels.length > 0) setSelectedChannels(validChannels);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleChannel = (ch: SocialChannel) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== ch));
        if (activePreview === ch) {
          const remaining = selectedChannels.filter((c) => c !== ch);
          if (remaining.length > 0) setActivePreview(remaining[0]);
        }
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
      setActivePreview(ch);
    }
  };

  const handleAiSuggest = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: content || 'Lead Generation Comment Automation',
          channels: selectedChannels,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.[0]?.content) {
        setContent(data.data[0].content);
      } else {
        setContent(
          `🚀 3 Simple automation strategies that saved our team 20+ hours this week:\n\n1. Instant keyword comment-to-DM triggers\n2. AI multi-channel post queuing\n3. 24/7 lead capture on autopilot\n\nDrop "PLAYBOOK" below to get our free step-by-step setup guide! 👇\n\n#buffermate #growthhacks #automation #marketingtools`
        );
      }
    } catch {
      setContent(
        `🚀 3 Simple automation strategies that saved our team 20+ hours this week:\n\n1. Instant keyword comment-to-DM triggers\n2. AI multi-channel post queuing\n3. 24/7 lead capture on autopilot\n\nDrop "PLAYBOOK" below to get our free step-by-step setup guide! 👇\n\n#buffermate #growthhacks #automation #marketingtools`
      );
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAppendPrompt = (phrase: string) => {
    setContent((prev) => (prev ? `${prev.trim()}\n\n${phrase}` : phrase));
  };

  const setQuickDate = (offsetHours: number) => {
    const d = new Date(Date.now() + 3600000 * offsetHours);
    setScheduledDate(d.toISOString().slice(0, 16));
  };

  const handlePublishOrSchedule = async (isImmediate: boolean) => {
    setIsSubmitting(true);
    const postPayload = {
      content: content || 'New post update',
      channels: selectedChannels,
      scheduled_at: isImmediate ? new Date().toISOString() : new Date(scheduledDate).toISOString(),
      status: isImmediate ? 'posted' : 'scheduled',
      isImmediate,
      attachments: imageUrl ? [{ type: 'image', url: imageUrl }] : [],
    };

    try {
      let savedPost: any = null;

      if (isImmediate) {
        const res = await fetch('/api/social/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: postPayload.content,
            channels: postPayload.channels,
            attachments: imageUrl ? [imageUrl] : [],
          }),
        });
        const pubData = await res.json();
        savedPost = pubData.post || pubData;
      } else {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postPayload),
        });
        const postData = await res.json();
        savedPost = postData.post || postData;
      }

      if (savedPost && (savedPost.id || savedPost._id)) {
        onSavePost(savedPost);
      } else {
        onSavePost({ id: `post-${Date.now()}`, user_id: 'user-current', ...postPayload, created_at: new Date().toISOString() } as unknown as Post);
      }

      triggerConfetti();
    } catch (err) {
      console.error('Error saving post:', err);
      onSavePost({ id: `post-${Date.now()}`, user_id: 'user-current', ...postPayload, created_at: new Date().toISOString() } as unknown as Post);
      triggerConfetti();
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const allChannels: { id: SocialChannel; label: string }[] = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'threads', label: 'Threads' },
    { id: 'x', label: 'X (Twitter)' },
    { id: 'whatsapp', label: 'WhatsApp' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90dvh] flex flex-col md:flex-row shadow-2xl border border-slate-200/80 overflow-hidden my-auto animate-slide-up">
        {/* Mobile Swipe Dismiss Handle */}
        <div className="md:hidden pt-2.5 pb-1 flex justify-center w-full bg-white">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full cursor-pointer" onClick={onClose} />
        </div>

        {/* Left Form */}
        <div className="p-5 sm:p-7 md:w-3/5 space-y-5 border-b md:border-b-0 md:border-r border-slate-100 overflow-y-auto flex-1">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Post Composer & Scheduler</h2>
                <p className="text-[11px] text-slate-400">Craft & queue multi-channel content</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleAiSuggest}
                disabled={isAiGenerating}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isAiGenerating ? 'Enhancing...' : 'AI Enhance'}</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-slate-200/80 hover:bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Publishing Channels Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Publishing Channels
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-slate-400 font-mono">
                  {selectedChannels.length} of {allChannels.length} selected
                </span>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedChannels(
                      selectedChannels.length === allChannels.length
                        ? []
                        : allChannels.map((c) => c.id)
                    )
                  }
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {selectedChannels.length === allChannels.length ? 'Clear' : 'Select All'}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allChannels.map((ch) => {
                const isSelected = selectedChannels.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChannel(ch.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer ${
                      isSelected
                        ? 'bg-[#141416] text-white border border-[#141416]'
                        : 'bg-slate-50/80 text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <SocialPlatformIcon channel={ch.id} className="w-3.5 h-3.5 shrink-0" />
                    <span>{ch.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caption & Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Caption & Content
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-full text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                  title="Generate post from rough brief or voice"
                >
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>Generate with AI</span>
                </button>
                <span className="text-[11px] text-slate-400 font-mono">
                  {content.length} / 2,200 chars
                </span>
              </div>
            </div>

            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to publish? (Include keyword triggers like 'Drop PRICE below to get the link!')"
              className="w-full p-4 rounded-3xl border border-slate-200/80 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-slate-50/50 focus:bg-white resize-none text-slate-900 transition-all placeholder:text-slate-400"
            />

            {/* Quick Keyword Trigger Pills */}
            <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-0.5">Quick CTA:</span>
              {[
                { label: 'Drop "PRICE" below 👇', value: 'Drop "PRICE" in the comments to receive instant VIP booking details directly in your DMs! 👇' },
                { label: 'Comment "GUIDE"', value: 'Comment "GUIDE" and our AI will send you our complimentary 2026 Treatment Playbook right now! 📲' },
                { label: '#buffermate #clinic', value: '#buffermate #sohoclinic #aestheticmedicine #automations' },
              ].map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendPrompt(pill.value)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200/60 rounded-full text-[10px] font-semibold text-slate-600 transition-all cursor-pointer"
                >
                  + {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Media / Image Upload & URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Media Attachment
              </label>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-full text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    uploadMode === 'upload'
                      ? 'bg-[#141416] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    uploadMode === 'url'
                      ? 'bg-[#141416] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Paste URL
                </button>
              </div>
            </div>

            {uploadMode === 'upload' ? (
              <div className="space-y-2">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`relative border rounded-3xl p-5 transition-all text-center ${
                    isDragging
                      ? 'border-purple-400 bg-purple-50/50'
                      : 'border-slate-200/80 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <input
                    id="image-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="sr-only"
                  />
                  <label
                    htmlFor="image-file-input"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-1.5"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white text-purple-700 border border-purple-200/60 flex items-center justify-center shadow-2xs">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 hover:underline">
                        Click to upload an image
                      </span>
                      <span className="text-xs text-slate-400"> or drag & drop</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      PNG, JPG, WEBP, GIF up to 10MB
                    </p>
                  </label>
                </div>

                {uploadedFileName && (
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <ImageIcon className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="truncate font-medium text-slate-800">{uploadedFileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setUploadedFileName('');
                      }}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors shrink-0 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setUploadedFileName('');
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
                {imageUrl && (
                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <span className="truncate max-w-[240px]">Previewing linked image</span>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-purple-600 hover:underline text-[10px] font-semibold cursor-pointer"
                    >
                      Clear URL
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Schedule Date Time */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Schedule Time
              </label>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-full text-[10px] font-semibold text-slate-600 cursor-pointer"
                >
                  In 1h
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(24)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-full text-[10px] font-semibold text-slate-600 cursor-pointer"
                >
                  Tomorrow
                </button>
              </div>
            </div>

            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Actions Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
            >
              Cancel
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handlePublishOrSchedule(true)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 disabled:opacity-50 text-xs font-semibold rounded-full shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-slate-600" />
                <span>Post Now</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handlePublishOrSchedule(false)}
                className="px-5 py-2 bg-[#141416] hover:bg-black disabled:opacity-50 text-white text-xs font-semibold rounded-full shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-slate-300" />
                <span>Save to Queue</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="p-5 sm:p-7 md:w-2/5 bg-slate-50/70 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 md:border-l border-slate-100">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
              <div className="flex bg-white border border-slate-200/80 p-0.5 rounded-full shadow-2xs">
                {selectedChannels.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setActivePreview(ch)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase flex items-center space-x-1 transition-all cursor-pointer ${
                      activePreview === ch
                        ? 'bg-[#141416] text-white shadow-2xs'
                        : 'text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <SocialPlatformIcon channel={ch} className="w-3 h-3" />
                    <span>{ch.slice(0, 2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mock Social Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
              {/* Creator Profile Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shadow-2xs ring-2 ring-purple-100">
                    <SocialPlatformIcon channel={activePreview} className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <p className="text-xs font-bold text-slate-900 leading-none">buffermate.ai</p>
                      <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500/20" />
                    </div>
                    <p className="text-[10px] text-slate-400 capitalize mt-0.5">
                      {activePreview} · Official Channel
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">
                  Verified
                </span>
              </div>

              {/* Media Aspect Container */}
              {imageUrl ? (
                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-100 shadow-2xs relative group">
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold">
                    1080p
                  </div>
                </div>
              ) : null}

              {/* Caption text */}
              <p className="text-xs text-slate-700 whitespace-pre-line line-clamp-4 leading-relaxed font-normal">
                {content || 'Your post caption preview will appear here in real-time as you write...'}
              </p>

              {/* Social Engagement Counters */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1 hover:text-rose-500 transition-colors">
                    <Heart className="w-3.5 h-3.5" />
                    <span>1.4k</span>
                  </span>
                  <span className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>284</span>
                  </span>
                  <span className="flex items-center space-x-1 hover:text-emerald-500 transition-colors">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>92</span>
                  </span>
                </div>
                <Bookmark className="w-3.5 h-3.5 hover:text-slate-900 transition-colors" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span>Real-time multi-platform sync</span>
            </span>
            <span className="font-mono">Queue Engine</span>
          </div>
        </div>
      </div>

      {/* AI Voice & Rough Draft Autofill Modal */}
      {showAiModal && (
        <AiVoiceFormModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          title="Generate post with AI"
          subtitle="Just describe what you want to publish. AI will extract channels, schedule time, and fill the form for you!"
          onApplyData={handleApplyAiData}
        />
      )}
    </div>
  );
}
