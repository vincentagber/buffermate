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
  ChevronRight,
  Target,
  CheckCircle2
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';
import ProductMockup from '@/components/marketing/ProductMockup';
import InteractiveAiStudioDemo from '@/components/marketing/InteractiveAiStudioDemo';
import MarqueeChannels from '@/components/marketing/MarqueeChannels';
import InteractiveWorkflowDemo from '@/components/marketing/InteractiveWorkflowDemo';
import FeatureAlternatingSections from '@/components/marketing/FeatureAlternatingSections';
import InteractiveCalendarPreview from '@/components/marketing/InteractiveCalendarPreview';
import TestimonialsSection from '@/components/marketing/TestimonialsSection';
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
      {/* =========================================================================
          SECTION 1: NAVIGATION
      ========================================================================= */}
      <MarketingNavbar />

      <main className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
        {/* =========================================================================
            SECTION 2: INTERACTIVE HERO SECTION (Inspired by Bachs.io Clean Typography)
        ========================================================================= */}
        <section className="relative pt-12 sm:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          {/* Subtle Radial Atmosphere Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-purple-200/25 via-indigo-100/35 to-emerald-100/25 blur-3xl rounded-full -z-10 pointer-events-none" />

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

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08] max-w-4xl mx-auto">
            Your Social Media. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-slate-950 via-purple-900 to-indigo-900 bg-clip-text text-transparent">
              Smarter. Automated.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
            Create engaging content, manage multiple social accounts, and automate your publishing workflow with AI. Everything you need to grow your online presence, in one place.
          </p>

          {/* Hero CTAs */}
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

          {/* Social Platform & Security Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mt-7 text-xs text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free forever tier</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>AES-256 OAuth standard</span>
            </div>
          </div>

          {/* High-Fidelity Interactive Hero Product Preview */}
          <div className="mt-12 sm:mt-16">
            <ProductMockup />
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: AI CONTENT GENERATION DEMONSTRATION (ColorInvoice Pattern)
        ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live AI Transformation Demonstration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              One prompt. Every platform tailored.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Type or select a sample idea below to see how Buffermate AI customizes hooks, character limits, and comment lead triggers for each network.
            </p>
          </div>

          <InteractiveAiStudioDemo />
        </section>

        {/* =========================================================================
            SECTION 4: SUPPORTED PLATFORMS (Horizontal Integration Strip)
        ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Official developer API integrations with the world&apos;s leading networks
            </p>
          </div>
          <MarqueeChannels />
        </section>

        {/* =========================================================================
            SECTION 5: PUBLISHING WORKFLOW (Kobble Step-by-Step Demonstration)
        ========================================================================= */}
        <section id="workflow" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
              <span>Interactive 5-Stage Publishing Pipeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Watch your content move through the engine.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              From initial idea to AI viral enhancement, multi-channel scheduling, and automated lead capture.
            </p>
          </div>

          <InteractiveWorkflowDemo />
        </section>

        {/* =========================================================================
            SECTION 6: FEATURE STORYTELLING (Alternating Layouts)
        ========================================================================= */}
        <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FeatureAlternatingSections />
        </section>

        {/* =========================================================================
            SECTION 7: INTERACTIVE CONTENT CALENDAR (HTMLHost & Buffer Pattern)
        ========================================================================= */}
        <section id="calendar" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Visual Calendar & Queue</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Take command of your monthly social presence.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Plan in advance, review peak audience windows, and keep all connected social profiles active with zero stress.
            </p>
          </div>

          <InteractiveCalendarPreview />
        </section>

        {/* =========================================================================
            SECTION 8: HOW BUFFERMATE WORKS (Clean 3-Step Presentation)
        ========================================================================= */}
        <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Simple 3-Step Onboarding</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              How Buffermate AI works.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Deploy your automated social publishing system in under two minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 font-bold flex items-center justify-center text-sm shadow-2xs">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Connect your accounts
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                One-click OAuth 2.0 authorization for Instagram, TikTok, Threads, Facebook, and X with zero password sharing.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold flex items-center justify-center text-sm shadow-2xs">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Create & enhance with AI
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Use Google Gemini 2.0 to formulate curiosity hooks, tailor post copy per platform, and set up your comment keyword triggers.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center justify-center text-sm shadow-2xs">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Schedule & convert leads automatically
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Posts publish at peak audience engagement windows while autonomous DM bots convert interested commenters 24/7.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9 & 10: BENEFITS & SOCIAL PROOF (Testimonials & Verified Metrics)
        ========================================================================= */}
        <section id="proof" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <TestimonialsSection />
        </section>

        {/* =========================================================================
            SECTION 11: PRICING (Predictable Plans & Bachs Payments)
        ========================================================================= */}
        <section id="pricing" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <PricingCards showTitle={true} />
        </section>

        {/* =========================================================================
            SECTION 12: FAQ (Interactive Knowledge Center)
        ========================================================================= */}
        <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Everything you need to know about Buffermate AI, supported networks, account security, and billing.
            </p>
          </div>

          <FaqAccordion />
        </section>

        {/* =========================================================================
            SECTION 13: FINAL CTA BANNER & GLOBAL FOOTER
        ========================================================================= */}
        <section className="px-4 sm:px-6 lg:px-8">
          <CtaBanner />
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
