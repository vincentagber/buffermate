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
  title: string;
  description: string;
  badge?: string;
}

const USE_CASES: UseCaseCard[] = [
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: 'AI Viral Script Studio',
    description: 'Transform rough ideas or URLs into platform-tailored hooks, threads, and short-form video scripts with predictive curiosity scoring.',
    badge: 'AI Engine',
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: 'Multi-Channel Auto-Scheduler',
    description: 'Compose once, adapt automatically. Queue media and captions formatted precisely for Instagram, TikTok, Threads, Facebook, X, and WhatsApp.',
    badge: 'Publishing',
  },
  {
    icon: <Edit3 className="w-6 h-6" />,
    title: '24/7 Comment Keyword Auto-DMs',
    description: 'Automatically trigger personalized direct messages whenever someone comments "LINK", "GUIDE", or "PRICE". Convert viral engagement into sales.',
    badge: 'Conversion',
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: 'Peak Engagement Heatmaps',
    description: 'Algorithmically discover when your specific followers are most active across every platform to maximize initial algorithmic velocity.',
    badge: 'Intelligence',
  },
  {
    icon: <ClipboardList className="w-6 h-6" />,
    title: 'Unified Social Inbox & CRM',
    description: 'Respond to comments and inbound direct messages from every connected channel in one high-velocity, team-collaborative feed.',
    badge: 'Operations',
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    title: 'Attribution & Revenue Analytics',
    description: 'Connect post engagement directly to website visits and Bachs checkout conversions with comprehensive white-label PDF reports.',
    badge: 'Analytics',
  },
];

export default function PlatformUseCases() {
  return (
    <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-20 md:py-28 border-b border-[#141416]/15">
      {/* Section Heading */}
      <div className="max-w-[680px] mb-16">
        <h2 className="font-hero-sans font-normal text-[36px] md:text-[50px] text-[#000000] leading-[1.04] tracking-[-0.04em] mb-4">
          Scale your social presence with <br />
          <span className="font-editorial-italic text-[#141416] font-normal tracking-tight pr-2 sm:pr-3">
            autonomous
          </span>
          <span className="font-hero-sans font-black tracking-[-0.04em] text-[#000000]">
            precision.
          </span>
        </h2>
        <p className="font-hero-sans font-normal text-[17px] text-[#141416]/75 leading-relaxed tracking-tight">
          Deploy autonomous AI agents and scheduling algorithms for operations requiring contextual nuance, viral curiosity hooks, and sub-15s speed-to-lead.
        </p>
      </div>

      {/* 6 Sleek Swiss Cards in 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {USE_CASES.map((uc, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[24px] p-8 border border-[#E2E0D5] hover:border-[#C4C4B8] hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-[14px] bg-[#00784D]/10 border border-[#07B979]/30 flex items-center justify-center shrink-0 text-[#00784D] transition-transform group-hover:scale-105">
                  {uc.icon}
                </div>
                {uc.badge && (
                  <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full bg-[#00784D]/10 text-[#00784D] border border-[#07B979]/30">
                    {uc.badge}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-[20px] text-[#1A202C] mb-2 leading-snug group-hover:text-[#00784D] transition-colors">
                  {uc.title}
                </h3>
                <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed">
                  {uc.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
