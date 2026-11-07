'use client';

import React from 'react';
import {
  InstagramIcon,
  TikTokIcon,
  ThreadsIcon,
  FacebookIcon,
  XIcon,
  WhatsAppIcon
} from '@/components/SocialIcons';

interface MarqueePill {
  label: string;
  dotColor: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
}

const ROW_1: MarqueePill[] = [
  { label: 'Instagram Graph API', dotColor: 'bg-[#C8FF3D]', bgColor: 'bg-[#141416]', textColor: 'text-[#E2E0D5]', borderColor: 'border-[#141416]' },
  { label: 'TikTok Creator v2', dotColor: 'bg-[#000000]', bgColor: 'bg-[#C8FF3D]', textColor: 'text-[#000000]', borderColor: 'border-[#141416]' },
  { label: 'Meta Threads API', dotColor: 'bg-[#C8FF3D]', bgColor: 'bg-[#141416]', textColor: 'text-[#E2E0D5]', borderColor: 'border-[#141416]' },
  { label: 'Facebook Pages', dotColor: 'bg-[#141416]', bgColor: 'bg-[#E2E0D5]', textColor: 'text-[#000000]', borderColor: 'border-[#141416]/30' },
  { label: 'X / Twitter API v2', dotColor: 'bg-[#C8FF3D]', bgColor: 'bg-[#141416]', textColor: 'text-[#E2E0D5]', borderColor: 'border-[#141416]' },
  { label: 'WhatsApp Business', dotColor: 'bg-[#000000]', bgColor: 'bg-[#C8FF3D]', textColor: 'text-[#000000]', borderColor: 'border-[#141416]' },
  { label: 'LinkedIn Marketing', dotColor: 'bg-[#C8FF3D]', bgColor: 'bg-[#141416]', textColor: 'text-[#E2E0D5]', borderColor: 'border-[#141416]' },
  { label: 'YouTube Shorts Sync', dotColor: 'bg-[#141416]', bgColor: 'bg-[#E2E0D5]', textColor: 'text-[#000000]', borderColor: 'border-[#141416]/30' },
];

const ROW_2: MarqueePill[] = [
  { label: '24/7 Comment Keyword Auto-DMs', dotColor: 'bg-[#000000]', bgColor: 'bg-[#C8FF3D]', textColor: 'text-[#000000]', borderColor: 'border-[#141416]' },
  { label: 'AI Viral Script Studio (Gemini 2.0)', dotColor: 'bg-[#C8FF3D]', bgColor: 'bg-[#141416]', textColor: 'text-[#E2E0D5]', borderColor: 'border-[#141416]' },
  { label: 'Predictive Peak Engagement Heatmaps', dotColor: 'bg-[#141416]', bgColor: 'bg-[#E2E0D5]', textColor: 'text-[#000000]', borderColor: 'border-[#141416]/30' },
  { label: 'Multi-Channel Aspect Resizing', dotColor: 'bg-[#C8FF3D]', bgColor: 'bg-[#141416]', textColor: 'text-[#E2E0D5]', borderColor: 'border-[#141416]' },
  { label: 'Bachs Hosted Payment Checkout', dotColor: 'bg-[#000000]', bgColor: 'bg-[#C8FF3D]', textColor: 'text-[#000000]', borderColor: 'border-[#141416]' },
  { label: 'Unified CRM & Social Inbox', dotColor: 'bg-[#C8FF3D]', bgColor: 'bg-[#141416]', textColor: 'text-[#E2E0D5]', borderColor: 'border-[#141416]' },
  { label: 'White-Label Client PDF Reports', dotColor: 'bg-[#141416]', bgColor: 'bg-[#E2E0D5]', textColor: 'text-[#000000]', borderColor: 'border-[#141416]/30' },
];

export default function MarketingMarquee() {
  return (
    <section className="py-12 bg-[#E2E0D5] border-b border-[#141416]/15 overflow-hidden">
      <div className="text-center mb-6">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#000000]/70 font-hero-sans">
          6+ CONNECTED CHANNELS &amp; AUTONOMOUS PUBLISHING ENGINES
        </p>
      </div>

      <div className="space-y-3">
        {/* Row 1: Scrolling Left */}
        <div className="flex w-max animate-marquee space-x-3">
          {[...ROW_1, ...ROW_1, ...ROW_1].map((item, idx) => (
            <div
              key={`row1-${idx}`}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${item.bgColor} ${item.textColor} border ${item.borderColor || 'border-transparent'} text-xs font-bold shadow-xs whitespace-nowrap`}
            >
              <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Row 2: Scrolling Right */}
        <div
          className="flex w-max space-x-3"
          style={{
            animation: 'marquee 35s linear infinite reverse',
          }}
        >
          {[...ROW_2, ...ROW_2, ...ROW_2].map((item, idx) => (
            <div
              key={`row2-${idx}`}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${item.bgColor} ${item.textColor} border ${item.borderColor || 'border-transparent'} text-xs font-bold shadow-xs whitespace-nowrap`}
            >
              <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

