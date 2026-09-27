'use client';

import React from 'react';
import {
  Plus,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  Calendar,
  Zap,
  Globe,
  CheckCircle2,
  Video,
  PenTool,
  Send
} from 'lucide-react';
import Link from 'next/link';
import { SocialPlatformIcon } from '@/components/SocialIcons';

export default function StartPage() {
  const quickActions = [
    {
      title: 'Post Composer & AI Studio',
      description: 'Write, generate AI hooks, preview real-time multi-platform layouts, and schedule.',
      icon: PenTool,
      href: '/dashboard/composer',
      badge: 'Interactive Studio',
      color: 'bg-[#FFF0E6] text-[#E05A2B] border-[#FED7AA]',
    },
    {
      title: 'Visual Content Calendar',
      description: 'Review your upcoming 7-day schedule, filter by channel, and drag to reschedule.',
      icon: Calendar,
      href: '/dashboard/calendar',
      badge: 'Timeline View',
      color: 'bg-[#EFF6FF] text-[#1877F2] border-[#BFDBFE]',
    },
    {
      title: 'Channel Integrations',
      description: 'Connect live accounts across X/Twitter, Meta, TikTok, and LinkedIn via 1-click OAuth.',
      icon: Globe,
      href: '/dashboard',
      badge: 'Real-Time SSE',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Performance & Analytics',
      description: 'Track audience impressions, post reach, engagement rates, and peak posting times.',
      icon: TrendingUp,
      href: '/dashboard/analytics',
      badge: 'Live Metrics',
      color: 'bg-[#FAF5FF] text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-12 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-neutral-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-orange-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Buffermate AI Workspace 2.0</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back to your Social Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Automate 24/7 comment replies, trigger instant DM lead capture funnels, and broadcast content across all connected channels in real time.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/dashboard/composer"
              className="px-5 py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-2xl text-xs font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Post</span>
            </Link>

            <Link
              href="/dashboard"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-2xl text-xs font-bold backdrop-blur-xs transition-all flex items-center space-x-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-orange-300" />
              <span>Manage Channels</span>
            </Link>
          </div>
        </div>

        {/* Decorative Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E05A2B]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>
      </div>

      {/* Quick Launch Suite */}
      <div className="space-y-3.5">
        <h2 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
          Quick Launch Workflows
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="bg-white border-2 border-dashed border-[#CBD5E1] hover:border-[#FED7AA] rounded-3xl p-5 sm:p-6 transition-all duration-200 flex items-start justify-between space-x-4 shadow-xs hover:shadow-md group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 border ${action.color}`}
                  >
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E293B] group-hover:text-[#E05A2B] transition-colors leading-tight">
                      {action.title}
                    </h3>
                    <span className="text-[10px] font-bold text-[#94A3B8] font-mono">
                      {action.badge}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed pt-1">
                  {action.description}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E2D9CF] flex items-center justify-center text-[#64748B] group-hover:bg-[#E05A2B] group-hover:text-white group-hover:border-[#E05A2B] transition-all shrink-0 mt-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Connected Channel Ecosystem Quick Status */}
      <div className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1E293B]">Connected Channel Ecosystem</h3>
            <p className="text-xs text-[#64748B]">Real-time multi-platform publishing readiness.</p>
          </div>

          <Link
            href="/dashboard"
            className="text-xs font-bold text-[#E05A2B] hover:underline flex items-center space-x-1"
          >
            <span>View Integrations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { id: 'facebook', name: 'Facebook', status: 'Active' },
            { id: 'instagram', name: 'Instagram', status: 'Active' },
            { id: 'x', name: 'X / Twitter', status: 'Active' },
            { id: 'tiktok', name: 'TikTok', status: 'Active' },
            { id: 'linkedin', name: 'LinkedIn', status: 'Active' },
            { id: 'threads', name: 'Threads', status: 'Active' },
          ].map((item) => (
            <div
              key={item.id}
              className="p-3 bg-[#FCFAF7] border border-[#F0E8DF] rounded-2xl flex flex-col items-center text-center space-y-1.5"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-[#E2D9CF] flex items-center justify-center shadow-2xs">
                <SocialPlatformIcon channel={item.id} className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#1E293B]">{item.name}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                ● {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
