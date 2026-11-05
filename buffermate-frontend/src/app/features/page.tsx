'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Zap,
  BarChart3,
  MessageSquare,
  Layers,
  Check,
  ArrowRight,
  Clock,
  Send,
  ShieldCheck,
  Bot,
  Sliders,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';
import CtaBanner from '@/components/marketing/CtaBanner';
import { InstagramIcon, TikTokIcon, ThreadsIcon, FacebookIcon, XIcon, WhatsAppIcon } from '@/components/SocialIcons';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      <MarketingNavbar />

      <main className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
        {/* Features Header */}
        <section className="pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Capabilities & Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-3xl mx-auto leading-tight">
            Crafted for creators who treat content as an engine.
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every feature in Buffermate AI is engineered to eliminate repetitive publishing friction and turn audience attention into direct leads.
          </p>
        </section>

        {/* Feature 1: AI Content Generation */}
        <section id="ai-studio" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-200/90 shadow-2xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Google Gemini & GPT-4 Viral Script Studio
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Struggling with creative block? Buffermate AI generates multi-network content variations tailored to each platform&apos;s unique algorithm. From high-curiosity video hooks to LinkedIn thought leadership and punchy Threads.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Predictive Hook Scoring:</strong> Instant 0–100 viral velocity rating</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Brand Persona Enforcement:</strong> Configurable tone, keywords & negative filter</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Multi-Language Generation:</strong> English, French, Spanish, Pidgin, and more</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4 shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono text-purple-800 pb-2 border-b border-slate-200">
                <span>MODEL: GEMINI-2.0-FLASH</span>
                <span className="font-bold">STATUS: READY</span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Pattern Interrupt Hook</p>
                <p className="text-slate-900 font-medium leading-relaxed">
                  &ldquo;Most creators spend 80% of their time writing content that 2% of their followers will ever see. Here is how to flip that ratio.&rdquo;
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Automated Call-To-Action</p>
                <p className="text-slate-900 font-medium leading-relaxed">
                  &ldquo;Comment &apos;SYSTEM&apos; below and I&apos;ll DM you the exact 1-page template we used to schedule 30 days of posts in 45 minutes.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Multi-Channel Visual Calendar */}
        <section id="scheduler" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-200/90 shadow-2xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3.5 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-bold text-slate-800">
                <span>Multi-Platform Dispatch Schedule</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px]">Optimal Timing</span>
              </div>
              <div className="space-y-2.5">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <InstagramIcon className="w-4 h-4 text-pink-600" />
                    <ThreadsIcon className="w-4 h-4" />
                    <span className="font-semibold text-slate-800">Product Teaser Reel</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">Wed 10:00 AM</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <TikTokIcon className="w-4 h-4" />
                    <FacebookIcon className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-slate-800">Behind The Scenes Workflow</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">Fri 6:30 PM</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <XIcon className="w-4 h-4" />
                    <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">Weekly Creator Briefing</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">Sun 4:15 PM</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Visual Drag & Drop Content Calendar
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Take complete command of your publishing schedule. Reorder queued posts with intuitive drag and drop, preview live platform mockups before sending, and sync publication windows across multiple timezones.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>AI Peak Heatmaps:</strong> Color-coded slots showing highest follower activity</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Cross-Platform Adaptation:</strong> Custom media sizing and tags per network</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>70+ Global Timezones:</strong> Flawless local delivery for worldwide audiences</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature 3: 24/7 Comment Auto-DM Bots */}
        <section id="auto-dm" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-200/90 shadow-2xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                24/7 Comment Keyword Auto-DM Lead Bots
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Never lose a hot lead because you were asleep. When an interested prospect comments on your video asking for pricing, templates, or access, our autonomous bots dispatch your link directly to their inbox within seconds.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Smart Anti-Detection Pacing:</strong> 15s to 45s human delays to keep accounts safe</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Dynamic Message Variations:</strong> Spin syntax prevents duplicate message filters</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>DM Safety Rate Guardrails:</strong> Configurable daily thresholds (250–1,000/day)</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                <span>Live Lead Conversion Simulator</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                  Real-time Trigger
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                    S
                  </div>
                  <span className="font-bold text-slate-900">@sophia_creator</span>
                  <span className="text-[10px] text-slate-400">12m ago</span>
                </div>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  Commented on Reel: <em>&ldquo;Loved the breakdown! Where can I sign up for the enterprise tier? PRICE&rdquo;</em>
                </p>
                <div className="p-3 bg-purple-50 text-purple-900 rounded-lg border border-purple-200 text-[11px] font-medium">
                  🤖 Auto-dispatched DM in 14s: <em>&ldquo;Hey Sophia! Here is the direct link to our enterprise tier with 20% discount applied: buffermate.ai/pro-access&rdquo;</em>
                </div>
              </div>
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

