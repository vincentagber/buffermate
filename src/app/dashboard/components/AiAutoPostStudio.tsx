'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  Send,
  CheckCircle2,
  TrendingUp,
  Settings2,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { AiAutoPostConfig, AiSuggestedPost, Post, SocialChannel } from '@/lib/types';
import { INITIAL_AI_SUGGESTIONS } from '@/lib/services/automation-store';
import { SocialPlatformIcon } from '@/components/SocialIcons';

interface AiAutoPostStudioProps {
  onSchedulePost: (post: Post) => void;
}

export default function AiAutoPostStudio({ onSchedulePost }: AiAutoPostStudioProps) {
  const [config, setConfig] = useState<AiAutoPostConfig>({
    enabled: true,
    niche: 'Digital Marketing & Growth Automation',
    tone: 'Engaging, High-Converting & Authoritative',
    target_channels: ['instagram', 'tiktok', 'facebook', 'threads'],
    frequency_per_day: 2,
    auto_publish: true,
  });

  const [suggestions, setSuggestions] = useState<AiSuggestedPost[]>(INITIAL_AI_SUGGESTIONS);
  const [topicInput, setTopicInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleGenerateNew = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput || '24/7 Comment & DM Automation Funnel',
          niche: config.niche,
          channels: config.target_channels,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setSuggestions(data.data);
        showNotification('OpenAI generated 3 viral post concepts!');
      } else {
        showNotification('Generated post concepts.');
      }
    } catch (err) {
      console.error('AI suggest error:', err);
    } finally {
      setIsGenerating(false);
      setTopicInput('');
    }
  };

  const handleApproveAndQueue = async (sug: AiSuggestedPost, isImmediate = false) => {
    const postPayload = {
      content: sug.content,
      scheduled_at: isImmediate ? new Date().toISOString() : new Date(Date.now() + 3600000 * 3).toISOString(),
      channels: sug.target_channels,
      status: isImmediate ? 'posted' : 'scheduled',
      attachments: [{ type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80' }],
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      });
      const data = await res.json();
      if (data && data.id) {
        onSchedulePost(data);
      } else {
        onSchedulePost({ id: `post-${Date.now()}`, user_id: 'user-demo', ...postPayload, created_at: new Date().toISOString() } as any);
      }
    } catch (err) {
      onSchedulePost({ id: `post-${Date.now()}`, user_id: 'user-demo', ...postPayload, created_at: new Date().toISOString() } as any);
    }

    showNotification(isImmediate ? 'Post published across all channels!' : 'Post scheduled to social queue!');
  };

  const toggleChannel = (ch: SocialChannel) => {
    if (config.target_channels.includes(ch)) {
      if (config.target_channels.length > 1) {
        setConfig({
          ...config,
          target_channels: config.target_channels.filter((c) => c !== ch),
        });
      }
    } else {
      setConfig({
        ...config,
        target_channels: [...config.target_channels, ch],
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 font-sans">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-[#1E293B] text-white px-4 sm:px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Auto-Pilot Banner */}
      <div className="bg-gradient-to-br from-[#FFF7ED] via-[#FFFBF7] to-[#FEF3E2] border-2 border-dashed border-[#FED7AA] rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E05A2B] text-white flex items-center justify-center font-bold shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#1E293B]">AI Auto-Posting Engine</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${config.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'}`}>
                {config.enabled ? '● Auto-Pilot ACTIVE' : '○ Paused'}
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Powered by OpenAI: Generates trend-aware social posts, embeds keyword funnels, and schedules them at peak engagement hours automatically.
            </p>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => {
                setConfig({ ...config, enabled: !config.enabled });
                showNotification(config.enabled ? 'Auto-Pilot paused.' : 'Auto-Pilot activated!');
              }}
              className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                config.enabled
                  ? 'bg-[#E05A2B] text-white shadow-md shadow-orange-500/20 hover:bg-[#C8491E]'
                  : 'bg-white text-[#475569] border border-[#E2D9CF] hover:bg-[#FAF6F0]'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{config.enabled ? 'Auto-Pilot Running' : 'Enable Auto-Pilot'}</span>
            </button>
          </div>
        </div>

        {/* Configuration settings row */}
        <div className="mt-4 pt-4 border-t border-[#FED7AA]/60 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div>
            <span className="font-bold text-[#334155] block mb-1">Brand Niche & Topics:</span>
            <input
              type="text"
              value={config.niche}
              onChange={(e) => setConfig({ ...config, niche: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#FED7AA] rounded-xl text-xs focus:ring-2 focus:ring-[#E05A2B] focus:outline-hidden"
            />
          </div>

          <div>
            <span className="font-bold text-[#334155] block mb-1">Posting Frequency:</span>
            <select
              value={config.frequency_per_day}
              onChange={(e) => setConfig({ ...config, frequency_per_day: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-[#FED7AA] rounded-xl text-xs focus:ring-2 focus:ring-[#E05A2B] focus:outline-hidden"
            >
              <option value={1}>1 Post Daily (Optimal Reach)</option>
              <option value={2}>2 Posts Daily (Peak Growth)</option>
              <option value={4}>4 Posts Daily (Maximum Viral Volume)</option>
            </select>
          </div>

          <div>
            <span className="font-bold text-[#334155] block mb-1">Target Platforms:</span>
            <div className="flex flex-wrap gap-1.5">
              {(['instagram', 'tiktok', 'facebook', 'threads', 'whatsapp'] as SocialChannel[]).map((ch) => (
                <button
                  key={ch}
                  onClick={() => toggleChannel(ch)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-bold capitalize transition-all flex items-center space-x-1.5 ${
                    config.target_channels.includes(ch)
                      ? ch === 'instagram'
                        ? 'bg-gradient-to-r from-[#E1306C] to-[#C13584] text-white shadow-xs'
                        : ch === 'tiktok'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : ch === 'facebook'
                        ? 'bg-[#1877F2] text-white shadow-xs'
                        : ch === 'threads'
                        ? 'bg-neutral-950 text-white shadow-xs'
                        : 'bg-[#25D366] text-white shadow-xs'
                      : 'bg-white text-[#64748B] border border-[#FED7AA] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <SocialPlatformIcon channel={ch} className="w-3 h-3" />
                  <span>{ch}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestion Generator Form */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1E293B]">OpenAI Viral Post Generator</h3>
            <p className="text-xs text-[#64748B]">
              Real AI-generated content tailored to your niche with viral hooks and keyword comment triggers.
            </p>
          </div>
          <button
            onClick={handleGenerateNew}
            disabled={isGenerating}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] disabled:opacity-50 text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Generate with OpenAI</span>
          </button>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter custom topic (e.g., 'Lead generation for course', 'Product launch')"
            className="flex-1 px-3.5 py-2.5 rounded-2xl border border-[#E2D9CF] text-xs bg-[#FCFAF7] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
          />
        </div>
      </div>

      {/* Suggested Post Cards List */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-bold text-[#1E293B]">AI Generated Post Concepts</h3>
          <span className="text-[11px] sm:text-xs text-[#64748B] font-medium">{suggestions.length} Ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              className="bg-white rounded-3xl border-2 border-dashed border-[#CBD5E1] hover:border-[#FED7AA] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5"
            >
              <div className="space-y-2.5">
                {/* Meta Header */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA]">
                    {sug.estimated_engagement}
                  </span>
                  <div className="flex items-center space-x-1">
                    {sug.target_channels.map((ch) => (
                      <span key={ch} className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#FAF6F0] rounded-md text-[#64748B] flex items-center space-x-1 border border-[#E8DFC9]">
                        <SocialPlatformIcon channel={ch} className="w-2.5 h-2.5" />
                        <span>{ch.slice(0, 2)}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hook */}
                <h4 className="text-xs font-bold text-[#1E293B] line-clamp-2 leading-snug">
                  "{sug.hook}"
                </h4>

                {/* Content Preview */}
                <p className="text-xs text-[#475569] whitespace-pre-line line-clamp-5 leading-relaxed bg-[#FAF8F5] p-3 rounded-2xl border border-[#F5EFE8]">
                  {sug.content}
                </p>

                {/* Timing */}
                <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] text-[#64748B]">
                  <Clock className="w-3.5 h-3.5 text-[#E05A2B] shrink-0" />
                  <span className="truncate">{sug.recommended_time}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 border-t border-[#F5EFE8] flex items-center space-x-2">
                <button
                  onClick={() => handleApproveAndQueue(sug, false)}
                  className="flex-1 py-2 bg-[#FFF0E6] hover:bg-[#FFE4D6] text-[#E05A2B] border border-[#FED7AA] rounded-xl text-[11px] sm:text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Auto-Schedule</span>
                </button>
                <button
                  onClick={() => handleApproveAndQueue(sug, true)}
                  className="px-3 sm:px-3.5 py-2 bg-[#1E293B] hover:bg-black text-white rounded-xl text-[11px] sm:text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Post Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
