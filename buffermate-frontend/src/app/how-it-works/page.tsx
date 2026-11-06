'use client';

import React from 'react';
import Link from 'next/link';
import {
  Cloud,
  Search,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Sparkles,
  Layers,
  Send
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import KobbleCta from '@/components/marketing/KobbleCta';
import MarketingFooter from '@/components/marketing/Footer';

export default function HowItWorksPage() {
  const guides = [
    {
      title: 'Connecting Channels with Official OAuth 2.0',
      description: 'Understanding why we connect directly to Meta Graph API and TikTok Creator endpoints without storing passwords.',
      category: 'BUFFERMATE 101',
      author: 'Buffermate Security',
      date: 'Nov 4, 2026',
    },
    {
      title: 'How to Craft High-Converting Social Hooks with AI',
      description: 'Learn the daily habits, opening curiosity triggers, and hashtag clustering strategies used by top creators on Buffermate.',
      category: 'BUFFERMATE 101',
      author: 'Growth Team',
      date: 'Nov 2, 2026',
    },
    {
      title: 'Setting Up 24/7 Comment Keyword Auto-DM Funnels',
      description: 'Step-by-step guide on creating keyword automation rules that instantly dispatch links and convert followers into paying clients.',
      category: 'BUFFERMATE 101',
      author: 'Lead Gen Team',
      date: 'Oct 28, 2026',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4EE] font-sans text-slate-900 selection:bg-[#52832B]/20 selection:text-[#52832B]">
      <MarketingNavbar />

      <main className="overflow-hidden">
        {/* Hero Section matching Kobble How It Works */}
        <section className="pt-12 sm:pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-[#E7E4DC] text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#52832B]" />
            <span>HOW IT WORKS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[#141416] leading-[1.08] max-w-4xl mx-auto">
            How <span className="text-[#52832B]">Buffermate</span> works.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re scheduling weekly posts or converting comments into paying clients, here&apos;s everything you need to know — step by step.
          </p>
        </section>

        {/* 3 Core Pillar Cards matching Kobble */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Connecting Channels */}
            <div className="bg-white rounded-3xl p-8 border border-[#E7E4DC] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#52832B] text-white flex items-center justify-center shadow-xs">
                  <Cloud className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#141416] tracking-tight">
                  Connecting Channels
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  One-click OAuth 2.0 authorization for Instagram, TikTok, Threads, Facebook, X, and WhatsApp with zero password sharing. Manage all profiles in isolated workspaces.
                </p>
              </div>
              <Link
                href="/features#integrations"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#52832B] hover:text-[#436e22] transition-colors"
              >
                <span>Read more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: AI Content & Scheduling */}
            <div className="bg-white rounded-3xl p-8 border border-[#E7E4DC] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#141416] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-[#141416] tracking-tight">
                  AI Content &amp; Scheduling
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Transform rough ideas or URLs into platform-tailored hooks, threads, and short-form video scripts. Queue dispatches at peak audience engagement windows automatically.
                </p>
              </div>
              <Link
                href="/features#ai-studio"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#52832B] hover:text-[#436e22] transition-colors"
              >
                <span>Read more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: 24/7 Lead Capture */}
            <div className="bg-white rounded-3xl p-8 border border-[#E7E4DC] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shadow-xs">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#141416] tracking-tight">
                  24/7 Lead Capture &amp; Revenue
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Turn post comments saying &apos;PRICE&apos; or &apos;LINK&apos; into paying customers with sub-15s direct message dispatches and Bachs hosted payment checkouts.
                </p>
              </div>
              <Link
                href="/features#auto-dm"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#52832B] hover:text-[#436e22] transition-colors"
              >
                <span>Read more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Further Reading Section matching Kobble */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141416] tracking-tight">
                Further reading
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Buffermate 101 — evergreen guides to the platform from the engineering team.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center space-x-1 text-xs sm:text-sm font-bold text-[#52832B] hover:underline"
            >
              <span>View all posts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((g, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E7E4DC] shadow-xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {g.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#141416] leading-snug">
                  {g.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {g.description}
                </p>
                <div className="pt-3 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-[#52832B]" />
                  <span>{g.author}</span>
                  <span>·</span>
                  <span>{g.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dual Closing CTA matching Kobble */}
        <KobbleCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
