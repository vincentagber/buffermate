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
  iconBorder: string;
  iconColor: string;
  title: string;
  description: string;
}

const USE_CASES: UseCaseCard[] = [
  {
    icon: <Smartphone className="w-6 h-6" />,
    iconBg: 'bg-[#3B82F6]/10',
    iconBorder: 'border-[#3B82F6]/20',
    iconColor: 'text-[#3B82F6]',
    title: 'AI Viral Script Studio',
    description: 'Transform rough ideas or URLs into platform-tailored hooks, threads, and short-form video scripts with predictive curiosity scoring.',
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    iconBg: 'bg-[#F59E0B]/10',
    iconBorder: 'border-[#F59E0B]/20',
    iconColor: 'text-[#F59E0B]',
    title: 'Multi-Channel Auto-Scheduler',
    description: 'Compose once, adapt automatically. Queue media and captions formatted precisely for Instagram, TikTok, Threads, Facebook, X, and WhatsApp.',
  },
  {
    icon: <Edit3 className="w-6 h-6" />,
    iconBg: 'bg-[#6F9C3E]/10',
    iconBorder: 'border-[#6F9C3E]/20',
    iconColor: 'text-[#6F9C3E]',
    title: '24/7 Comment Keyword Auto-DMs',
    description: 'Automatically trigger personalized direct messages whenever someone comments "LINK", "GUIDE", or "PRICE". Convert viral engagement into sales.',
  },
  {
    icon: <Video className="w-6 h-6" />,
    iconBg: 'bg-[#8B5CF6]/10',
    iconBorder: 'border-[#8B5CF6]/20',
    iconColor: 'text-[#8B5CF6]',
    title: 'Peak Engagement Heatmaps',
    description: 'Algorithmically discover when your specific followers are most active across every platform to maximize initial algorithmic velocity.',
  },
  {
    icon: <ClipboardList className="w-6 h-6" />,
    iconBg: 'bg-[#EF4444]/10',
    iconBorder: 'border-[#EF4444]/20',
    iconColor: 'text-[#EF4444]',
    title: 'Unified Social Inbox & CRM',
    description: 'Respond to comments and inbound direct messages from every connected channel in one high-velocity, team-collaborative feed.',
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    iconBg: 'bg-[#EC4899]/10',
    iconBorder: 'border-[#EC4899]/20',
    iconColor: 'text-[#EC4899]',
    title: 'Attribution & Revenue Analytics',
    description: 'Connect post engagement directly to website visits and Bachs checkout conversions with comprehensive white-label PDF reports.',
  },
];

export default function PlatformUseCases() {
  return (
    <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-20 md:py-28 border-b border-[#E2E0D5]">
      {/* Section Heading */}
      <div className="max-w-[680px] mb-16">
        <h2 className="font-hero-sans font-normal text-[36px] md:text-[50px] text-[#1A202C] leading-[1.04] tracking-[-0.04em] mb-4">
          Scale your social presence with <br />
          <span className="font-editorial-italic text-[#52832B] font-normal tracking-tight pr-2 sm:pr-3">
            autonomous
          </span>
          <span className="font-hero-sans font-black tracking-[-0.04em] text-[#1A202C]">
            precision.
          </span>
        </h2>
        <p className="font-hero-sans font-normal text-[17px] text-[#6B6B60] leading-relaxed tracking-tight">
          Deploy autonomous AI agents and scheduling algorithms for operations requiring contextual nuance, viral curiosity hooks, and sub-15s speed-to-lead.
        </p>
      </div>

      {/* 6 White Cards in 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {USE_CASES.map((uc, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[24px] p-8 border border-[#E2E0D5] hover:border-[#C4C4B8] transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between"
          >
            <div className="flex items-start gap-5">
              <div
                className={`w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 border ${uc.iconBg} ${uc.iconBorder} ${uc.iconColor}`}
              >
                {uc.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[20px] text-[#1A202C] mb-2 leading-snug">
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
