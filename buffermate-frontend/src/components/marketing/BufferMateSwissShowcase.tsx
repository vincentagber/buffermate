'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface SwissCard {
  id: string;
  tag: string;
  title: string;
  category: string;
  bgClass: string;
  photoUrl?: string;
  contentNode: React.ReactNode;
  hasButton?: boolean;
}

export default function BufferMateSwissShowcase() {
  const cards: SwissCard[] = [
    {
      id: '001',
      tag: 'BM / 001',
      title: 'Viral Hook Engine',
      category: 'AI Studio',
      bgClass: 'bg-[#C8FF3D] text-[#0A0A0A]',
      contentNode: (
        <div className="text-center">
          <div className="font-grotesk-black text-3xl sm:text-4xl text-[#0A0A0A] tracking-tighter leading-none uppercase">
            VIRAL<br />HOOKS.
          </div>
        </div>
      ),
    },
    {
      id: '002',
      tag: 'BM / 002',
      title: 'Algorithmic Pacing',
      category: 'Audience Velocity',
      bgClass: 'relative bg-[#1B1B1B] text-white',
      photoUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      contentNode: (
        <div className="text-center">
          <div className="font-editorial-italic text-3xl sm:text-4xl text-white font-normal tracking-tight leading-tight drop-shadow-md">
            Organic<br />reach.
          </div>
        </div>
      ),
    },
    {
      id: '003',
      tag: 'BM / 003',
      title: 'Autonomous Flow',
      category: 'Omnichannel',
      bgClass: 'bg-[#F5F1EA] text-[#0A0A0A]',
      contentNode: (
        <div className="text-center space-y-1">
          <div className="font-grotesk font-extrabold text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight leading-none lowercase">
            schedule.<br />publish.<br />convert.
          </div>
        </div>
      ),
    },
    {
      id: '004',
      tag: 'BM / 004',
      title: 'Cross-Platform Mesh',
      category: 'Architecture',
      bgClass: 'bg-[#1B1B1B] text-white',
      contentNode: (
        <div className="text-center">
          <div className="font-outline-white text-2xl sm:text-3xl tracking-widest leading-none">
            AUTONOMOUS<br />PIPELINE.
          </div>
        </div>
      ),
    },
    {
      id: '005',
      tag: 'BM / 005',
      title: 'Comment-to-Sale AI',
      category: 'Speed-to-Lead',
      bgClass: 'bg-[#353733] text-white',
      contentNode: (
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="w-32 h-32 rounded-full border border-white/20 flex items-center justify-center p-3">
            <span className="font-editorial-italic text-xl sm:text-2xl text-white text-center leading-tight">
              24/7 lead<br />capture
            </span>
          </div>
        </div>
      ),
    },
    {
      id: '006',
      tag: 'BM / 006',
      title: 'Creator Operations',
      category: 'Studio',
      bgClass: 'relative bg-[#1B1B1B] text-white',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
      contentNode: (
        <div className="text-center">
          <div className="font-editorial-italic text-3xl sm:text-4xl text-white font-normal tracking-tight leading-tight drop-shadow-md">
            Creator<br />Studio.
          </div>
        </div>
      ),
    },
    {
      id: '007',
      tag: 'BM / 007',
      title: 'Direct Monetization',
      category: 'Revenue Engine',
      bgClass: 'bg-[#C8FF3D] text-[#0A0A0A]',
      hasButton: true,
      contentNode: (
        <div className="flex flex-col items-center justify-between h-full pt-4 pb-1">
          <div className="font-grotesk-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tighter leading-none uppercase text-center mt-2">
            HIGH<br />CONVERSION
          </div>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-[#0A0A0A] text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            Start Free Workspace <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      ),
    },
    {
      id: '008',
      tag: 'BM / 008',
      title: 'Exponential Audience',
      category: 'Compounding ROI',
      bgClass: 'bg-[#F5F1EA] text-[#0A0A0A]',
      contentNode: (
        <div className="text-center">
          <div className="font-grotesk-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tighter leading-none uppercase">
            SCALE<br />AFTER<br />SCALE
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-[#0A0A0A] text-white py-24 sm:py-32 border-b border-[#353733]/60 relative overflow-hidden">
      {/* Subtle Lime Ambient Light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C8FF3D]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-5 md:px-10 relative z-10">
        {/* Section Header: Swiss Minimalist Editorial Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#353733]/70 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-hero-mono text-[#C8FF3D] uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C8FF3D] animate-pulse" />
              <span>Neo-Swiss Editorial Minimalism · BufferMate AI</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-grotesk text-white tracking-[-0.04em] leading-[0.98]">
              Engineered to publish <br />
              content that{' '}
              <span className="font-editorial-italic text-[#C8FF3D] font-normal tracking-tight">
                really
              </span>{' '}
              <span className="font-grotesk-black text-white">scales.</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-xs leading-relaxed">
            Three distinctive typographic voices tailored to every social moment — from high-curiosity viral hooks to elegant editorial storytelling.
          </p>
        </div>

        {/* 8-Card Responsive Swiss Bento Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <div key={card.id} className="group flex flex-col space-y-2.5">
              {/* Card Body */}
              <div
                className={`relative w-full aspect-square rounded-[26px] p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl border border-white/5 ${card.bgClass}`}
              >
                {/* Photo Underlay if applicable */}
                {card.photoUrl && (
                  <>
                    <img
                      src={card.photoUrl}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-[#0A0A0A]/40" />
                  </>
                )}

                {/* Top Serial Tag */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-hero-mono tracking-wider opacity-70">
                  <span>{card.tag}</span>
                  <span className="text-[10px] uppercase font-bold">{card.category}</span>
                </div>

                {/* Center Content Node */}
                <div className="relative z-10 my-auto flex items-center justify-center">
                  {card.contentNode}
                </div>

                {/* Bottom Spacer if no button */}
                {!card.hasButton && <div className="h-4" />}
              </div>

              {/* Bottom Label Bar */}
              <div className="flex items-center justify-between px-2 text-xs">
                <span className="font-medium text-white/90 group-hover:text-[#C8FF3D] transition-colors">
                  {card.title}
                </span>
                <span className="text-[11px] font-hero-mono text-zinc-500">
                  {card.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
