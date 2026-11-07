'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Zap, Layers, RefreshCw } from 'lucide-react';

interface SwissFeatureCard {
  id: string;
  tag: string;
  title: string;
  category: 'AI Engine' | 'Publishing' | 'Automation' | 'Conversion';
  bgType: 'lime' | 'cream' | 'graphite' | 'charcoal' | 'photo1' | 'photo2';
  photoUrl?: string;
  primaryTypography: 'grotesk' | 'editorial' | 'outline' | 'stacked';
  content: React.ReactNode;
  hasButton?: boolean;
}

export default function BufferMateSwissShowcase() {
  const [filter, setFilter] = useState<'all' | 'AI Engine' | 'Publishing' | 'Automation' | 'Conversion'>('all');

  const cards: SwissFeatureCard[] = [
    {
      id: '001',
      tag: 'BM / 001',
      title: 'AI Viral Script Studio',
      category: 'AI Engine',
      bgType: 'lime',
      primaryTypography: 'grotesk',
      content: (
        <div className="text-center select-none">
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#0A0A0A] tracking-[-0.045em] leading-none uppercase">
            BIG<br />MOOD.
          </div>
          <p className="mt-2 text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#0A0A0A]/70">
            Viral Hooks Engine
          </p>
        </div>
      ),
    },
    {
      id: '002',
      tag: 'BM / 002',
      title: 'Deep Editorial Content',
      category: 'AI Engine',
      bgType: 'photo1',
      photoUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80',
      primaryTypography: 'editorial',
      content: (
        <div className="text-center select-none">
          <div className="font-editorial italic text-3xl sm:text-4xl text-white font-normal tracking-tight leading-tight drop-shadow-md">
            Soft<br />focus.
          </div>
          <p className="mt-2 text-[10px] font-mono text-white/75 uppercase tracking-widest">
            Long-Form Threads &amp; Scripts
          </p>
        </div>
      ),
    },
    {
      id: '003',
      tag: 'BM / 003',
      title: 'Autonomous Scheduling Loop',
      category: 'Publishing',
      bgType: 'cream',
      primaryTypography: 'grotesk',
      content: (
        <div className="text-center space-y-0.5 select-none">
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0A0A0A] tracking-[-0.04em] leading-tight lowercase">
            publish.<br />publish.<br />publish.
          </div>
          <p className="pt-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#353733]/80">
            Autonomous Queue
          </p>
        </div>
      ),
    },
    {
      id: '004',
      tag: 'BM / 004',
      title: 'Omnichannel Precision',
      category: 'Publishing',
      bgType: 'graphite',
      primaryTypography: 'outline',
      content: (
        <div className="text-center select-none">
          <div className="font-outline text-2xl sm:text-3xl tracking-widest leading-none text-white font-light uppercase">
            MAKE<br />BELIEVE.
          </div>
          <p className="mt-3 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            6 Connected Networks
          </p>
        </div>
      ),
    },
    {
      id: '005',
      tag: 'BM / 005',
      title: '24/7 Comment Lead Auto-DMs',
      category: 'Conversion',
      bgType: 'charcoal',
      primaryTypography: 'editorial',
      content: (
        <div className="relative flex flex-col items-center justify-center w-full h-full select-none">
          <div className="w-28 h-28 rounded-full border border-zinc-600/80 flex flex-col items-center justify-center p-2">
            <span className="font-editorial italic text-lg sm:text-xl text-white text-center leading-tight">
              what goes<br />around
            </span>
          </div>
          <p className="mt-2 text-[10px] font-mono text-[#C8FF3D] uppercase tracking-wider">
            Sub-15s Speed to Lead
          </p>
        </div>
      ),
    },
    {
      id: '006',
      tag: 'BM / 006',
      title: 'Creative Media Vault',
      category: 'AI Engine',
      bgType: 'photo2',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&auto=format&fit=crop&q=80',
      primaryTypography: 'editorial',
      content: (
        <div className="text-center select-none">
          <div className="font-editorial italic text-3xl sm:text-4xl text-white font-normal tracking-tight leading-tight drop-shadow-md">
            Sunday<br />club.
          </div>
          <p className="mt-2 text-[10px] font-mono text-white/80 uppercase tracking-widest">
            Brand Assets &amp; Presets
          </p>
        </div>
      ),
    },
    {
      id: '007',
      tag: 'BM / 007',
      title: 'Active Multi-Channel Dispatch',
      category: 'Publishing',
      bgType: 'lime',
      hasButton: true,
      primaryTypography: 'grotesk',
      content: (
        <div className="flex flex-col items-center justify-between h-full pt-2 pb-1 select-none">
          <div className="font-heading font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-[-0.04em] leading-none uppercase text-center mt-2">
            HEAVY<br />ROTATION
          </div>
          <Link
            href="/dashboard/calendar"
            className="mt-5 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white text-[#0A0A0A] text-xs font-heading font-bold shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Open in studio <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      ),
    },
    {
      id: '008',
      tag: 'BM / 008',
      title: 'Revenue & Attribution Growth',
      category: 'Conversion',
      bgType: 'cream',
      primaryTypography: 'stacked',
      content: (
        <div className="text-center select-none">
          <div className="font-heading font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-[-0.045em] leading-none uppercase">
            WAVE<br />AFTER<br />WAVE
          </div>
          <p className="mt-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#353733]">
            Verified ROI Tracking
          </p>
        </div>
      ),
    },
  ];

  const filteredCards = filter === 'all' ? cards : cards.filter((c) => c.category === filter);

  return (
    <section className="relative bg-[#0A0A0A] text-[#F5F1EA] py-24 sm:py-32 overflow-hidden border-b border-[#1B1B1B]">
      {/* Ambient Radial Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[550px] bg-[#C8FF3D]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">
        {/* =========================================================================
            HEADER: NEO-SWISS EDITORIAL TYPOGRAPHY & BRAND VALUE
        ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#1B1B1B]">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B1B1B] border border-zinc-800 text-[11px] font-mono font-semibold text-[#C8FF3D] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-[#C8FF3D]" />
              <span>Neo-Swiss Editorial Architecture</span>
            </div>

            <h2 className="text-[38px] sm:text-[54px] lg:text-[62px] font-heading font-extrabold tracking-[-0.045em] text-[#F5F1EA] leading-[0.98]">
              Engineered to publish <br />
              <span className="font-editorial italic font-normal text-[#C8FF3D] tracking-tight pr-2">
                content that
              </span>
              <span className="font-heading font-black tracking-[-0.04em] text-white">
                converts.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 font-heading font-normal leading-relaxed tracking-tight pt-1 max-w-xl">
              An autonomous social operating system pairing high-velocity publishing with sub-15s conversion workflows across 6 connected networks.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'AI Engine', 'Publishing', 'Conversion'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`text-xs font-heading font-semibold px-4 py-2 rounded-full transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-[#C8FF3D] text-[#0A0A0A] shadow-[0_0_20px_rgba(200,255,61,0.25)]'
                    : 'bg-[#1B1B1B] text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat === 'all' ? 'All Systems' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            8-CARD SWISS BENTO GRID (Sampled from User Reference Screenshot)
        ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10">
          {filteredCards.map((card) => (
            <div key={card.id} className="group flex flex-col space-y-2">
              {/* Card Container */}
              <div
                className={`relative w-full aspect-square rounded-[26px] p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl ${
                  card.bgType === 'lime'
                    ? 'bg-[#C8FF3D] text-[#0A0A0A] shadow-[0_10px_35px_rgba(200,255,61,0.18)]'
                    : card.bgType === 'cream'
                    ? 'bg-[#F5F1EA] text-[#0A0A0A]'
                    : card.bgType === 'graphite'
                    ? 'bg-[#1B1B1B] border border-zinc-800 text-white'
                    : card.bgType === 'charcoal'
                    ? 'bg-[#353733] border border-zinc-700/60 text-white'
                    : 'relative bg-[#1B1B1B] border border-zinc-800 text-white'
                }`}
              >
                {/* Photo Background (Soft Focus / Sunday Club) */}
                {card.photoUrl && (
                  <>
                    <img
                      src={card.photoUrl}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/45" />
                  </>
                )}

                {/* Top Corner Identifier Tag */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono opacity-65">
                  <span className="font-bold">{card.tag}</span>
                  <span className="text-[10px] uppercase tracking-wider">{card.category}</span>
                </div>

                {/* Center Content / Typographic Specimen */}
                <div className="relative z-10 my-auto flex items-center justify-center">
                  {card.content}
                </div>

                {/* Bottom Spacer if no CTA button */}
                {!card.hasButton && <div className="h-3" />}
              </div>

              {/* Bottom Metadata Label Bar */}
              <div className="flex items-center justify-between px-2 pt-1 text-xs">
                <span className="font-heading font-bold text-[#F5F1EA] group-hover:text-[#C8FF3D] transition-colors tracking-tight">
                  {card.title}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {card.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================================================
            BOTTOM CALL-TO-ACTION BAND (Electric Lime & Near Black)
        ========================================================================= */}
        <div className="mt-14 sm:mt-18 p-8 sm:p-12 rounded-[32px] bg-gradient-to-r from-[#1B1B1B] via-[#141416] to-[#1B1B1B] border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-white">
              Ready to automate your publishing schedule?
            </h3>
            <p className="text-xs sm:text-sm font-heading text-zinc-400">
              Join 2,420+ creators and brands publishing seamlessly with BufferMate AI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C8FF3D] hover:bg-[#d4ff59] text-[#0A0A0A] font-heading font-extrabold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(200,255,61,0.25)]"
            >
              Start Free Workspace <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <Link
              href="/pricing"
              className="px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-heading font-semibold text-xs sm:text-sm border border-white/10 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
