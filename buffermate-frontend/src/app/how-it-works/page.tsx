'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Cloud,
  Sparkles,
  Wallet,
  ArrowRight,
  Clock,
  Layers,
  Send,
  CheckCircle2,
  Check,
  Zap,
  Play,
  Share2,
  Calendar,
  Lock,
  RotateCcw
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingCta from '@/components/marketing/MarketingCta';
import MarketingFooter from '@/components/marketing/Footer';
import MarketingWorkflowSpeed from '@/components/marketing/MarketingWorkflowSpeed';
import {
  InstagramIcon,
  TikTokIcon,
  ThreadsIcon,
  FacebookIcon,
  XIcon,
  WhatsAppIcon
} from '@/components/SocialIcons';

export default function HowItWorksPage() {
  const [activeStepTab, setActiveStepTab] = useState<'connect' | 'compose' | 'automate'>('compose');

  const furtherReadings = [
    {
      title: 'Why Buffermate Connects Exclusively via Official APIs',
      description: 'Understanding why we collect OAuth 2.0 authorization tokens directly from Meta and TikTok, and what it means for your account safety.',
      category: 'BUFFERMATE 101',
      author: 'Trust & Safety',
      date: 'Nov 4, 2026',
      readTime: '4 min read',
      href: '/blog/why-buffermate-connects-exclusively-via-official-apis'
    },
    {
      title: 'How to Stand Out on Social Feeds with Curiosity Hooks',
      description: 'Learn the daily posting cadence, opening curiosity triggers, and hashtag clustering strategies used by top-performing creators.',
      category: 'AI STRATEGY',
      author: 'Editorial Staff',
      date: 'Oct 29, 2026',
      readTime: '6 min read',
      href: '/blog/how-to-stand-out-on-social-feeds-with-curiosity-hooks'
    },
    {
      title: 'How to Create Private Lead Funnels with Comment Keywords',
      description: 'Learn how to automatically dispatch direct messages with unlisted resources when followers comment specific triggers on your posts.',
      category: 'LEAD FUNNELS',
      author: 'Lead Gen Team',
      date: 'Oct 24, 2026',
      readTime: '5 min read',
      href: '/blog/how-to-create-private-lead-funnels-with-comment-keywords'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1A202C] relative selection:bg-[#6F9C3E]/20 selection:text-[#6F9C3E]">
      {/* Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#6F9C3E]/12 to-transparent blur-[130px]" />
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
              <rect width="20" height="14" x="2" y="6" rx="2" /><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute -bottom-10 left-[20%] -rotate-6">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            </svg>
          </div>

          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6F9C3E]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-[800px] mx-auto text-center animate-slide-up-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#E2E0D5] shadow-xs mb-6 mx-auto">
              <div className="w-2 h-2 rounded-full bg-[#6F9C3E] animate-pulse" />
              <span className="font-bold text-[12px] text-[#1A202C] tracking-wide uppercase">
                How It Works
              </span>
            </div>

            <h1 className="font-extrabold text-[42px] sm:text-[56px] md:text-[68px] text-[#1A202C] leading-[1.08] mb-6 tracking-tight">
              How <span className="text-[#6F9C3E]">Buffermate</span> works.
            </h1>

            <p className="font-medium text-[18px] md:text-[20px] text-[#6B6B60] leading-relaxed max-w-[700px] mx-auto">
              Whether you are scheduling weekly content across 6 channels or converting casual comments into high-ticket buyers, here is everything you need to know — step by step.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THREE CORE PILLARS */}
        {/* ========================================================================= */}
        <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-16 md:py-24 border-b border-[#E2E0D5]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Connecting Channels */}
            <div className="bg-white rounded-[28px] border border-[#E2E0D5] p-8 hover:border-[#6F9C3E]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md bg-[#6F9C3E]">
                  <Cloud className="w-7 h-7" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6F9C3E] mb-1">
                  Step 01 · 60 Seconds
                </div>
                <h2 className="font-extrabold text-[24px] text-[#1A202C] mb-3 leading-snug">
                  Connect &amp; Authenticate
                </h2>
                <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed mb-6">
                  One-click OAuth 2.0 authorization for Instagram, TikTok, Threads, Facebook, X, and WhatsApp. No password sharing, no shady scraping, and zero account security risk.
                </p>
              </div>

              <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A202C]">AES-256 Tokens</span>
                <Link
                  href="/integrations"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#6F9C3E] hover:underline"
                >
                  <span>View APIs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 2: AI Content & Smart Queue */}
            <div className="bg-white rounded-[28px] border border-[#E2E0D5] p-8 hover:border-[#3B82F6]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md bg-[#1A202C]">
                  <Sparkles className="w-7 h-7 text-[#6F9C3E]" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#3B82F6] mb-1">
                  Step 02 · Content Ideation
                </div>
                <h2 className="font-extrabold text-[24px] text-[#1A202C] mb-3 leading-snug">
                  AI Scripting &amp; Queue
                </h2>
                <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed mb-6">
                  Transform raw briefs into formatted carousel slides, video teleprompter hooks, and threads. The smart queue releases your content at predictive peak audience windows.
                </p>
              </div>

              <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A202C]">Peak Heatmaps</span>
                <Link
                  href="/features#interactive-demo"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#3B82F6] hover:underline"
                >
                  <span>Test Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 3: 24/7 Lead Funnels */}
            <div className="bg-white rounded-[28px] border border-[#E2E0D5] p-8 hover:border-[#8B5CF6]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md bg-[#8B5CF6]">
                  <Wallet className="w-7 h-7" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6] mb-1">
                  Step 03 · Pipeline &amp; Revenue
                </div>
                <h2 className="font-extrabold text-[24px] text-[#1A202C] mb-3 leading-snug">
                  Comment Auto-DMs
                </h2>
                <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed mb-6">
                  Turn organic comments saying &apos;PRICE&apos; or &apos;INFO&apos; into paying clients. Our automated sub-15s webhook dispatches resource links and Bachs checkouts directly to their DMs.
                </p>
              </div>

              <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A202C]">Bachs Hosted Gateway</span>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#8B5CF6] hover:underline"
                >
                  <span>View Plans</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. BUILT FOR SPEED INTERACTIVE WORKFLOW */}
        {/* ========================================================================= */}
        <MarketingWorkflowSpeed />

        {/* ========================================================================= */}
        {/* 4. FURTHER READING GUIDES */}
        {/* ========================================================================= */}
        <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-20 md:py-28 border-b border-[#E2E0D5]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#6F9C3E] mb-2">
                Buffermate Knowledge Base
              </div>
              <h2 className="font-extrabold text-[32px] md:text-[42px] text-[#1A202C] leading-tight">
                Further reading
              </h2>
              <p className="font-medium text-[16px] text-[#6B6B60] mt-1">
                Evergreen playbooks and technical deep dives from the Buffermate engineering team.
              </p>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6F9C3E] hover:text-[#587e31] transition-colors shrink-0"
            >
              <span>View all 9 guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {furtherReadings.map((guide, idx) => (
              <Link
                key={idx}
                href={guide.href}
                className="group bg-white rounded-[24px] p-7 border border-[#E2E0D5] hover:border-[#C4C4B8] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#6F9C3E]/10 text-[#6F9C3E] border border-[#6F9C3E]/20">
                      {guide.category}
                    </span>
                    <span className="text-xs text-[#6B6B60] font-medium">
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-[18px] text-[#1A202C] group-hover:text-[#6F9C3E] transition-colors leading-snug mb-3">
                    {guide.title}
                  </h3>

                  <p className="font-medium text-[14px] text-[#6B6B60] leading-relaxed line-clamp-3 mb-6">
                    {guide.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs text-[#6B6B60]">
                  <span className="font-semibold text-[#1A202C]">{guide.author}</span>
                  <span>{guide.date}</span>
                </div>
              </Link>
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
