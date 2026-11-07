'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Play, Sparkles } from 'lucide-react';

interface PresetCard {
  id: string;
  tag: string;
  title: string;
  category: string;
  bgType: 'lime' | 'dark' | 'ivory' | 'photo1' | 'photo2';
  photoUrl?: string;
  contentNode: React.ReactNode;
  hasButton?: boolean;
}

export default function KineticTypeShowcase() {
  const [activeTab, setActiveTab] = useState<'social' | 'kinetic'>('social');

  const presets: PresetCard[] = [
    {
      id: '001',
      tag: 'BM / 001',
      title: 'Big Mood',
      category: 'Typography',
      bgType: 'lime',
      contentNode: (
        <div className="text-center">
          <div className="font-hero-sans font-black text-3xl sm:text-4xl text-black tracking-tight leading-none uppercase">
            BIG<br />MOOD.
          </div>
        </div>
      ),
    },
    {
      id: '002',
      tag: 'BM / 002',
      title: 'Soft Focus',
      category: 'Scene',
      bgType: 'photo1',
      photoUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      contentNode: (
        <div className="text-center">
          <div className="font-editorial-italic text-3xl sm:text-4xl text-white font-normal tracking-tight leading-tight drop-shadow-md">
            Soft<br />focus.
          </div>
        </div>
      ),
    },
    {
      id: '003',
      tag: 'BM / 003',
      title: 'On Repeat',
      category: 'Loop',
      bgType: 'ivory',
      contentNode: (
        <div className="text-center space-y-1">
          <div className="font-hero-sans font-bold text-2xl sm:text-3xl text-zinc-950 tracking-tight leading-none lowercase">
            again.<br />again.<br />again.
          </div>
        </div>
      ),
    },
    {
      id: '004',
      tag: 'BM / 004',
      title: 'Split Personality',
      category: 'Typography',
      bgType: 'dark',
      contentNode: (
        <div className="text-center">
          <div className="font-hero-sans font-black text-2xl sm:text-3xl text-stroke-white tracking-widest leading-none uppercase">
            MAKE<br />BELIEVE.
          </div>
        </div>
      ),
    },
    {
      id: '005',
      tag: 'BM / 005',
      title: 'Full Circle',
      category: 'Loop',
      bgType: 'dark',
      contentNode: (
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="w-28 h-28 rounded-full border border-zinc-700 flex items-center justify-center p-2">
            <span className="font-editorial-italic text-xl sm:text-2xl text-white text-center leading-tight">
              what goes<br />around
            </span>
          </div>
        </div>
      ),
    },
    {
      id: '006',
      tag: 'BM / 006',
      title: 'Sunday Club',
      category: 'Scene',
      bgType: 'photo2',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      contentNode: (
        <div className="text-center">
          <div className="font-editorial-italic text-3xl sm:text-4xl text-white font-normal tracking-tight leading-tight drop-shadow-md">
            Sunday<br />club.
          </div>
        </div>
      ),
    },
    {
      id: '007',
      tag: 'BM / 007',
      title: 'Heavy Rotation',
      category: 'Typography',
      bgType: 'lime',
      hasButton: true,
      contentNode: (
        <div className="flex flex-col items-center justify-between h-full pt-4 pb-1">
          <div className="font-hero-sans font-black text-2xl sm:text-3xl text-black tracking-tight leading-none uppercase text-center mt-2">
            HEAVY<br />ROTATION
          </div>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white/95 hover:bg-white text-black text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Open in editor <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
    {
      id: '008',
      tag: 'BM / 008',
      title: 'The Next Wave',
      category: 'Loop',
      bgType: 'ivory',
      contentNode: (
        <div className="text-center">
          <div className="font-hero-sans font-black text-2xl sm:text-3xl text-zinc-950 tracking-tight leading-tight uppercase">
            WAVE<br />AFTER<br />WAVE
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative bg-[#0A0A0C] text-white pt-20 sm:pt-28 pb-24 overflow-hidden border-b border-zinc-800">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-[#c8ff25]/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 relative z-10">
        {/* =========================================================================
            1. EXACT HERO HEADLINE & SIZING (Reference Image 1)
        ========================================================================= */}
        <div className="text-center max-w-5xl mx-auto flex flex-col items-center">
          {/* Main Headline */}
          <h1 className="text-[52px] sm:text-[84px] md:text-[108px] lg:text-[124px] font-normal tracking-[-0.04em] text-white leading-[0.92] select-none text-center">
            <span className="font-hero-sans">Type that</span>{' '}
            {/* Organic Green Badge with K / BM */}
            <span className="inline-flex items-center justify-center align-middle mx-1.5 sm:mx-3 px-3 sm:px-4 py-1 sm:py-1.5 bg-[#2d3a14] border border-[#a3e635]/60 rounded-xl sm:rounded-2xl shadow-[0_0_35px_rgba(200,255,37,0.35)] relative overflow-hidden -translate-y-1 sm:-translate-y-2">
              {/* Background textured lines */}
              <span className="absolute inset-0 opacity-40 bg-[radial-gradient(#c8ff25_1px,transparent_1px)] [background-size:6px_6px]" />
              <span className="relative font-hero-sans font-black text-[#c8ff25] text-2xl sm:text-4xl md:text-5xl leading-none">
                K
              </span>
            </span>
            <br />
            {/* "really" in High-Contrast Italic Serif */}
            <span className="font-editorial-italic text-white pr-2 sm:pr-3 tracking-normal">
              really
            </span>{' '}
            {/* "moves." in Bold Grotesque Sans with stylized Moon "o" */}
            <span className="font-hero-sans font-black tracking-[-0.04em] text-white inline-flex items-baseline">
              m
              <span className="inline-flex items-center justify-center relative w-[0.72em] h-[0.72em] mx-[0.02em] align-baseline">
                {/* Outer circle */}
                <span className="w-[0.68em] h-[0.68em] rounded-full border-[0.14em] border-white inline-block relative overflow-hidden">
                  {/* Half moon fill */}
                  <span className="absolute left-0 top-0 bottom-0 w-1/2 bg-white" />
                </span>
              </span>
              ves.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-7 text-sm sm:text-base md:text-[17px] text-zinc-400 font-normal tracking-tight max-w-lg mx-auto">
            From a few good words to a very good loop.
          </p>

          {/* Call to Actions (Lime Green Pill + Sign in) */}
          <div className="mt-8 flex items-center justify-center gap-5 sm:gap-6">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#c8ff25] hover:bg-[#d9ff45] text-black font-semibold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(200,255,37,0.3)]"
            >
              Start making moves <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2 px-1"
            >
              Sign in
            </Link>
          </div>

          {/* Caption */}
          <p className="mt-7 text-[11px] sm:text-xs text-zinc-500 leading-relaxed max-w-md mx-auto">
            Pick a preset. Nudge a couple of settings. You&apos;re moving.<br />
            We&apos;ve already obsessed over the timing.
          </p>
        </div>

        {/* =========================================================================
            2. PRESET CARDS BENTO GALLERY (Reference Image 2)
        ========================================================================= */}
        <div className="mt-20 sm:mt-28">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/80">
            <div>
              <span className="text-xs font-hero-mono text-[#c8ff25] uppercase tracking-wider">
                Typography Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Kinetic Presets &amp; Editorial Styles
              </h2>
            </div>
            <span className="text-xs font-hero-mono text-zinc-500">
              8 Presets Ready
            </span>
          </div>

          {/* 4-Column Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {presets.map((preset) => (
              <div key={preset.id} className="group flex flex-col space-y-2">
                {/* Main Visual Card */}
                <div
                  className={`relative w-full aspect-square rounded-[24px] sm:rounded-[28px] p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl ${
                    preset.bgType === 'lime'
                      ? 'bg-[#c8ff25] text-black shadow-[0_10px_30px_rgba(200,255,37,0.18)]'
                      : preset.bgType === 'ivory'
                      ? 'bg-[#F4EFE8] text-zinc-950'
                      : preset.bgType === 'dark'
                      ? 'bg-[#141416] border border-zinc-800 text-white'
                      : 'relative bg-zinc-900 border border-zinc-800 text-white'
                  }`}
                >
                  {/* Photo Background if applicable */}
                  {preset.photoUrl && (
                    <>
                      <img
                        src={preset.photoUrl}
                        alt={preset.title}
                        className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                    </>
                  )}

                  {/* Top Identifier */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-hero-mono opacity-60">
                    <span>{preset.tag}</span>
                  </div>

                  {/* Centered Graphic / Content */}
                  <div className="relative z-10 my-auto flex items-center justify-center">
                    {preset.contentNode}
                  </div>

                  {/* Empty bottom spacer if no button */}
                  {!preset.hasButton && <div className="h-4" />}
                </div>

                {/* Bottom Metadata Bar */}
                <div className="flex items-center justify-between px-2 pt-1 text-xs">
                  <span className="font-medium text-white/90 group-hover:text-[#c8ff25] transition-colors">
                    {preset.title}
                  </span>
                  <span className="text-[11px] font-hero-mono text-zinc-500">
                    {preset.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
