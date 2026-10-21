'use client';

import React from 'react';
import {
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar,
  Globe,
  PenTool,
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
      color: 'bg-purple-50 text-purple-700 border-purple-200/60',
    },
    {
      title: 'Visual Content Calendar',
      description: 'Review your upcoming 7-day schedule, filter by channel, and drag to reschedule.',
      icon: Calendar,
      href: '/dashboard/calendar',
      badge: 'Timeline View',
      color: 'bg-blue-50 text-blue-700 border-blue-200/60',
    },
    {
      title: 'Channel Integrations',
      description: 'Connect live accounts across X/Twitter, Meta, TikTok, and LinkedIn via 1-click OAuth.',
      icon: Globe,
      href: '/dashboard/accounts',
      badge: 'Real-Time SSE',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    {
      title: 'Performance & Analytics',
      description: 'Track audience impressions, post reach, engagement rates, and peak posting times.',
      icon: TrendingUp,
      href: '/dashboard/analytics',
      badge: 'Live Metrics',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-12 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-[#141416] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-purple-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
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
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Post</span>
            </Link>

            <Link
              href="/dashboard/accounts"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-full text-xs font-semibold backdrop-blur-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-purple-300" />
              <span>Manage Channels</span>
            </Link>
          </div>
        </div>

        {/* Decorative Ambient Luxury Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>
      </div>

      {/* Quick Launch Suite */}
      <div className="space-y-3.5">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Quick Launch Workflows
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-5 sm:p-6 transition-all duration-200 flex items-start justify-between space-x-4 shadow-2xs hover:shadow-xs group cursor-pointer"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 border ${action.color}`}
                  >
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-tight">
                      {action.title}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 font-mono">
                      {action.badge}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  {action.description}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 group-hover:bg-[#141416] group-hover:text-white group-hover:border-[#141416] transition-all shrink-0 mt-1 shadow-2xs">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Connected Channel Ecosystem Quick Status */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Connected Channel Ecosystem</h3>
            <p className="text-xs text-slate-500">Real-time multi-platform publishing readiness.</p>
          </div>

          <Link
            href="/dashboard/accounts"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline flex items-center space-x-1"
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
              className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl flex flex-col items-center text-center space-y-1.5"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs text-slate-800">
                <SocialPlatformIcon channel={item.id} className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-800">{item.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[9px] font-semibold">
                ● {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
