'use client';

import React from 'react';
import {
  Smartphone,
  Share2,
  Edit3,
  Video,
  ClipboardList,
  Megaphone
} from 'lucide-react';

interface UseCaseCard {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const USE_CASES: UseCaseCard[] = [
  {
    icon: <Smartphone className="w-5 h-5" />,
    iconBg: 'bg-blue-50 border-blue-100',
    iconColor: 'text-blue-600',
    title: 'AI Viral Script Studio',
    description: 'Transform rough ideas or URLs into platform-tailored hooks, threads, and short-form video scripts with predictive curiosity scoring.',
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    iconBg: 'bg-amber-50 border-amber-100',
    iconColor: 'text-amber-600',
    title: 'Multi-Channel Auto-Scheduler',
    description: 'Compose once, adapt automatically. Queue media and captions formatted precisely for Instagram, TikTok, Threads, Facebook, X, and WhatsApp.',
  },
  {
    icon: <Edit3 className="w-5 h-5" />,
    iconBg: 'bg-emerald-50 border-emerald-100',
    iconColor: 'text-emerald-600',
    title: '24/7 Comment Keyword Auto-DMs',
    description: 'Automatically trigger personalized direct messages whenever someone comments "LINK", "GUIDE", or "PRICE". Convert viral engagement into sales.',
  },
  {
    icon: <Video className="w-5 h-5" />,
    iconBg: 'bg-purple-50 border-purple-100',
    iconColor: 'text-purple-600',
    title: 'Peak Engagement Heatmaps',
    description: 'Algorithmically discover when your specific followers are most active across every platform to maximize initial algorithmic velocity.',
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    iconBg: 'bg-rose-50 border-rose-100',
    iconColor: 'text-rose-600',
    title: 'Unified Social Inbox & CRM',
    description: 'Respond to comments and inbound direct messages from every connected channel in one high-velocity, team-collaborative feed.',
  },
  {
    icon: <Megaphone className="w-5 h-5" />,
    iconBg: 'bg-pink-50 border-pink-100',
    iconColor: 'text-pink-600',
    title: 'Attribution & Revenue Analytics',
    description: 'Connect post engagement directly to website visits and Bachs checkout conversions with comprehensive white-label PDF reports.',
  },
];

export default function KobbleUseCases() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Heading styled identically to Kobble */}
      <div className="space-y-3">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141416] leading-tight">
          Scale your social presence with <br />
          <span className="text-[#52832B]">autonomous precision.</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Deploy autonomous AI agents and scheduling algorithms for operations requiring contextual nuance, viral curiosity hooks, and sub-15s speed-to-lead.
        </p>
      </div>

      {/* 6 White Cards in 3x2 Grid matching Kobble */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {USE_CASES.map((uc) => (
          <div
            key={uc.title}
            className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E4DC] shadow-xs hover:shadow-md transition-shadow duration-200 space-y-4"
          >
            {/* Square rounded icon box matching Kobble */}
            <div
              className={`w-11 h-11 rounded-xl border flex items-center justify-center ${uc.iconBg} ${uc.iconColor}`}
            >
              {uc.icon}
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#141416] tracking-tight">
                {uc.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {uc.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

