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
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MarqueeChannels() {
  const channels = [
    { name: 'Instagram Professional', icon: <InstagramIcon className="w-4 h-4 text-pink-600" />, badge: 'Graph API' },
    { name: 'TikTok Creator', icon: <TikTokIcon className="w-4 h-4 text-slate-900" />, badge: 'Official Video API' },
    { name: 'Meta Threads', icon: <ThreadsIcon className="w-4 h-4 text-slate-900" />, badge: 'Threads API' },
    { name: 'Facebook Pages', icon: <FacebookIcon className="w-4 h-4 text-blue-600" />, badge: 'Pages API' },
    { name: 'X / Twitter', icon: <XIcon className="w-4 h-4 text-slate-900" />, badge: 'API v2' },
    { name: 'WhatsApp Direct', icon: <WhatsAppIcon className="w-4 h-4 text-emerald-600" />, badge: 'Lead Gateway' },
    { name: 'Google Gemini 2.0', icon: <Sparkles className="w-4 h-4 text-purple-600" />, badge: 'AI Engine' },
    { name: 'Bachs Hosted Checkout', icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />, badge: 'Global Billing' },
  ];

  return (
    <div className="w-full overflow-hidden py-4 font-sans select-none">
      <div className="flex space-x-4 animate-marquee whitespace-nowrap">
        {/* Double the list for infinite continuous loop */}
        {[...channels, ...channels].map((ch, idx) => (
          <div
            key={`${ch.name}-${idx}`}
            className="inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all shrink-0"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              {ch.icon}
            </div>
            <span className="text-xs font-bold text-slate-800">{ch.name}</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
              {ch.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
