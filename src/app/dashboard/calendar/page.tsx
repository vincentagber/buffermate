'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Layers,
  Sparkles,
  Send,
  Trash2,
  Edit3
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';
import Link from 'next/link';

interface ScheduledPost {
  id: string;
  content: string;
  scheduled_at: string;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  platforms?: string[];
  image_url?: string;
}

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('agenda');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'posted' | 'draft'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const supabase = createClient();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('scheduled_at', { ascending: true });

        if (data && data.length > 0) {
          setPosts(data);
        } else {
          // Curated sample scheduled posts if database is fresh
          setPosts([
            {
              id: 'p-1',
              content: '🚀 5 AI Automation Frameworks that cut social scheduling time by 80%. Check out our breakdown!',
              scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
              status: 'scheduled',
              platforms: ['x', 'linkedin', 'threads'],
            },
            {
              id: 'p-2',
              content: 'Behind the scenes: How we scale multi-channel video distribution with zero manual rendering. ✨',
              scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
              status: 'scheduled',
              platforms: ['instagram', 'tiktok', 'facebook'],
            },
            {
              id: 'p-3',
              content: 'Top 3 creator workflow trends for Q4 2026. What is your #1 growth lever right now?',
              scheduled_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
              status: 'posted',
              platforms: ['x', 'linkedin'],
            },
            {
              id: 'p-4',
              content: 'Draft: Weekend creator tips & aesthetic workspace setup guide.',
              scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
              status: 'draft',
              platforms: ['instagram', 'threads'],
            }
          ]);
        }
      } else {
        // Sample posts for guest state
        setPosts([
          {
            id: 'p-1',
            content: '🚀 5 AI Automation Frameworks that cut social scheduling time by 80%. Check out our breakdown!',
            scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
            status: 'scheduled',
            platforms: ['x', 'linkedin', 'threads'],
          },
          {
            id: 'p-2',
            content: 'Behind the scenes: How we scale multi-channel video distribution with zero manual rendering. ✨',
            scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
            status: 'scheduled',
            platforms: ['instagram', 'tiktok', 'facebook'],
          },
          {
            id: 'p-3',
            content: 'Top 3 creator workflow trends for Q4 2026. What is your #1 growth lever right now?',
            scheduled_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            status: 'posted',
            platforms: ['x', 'linkedin'],
          },
        ]);
      }
    } catch (e) {
      console.error('Error fetching calendar posts:', e);
    } finally {
      setLoading(false);
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesPlatform =
      selectedPlatform === 'all' ||
      (post.platforms && post.platforms.includes(selectedPlatform));
    return matchesStatus && matchesPlatform;
  });

  // Group filtered posts by day date string
  const groupedPosts: { [key: string]: ScheduledPost[] } = {};
  filteredPosts.forEach((post) => {
    const dateKey = new Date(post.scheduled_at).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    if (!groupedPosts[dateKey]) {
      groupedPosts[dateKey] = [];
    }
    groupedPosts[dateKey].push(post);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B]">
            Content Calendar & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Visual timeline of your scheduled, published, and automated social campaigns.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* View Toggle */}
          <div className="bg-white border border-[#E2D9CF] p-1 rounded-2xl flex items-center shadow-2xs">
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'agenda'
                  ? 'bg-[#E05A2B] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              Agenda Feed
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-[#E05A2B] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              Month View
            </button>
          </div>

          <Link
            href="/dashboard/composer"
            className="px-4 py-2 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Status Filter Chips */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mr-1">Status:</span>
          {(['all', 'scheduled', 'posted', 'draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-[#1E293B] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#64748B] hover:bg-[#F3EBE1] border border-[#E2D9CF]'
              }`}
            >
              {st === 'all' ? `All (${posts.length})` : st}
            </button>
          ))}
        </div>

        {/* Platform Filter Chips */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mr-1">Channel:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'facebook', label: 'FB' },
            { id: 'instagram', label: 'IG' },
            { id: 'x', label: 'X' },
            { id: 'tiktok', label: 'TikTok' },
            { id: 'threads', label: 'Threads' },
            { id: 'linkedin', label: 'LinkedIn' },
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedPlatform(ch.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedPlatform === ch.id
                  ? 'bg-[#E05A2B] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#64748B] hover:bg-[#F3EBE1] border border-[#E2D9CF]'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'agenda' ? (
        /* Agenda Feed View */
        <div className="space-y-6">
          {Object.keys(groupedPosts).length > 0 ? (
            Object.entries(groupedPosts).map(([dateLabel, dayPosts]) => (
              <div key={dateLabel} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E05A2B]"></div>
                  <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
                    {dateLabel}
                  </h3>
                  <span className="text-xs text-[#94A3B8] font-semibold">
                    ({dayPosts.length} {dayPosts.length === 1 ? 'post' : 'posts'})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dayPosts.map((post) => {
                    const postTime = new Date(post.scheduled_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={post.id}
                        className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-3xl p-5 hover:border-[#FED7AA] hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 shadow-xs"
                      >
                        <div className="space-y-2.5">
                          {/* Card Top: Platforms & Status */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5">
                              {post.platforms && post.platforms.length > 0 ? (
                                post.platforms.map((p) => (
                                  <div
                                    key={p}
                                    className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E2D9CF] flex items-center justify-center text-neutral-800"
                                    title={p.toUpperCase()}
                                  >
                                    <SocialPlatformIcon channel={p} className="w-3.5 h-3.5" />
                                  </div>
                                ))
                              ) : (
                                <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E2D9CF] flex items-center justify-center">
                                  <Layers className="w-3.5 h-3.5 text-[#64748B]" />
                                </div>
                              )}
                            </div>

                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                post.status === 'posted'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : post.status === 'scheduled'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              ● {post.status}
                            </span>
                          </div>

                          {/* Post Content */}
                          <p className="text-xs sm:text-sm text-[#1E293B] font-medium line-clamp-3 leading-relaxed">
                            {post.content}
                          </p>
                        </div>

                        {/* Card Bottom: Timestamp & Quick Action */}
                        <div className="pt-2.5 border-t border-[#F5EFE8] flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1.5 text-[#64748B] text-[11px] font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#E05A2B]" />
                            <span>{postTime}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Link
                              href={`/dashboard/composer?draftId=${post.id}`}
                              className="p-1.5 hover:bg-[#FAF6F0] text-[#64748B] hover:text-[#E05A2B] rounded-lg transition-colors"
                              title="Edit in Composer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white border-2 border-dashed border-[#CBD5E1] rounded-3xl p-6">
              <CalendarIcon className="w-12 h-12 text-[#E05A2B]/40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#1E293B]">No Scheduled Posts Found</h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                No content matches your current status or channel filter. Click below to craft and schedule a new post.
              </p>
              <Link
                href="/dashboard/composer"
                className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Post</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Month Matrix Grid View */
        <div className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1E293B]">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center space-x-1">
              <button
                onClick={() =>
                  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
                }
                className="p-1.5 hover:bg-[#FAF6F0] border border-[#E2D9CF] rounded-xl text-[#64748B]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs font-bold text-[#475569]"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
                }
                className="p-1.5 hover:bg-[#FAF6F0] border border-[#E2D9CF] rounded-xl text-[#64748B]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-[#94A3B8] pb-2 border-b border-[#F5EFE8]">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = (i % 31) + 1;
              const hasPost = i === 3 || i === 12 || i === 18 || i === 24;

              return (
                <div
                  key={i}
                  className={`min-h-[70px] sm:min-h-[90px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    hasPost
                      ? 'bg-[#FFF8F5] border-[#FED7AA]'
                      : 'bg-[#FCFAF7] border-[#F5EFE8] hover:border-[#E2D9CF]'
                  }`}
                >
                  <span className="text-[11px] font-bold text-[#64748B]">{dayNum}</span>
                  {hasPost && (
                    <div className="p-1 bg-[#E05A2B] text-white rounded-lg text-[9px] font-bold truncate leading-tight mt-1">
                      2 Posts Scheduled
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
