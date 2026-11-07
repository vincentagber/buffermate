'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AnimatedButton from '@/components/ui/AnimatedButton';
import {
  Sparkles,
  Calendar,
  MessageCircle,
  TrendingUp,
  Inbox,
  ShieldCheck,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  Copy,
  Share2,
  Play,
  RotateCcw,
  Sliders,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { TailwindDocumentChartIcon, TailwindCheckBadgeIcon } from '@/components/PaymentIcons';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingCta from '@/components/marketing/MarketingCta';
import MarketingFooter from '@/components/marketing/Footer';
import {
  InstagramIcon,
  TikTokIcon,
  ThreadsIcon,
  FacebookIcon,
  XIcon,
  WhatsAppIcon
} from '@/components/SocialIcons';

export default function FeaturesPage() {
  // Interactive AI Script Studio State
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<'agency' | 'launch' | 'leadgen'>('agency');
  const [activePlatform, setActivePlatform] = useState<'instagram' | 'threads' | 'x' | 'tiktok'>('instagram');
  const [isCopied, setIsCopied] = useState(false);

  // Heatmap interactive day selector
  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState<'Mon' | 'Wed' | 'Fri' | 'Sun'>('Wed');

  const promptDemos = {
    agency: {
      label: 'Agency Service Offer',
      input: 'Create a high-converting announcement offering custom Next.js web application development for digital marketing agencies.',
      instagram: {
        hook: 'Is your business website actually converting visitors into paying clients, or is it just an expensive digital business card? 💻⚡️',
        body: 'In 2026, a 3-second mobile load delay costs you over 40% of inbound buyers.\n\nWe build lightning-fast web experiences engineered to convert social traffic into qualified booked appointments:\n\n1. Sub-second load times & 60fps mobile UX\n2. Automated comment-to-WhatsApp lead funnels\n3. High-converting copywriting and technical SEO',
        cta: 'Comment "WEBSITE" below and our automated AI assistant will instantly send you our 2026 Web Architecture Breakdown in your DMs!',
        score: 98,
        reach: 'Top 5% Projected Reach'
      },
      threads: {
        hook: 'Hard truth about website development for modern agencies:',
        body: 'Your beautiful website is completely useless if social media visitors bounce in under 4 seconds.\n\nSub-second speeds, clean typography, and instant DM lead capture are what actually generate pipeline.',
        cta: 'When was the last time you refreshed your agency website? Reply below.',
        score: 95,
        reach: 'High Conversational Velocity'
      },
      x: {
        hook: 'Most businesses spend thousands on ads while sending traffic to a slow 2018-era website.',
        body: 'We design high-converting web applications tailored for creators and agencies.\n\nHere are 4 architecture mistakes draining your conversion rate 🧵👇',
        cta: 'Drop a bookmark or reply "AUDIT" for our checklist.',
        score: 96,
        reach: 'Thread Retweet Optimized'
      },
      tiktok: {
        hook: '[HOOK: 0-3s] "If your business website looks like it was made in 2018, this is why you are losing high-ticket clients."',
        body: 'Visual: Split screen comparing a sluggish desktop site with a slick, instant mobile app with live one-click WhatsApp booking.\n\nAudio: People don\'t wait 10 seconds for a page to load. We build sub-second websites with built-in DM lead capture.',
        cta: 'Comment "DEV" and I\'ll send you our complete client template directly!',
        score: 99,
        reach: 'Viral Retention Profile'
      }
    },
    launch: {
      label: 'Product Feature Launch',
      input: 'Announce Buffermate 2.0 with predictive peak audience heatmaps and 24/7 comment keyword DM automations.',
      instagram: {
        hook: 'We spent 6 months building the feature our creators requested most. It is finally live. 🚀',
        body: 'Introducing Buffermate Predictive Audience Intelligence.\n\nNow you can see:\n• Exact peak engagement heatmaps across 6 platforms\n• Predictive viral hook scoring before you hit publish\n• Direct revenue pipeline attributed to comments and DMs',
        cta: 'Comment "LAUNCH" below to claim lifetime early beta pricing!',
        score: 97,
        reach: 'Top 3% Projected Reach'
      },
      threads: {
        hook: 'You can now predict which post will perform before you hit publish.',
        body: 'We analyzed 2.4 million creator engagement points to build our predictive peak-time engine.\n\nNo more guessing whether Wednesday 10 AM or Friday 6 PM works best.',
        cta: 'What is your primary social channel right now? Comment below.',
        score: 94,
        reach: 'Community Discussion Trigger'
      },
      x: {
        hook: 'Major product release 🚀 Buffermate AI 2.0 is officially live.',
        body: '• Gemini 2.0 Viral Script Studio\n• Predictive Peak Publishing Heatmaps\n• Automated Comment-to-DM Funnels\n\nTry it free today without a credit card 👇',
        cta: 'Retweet to share with your team.',
        score: 96,
        reach: 'High B2B Click-Through'
      },
      tiktok: {
        hook: '[HOOK: 0-2s] "This one AI tool just solved the hardest part of social media."',
        body: 'Visual: Live screen recording selecting Wednesday 8:15 AM on the Buffermate Heatmap and showing a 34% reach spike.\n\nAudio: It scans your actual followers across Instagram, TikTok, and Threads and tells you the exact minute they are active.',
        cta: 'Comment "AI" and I will send you the secret invite link!',
        score: 98,
        reach: 'High Video Watch Time'
      }
    },
    leadgen: {
      label: 'Lead Magnet Funnel',
      input: 'Offer a free 12-page guide on scaling a digital agency using automated social media workflows.',
      instagram: {
        hook: 'Want our exact 12-page SOP for running 20+ client social channels on autopilot? 📥',
        body: 'Most agencies burn out trying to manually schedule posts at 11 PM and replying to DMs 5 hours late.\n\nThis free blueprint shows you:\n• Multi-client isolated workspace architecture\n• The 3.2-second comment-to-DM conversion trigger\n• How to generate white-label PDF reports in 10 seconds',
        cta: 'Comment "BLUEPRINT" and I will DM you the instant download link right now!',
        score: 99,
        reach: 'Maximum Lead Generation'
      },
      threads: {
        hook: 'Giving away our agency SOP for managing 20+ client social accounts without burning out.',
        body: 'Includes our exact AI prompting templates, peak scheduling calendar, and white-label reporting dashboard.',
        cta: 'Reply "SEND" and check your inbox.',
        score: 93,
        reach: 'Organic Conversation Spike'
      },
      x: {
        hook: 'I compiled our agency\'s entire social media automation SOP into a 12-page PDF.',
        body: '• Multi-channel queue templates\n• Automated keyword DM workflows\n• Client white-label reporting\n\nFree for the next 24 hours 🧵👇',
        cta: 'Like + reply "SOP" to get the direct link.',
        score: 97,
        reach: 'High Virality Score'
      },
      tiktok: {
        hook: '[HOOK: 0-3s] "Stop manually scheduling social posts for your clients. Here is the SOP we use instead."',
        body: 'Visual: Quick scroll through the 12-page guide and the Buffermate queue dashboard.\n\nAudio: We automated 85% of our agency social posting. Comment "GUIDE" and my AI assistant will instantly send you the PDF!',
        cta: 'Comment "GUIDE" right now to get it before it is taken down.',
        score: 98,
        reach: 'Instant Comment Surge'
      }
    }
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const currentDemo = promptDemos[selectedPromptCategory];
  const activePost = currentDemo[activePlatform];

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
          {/* Subtle floating background SVG shapes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden text-[#1A202C] opacity-[0.03]">
            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute -top-20 -left-10 rotate-12">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[35%] left-[8%] -rotate-12">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute -top-16 -right-12 -rotate-12">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute bottom-[-10%] right-[15%] rotate-6">
              <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>

          {/* Radial soft glow behind hero badge */}
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00784D]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-[850px] mx-auto text-center animate-slide-up-fade">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#E2E0D5] shadow-xs mb-6 mx-auto">
              <div className="w-2 h-2 rounded-full bg-[#07B979] animate-pulse" />
              <span className="font-bold text-[12px] text-[#1A202C] tracking-wide uppercase">
                Platform Features
              </span>
            </div>

            {/* Massive Headline */}
            <h1 className="font-extrabold text-[42px] sm:text-[56px] md:text-[68px] text-[#1A202C] leading-[1.08] mb-6 tracking-tight">
              Every channel, <br className="hidden sm:inline" />
              <span className="text-[#00784D]">one autonomous engine.</span>
            </h1>

            {/* Subtitle */}
            <p className="font-medium text-[18px] md:text-[20px] text-[#6B6B60] leading-relaxed max-w-[720px] mx-auto mb-8">
              From Google Gemini 2.0 viral script ideation and multi-channel scheduling to sub-15s comment DM lead funnels and peak heatmaps — Buffermate replaces manual social chaos with automated precision.
            </p>

            {/* Hero Quick CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <AnimatedButton href="/signup" size="lg">
                Start Free Workspace
              </AnimatedButton>
              <Link
                href="#interactive-demo"
                className="px-7 py-4 bg-white border border-[#E2E0D5] text-[#1A202C] rounded-full font-bold text-[15px] hover:bg-[#F0EEE6] hover:border-[#C4C4B8] transition-all w-full sm:w-auto"
              >
                Explore Live Demo ↓
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CORE CAPABILITIES 6-CARD GRID */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#E2E0D5] border-b border-[#E2E0D5] py-20 md:py-28 relative">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 relative z-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="max-w-[620px]">
                <h2 className="font-extrabold text-[34px] md:text-[46px] text-[#1A202C] leading-[1.12] mb-4">
                  Scale operations with <br />
                  <span className="text-[#00784D]">autonomous precision.</span>
                </h2>
                <p className="font-medium text-[17px] text-[#6B6B60] leading-relaxed">
                  Engineered for solo creators, fast-moving agencies, and high-growth brands that cannot afford fragmented tools, missed peak times, or lost comment leads.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2E0D5] text-xs font-bold text-[#1A202C]">
                  6 Unified Core Systems
                </span>
              </div>
            </div>

            {/* 6 Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: AI Viral Script Studio */}
              <div className="bg-white rounded-[24px] p-8 border border-[#E2E0D5] hover:border-[#C4C4B8] transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 bg-[#00784D]/10 border border-[#07B979]/30 text-[#00784D]">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#00784D] bg-[#00784D]/10 px-2.5 py-0.5 rounded-full">
                        Gemini 2.0 &amp; GPT-4
                      </span>
                      <h3 className="font-bold text-[20px] text-[#1A202C] mt-1">
                        AI Viral Script Studio
                      </h3>
                    </div>
                  </div>
                  <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed mb-6">
                    Turn a raw thought or brief into high-curiosity opening hooks, carousel slides, and video teleprompter scripts tailored to your personal creator tone.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs font-semibold text-[#1A202C]">
                  <span>Curiosity Hook Scoring</span>
                  <span className="text-[#00784D]">98% Match Rate →</span>
                </div>
              </div>

              {/* Card 2: Multi-Channel Precision Scheduler */}
              <div className="bg-white rounded-[24px] p-8 border border-[#E2E0D5] hover:border-[#C4C4B8] transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6]">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-0.5 rounded-full">
                        6 Official Networks
                      </span>
                      <h3 className="font-bold text-[20px] text-[#1A202C] mt-1">
                        Precision Multi-Scheduler
                      </h3>
                    </div>
                  </div>
                  <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed mb-6">
                    Compose once, format natively. Dispatch Reels, TikToks, Threads, Tweets, and Facebook posts simultaneously with custom video covers and aspect ratio checks.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs font-semibold text-[#1A202C]">
                  <span>Official OAuth 2.0 APIs</span>
                  <span className="text-[#3B82F6]">Zero Account Bans →</span>
                </div>
              </div>

              {/* Card 3: 24/7 Comment-to-DM Pipeline */}
              <div className="bg-white rounded-[24px] p-8 border border-[#E2E0D5] hover:border-[#C4C4B8] transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6]">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6] bg-[#8B5CF6]/10 px-2.5 py-0.5 rounded-full">
                        Instant 3.2s Trigger
                      </span>
                      <h3 className="font-bold text-[20px] text-[#1A202C] mt-1">
                        Comment-to-DM Lead Funnel
                      </h3>
                    </div>
                  </div>
                  <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed mb-6">
                    Never lose an interested buyer. When followers comment &apos;PRICE&apos;, &apos;LINK&apos;, or &apos;INFO&apos;, our webhook engine dispatches the exact resource link to their DMs in seconds.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs font-semibold text-[#1A202C]">
                  <span>Anti-Spam Human Delay</span>
                  <span className="text-[#8B5CF6]">98.4% Open Rate →</span>
                </div>
              </div>

              {/* Card 4: Predictive Peak Audience Heatmaps */}
              <div className="bg-white rounded-[24px] p-8 border border-[#E2E0D5] hover:border-[#C4C4B8] transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-0.5 rounded-full">
                        Timezone Calibrated
                      </span>
                      <h3 className="font-bold text-[20px] text-[#1A202C] mt-1">
                        Predictive Peak Heatmaps
                      </h3>
                    </div>
                  </div>
                  <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed mb-6">
                    Stop posting into an empty void. Our engine analyzes 2.4 million follower data points to calculate the exact hour and minute your audience is actively scrolling.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs font-semibold text-[#1A202C]">
                  <span>Automatic Slot Routing</span>
                  <span className="text-[#F59E0B]">+34% Reach Boost →</span>
                </div>
              </div>

              {/* Card 5: Unified Omnichannel CRM Inbox */}
              <div className="bg-white rounded-[24px] p-8 border border-[#E2E0D5] hover:border-[#C4C4B8] transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899]">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#EC4899] bg-[#EC4899]/10 px-2.5 py-0.5 rounded-full">
                        Zero-Lag Webhooks
                      </span>
                      <h3 className="font-bold text-[20px] text-[#1A202C] mt-1">
                        Unified Omnichannel Inbox
                      </h3>
                    </div>
                  </div>
                  <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed mb-6">
                    Manage Instagram DMs, TikTok comments, X mentions, and Facebook messages in one centralized stream. Filter unread, tag high-value leads, and reply without switching tabs.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs font-semibold text-[#1A202C]">
                  <span>Lead Attribution Tags</span>
                  <span className="text-[#EC4899]">All-in-One Inbox →</span>
                </div>
              </div>

              {/* Card 6: White-Label Agency Analytics */}
              <div className="bg-white rounded-[24px] p-8 border border-[#E2E0D5] hover:border-[#C4C4B8] transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]">
                      <TailwindDocumentChartIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#EF4444] bg-[#EF4444]/10 px-2.5 py-0.5 rounded-full">
                        Executive PDF &amp; CSV
                      </span>
                      <h3 className="font-bold text-[20px] text-[#1A202C] mt-1">
                        White-Label Client Analytics
                      </h3>
                    </div>
                  </div>
                  <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed mb-6">
                    Export polished, client-ready PDF reports with your own agency branding. Prove return on investment with follower growth, viral post rankings, and conversion metrics.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs font-semibold text-[#1A202C]">
                  <span>1-Click Custom Branding</span>
                  <span className="text-[#EF4444]">Agency Ready →</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. INTERACTIVE FEATURE DEEP DIVE: AI SCRIPT STUDIO (Interactive Demo) */}
        {/* ========================================================================= */}
        <section id="interactive-demo" className="w-full bg-[#FAF8F4] border-b border-[#E2E0D5] py-20 md:py-28 relative">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10">
            {/* Header */}
            <div className="text-center max-w-[700px] mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E0D5] text-[11px] font-bold text-[#00784D] uppercase tracking-wider mb-4 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Interactive Demonstration</span>
              </div>
              <h2 className="font-extrabold text-[32px] md:text-[44px] text-[#1A202C] leading-tight mb-4">
                Test the AI Viral Script Studio.
              </h2>
              <p className="font-medium text-[16px] text-[#6B6B60]">
                Select an example prompt below, toggle between platforms, and see how Buffermate adapts tone, formatting, and call-to-actions instantly.
              </p>
            </div>

            {/* Interactive Card Container */}
            <div className="bg-white rounded-[28px] border border-[#E2E0D5] shadow-xl overflow-hidden">
              {/* Top Control Bar */}
              <div className="p-6 md:p-8 bg-[#E2E0D5] border-b border-[#E2E0D5]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#6B6B60] mr-2">Example Use Case:</span>
                    {(['agency', 'launch', 'leadgen'] as const).map((key) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPromptCategory(key)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          selectedPromptCategory === key
                            ? 'bg-[#1A202C] text-white shadow-md'
                            : 'bg-white hover:bg-white/80 text-[#1A202C] border border-[#E2E0D5]'
                        }`}
                      >
                        {promptDemos[key].label}
                      </button>
                    ))}
                  </div>

                  {/* Model Engine Badge */}
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#00784D] bg-[#00784D]/10 px-3 py-1.5 rounded-full border border-[#07B979]/30 self-start md:self-auto">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#07B979] animate-ping" />
                    <span>Gemini 2.0 Viral Architecture</span>
                  </div>
                </div>

                {/* Simulated Prompt Box */}
                <div className="mt-5 bg-white rounded-2xl p-4 border border-[#E2E0D5] shadow-2xs">
                  <div className="text-[11px] font-bold text-[#6B6B60] uppercase tracking-wider mb-1">
                    Input Prompt Directive:
                  </div>
                  <div className="text-sm md:text-[15px] font-semibold text-[#1A202C]">
                    &ldquo;{currentDemo.input}&rdquo;
                  </div>
                </div>
              </div>

              {/* Platform Switcher Tabs */}
              <div className="px-6 md:px-8 pt-5 pb-3 bg-white border-b border-[#E2E0D5] flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-[#6B6B60] mr-2 shrink-0">Native Preview:</span>
                {[
                  { id: 'instagram', label: 'Instagram Reel/Post', icon: <InstagramIcon className="w-4 h-4 text-pink-600" /> },
                  { id: 'tiktok', label: 'TikTok Video Script', icon: <TikTokIcon className="w-4 h-4 text-slate-900" /> },
                  { id: 'threads', label: 'Threads Conversation', icon: <ThreadsIcon className="w-4 h-4 text-slate-900" /> },
                  { id: 'x', label: 'X (Twitter Thread)', icon: <XIcon className="w-4 h-4 text-slate-900" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePlatform(tab.id as any)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      activePlatform === tab.id
                        ? 'bg-[#1A202C] text-white shadow-xs'
                        : 'bg-[#E2E0D5] hover:bg-[#EAE6DD] text-[#4A5568]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Output Content Area */}
              <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Generated Copy Display */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Viral Score & Reach Projection */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00784D]/10 border border-[#07B979]/30 text-xs font-bold text-[#00784D]">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Viral Hook Score: {activePost.score}/100</span>
                    </div>
                    <span className="text-xs font-medium text-[#6B6B60]">
                      {activePost.reach}
                    </span>
                  </div>

                  {/* Hook Display */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B60]">
                      Opening Hook (0–3 Seconds):
                    </span>
                    <div className="p-4 rounded-2xl bg-[#E2E0D5] border border-[#E2E0D5] font-bold text-base md:text-lg text-[#1A202C] leading-snug">
                      {activePost.hook}
                    </div>
                  </div>

                  {/* Body Display */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B60]">
                      Script Body &amp; Value Delivery:
                    </span>
                    <div className="p-5 rounded-2xl bg-white border border-[#E2E0D5] text-sm md:text-[15px] font-medium text-[#1A202C] leading-relaxed whitespace-pre-line">
                      {activePost.body}
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B60]">
                      Automated Lead Trigger CTA:
                    </span>
                    <div className="p-3.5 rounded-xl bg-[#00784D]/5 border border-[#07B979]/30 text-xs md:text-sm font-semibold text-[#1A202C] flex items-center justify-between">
                      <span>{activePost.cta}</span>
                      <span className="shrink-0 ml-3 text-[10px] font-bold uppercase bg-[#00784D] text-white px-2 py-0.5 rounded-md">
                        Auto-DM Ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions & Publish Pipeline */}
                <div className="lg:col-span-4 bg-[#E2E0D5] rounded-2xl p-6 border border-[#E2E0D5] space-y-6">
                  <h4 className="font-bold text-[16px] text-[#1A202C]">
                    Pipeline Actions
                  </h4>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleCopy(`${activePost.hook}\n\n${activePost.body}\n\n${activePost.cta}`)}
                      className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-[#1A202C] rounded-xl font-bold text-xs border border-[#E2E0D5] flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-[#00784D]" /> : <Copy className="w-4 h-4" />}
                      <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}</span>
                    </button>

                    <Link
                      href="/signup"
                      className="w-full py-3.5 px-4 bg-[#00784D] hover:bg-[#07B979] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <span>Add to Smart Queue Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="pt-4 border-t border-[#E2E0D5] space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B60]">
                      Autonomous Checklist
                    </div>
                    <div className="space-y-2 text-xs font-medium text-[#4A5568]">
                      <div className="flex items-center gap-2 text-[#00784D]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Platform character limit verified</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#00784D]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Curiosity gap algorithm optimized</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#00784D]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Comment keyword trigger verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. PREDICTIVE PEAK AUDIENCE HEATMAP SHOWCASE */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#E2E0D5] border-b border-[#E2E0D5] py-20 md:py-28">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Descriptive Story */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E0D5] text-xs font-bold text-[#F59E0B] shadow-2xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Algorithmic Timing Intelligence</span>
                </div>

                <h2 className="font-extrabold text-[34px] md:text-[44px] text-[#1A202C] leading-[1.12]">
                  Publish when your audience is <br />
                  <span className="text-[#00784D]">actually scrolling.</span>
                </h2>

                <p className="font-medium text-[16px] text-[#6B6B60] leading-relaxed">
                  Most creators post whenever they remember, burning valuable content in the dead hours. Buffermate continuously scans your connected audience metrics to compute the exact 30-minute peak engagement window for every day of the week.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00784D]/10 text-[#00784D] flex items-center justify-center font-bold text-xs mt-0.5">
                      ✓
                    </div>
                    <p className="text-sm font-medium text-[#4A5568]">
                      <strong>Timezone Auto-Calibration:</strong> Syncs with West Africa (WAT), London (GMT), and New York (EST) automatically.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00784D]/10 text-[#00784D] flex items-center justify-center font-bold text-xs mt-0.5">
                      ✓
                    </div>
                    <p className="text-sm font-medium text-[#4A5568]">
                      <strong>Smart Slot Queue:</strong> Drag drafts into your queue and let Buffermate release them at highest-velocity slots.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Heatmap Matrix */}
              <div className="lg:col-span-7 bg-white rounded-[28px] border border-[#E2E0D5] p-6 md:p-8 shadow-xl">
                <div className="flex items-center justify-between pb-6 border-b border-[#E2E0D5] mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-[#1A202C]">
                      Audience Density Matrix
                    </h3>
                    <p className="text-xs text-[#6B6B60]">
                      Simulated 24-hour active follower density across Lagos &amp; Global feeds
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#E2E0D5] p-1 rounded-xl">
                    {(['Mon', 'Wed', 'Fri', 'Sun'] as const).map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedHeatmapDay(day)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          selectedHeatmapDay === day
                            ? 'bg-white text-[#1A202C] shadow-2xs'
                            : 'text-[#6B6B60] hover:text-[#1A202C]'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Hour Slots Matrix */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#6B6B60] px-2">
                    <span>Hour Slot</span>
                    <span>Audience Activity</span>
                    <span>Status</span>
                  </div>

                  {[
                    { time: '08:00 AM (Morning Catch)', density: 88, status: 'Peak Hot Slot', highlight: true },
                    { time: '11:30 AM (Midday Check)', density: 54, status: 'Moderate', highlight: false },
                    { time: '01:15 PM (Lunch Break)', density: 79, status: 'Recommended', highlight: true },
                    { time: '04:45 PM (Commute Start)', density: 62, status: 'Moderate', highlight: false },
                    { time: '07:30 PM (Evening Prime)', density: 96, status: 'Highest Reach (96%)', highlight: true },
                    { time: '11:00 PM (Late Night)', density: 31, status: 'Low Activity', highlight: false },
                  ].map((slot, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        slot.highlight
                          ? 'bg-[#00784D]/5 border-[#07B979]/30 shadow-2xs'
                          : 'bg-[#E2E0D5]/60 border-[#E2E0D5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={`w-4 h-4 ${slot.highlight ? 'text-[#00784D]' : 'text-[#6B6B60]'}`} />
                        <span className="text-xs md:text-sm font-bold text-[#1A202C]">
                          {slot.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Progress bar */}
                        <div className="w-24 md:w-32 h-2.5 bg-[#E2E0D5] rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              slot.highlight ? 'bg-[#00784D]' : 'bg-[#A0AEC0]'
                            }`}
                            style={{ width: `${slot.density}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          slot.highlight
                            ? 'bg-[#00784D] text-white'
                            : 'bg-[#E2E0D5] text-[#4A5568]'
                        }`}>
                          {slot.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-[#E2E0D5] flex items-center justify-between text-xs text-[#6B6B60]">
                  <span>Optimized for Africa/Lagos (UTC+1)</span>
                  <span className="font-bold text-[#00784D]">Automated Queue Active</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. COMPARISON MATRIX: MANUAL VS. BUFFERMATE AI */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#FAF8F4] border-b border-[#E2E0D5] py-20 md:py-28">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10">
            <div className="text-center max-w-[700px] mx-auto mb-16">
              <h2 className="font-extrabold text-[32px] md:text-[44px] text-[#1A202C] leading-tight mb-4">
                Manual publishing vs. Buffermate AI.
              </h2>
              <p className="font-medium text-[16px] text-[#6B6B60]">
                See how switching to an autonomous stack saves 15+ hours each week while doubling inbound customer pipeline.
              </p>
            </div>

            <div className="bg-white rounded-[28px] border border-[#E2E0D5] shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#E2E0D5] border-b border-[#E2E0D5] text-xs font-bold text-[#6B6B60] uppercase tracking-wider">
                    <tr>
                      <th className="py-5 px-6 md:px-8 text-[#1A202C]">Operational Capability</th>
                      <th className="py-5 px-6 text-[#6B6B60]">Manual Social Routine</th>
                      <th className="py-5 px-6 md:px-8 text-[#00784D] font-extrabold bg-[#00784D]/5">
                        Buffermate AI Stack
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E0D5]">
                    {[
                      {
                        title: 'Publishing Across 6 Channels',
                        manual: 'Log into 6 separate apps, copy-paste content, manually re-upload assets (2.5 hrs/day).',
                        buffermate: 'Compose once. Buffermate formats, resizes, and dispatches natively across all feeds simultaneously.'
                      },
                      {
                        title: 'Viral Script & Hook Ideation',
                        manual: 'Staring at blank screens, writer’s block, inconsistent tone across channels.',
                        buffermate: 'Gemini 2.0 generates curiosity hooks, thread outlines, and video teleprompter scripts in seconds.'
                      },
                      {
                        title: 'Post Timing & Reach',
                        manual: 'Posting randomly whenever free. Content misses peak active follower windows.',
                        buffermate: 'Predictive audience heatmaps continuously calculate and schedule into peak reach windows.'
                      },
                      {
                        title: 'Comment Lead Conversion',
                        manual: 'Replying to comments 4–8 hours late. 80% of interested buyers bounce.',
                        buffermate: 'Sub-15 second automated direct message funnels deliver links directly to buyer inboxes 24/7.'
                      },
                      {
                        title: 'Executive Client Reporting',
                        manual: 'Taking manual screenshots, stitching messy Excel spreadsheets, hours wasted monthly.',
                        buffermate: 'One-click white-label PDF reports branded with your agency logo and verified reach stats.'
                      },
                      {
                        title: 'Payment & Subscription Billing',
                        manual: 'Awkward manual invoices, delayed wire transfers, international card declines.',
                        buffermate: 'Seamless Bachs hosted checkouts supporting Cards, African Bank Transfers, Mobile Money, and Crypto.'
                      }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#E2E0D5]/50 transition-colors">
                        <td className="py-5 px-6 md:px-8 font-bold text-[#1A202C] text-sm md:text-[15px]">
                          {row.title}
                        </td>
                        <td className="py-5 px-6 text-[#6B6B60] text-xs md:text-sm leading-relaxed">
                          {row.manual}
                        </td>
                        <td className="py-5 px-6 md:px-8 font-medium text-[#1A202C] text-xs md:text-sm leading-relaxed bg-[#00784D]/5">
                          <div className="flex items-start gap-2">
                            <span className="text-[#00784D] font-bold text-base mt-[-2px]">✓</span>
                            <span>{row.buffermate}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. ENTERPRISE RELIABILITY & SECURITY SECTION */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#1A202C] text-white py-20 md:py-28 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 relative z-10">
            <div className="text-center max-w-[750px] mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-5">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise Infrastructure Security</span>
              </div>
              <h2 className="font-extrabold text-[34px] md:text-[48px] text-white leading-tight mb-5">
                Built on a foundation of <br />
                <span className="text-[#07B979]">absolute reliability.</span>
              </h2>
              <p className="font-normal text-[16px] md:text-[18px] text-slate-300 leading-relaxed">
                We know your social channels and creator accounts are your lifeblood. That is why we never scrape, never store passwords, and connect strictly through verified developer endpoints.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#00784D]/30 text-[#07B979] flex items-center justify-center font-bold text-lg mb-6">
                  <TailwindCheckBadgeIcon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">
                  100% Official OAuth 2.0
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Direct verified integration with Meta Graph API, TikTok Creator, X Developer, and Threads. Your login credentials never touch our servers.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">
                  Encrypted Token Security
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Access tokens and automation triggers are encrypted with enterprise-grade standards, isolating each client workspace.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">
                  99.98% Dispatched Post Uptime
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Distributed cloud queue workers ensure scheduled dispatches execute precisely on the exact minute, even during global platform peak hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. DUAL CLOSING CALL-TO-ACTION */}
        {/* ========================================================================= */}
        <MarketingCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
