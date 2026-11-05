'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Zap,
  BarChart3,
  Check,
  Send,
  MessageCircle,
  Clock,
  Shield,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Bot,
  Lock,
  Search,
  CheckCircle2,
  Share2,
  Users
} from 'lucide-react';
import { InstagramIcon, TikTokIcon, ThreadsIcon, FacebookIcon, XIcon, WhatsAppIcon } from '@/components/SocialIcons';

export default function ProductMockup() {
  const [activeTab, setActiveTab] = useState<'scheduler' | 'ai' | 'funnel' | 'analytics'>('scheduler');

  return (
    <div className="relative mx-auto max-w-6xl w-full">
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-emerald-500/15 rounded-3xl blur-2xl -z-10 opacity-70" />

      {/* Main Browser / App Window Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] overflow-hidden font-sans">
        {/* Window Chrome Header Bar */}
        <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
          {/* Traffic Lights */}
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 inline-block border border-rose-500/20" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block border border-amber-500/20" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block border border-emerald-500/20" />
            <span className="text-[11px] font-mono text-slate-400 pl-2 hidden sm:inline">buffermate.ai/app</span>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex items-center space-x-1 bg-slate-200/60 p-1 rounded-full text-xs font-semibold overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('scheduler')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'scheduler'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Multi-Channel Queue</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'ai'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Script Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('funnel')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'funnel'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>24/7 Auto-DM Bots</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Audience Intelligence</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Autonomous Engine: Active</span>
          </div>
        </div>

        {/* Tab 1: Multi-Channel Scheduler View */}
        {activeTab === 'scheduler' && (
          <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/40 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Composer Card */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Cross-Platform Composer
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Publishing to 4 channels</span>
                  </div>
                </div>

                {/* Selected Channel Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center space-x-1.5 text-xs font-semibold">
                    <InstagramIcon className="w-3.5 h-3.5 text-purple-700" />
                    <span>Instagram Reel</span>
                    <Check className="w-3 h-3 text-purple-600 ml-1" />
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center space-x-1.5 text-xs font-semibold">
                    <TikTokIcon className="w-3.5 h-3.5 text-slate-900" />
                    <span>TikTok Video</span>
                    <Check className="w-3 h-3 text-slate-600 ml-1" />
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 flex items-center space-x-1.5 text-xs font-semibold">
                    <ThreadsIcon className="w-3.5 h-3.5 text-sky-700" />
                    <span>Threads Post</span>
                    <Check className="w-3 h-3 text-sky-600 ml-1" />
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-1.5 text-xs font-semibold">
                    <FacebookIcon className="w-3.5 h-3.5 text-blue-700" />
                    <span>Facebook Page</span>
                    <Check className="w-3 h-3 text-blue-600 ml-1" />
                  </div>
                </div>

                {/* Post Copy */}
                <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Generated via Google Gemini 2.0</span>
                    <span className="text-purple-600 font-bold">Viral Hook Score: 96/100</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    Stop spending 4 hours a day manually replying to social DMs. ⚡️
                    <br /><br />
                    Here is the 3-step automation blueprint we used to capture 1,420 qualified leads straight from Instagram & TikTok comments without running paid ads.
                    <br /><br />
                    Drop <strong>&quot;GROWTH&quot;</strong> in the comments below and our AI agent will send you the private Notion template directly to your DMs! 🚀
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-purple-700 font-medium">
                    <span>#BufferMate</span>
                    <span>#CreatorEconomy</span>
                    <span>#Automation</span>
                    <span>#LeadGeneration</span>
                  </div>
                </div>

                {/* Dispatch Settings */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Optimal Slot: <strong>Wednesday @ 10:00 AM WAT</strong> (+34% engagement)</span>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#161616] text-white rounded-full font-semibold flex items-center justify-center space-x-1.5 shadow-2xs hover:bg-black transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Schedule Cross-Platform</span>
                  </button>
                </div>
              </div>

              {/* Right Live Preview / Queue Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Upcoming Multi-Channel Queue
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      12 in Queue
                    </span>
                  </div>

                  {/* Queued Item 1 */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-1.5 text-purple-800 font-semibold">
                        <InstagramIcon className="w-3.5 h-3.5" />
                        <ThreadsIcon className="w-3.5 h-3.5" />
                        <span>Today · 6:30 PM</span>
                      </div>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                        Auto-Pilot Ready
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium line-clamp-2">
                      5 Creator Workflow Bottlenecks Killing Your B2B Pipeline (And how to fix them)
                    </p>
                  </div>

                  {/* Queued Item 2 */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-1.5 text-slate-800 font-semibold">
                        <TikTokIcon className="w-3.5 h-3.5" />
                        <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tomorrow · 10:00 AM</span>
                      </div>
                      <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md text-[10px]">
                        Peak Heatmap Slot
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium line-clamp-2">
                      Behind the scenes: Scaling from 0 to 12,000 monthly active users on Buffermate AI
                    </p>
                  </div>

                  {/* Queued Item 3 */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-1.5 text-slate-800 font-semibold">
                        <XIcon className="w-3.5 h-3.5" />
                        <ThreadsIcon className="w-3.5 h-3.5 text-sky-600" />
                        <span>Friday · 2:15 PM</span>
                      </div>
                      <span className="text-slate-600 font-bold bg-slate-200/80 px-2 py-0.5 rounded-md text-[10px]">
                        Scheduled
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium line-clamp-2">
                      The full breakdown of social commerce conversion benchmarks in Q3 2026.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AI Viral Script Studio View */}
        {activeTab === 'ai' && (
          <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/40 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Prompt & Tone Controls</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Content Objective</label>
                    <input
                      type="text"
                      readOnly
                      value="High-converting B2B SaaS lead magnet"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Brand Voice</label>
                    <div className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 text-indigo-900 font-medium">
                      Viral & Hook-Heavy (High Curiosity)
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Keywords To Include</label>
                    <p className="text-slate-500 text-[11px]">autonomous, viral growth, BufferMate, ROI, lead capture</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Generated Hook Options (Predictive Velocity)
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    Gemini 2.0 Flash Verified
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/80 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                      <span>Option A · Pattern Interrupt (Recommended)</span>
                      <span className="text-purple-700">98% Hook Rate</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      &ldquo;If you&apos;re still replying to Instagram DMs by hand in 2026, you&apos;re leaving 60% of your customer conversions on the table.&rdquo;
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>Option B · Contrast & Proof</span>
                      <span className="text-slate-600">92% Hook Rate</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      &ldquo;How we turned 400 casual reel comments into $48,200 in closed pipeline within 72 hours—without a sales team.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 24/7 Auto-DM Bots View */}
        {activeTab === 'funnel' && (
          <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/40 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Keyword Triggers & DM Dispatch</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-amber-950">Comment Keyword: &quot;PRICE&quot;</p>
                      <p className="text-[11px] text-amber-800">Dispatches enterprise tier pricing sheet + 20% discount</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-900 bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                      842 Sent
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Comment Keyword: &quot;GUIDE&quot;</p>
                      <p className="text-[11px] text-slate-500">Sends Notion creator workflow automation playbook</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      1,290 Sent
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Direct Message Dispatch Simulation
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Average Reply: 8s
                  </span>
                </div>
                <div className="bg-slate-100/70 rounded-2xl p-4 space-y-3">
                  <div className="bg-white rounded-2xl rounded-tl-xs p-3 text-xs text-slate-800 shadow-2xs max-w-[85%] border border-slate-200/80">
                    Hey Sophia! 👋 Saw you commented on our scorecard post. Here is your instant private access link to test the new Buffermate AI Pro tier:
                    <div className="mt-2 p-2 rounded-xl bg-purple-50 text-purple-900 font-semibold text-[11px] border border-purple-200 flex items-center justify-between">
                      <span>buffermate.ai/pro-access?ref=dm</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono pl-1">Delivered via Instagram Graph API · Anti-detection delay: 15s</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Audience Intelligence View */}
        {activeTab === 'analytics' && (
          <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/40 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Total Impressions</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">208.2K</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 12.5% vs last month</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Engagement Rate</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">66.7%</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 2.4 pts above avg</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Pipeline from DMs</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">$48,200</p>
                <p className="text-xs text-purple-700 font-semibold mt-1">↑ $12k this month</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <p className="text-xs text-slate-500 font-medium">Resolution Rate</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">98.4%</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1">Auto-closed leads</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Window Footer Status */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Connected Channels: <strong>Instagram, TikTok, Threads, Facebook, X, WhatsApp</strong></span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>OAuth 2.0 Official Graph APIs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

