'use client';

import React from 'react';
import Link from 'next/link';
import {
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
  Users,
  Target,
  TrendingUp,
  Award,
  Globe
} from 'lucide-react';
import { TailwindCheckBadgeIcon } from '@/components/PaymentIcons';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingCta from '@/components/marketing/MarketingCta';
import MarketingFooter from '@/components/marketing/Footer';

export default function AboutPage() {
  const values = [
    {
      icon: <Zap className="w-7 h-7 text-[#00784D]" />,
      bg: 'bg-[#00784D]/10 border-[#07B979]/30',
      title: 'Built for Speed',
      description: 'From drafting an opening curiosity hook to multi-channel dispatch, every micro-step is engineered for throughput. Content reaches active follower feeds at peak velocity without manual lag.',
    },
    {
      icon: <Layers className="w-7 h-7 text-[#FF882A]" />,
      bg: 'bg-[#FF882A]/10 border-[#FF882A]/20',
      title: 'Automation at Scale',
      description: 'An autonomous publishing engine built to handle 1 to 100+ social accounts seamlessly. Scale audience reach and inbound client pipeline without adding headcount or experiencing burnout.',
    },
    {
      icon: <TailwindCheckBadgeIcon className="w-7 h-7 text-[#00784D]" />,
      bg: 'bg-[#00784D]/10 border-[#07B979]/30',
      title: 'Transparent & Compliant',
      description: 'Official developer APIs only. Zero password storage, AES-256 encrypted authentication tokens, and strict rate limit safety guardrails that protect your brand and account health.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#E2E0D5] text-[#1A202C] relative selection:bg-[#00784D]/20 selection:text-[#00784D]">
      {/* Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#07B979]/15 to-transparent blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#FF882A]/8 to-transparent blur-[130px]" />
      </div>

      <MarketingNavbar />

      <main className="flex-1 flex flex-col w-full relative">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden w-full px-5 md:px-10 py-16 md:py-24 border-b border-[#E2E0D5]">
          <div className="absolute inset-0 pointer-events-none overflow-hidden text-[#1A202C] opacity-[0.03]">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute -top-16 -left-10 rotate-12">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[30%] right-[10%] rotate-12">
              <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" />
            </svg>
          </div>

          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00784D]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-[800px] mx-auto text-center animate-slide-up-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#E2E0D5] shadow-xs mb-6 mx-auto">
              <div className="w-2 h-2 rounded-full bg-[#07B979] animate-pulse" />
              <span className="font-bold text-[12px] text-[#1A202C] tracking-wide uppercase">
                About Buffermate
              </span>
            </div>

            <h1 className="font-extrabold text-[42px] sm:text-[56px] md:text-[68px] text-[#1A202C] leading-[1.08] mb-6 tracking-tight">
              Social intelligence, <br className="hidden sm:inline" />
              <span className="text-[#00784D]">delivered at scale</span>.
            </h1>

            <p className="font-medium text-[18px] md:text-[20px] text-[#6B6B60] leading-relaxed max-w-[700px] mx-auto">
              Buffermate was built with a simple mission: give modern creators and agencies a transparent, fast, and reliable way to automate social publishing, schedule across every platform, and turn audience engagement into paying clients.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. STORY SECTION */}
        {/* ========================================================================= */}
        <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-16 md:py-24 border-b border-[#E2E0D5]">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
            {/* Left Column: Story text */}
            <div className="flex-1 space-y-6">
              <h2 className="font-extrabold text-[36px] md:text-[46px] leading-[1.12] text-[#1A202C]">
                The Modern Creator <br />
                <span className="text-[#00784D]">Workflow</span>, solved.
              </h2>

              <div className="space-y-5 font-medium text-[17px] text-[#6B6B60] leading-relaxed">
                <p>
                  Managing a serious social presence used to mean juggling scattered spreadsheets, brittle Chrome extensions, manually reformatting videos for 6 different aspect ratios, and constantly checking feeds at late hours to hit peak posting windows.
                </p>
                <p>
                  We noticed a massive gap: high-growth brands and creators were getting thousands of comments on viral videos saying &ldquo;PRICE&rdquo; or &ldquo;LINK&rdquo;, but dropping 80% of those leads because manual DMs took 4 hours. By the time a human replied, the buyer was gone.
                </p>
                <p>
                  That is why we built Buffermate AI. We replaced the busywork with autonomous intelligence. From Google Gemini 2.0 hook formulation to automated multi-channel scheduling and sub-15s direct message funnels, we help you make every post count.
                </p>
              </div>
            </div>

            {/* Right Column: Tilted Photo Card */}
            <div className="flex-1 flex justify-center w-full">
              <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80"
                  alt="Buffermate Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-xs font-mono font-bold tracking-wider text-emerald-400">
                    BUFFERMATE LABS · LAGOS &amp; GLOBAL
                  </div>
                  <div className="text-lg font-bold">
                    Building the autonomous social stack
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PLATFORM STATISTICS COUNTER */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#FAF8F4] border-b border-[#E2E0D5] py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-extrabold text-[40px] md:text-[52px] text-[#1A202C] tracking-tight">
                  2,400+
                </div>
                <div className="text-sm font-semibold text-[#6B6B60] mt-1">
                  Active Creators &amp; Agencies
                </div>
              </div>
              <div>
                <div className="font-extrabold text-[40px] md:text-[52px] text-[#00784D] tracking-tight">
                  1.2M+
                </div>
                <div className="text-sm font-semibold text-[#6B6B60] mt-1">
                  Social Posts Dispatched
                </div>
              </div>
              <div>
                <div className="font-extrabold text-[40px] md:text-[52px] text-[#FF882A] tracking-tight">
                  98.4%
                </div>
                <div className="text-sm font-semibold text-[#6B6B60] mt-1">
                  Comment-to-DM Open Rate
                </div>
              </div>
              <div>
                <div className="font-extrabold text-[40px] md:text-[52px] text-[#1A202C] tracking-tight">
                  99.98%
                </div>
                <div className="text-sm font-semibold text-[#6B6B60] mt-1">
                  Dispatched Post Uptime
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CORE VALUES */}
        {/* ========================================================================= */}
        <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-20 md:py-28 border-b border-[#E2E0D5]">
          <div className="text-center max-w-[650px] mx-auto mb-16">
            <h2 className="font-extrabold text-[36px] md:text-[46px] text-[#1A202C] leading-tight mb-4">
              Our Core Values
            </h2>
            <p className="font-medium text-[17px] text-[#6B6B60]">
              The product principles guiding every feature, AI model iteration, and API integration we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[28px] p-8 md:p-9 border border-[#E2E0D5] hover:border-[#C4C4B8] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${val.bg}`}>
                    {val.icon}
                  </div>
                  <h3 className="font-extrabold text-[22px] text-[#1A202C] mb-3">
                    {val.title}
                  </h3>
                  <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. DUAL CLOSING CALL-TO-ACTION */}
        {/* ========================================================================= */}
        <MarketingCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
