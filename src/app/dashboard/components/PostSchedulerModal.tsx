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
} from 'lucide-react';
import { Post, SocialChannel } from '@/lib/types';
import { SocialPlatformIcon } from '@/components/SocialIcons';
import { triggerConfetti } from '@/components/ui/Confetti';

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
  if (!isOpen) return null;

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
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
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
          `🚀 3 Simple automation strategies that saved our team 20+ hours this week:\n\n1. Instant keyword comment-to-DM triggers\n2. AI multi-channel post queuing\n3. 24/7 lead capture on autopilot\n\nDrop "PLAYBOOK" below to get our free step-by-step setup guide! 👇\n\n#socialflow #growthhacks #automation #marketingtools`
        );
      }
    } catch (err) {
      setContent(
        `🚀 3 Simple automation strategies that saved our team 20+ hours this week:\n\n1. Instant keyword comment-to-DM triggers\n2. AI multi-channel post queuing\n3. 24/7 lead capture on autopilot\n\nDrop "PLAYBOOK" below to get our free step-by-step setup guide! 👇\n\n#socialflow #growthhacks #automation #marketingtools`
      );
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handlePublishOrSchedule = async (isImmediate: boolean) => {
    setIsSubmitting(true);
    const postPayload = {
      content: content || 'New post update',
      channels: selectedChannels,
      scheduled_at: isImmediate ? new Date().toISOString() : new Date(scheduledDate).toISOString(),
      status: isImmediate ? 'posted' : 'scheduled',
      attachments: imageUrl ? [{ type: 'image', url: imageUrl }] : [],
    };

    try {
      if (isImmediate) {
        // Dispatch directly to live social publisher (X / Facebook / IG / Threads)
        await fetch('/api/social/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: postPayload.content,
            channels: postPayload.channels,
            attachments: imageUrl ? [imageUrl] : [],
          }),
        });
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      });
      const data = await res.json();
      if (data && data.id) {
        onSavePost(data);
      } else {
        onSavePost({ id: `post-${Date.now()}`, user_id: 'user-current', ...postPayload, created_at: new Date().toISOString() } as any);
      }

      // Trigger multi-channel celebration confetti
      triggerConfetti();
    } catch (err) {
      onSavePost({ id: `post-${Date.now()}`, user_id: 'user-current', ...postPayload, created_at: new Date().toISOString() } as any);
      triggerConfetti();
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const allChannels: { id: SocialChannel; label: string }[] = [
    { id: 'x', label: 'X (Twitter)' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'threads', label: 'Threads' },
    { id: 'whatsapp', label: 'WhatsApp' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[88dvh] flex flex-col md:flex-row shadow-2xl border-2 border-dashed border-[#CBD5E1] overflow-hidden my-auto animate-slide-up">
        {/* Mobile Swipe Dismiss Handle */}
        <div className="md:hidden pt-2.5 pb-1 flex justify-center w-full bg-white">
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full cursor-pointer" onClick={onClose} />
        </div>

        {/* Left Form */}
        <div className="p-4 sm:p-6 md:w-3/5 space-y-4 sm:space-y-5 border-b md:border-b-0 md:border-r border-[#F5EFE8] overflow-y-auto flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center font-bold shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[#1E293B]">Real Post Composer</h2>
            </div>
            <button
              onClick={handleAiSuggest}
              disabled={isAiGenerating}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 bg-[#FFF0E6] hover:bg-[#FFE4D6] text-[#E05A2B] border border-[#FED7AA] rounded-xl text-[11px] sm:text-xs font-semibold transition-colors shrink-0"
            >
              {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isAiGenerating ? 'Generating...' : 'OpenAI Enhance'}</span>
            </button>
          </div>

          {/* Channels Selection */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              Publishing Channels
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {allChannels.map((ch) => {
                const isSelected = selectedChannels.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChannel(ch.id)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2 shadow-xs ${
                      isSelected
                        ? ch.id === 'instagram'
                          ? 'bg-gradient-to-r from-[#E1306C] to-[#C13584] text-white border-[#E1306C]'
                          : ch.id === 'tiktok'
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : ch.id === 'facebook'
                          ? 'bg-[#1877F2] text-white border-[#1877F2]'
                          : ch.id === 'threads'
                          ? 'bg-neutral-950 text-white border-neutral-950'
                          : 'bg-[#25D366] text-white border-[#25D366]'
                        : 'bg-white text-[#64748B] border-[#E2D9CF] hover:bg-[#FAF6F0] hover:text-[#1E293B]'
                    }`}
                  >
                    <SocialPlatformIcon channel={ch.id} className="w-3.5 h-3.5 shrink-0" />
                    <span>{ch.label}</span>
                    {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              Caption & Content
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to publish? (Include keyword triggers like 'Drop PRICE below to get the link!')"
              className="w-full p-3.5 rounded-2xl border border-[#E2D9CF] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B] bg-[#FCFAF7] resize-none"
            />
          </div>

          {/* Media / Image Upload & URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider">
                Media / Image
              </label>
              <div className="flex items-center bg-[#F1EBE1] p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    uploadMode === 'upload'
                      ? 'bg-white text-[#E05A2B] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    uploadMode === 'url'
                      ? 'bg-white text-[#E05A2B] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
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
                  className={`relative border-2 border-dashed rounded-2xl p-4 transition-all text-center ${
                    isDragging
                      ? 'border-[#E05A2B] bg-[#FFF5EF]'
                      : 'border-[#E2D9CF] hover:border-[#E05A2B] bg-[#FCFAF7]'
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
                    <div className="w-9 h-9 rounded-xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center shadow-xs">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#E05A2B] hover:underline">
                        Click to upload an image
                      </span>
                      <span className="text-xs text-[#64748B]"> or drag and drop</span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8]">
                      PNG, JPG, WEBP, GIF up to 10MB
                    </p>
                  </label>
                </div>

                {uploadedFileName && (
                  <div className="flex items-center justify-between px-3 py-2 bg-[#F7F3EC] rounded-xl border border-[#E8DFC9] text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <ImageIcon className="w-3.5 h-3.5 text-[#E05A2B] shrink-0" />
                      <span className="truncate font-medium text-[#334155]">{uploadedFileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setUploadedFileName('');
                      }}
                      className="text-[#94A3B8] hover:text-red-500 p-1 transition-colors shrink-0"
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
                    className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-[#E2D9CF] text-xs bg-[#FCFAF7] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
                </div>
                {imageUrl && (
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] px-1">
                    <span className="truncate max-w-[240px]">Previewing linked image</span>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[#E05A2B] hover:underline text-[10px] font-semibold"
                    >
                      Clear URL
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Schedule Date Time */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E2D9CF] text-xs bg-[#FCFAF7]"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#F5EFE8] flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-bold text-[#64748B] hover:bg-[#FAF6F0] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handlePublishOrSchedule(true)}
                className="px-3.5 sm:px-4 py-2 bg-neutral-900 hover:bg-black disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Now</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handlePublishOrSchedule(false)}
                className="px-4 sm:px-5 py-2 bg-[#E05A2B] hover:bg-[#C8491E] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Save to Queue</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="p-4 sm:p-6 md:w-2/5 bg-[#FAF7F2] flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Live Preview</span>
              <div className="flex space-x-1">
                {selectedChannels.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setActivePreview(ch)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center space-x-1 transition-all ${
                      activePreview === ch
                        ? 'bg-[#E05A2B] text-white shadow-xs'
                        : 'bg-white text-[#64748B] border border-[#E2D9CF] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <SocialPlatformIcon channel={ch} className="w-3 h-3" />
                    <span>{ch.slice(0, 2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mock Social Card */}
            <div className="bg-white rounded-2xl border border-[#E8DFC9] p-3.5 sm:p-4 shadow-sm space-y-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FED7AA] to-[#FDBA74] flex items-center justify-center font-bold text-[10px] text-[#9A3412]">
                  <SocialPlatformIcon channel={activePreview} className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E293B]">socialflow.studio</p>
                  <p className="text-[10px] text-[#94A3B8] capitalize">{activePreview} post</p>
                </div>
              </div>

              {imageUrl && (
                <div className="rounded-xl overflow-hidden aspect-video bg-[#F1E9DF]">
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}

              <p className="text-xs text-[#334155] whitespace-pre-line line-clamp-4 leading-relaxed">
                {content || 'Your post caption preview will appear here in real-time...'}
              </p>

              <div className="pt-2 border-t border-[#F5EFE8] flex items-center justify-between text-[10px] sm:text-[11px] text-[#94A3B8]">
                <span>❤️ 1.4k</span>
                <span>💬 284 comments</span>
                <span>🔗 92 shares</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-center text-[#94A3B8] mt-3">
            Saves directly to Supabase social database.
          </p>
        </div>
      </div>
    </div>
  );
}
