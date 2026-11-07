'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Send,
  Layers,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { InstagramIcon, TikTokIcon, ThreadsIcon, XIcon, LinkedInIcon, FacebookIcon } from '@/components/SocialIcons';
import AnimatedButton from '../ui/AnimatedButton';

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: InstagramIcon, handle: '@buffermate.hq', active: true },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, handle: '@buffermate', active: true },
  { id: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon, handle: 'BufferMate Inc.', active: true },
  { id: 'x', name: 'X / Twitter', icon: XIcon, handle: '@buffermate', active: true },
  { id: 'facebook', name: 'Facebook', icon: FacebookIcon, handle: 'BufferMate App', active: true },
  { id: 'threads', name: 'Threads', icon: ThreadsIcon, handle: '@buffermate.hq', active: true },
];

const SCHEDULED_ITEMS = [
  {
    time: 'Today, 2:30 PM',
    title: 'Product launch walkthrough & feature breakdown',
    platforms: ['instagram', 'tiktok', 'threads'],
    status: 'Ready',
  },
  {
    time: 'Tomorrow, 9:00 AM',
    title: '5 workflows that cut content production time by 80%',
    platforms: ['linkedin', 'x'],
    status: 'Scheduled',
  },
  {
    time: 'Thursday, 4:15 PM',
    title: 'Behind the scenes: Automating client social accounts',
    platforms: ['instagram', 'facebook', 'x'],
    status: 'Scheduled',
  },
];

