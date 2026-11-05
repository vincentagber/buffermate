'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Calendar,
  MessageCircle,
  BarChart3,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  Send,
  Layers,
  Bot
} from 'lucide-react';
import {
  InstagramIcon,
  TikTokIcon,
  ThreadsIcon,
  FacebookIcon,
  XIcon
} from '@/components/SocialIcons';

export default function FeatureAlternatingSections() {
  return (
    <div className="w-full max-w-7xl mx-auto font-sans space-y-24 sm:space-y-32">
      {/* Feature 1: AI Content Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Viral Script Studio</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Stop starting with a blank page. Formulate hooks that halt the scroll.
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Trained on top-converting creator frameworks and powered by Google Gemini 2.0 Flash, Buffermate AI turns any rough brief into platform-tailored scripts, high-curiosity video openings, and formatted carousels in seconds.
          </p>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 pt-1">
            <li className="flex items-center space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span><strong>Curiosity & Contrarian Angles:</strong> Tested formulas that double hook rate</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span><strong>Brand Guidelines Enforcement:</strong> Memorizes target persona, keywords & avoided words</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span><strong>Automated Character Pacing:</strong> 280 for X, 500 for Threads, 2,200 for Instagram</span>
            </li>
          </ul>

          <div className="pt-2">
            <Link
              href="/features#ai-studio"
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-purple-700 hover:text-purple-900 group cursor-pointer"
            >
              <span>Explore AI Studio Capabilities</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature 1 Interface Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-800">Prompt: &quot;B2B Agency Growth Framework&quot;</span>
            <span className="text-purple-700 font-bold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Hook Score: 98/100
            </span>
          </div>
          <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200/80 space-y-2 text-xs">
            <p className="font-bold text-purple-950">Formulated 3-Second Hook:</p>
            <p className="text-slate-800 leading-relaxed italic">
              &ldquo;If your agency still charges retainers instead of performance-guaranteed pipeline in 2026, here is why your churn rate is 40%.&rdquo;
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between font-mono">
            <span>Model: Gemini 2.0 Flash · Latency: 420ms</span>
            <span className="text-emerald-600 font-bold">Passes Negative Filter</span>
          </div>
        </div>
      </div>

      {/* Feature 2: 24/7 Automated Comment Lead Bots (Reversed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Interface Card First on Desktop */}
        <div className="order-2 lg:order-1 lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-800">Live Auto-DM Funnel Simulation</span>
            <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Trigger: &quot;PRICE&quot;
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">
                  M
                </div>
                <span className="font-bold text-slate-800">@marcus_vance</span>
                <span className="text-[10px] text-slate-400">Instagram Reel Comment</span>
              </div>
              <p className="text-slate-700 italic pl-7">
                &ldquo;Where can I get the scorecard template and enterprise tier pricing? PRICE&rdquo;
              </p>
            </div>

            <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 space-y-1.5 text-xs">
              <div className="flex items-center space-x-2 text-purple-900 font-bold">
                <Bot className="w-4 h-4 text-purple-700" />
                <span>Buffermate Autonomous DM Agent (14s delay)</span>
              </div>
              <p className="text-slate-800 leading-relaxed pl-6">
                &ldquo;Hey Marcus! Here is the private scorecard template and enterprise sheet with 20% launch pricing: <strong>buffermate.ai/pro-access</strong>&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Text Details Second on Desktop */}
        <div className="order-1 lg:order-2 lg:col-span-6 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>24/7 Comment Keyword Funnels</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Turn social commenters into paying customers automatically.
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Mobile viewers rarely click the link in your bio. With Buffermate AI, asking viewers to drop a trigger keyword in the comments dispatches a personalized direct message to their inbox within seconds—capturing leads at peak curiosity.
          </p>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 pt-1">
            <li className="flex items-center space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span><strong>Natural Human Pacing:</strong> 15s to 45s smart delay to avoid spam detection</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span><strong>Spin-Syntax Variation:</strong> Dynamically rotates greeting lines and copy</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span><strong>Rate Limits & Guardrails:</strong> Protects your account with conservative daily caps</span>
            </li>
          </ul>

          <div className="pt-2">
            <Link
              href="/features#auto-dm"
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-purple-700 hover:text-purple-900 group cursor-pointer"
            >
              <span>See Auto-DM Lead Bot Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Feature 3: Predictive Analytics & Peak Heatmaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Audience Intelligence & Attribution</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Stop guessing post times. Publish when your audience is awake.
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Buffermate calculates historical engagement across 2.4 million audience interaction data points, pinpointing the optimal 15-minute publication window for each connected account.
          </p>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 pt-1">
            <li className="flex items-center space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span><strong>Predictive Heatmap Windows:</strong> Wednesday 10 AM, Friday 6:30 PM, Sunday 4:15 PM</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span><strong>Direct Revenue Attribution:</strong> Track dollar pipeline generated straight from social DMs</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span><strong>CSV & PDF Export:</strong> Clean white-label reports for client and stakeholder reviews</span>
            </li>
          </ul>

          <div className="pt-2">
            <Link
              href="/features#analytics"
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-purple-700 hover:text-purple-900 group cursor-pointer"
            >
              <span>Explore Analytics Capabilities</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature 3 Interface Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-500 font-medium">Total Impressions</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">208.2K</p>
              <p className="text-emerald-700 font-semibold mt-1">↑ 12.5% this month</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
              <p className="text-purple-800 font-medium">Pipeline from DMs</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">$48,200</p>
              <p className="text-purple-700 font-semibold mt-1">↑ $12k this month</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>🔥 Peak Heatmap Detection</span>
              <span className="text-purple-700">Wednesday @ 10:00 AM</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Posts scheduled in this slot receive <strong>+34% higher comment and save velocity</strong> compared to non-peak hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
