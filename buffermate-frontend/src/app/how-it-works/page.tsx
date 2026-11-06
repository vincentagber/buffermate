'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Share2,
  Calendar,
  Bot,
  ShieldCheck,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';
import CtaBanner from '@/components/marketing/CtaBanner';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Connect your accounts via official OAuth 2.0',
      description: 'Authorize Instagram, TikTok, Threads, Facebook, X, and WhatsApp with one click. Buffermate connects directly to official Meta Graph and TikTok Creator APIs with zero password sharing.',
      details: [
        'AES-256 encrypted session tokens stored at rest',
        'Direct multi-tenant account isolation via Supabase RLS',
        'No browser extensions or risky scraper automations',
      ],
      badge: 'Step 1: Security & Setup',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      number: '02',
      title: 'Craft and tailor content with Google Gemini 2.0',
      description: 'Input your raw thoughts, product links, or weekly prompts. Buffermate AI automatically crafts platform-specific hooks, formats captions to exact network guidelines, and generates optimal hashtag clusters.',
      details: [
        'Predictive curiosity and virality hook scoring',
        'Automatic media resizing (1:1 square, 4:5 vertical, 9:16 reels)',
        'Custom brand voice consistency tuned for your niche',
      ],
      badge: 'Step 2: AI Transformation',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      number: '03',
      title: 'Automate publishing and capture leads 24/7',
      description: 'Queue your content across the calendar using peak engagement heatmaps. Once live, autonomous DM funnels instantly reply to high-intent keywords in your post comments to convert followers into paying customers.',
      details: [
        'Algorithmic scheduling for maximum organic velocity',
        'Sub-15 second automated direct message dispatches',
        'Direct integration with Bachs payment checkout sessions',
      ],
      badge: 'Step 3: Conversion & Scale',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      <MarketingNavbar />

      <main className="space-y-20 sm:space-y-28 py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            <span>Step-by-Step Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.08]">
            How Buffermate AI works.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Go from scattered manual posting to an autonomous, high-velocity social media pipeline in three simple stages.
          </p>
        </div>

        {/* 3 Steps Vertical Sequence */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-4">
                  <span className="w-12 h-12 rounded-2xl bg-[#141416] text-white font-mono font-bold text-lg flex items-center justify-center shadow-2xs">
                    {step.number}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${step.badgeColor}`}>
                    {step.badge}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {step.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <CtaBanner />
      </main>

      <MarketingFooter />
    </div>
  );
}