export default function ScheduleAutomationSection() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'instagram',
    'tiktok',
    'linkedin',
    'x',
    'facebook',
    'threads',
  ]);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((p) => p !== id) : prev) : [...prev, id]
    );
  };

  return (
    <section className="py-20 md:py-28 bg-[#E2E0D5] border-b border-[#141416]/15">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        {/* =========================================================================
            SECTION HEADER
        ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#141416] border border-[#141416] text-[12px] font-medium text-white shadow-2xs mb-5">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                background: 'linear-gradient(to right bottom in oklab, rgb(0, 120, 77) 0%, rgb(7, 185, 121) 100%)',
              }}
            />
            <span className="font-mono text-zinc-300">Unified Publishing Engine</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-hero-sans font-normal tracking-[-0.04em] text-[#000000] leading-[1.04]">
            Schedule posts across{' '}
            <span
              className="font-hero-sans font-black tracking-[-0.04em] inline-block"
              style={{
                backgroundImage: 'linear-gradient(to right bottom in oklab, rgb(0, 120, 77) 0%, rgb(7, 185, 121) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              all platforms.
            </span>
          </h2>

          <p className="font-editorial-italic text-2xl sm:text-3xl text-[#141416] font-normal tracking-tight mt-3">
            Save time with one dashboard.
          </p>

          <p className="font-hero-sans font-normal text-base sm:text-lg text-[#141416]/80 max-w-2xl mx-auto leading-relaxed tracking-tight mt-4">
            Stop jumping between different apps, copying links, and reformatting posts by hand. Write your content once, adjust it for each network, and schedule it out weeks in advance. BufferMate handles the publishing directly to your connected profiles while you stay focused on your work.
          </p>
        </div>

        {/* =========================================================================
            INTERACTIVE SCHEDULER DASHBOARD SHOWCASE (Crisp White SaaS Surface)
        ========================================================================= */}
        <div className="bg-white rounded-[28px] border border-[#141416]/12 shadow-[0_20px_50px_rgba(20,20,22,0.06)] p-6 sm:p-10 text-[#141416] mb-12">
          {/* Top Bar: Connected Platform Selectors */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 border-b border-[#E2E0D5] gap-6">
            <div>
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#00784D]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#62645F] font-semibold">
                  Target Destinations ({selectedPlatforms.length} active)
                </span>
              </div>
              <p className="text-xs text-[#62645F] mt-1">
                Click any channel to include or exclude it from this scheduled dispatch.
              </p>
            </div>

            {/* Platform Badges */}
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => {
                const IconComponent = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00784D] text-white border border-[#00784D] shadow-xs'
                        : 'bg-[#F7F6F2] text-[#62645F] border border-[#E2E0D5] hover:text-[#141416] hover:border-[#141416]/30'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{platform.name}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-3 h-3 text-[#07B979]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Grid: Composer & Live Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Left: Universal Composer Preview */}
            <div className="lg:col-span-7 bg-[#F7F6F2] rounded-2xl p-6 border border-[#E2E0D5] space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-2xs"
                    style={{
                      background: 'linear-gradient(to right bottom in oklab, rgb(0, 120, 77) 0%, rgb(7, 185, 121) 100%)',
                    }}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-[#141416]">Multi-Channel Composer</span>
                </div>
                <span className="text-[11px] font-mono text-[#00784D] bg-[#00784D]/10 px-2.5 py-0.5 rounded-full border border-[#00784D]/25 font-semibold">
                  Auto-sync active
                </span>
              </div>

              {/* Text Area Mockup */}
              <div className="bg-white rounded-xl p-4 border border-[#E2E0D5] text-sm space-y-3 shadow-2xs">
                <p className="text-[#141416] font-normal leading-relaxed">
                  We just crossed 2,400+ creators automating their weekly publishing with BufferMate. Here is the exact 3-step scheduling workflow we use to run six channels in under 30 minutes a week 👇
                </p>
                <div className="flex items-center space-x-2 text-xs font-medium text-[#00784D]">
                  <span>#SocialMediaAutomation</span>
                  <span>#ContentCreator</span>
                  <span>#GrowthStrategy</span>
                </div>
              </div>

              {/* Channel Distribution Indicator */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#62645F] font-medium">Distributing to:</span>
                <div className="flex items-center space-x-1.5">
                  {selectedPlatforms.map((pId) => {
                    const match = PLATFORMS.find((p) => p.id === pId);
                    if (!match) return null;
                    const Icon = match.icon;
                    return (
                      <div
                        key={pId}
                        className="w-6 h-6 rounded-full bg-white border border-[#E2E0D5] flex items-center justify-center text-[#141416] shadow-2xs"
                        title={match.name}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Schedule Bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E2E0D5]">
                <div className="flex items-center space-x-2 text-xs text-[#62645F]">
                  <Clock className="w-4 h-4 text-[#00784D]" />
                  <span>Scheduled for: <strong className="text-[#141416]">Friday at 10:00 AM</strong></span>
                </div>
                <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#00784D]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Optimal engagement slot</span>
                </div>
              </div>
            </div>

            {/* Right: Upcoming Publishing Timeline */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm font-bold text-[#141416]">
                    <Calendar className="w-4 h-4 text-[#00784D]" />
                    <span>Upcoming Queue</span>
                  </div>
                  <Link href="/dashboard" className="text-xs font-semibold text-[#00784D] hover:underline transition-colors">
                    View calendar →
                  </Link>
                </div>

                <div className="space-y-3">
                  {SCHEDULED_ITEMS.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F7F6F2] rounded-xl p-3.5 border border-[#E2E0D5] hover:border-[#141416]/25 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-[#00784D] font-mono font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00784D]" />
                          {item.time}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#62645F] bg-white border border-[#E2E0D5] px-2 py-0.5 rounded-md shadow-2xs">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#141416] line-clamp-1 mb-2">
                        {item.title}
                      </p>
                      <div className="flex items-center space-x-1">
                        {item.platforms.map((pId) => {
                          const match = PLATFORMS.find((p) => p.id === pId);
                          if (!match) return null;
                          const Icon = match.icon;
                          return (
                            <div
                              key={pId}
                              className="w-5 h-5 rounded-full bg-white border border-[#E2E0D5] flex items-center justify-center text-[#62645F] shadow-2xs"
                            >
                              <Icon className="w-2.5 h-2.5" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Metric */}
              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E2E0D5] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#62645F] font-semibold">Time saved this month</div>
                  <div className="text-xl font-black text-[#141416] tracking-tight mt-0.5">38 hours</div>
                </div>
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                  style={{
                    background: 'linear-gradient(to right bottom in oklab, rgb(0, 120, 77) 0%, rgb(7, 185, 121) 100%)',
                  }}
                >
                  100% Automated
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3 SUPPORTING VALUE PILLARS
        ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-[24px] p-7 border border-[#E2E0D5] hover:border-[#141416] transition-all">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-5 shadow-xs"
              style={{
                background: 'linear-gradient(to right bottom in oklab, rgb(0, 120, 77) 0%, rgb(7, 185, 121) 100%)',
              }}
            >
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#000000] mb-2 leading-snug">
              One-Click Multi-Posting
            </h3>
            <p className="font-medium text-[14px] text-[#353733] leading-relaxed">
              Write your update once and format it automatically for every network. Hashtags, character limits, and media attachments adapt to each platform instantly.
            </p>
          </div>

          <div className="bg-white rounded-[24px] p-7 border border-[#E2E0D5] hover:border-[#141416] transition-all">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-5 shadow-xs"
              style={{
                background: 'linear-gradient(to right bottom in oklab, rgb(0, 120, 77) 0%, rgb(7, 185, 121) 100%)',
              }}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#000000] mb-2 leading-snug">
              Visual Master Calendar
            </h3>
            <p className="font-medium text-[14px] text-[#353733] leading-relaxed">
              Organize your entire content pipeline at a glance. Drag, drop, and reschedule posts in seconds to maintain an active social presence without gaps.
            </p>
          </div>

          <div className="bg-white rounded-[24px] p-7 border border-[#E2E0D5] hover:border-[#141416] transition-all">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-5 shadow-xs"
              style={{
                background: 'linear-gradient(to right bottom in oklab, rgb(0, 120, 77) 0%, rgb(7, 185, 121) 100%)',
              }}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#000000] mb-2 leading-snug">
              Reliable Direct Publishing
            </h3>
            <p className="font-medium text-[14px] text-[#353733] leading-relaxed">
              No reminder push notifications that ask you to post manually. Your content goes live automatically on schedule through official platform APIs.
            </p>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM CALL TO ACTION
        ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <AnimatedButton href="/signup" size="lg">
            Start Scheduling Free
          </AnimatedButton>
          <Link
            href="/features#scheduler"
            className="text-sm font-bold text-[#141416] hover:text-[#00784D] transition-colors inline-flex items-center gap-1.5 py-3 px-5"
          >
            <span>Explore all scheduler features</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

