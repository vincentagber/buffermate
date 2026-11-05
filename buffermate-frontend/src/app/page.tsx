'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Calendar,
  MessageCircle,
  BarChart3,
  ShieldCheck,
  Check,
  Layers,
  Clock,
  Send,
  Users,
  Bot,
  Activity,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';
import ProductMockup from '@/components/marketing/ProductMockup';
import PricingCards from '@/components/marketing/PricingCards';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import CtaBanner from '@/components/marketing/CtaBanner';
import {
  InstagramIcon,
  TikTokIcon,
  ThreadsIcon,
  FacebookIcon,
  XIcon,
  WhatsAppIcon
} from '@/components/SocialIcons';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      {/* 1. Global Navigation */}
      <MarketingNavbar />

      <main className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
        {/* 2. Hero Section (Inspired by Bachs.io Clean Typography & Generous Whitespace) */}
        <section className="relative pt-12 sm:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          {/* Subtle Background Radial Gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-200/30 via-indigo-100/40 to-emerald-100/30 blur-3xl rounded-full -z-10 pointer-events-none" />

          {/* Eyebrow Announcement Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs text-xs font-semibold text-slate-800 hover:border-slate-300 transition-all mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Buffermate AI 2.0 is live</span>
            <span className="text-slate-300">·</span>
            <Link href="/features" className="text-purple-700 hover:underline flex items-center space-x-0.5">
              <span>See what&apos;s new</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08] max-w-4xl mx-auto">
            Your Social Media. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-slate-950 via-purple-900 to-indigo-900 bg-clip-text text-transparent">
              Smarter. Automated.
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
            Create engaging content, manage multiple social accounts, and automate your publishing workflow with AI. Everything you need to grow your online presence, in one place.
          </p>

          {/* Hero Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 sm:mt-10">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#141416] hover:bg-black text-white text-sm font-semibold shadow-md transition-all flex items-center justify-center space-x-2 hover:scale-[1.02] cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/features"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-sm font-semibold shadow-2xs transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Explore Features</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex items-center justify-center space-x-6 mt-6 text-xs text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>No credit card needed</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Setup in 2 minutes</span>
            </div>
          </div>

          {/* Interactive Product Mockup Showcase */}
          <div className="mt-12 sm:mt-16">
            <ProductMockup />
          </div>
        </section>

        {/* 3. Supported Platforms & Social Proof Strip */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Direct API integrations with the world&apos;s premier social channels
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2">
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center space-x-2 text-xs font-semibold text-slate-800">
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                <span>Instagram</span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center space-x-2 text-xs font-semibold text-slate-800">
                <TikTokIcon className="w-4 h-4 text-slate-900" />
                <span>TikTok</span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center space-x-2 text-xs font-semibold text-slate-800">
                <ThreadsIcon className="w-4 h-4 text-slate-900" />
                <span>Threads</span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center space-x-2 text-xs font-semibold text-slate-800">
                <FacebookIcon className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center space-x-2 text-xs font-semibold text-slate-800">
                <XIcon className="w-4 h-4 text-slate-900" />
                <span>X (Twitter)</span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center space-x-2 text-xs font-semibold text-slate-800">
                <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Core Features Bento Grid */}
        <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Social Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Everything required to dominate modern publishing.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Engineered for solopreneurs, content teams, and growing brands who need authentic velocity without burnout.
            </p>
          </div>

          {/* Bento Grid Layout (Bachs.io Clean Squircle Pattern) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: AI Content Generation */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-5 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  AI Viral Script & Hook Studio
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Generate curiosity-driven hooks, multi-channel carousels, and engaging captions trained on top-converting creator frameworks using Google Gemini 2.0.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-purple-800 font-mono font-medium">
                ⚡️ 94/100 Average Viral Hook Score
              </div>
            </div>

            {/* Card 2: Multi-Platform Calendar */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-5 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-2xs">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Unified Visual Calendar & Queue
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Drag and drop posts across days, weeks, or months. Queue content once and let BufferMate AI dispatch to each platform at its optimal audience window.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-indigo-800 font-mono font-medium">
                📅 Real-time multi-platform queue sync
              </div>
            </div>

            {/* Card 3: 24/7 Comment Keyword Lead Bots */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-5 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Autonomous Comment Auto-DM Bots
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Turn organic comments into qualified leads. When users comment trigger keywords like &quot;LINK&quot; or &quot;PRICE&quot;, our bots send personalized DMs instantly.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-amber-900 font-mono font-medium">
                ⚡️ Under 15-second response latency
              </div>
            </div>

            {/* Card 4: Unified Social Inbox */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-5 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shadow-2xs">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Unified Multi-Channel Inbox
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Consolidate customer inquiries, DMs, and comments from Instagram, TikTok, and Facebook into a single real-time inbox with auto-drafted AI replies.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-sky-800 font-mono font-medium">
                📥 Zero missed DMs or customer leads
              </div>
            </div>

            {/* Card 5: Audience Intelligence */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-5 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Predictive Audience Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Track impressions, engagement rates, DM pipeline revenue, and AI-calculated peak publishing heatmaps tailored specifically to your followers.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-emerald-800 font-mono font-medium">
                📊 Calculated across 2.4M data points
              </div>
            </div>

            {/* Card 6: Jira-Grade Task Workflows */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-5 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Jira-Grade Workflows & Sprints
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Structure your social campaigns with agile epics, sprints, subtasks, issue dependencies, and automated review gates before content goes live.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800 font-mono font-medium">
                🛡 Enterprise role approvals & audit trail
              </div>
            </div>
          </div>
        </section>

        {/* 5. How It Works (Simple 3-Step Sequence) */}
        <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Simple 3-Step Deployment</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              How Buffermate AI works.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Go from manual posting chaos to an automated social revenue engine in three intuitive steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 font-bold flex items-center justify-center text-sm shadow-2xs">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Connect your social accounts
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                One-click OAuth 2.0 authorization for Instagram, TikTok, Threads, Facebook, X, and WhatsApp with zero password sharing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold flex items-center justify-center text-sm shadow-2xs">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Craft & enhance with AI
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Use Google Gemini 2.0 to generate viral hooks, format captions for each network, and set up your comment keyword lead triggers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center justify-center text-sm shadow-2xs">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Publish & capture leads automatically
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Content is dispatched at peak engagement slots while autonomous DM bots convert commenters into paying customers 24/7.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Pricing Section */}
        <section id="pricing" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <PricingCards showTitle={true} />
        </section>

        {/* 7. FAQ Section */}
        <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Everything you need to know about Buffermate AI, supported platforms, and billing.
            </p>
          </div>

          <FaqAccordion />
        </section>

        {/* 8. Final Compelling Closing CTA Banner */}
        <section className="px-4 sm:px-6 lg:px-8">
          <CtaBanner />
        </section>
      </main>

      {/* 9. Global Marketing Footer */}
      <MarketingFooter />
    </div>
  );
}
