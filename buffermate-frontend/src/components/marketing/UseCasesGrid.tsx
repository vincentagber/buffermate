'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  Bot,
  Activity,
  MessageCircle,
  BarChart3,
  ArrowRight
} from 'lucide-react';

interface UseCase {
  icon: React.ReactNode;
  title: string;
  category: string;
  description: string;
  metric: string;
  badgeColor: string;
}

const USE_CASES: UseCase[] = [
  {
    icon: <Sparkles className="w-5 h-5 text-purple-600" />,
    title: 'AI Viral Script Studio',
    category: 'Content Generation',
    description: 'Transform rough ideas or URLs into platform-tailored hooks, threads, and short-form video scripts with predictive curiosity scoring.',
    metric: '97% average hook score',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    icon: <Send className="w-5 h-5 text-blue-600" />,
    title: 'Multi-Channel Auto-Scheduler',
    category: 'Autonomous Publishing',
    description: 'Compose once, adapt automatically. Queue media and captions formatted precisely for Instagram, TikTok, Threads, Facebook, X, and WhatsApp.',
    metric: '6 networks in 1 click',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    icon: <Bot className="w-5 h-5 text-emerald-600" />,
    title: '24/7 Comment Keyword Auto-DMs',
    category: 'Inbound Lead Funnel',
    description: 'Automatically trigger personalized direct messages whenever someone comments "LINK", "GUIDE", or "PRICE". Convert viral engagement into sales.',
    metric: '< 15s speed-to-lead',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    icon: <Activity className="w-5 h-5 text-amber-600" />,
    title: 'Peak Engagement Heatmaps',
    category: 'Audience Timing',
    description: 'Algorithmically discover when your specific followers are most active across every platform to maximize initial velocity and reach.',
    metric: '+42% higher reach',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-indigo-600" />,
    title: 'Unified Social Inbox & CRM',
    category: 'Customer Conversations',
    description: 'Respond to comments and inbound direct messages from every connected channel in one high-velocity, team-collaborative feed.',
    metric: 'Zero dropped leads',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-rose-600" />,
    title: 'Attribution & Revenue Analytics',
    category: 'Growth Reporting',
    description: 'Connect post engagement directly to website visits and Bachs checkout conversions with comprehensive white-label PDF reports.',
    metric: '100% verified ROI',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
];

export default function UseCasesGrid() {
  return (
    <section className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
          <span>Complete Platform Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Scale your social channels with autonomous precision.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Every capability you need to conceptualize, schedule, publish, and monetize social media without manual busywork.
        </p>
      </div>

      {/* 6-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {USE_CASES.map((uc, index) => (
          <div
            key={uc.title}
            className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  {uc.icon}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${uc.badgeColor}`}>
                  {uc.category}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-purple-900 transition-colors">
                  {uc.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {uc.description}
                </p>
              </div>
            </div>

            {/* Metric Footer */}
            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 font-mono">
                {uc.metric}
              </span>
              <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-900 transition-colors flex items-center space-x-1">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

