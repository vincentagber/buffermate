'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Target,
  Shield,
  Heart,
  Globe,
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
  Building2
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';
import CtaBanner from '@/components/marketing/CtaBanner';
import { BufferMateLogo } from '@/app/dashboard/components/Sidebar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      <MarketingNavbar />

      <main className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
        {/* Header */}
        <section className="pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5" />
            <span>Our Mission & Vision</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-3xl mx-auto leading-tight">
            Building the autonomous operating system for modern creators.
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We believe creators and growing businesses shouldn&apos;t waste 20+ hours each week wrestling with fragmented social tools and manual direct messages.
          </p>
        </section>

        {/* Narrative Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-2xs space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why we built Buffermate AI
            </h2>
            <p>
              In 2026, social presence is no longer optional—it is the primary distribution channel for founders, agencies, coaches, and digital products. Yet, the tools used to manage this presence have remained stuck in 2016: static schedulers that post text blindly and leave the actual hard work—viral ideation and customer DM follow-ups—entirely manual.
            </p>
            <p>
              Buffermate AI was founded on a simple principle: <strong>What if your social publishing platform wasn&apos;t just a calendar, but an autonomous marketing team?</strong>
            </p>
            <p>
              We combined Google Gemini 2.0 AI models with official Meta, TikTok, and X Graph APIs. Today, creators use Buffermate to generate predictive viral hooks, dispatch content to six networks simultaneously, and automatically convert interested commenters into qualified paying leads 24 hours a day.
            </p>
          </div>
        </section>

        {/* Core Principles Bento Grid */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Core Principles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              The values guiding how we engineer our product and support our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Autonomous Velocity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Repetitive publishing tasks, hashtag formatting, and basic comment replies should be automated so creators can focus on strategy, vision, and deep craft.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Real Revenue, Not Vanity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Views and likes don&apos;t pay rent. Our features are intentionally designed to capture qualified buyer intent through instant DM lead funnels and measurable conversion tracking.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Account Safety First</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We never use illegal reverse-engineered private APIs or store passwords. Everything connects via verified partner OAuth 2.0 endpoints with built-in anti-detection rate limits.
              </p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-4 sm:px-6 lg:px-8">
          <CtaBanner />
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

