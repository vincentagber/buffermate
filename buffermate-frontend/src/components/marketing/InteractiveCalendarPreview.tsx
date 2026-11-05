'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  Eye,
  Zap,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  InstagramIcon,
  TikTokIcon,
  ThreadsIcon,
  FacebookIcon,
  XIcon
} from '@/components/SocialIcons';

interface ScheduledPostItem {
  id: string;
  day: string;
  date: string;
  time: string;
  title: string;
  channels: ('instagram' | 'tiktok' | 'threads' | 'facebook' | 'x')[];
  status: 'Ready' | 'Peak Slot' | 'Dispatched';
  keywordTrigger?: string;
  engagementLift?: string;
  previewCopy: string;
}

const SCHEDULED_POSTS: ScheduledPostItem[] = [
  {
    id: 'post-1',
    day: 'Monday',
    date: 'Sep 21',
    time: '09:00 AM',
    title: '5 Creator Workflow Bottlenecks Killing Your B2B Pipeline',
    channels: ['instagram', 'threads'],
    status: 'Ready',
    keywordTrigger: 'AUDIT',
    engagementLift: '+18% save velocity',
    previewCopy: 'Stop letting leads drop through the cracks. Here are the 5 bottlenecks we fixed to scale our social pipeline.',
  },
  {
    id: 'post-2',
    day: 'Wednesday',
    date: 'Sep 23',
    time: '10:00 AM',
    title: 'Autonomous Comment-to-DM Blueprint for High-Growth Brands',
    channels: ['instagram', 'tiktok', 'facebook', 'threads'],
    status: 'Peak Slot',
    keywordTrigger: 'GROWTH',
    engagementLift: '+34% higher comment & save velocity',
    previewCopy: 'How we captured 1,420 qualified leads from social comments without paid ads. Comment "GROWTH" for the full blueprint!',
  },
  {
    id: 'post-3',
    day: 'Thursday',
    date: 'Sep 24',
    time: '02:30 PM',
    title: 'Behind the Scenes: Scaling to 12k Active Users',
    channels: ['x', 'threads'],
    status: 'Ready',
    previewCopy: 'A deep-dive transparency report on scaling an autonomous SaaS platform with real customer retention data.',
  },
  {
    id: 'post-4',
    day: 'Friday',
    date: 'Sep 25',
    time: '06:30 PM',
    title: 'Weekend Reel: Stop replying to DMs by hand in 2026',
    channels: ['tiktok', 'instagram'],
    status: 'Peak Slot',
    keywordTrigger: 'PRICE',
    engagementLift: '+28% higher reel & video completion',
    previewCopy: 'Short 20-second reel showing how automated comment keyword bots reply in 15 seconds.',
  },
  {
    id: 'post-5',
    day: 'Sunday',
    date: 'Sep 27',
    time: '04:15 PM',
    title: 'Weekly Creator Intelligence Digest & Best Times to Publish',
    channels: ['x', 'threads', 'facebook'],
    status: 'Peak Slot',
    keywordTrigger: 'GUIDE',
    engagementLift: '+41% higher DM link clickthrough',
    previewCopy: 'Sunday evening thought leadership summary outlining key social attribution benchmarks.',
  },
];

export default function InteractiveCalendarPreview() {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [channelFilter, setChannelFilter] = useState<'all' | 'instagram' | 'tiktok' | 'threads' | 'facebook' | 'x'>('all');
  const [selectedPost, setSelectedPost] = useState<ScheduledPostItem>(SCHEDULED_POSTS[1]);

  const filteredPosts = SCHEDULED_POSTS.filter((p) => {
    if (channelFilter === 'all') return true;
    return p.channels.includes(channelFilter);
  });

  return (
    <div className="w-full max-w-6xl mx-auto font-sans">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Top Controls Bar */}
        <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Interactive Calendar Experience</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Visualize your entire publishing queue.
            </h3>
          </div>

          {/* View Mode & Channel Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Week / Month Toggle */}
            <div className="inline-flex items-center space-x-1 bg-slate-200/60 p-1 rounded-full text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  viewMode === 'week' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                7-Day Week
              </button>
              <button
                type="button"
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  viewMode === 'month' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                30-Day Grid
              </button>
            </div>

            {/* Platform Filter Buttons */}
            <div className="hidden sm:flex items-center space-x-1 bg-slate-200/60 p-1 rounded-full text-xs font-semibold">
              <button
                type="button"
                onClick={() => setChannelFilter('all')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  channelFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setChannelFilter('instagram')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  channelFilter === 'instagram' ? 'bg-white text-pink-600 shadow-2xs' : 'text-slate-500'
                }`}
                title="Filter Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setChannelFilter('tiktok')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  channelFilter === 'tiktok' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
                title="Filter TikTok"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setChannelFilter('threads')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  channelFilter === 'threads' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
                title="Filter Threads"
              >
                <ThreadsIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid & Inspector View */}
        <div className="p-6 sm:p-8 bg-slate-50/40 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Weekly Grid */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 pb-1">
              <span>Scheduled Queue ({filteredPosts.length} posts this week)</span>
              <span className="text-purple-700 font-mono text-[11px] font-semibold">Click a post to inspect</span>
            </div>

            <div className="space-y-2.5">
              {filteredPosts.map((post) => {
                const isSelected = selectedPost.id === post.id;
                return (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-100'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{post.day}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[11px] font-mono text-slate-500">{post.time}</span>
                      </div>

                      {post.status === 'Peak Slot' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <span>🔥 Peak Heatmap</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                          {post.status}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-2 line-clamp-1">
                      {post.title}
                    </p>

                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-xs">
                      {/* Platform icons */}
                      <div className="flex items-center space-x-1.5 text-slate-700">
                        {post.channels.map((ch) => (
                          <span key={ch} className="p-1 rounded bg-slate-50 border border-slate-200">
                            {ch === 'instagram' && <InstagramIcon className="w-3 h-3 text-pink-600" />}
                            {ch === 'tiktok' && <TikTokIcon className="w-3 h-3 text-slate-900" />}
                            {ch === 'threads' && <ThreadsIcon className="w-3 h-3 text-slate-900" />}
                            {ch === 'facebook' && <FacebookIcon className="w-3 h-3 text-blue-600" />}
                            {ch === 'x' && <XIcon className="w-3 h-3 text-slate-900" />}
                          </span>
                        ))}
                      </div>

                      {post.keywordTrigger && (
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Trigger: &quot;{post.keywordTrigger}&quot;
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Post Inspector Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Scheduled Post Inspector
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Verified OAuth Pipeline
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Publication Slot</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedPost.day}, {selectedPost.date} @ {selectedPost.time}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Post Subject</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  {selectedPost.title}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Generated Caption Preview:</p>
                {selectedPost.previewCopy}
              </div>

              {selectedPost.engagementLift && (
                <div className="p-3 bg-purple-50 text-purple-900 rounded-xl border border-purple-200 text-xs flex items-center space-x-2 font-medium">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{selectedPost.engagementLift}</span>
                </div>
              )}

              {selectedPost.keywordTrigger && (
                <div className="p-3 bg-amber-50 text-amber-950 rounded-xl border border-amber-200 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>24/7 Auto-DM Bot Configured</span>
                  </p>
                  <p className="text-[11px] text-amber-800">
                    When viewers comment <strong>&quot;{selectedPost.keywordTrigger}&quot;</strong>, personalized DM links are dispatched automatically.
                  </p>
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/signup"
                  className="w-full py-2.5 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <span>Build Your Calendar with AI →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

