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
}

const ROW_1: MarqueePill[] = [
  { label: 'Instagram Graph API', dotColor: 'bg-orange-500', bgColor: 'bg-[#FF8A65]', textColor: 'text-white' },
  { label: 'TikTok Creator v2', dotColor: 'bg-emerald-500', bgColor: 'bg-[#81C784]', textColor: 'text-white' },
  { label: 'Meta Threads API', dotColor: 'bg-lime-600', bgColor: 'bg-[#52832B]', textColor: 'text-white' },
  { label: 'Facebook Pages', dotColor: 'bg-blue-600', bgColor: 'bg-[#42A5F5]', textColor: 'text-white' },
  { label: 'X / Twitter API v2', dotColor: 'bg-purple-600', bgColor: 'bg-[#7E57C2]', textColor: 'text-white' },
  { label: 'WhatsApp Business', dotColor: 'bg-emerald-600', bgColor: 'bg-[#2E7D32]', textColor: 'text-white' },
  { label: 'LinkedIn Marketing', dotColor: 'bg-sky-600', bgColor: 'bg-[#0288D1]', textColor: 'text-white' },
  { label: 'YouTube Shorts Sync', dotColor: 'bg-red-600', bgColor: 'bg-[#EF5350]', textColor: 'text-white' },
];

const ROW_2: MarqueePill[] = [
  { label: '24/7 Comment Keyword Auto-DMs', dotColor: 'bg-pink-500', bgColor: 'bg-[#EC407A]', textColor: 'text-white' },
  { label: 'AI Viral Script Studio (Gemini 2.0)', dotColor: 'bg-indigo-500', bgColor: 'bg-[#5C6BC0]', textColor: 'text-white' },
  { label: 'Predictive Peak Engagement Heatmaps', dotColor: 'bg-teal-500', bgColor: 'bg-[#26A69A]', textColor: 'text-white' },
  { label: 'Multi-Channel Aspect Resizing', dotColor: 'bg-blue-700', bgColor: 'bg-[#37474F]', textColor: 'text-white' },
  { label: 'Bachs Hosted Payment Checkout', dotColor: 'bg-cyan-500', bgColor: 'bg-[#0097A7]', textColor: 'text-white' },
  { label: 'Unified CRM & Social Inbox', dotColor: 'bg-purple-700', bgColor: 'bg-[#6A1B9A]', textColor: 'text-white' },
  { label: 'White-Label Client PDF Reports', dotColor: 'bg-rose-500', bgColor: 'bg-[#D81B60]', textColor: 'text-white' },
];

export default function KobbleMarquee() {
  return (
    <section className="py-12 bg-white/60 border-b border-[#E2E0D5] overflow-hidden">
      <div className="text-center mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B6B60]">
          6+ CHANNELS &amp; ADVANCED AUTOMATION ENGINES
        </p>
      </div>

      <div className="space-y-3">
        {/* Row 1: Scrolling Left */}
        <div className="flex w-max animate-marquee space-x-3">
          {[...ROW_1, ...ROW_1, ...ROW_1].map((item, idx) => (
            <div
              key={`row1-${idx}`}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${item.bgColor} ${item.textColor} text-xs font-bold shadow-xs whitespace-nowrap`}
            >
              <span className={`w-2 h-2 rounded-full ${item.dotColor} bg-white`} />
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${item.bgColor} ${item.textColor} text-xs font-bold shadow-xs whitespace-nowrap`}
            >
              <span className={`w-2 h-2 rounded-full ${item.dotColor} bg-white`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

