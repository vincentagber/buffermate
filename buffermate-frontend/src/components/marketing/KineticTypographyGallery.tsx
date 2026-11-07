'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface TypographyCardItem {
  id: string;
  code: string;
  title: string;
  category: 'Typography' | 'Scene' | 'Loop';
  bgColor?: string;
  textColor?: string;
  bgImage?: string;
  content: React.ReactNode;
  hasButton?: boolean;
}

const GALLERY_ITEMS: TypographyCardItem[] = [
  {
    id: 'big-mood',
    code: 'KIN / 001',
    title: 'Big Mood',
    category: 'Typography',
    bgColor: 'bg-[#C8FF3D]',
    textColor: 'text-[#000000]',
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-hero-sans font-black text-[38px] sm:text-[46px] leading-[0.92] tracking-[-0.05em] uppercase text-[#000000]">
          BIG<br />MOOD.
        </span>
      </div>
    ),
  },
  {
    id: 'soft-focus',
    code: 'KIN / 002',
    title: 'Soft Focus',
    category: 'Scene',
    bgImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-editorial-italic text-[42px] sm:text-[50px] leading-[0.95] text-white tracking-tight drop-shadow-md">
          Soft<br />focus.
        </span>
      </div>
    ),
  },
  {
    id: 'on-repeat',
    code: 'KIN / 003',
    title: 'On Repeat',
    category: 'Loop',
    bgColor: 'bg-[#F5F1EA]',
    textColor: 'text-[#000000]',
    content: (
      <div className="flex flex-col items-center justify-center text-center space-y-0.5">
        <span className="font-hero-sans font-black text-[34px] sm:text-[40px] leading-[0.92] tracking-[-0.04em] lowercase text-[#000000]">
          again.<br />again.<br />again.
        </span>
      </div>
    ),
  },
  {
    id: 'make-believe',
    code: 'KIN / 004',
    title: 'Split Personality',
    category: 'Typography',
    bgColor: 'bg-[#141416]',
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <span
          className="font-hero-sans font-light text-[34px] sm:text-[42px] leading-[0.95] tracking-[0.06em] uppercase"
          style={{
            WebkitTextStroke: '1.5px rgba(255,255,255,0.95)',
            color: 'transparent',
          }}
        >
          MAKE<br />BELIEVE.
        </span>
      </div>
    ),
  },
  {
    id: 'full-circle',
    code: 'KIN / 005',
    title: 'Full Circle',
    category: 'Loop',
    bgColor: 'bg-[#353733]',
    content: (
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="w-36 h-36 rounded-full border border-white/20 flex items-center justify-center">
          <span className="font-editorial-italic text-[26px] sm:text-[30px] leading-[1.05] text-white text-center tracking-tight">
            what goes<br />around
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'sunday-club',
    code: 'KIN / 006',
    title: 'Sunday Club',
    category: 'Scene',
    bgImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-editorial-italic text-[40px] sm:text-[48px] leading-[0.95] text-white tracking-tight drop-shadow-md">
          Sunday<br />club.
        </span>
      </div>
    ),
  },
  {
    id: 'heavy-rotation',
    code: 'KIN / 007',
    title: 'Heavy Rotation',
    category: 'Typography',
    bgColor: 'bg-[#C8FF3D]',
    hasButton: true,
    content: (
      <div className="flex flex-col items-center justify-between h-full pt-6 pb-2 text-center w-full">
        <span className="font-hero-sans font-black text-[32px] sm:text-[38px] leading-[0.92] tracking-[-0.05em] uppercase text-[#000000]">
          HEAVY<br />ROTATION
        </span>
        <Link
          href="/dashboard"
          className="mt-6 px-5 py-2 rounded-full bg-white hover:bg-neutral-100 text-[#000000] text-xs font-bold shadow-xs transition-all inline-flex items-center space-x-1.5"
        >
          <span>Open in editor</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    ),
  },
  {
    id: 'next-wave',
    code: 'KIN / 008',
    title: 'The Next Wave',
    category: 'Loop',
    bgColor: 'bg-[#F5F1EA]',
    content: (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-hero-sans font-black text-[32px] sm:text-[38px] leading-[0.95] tracking-[-0.04em] uppercase text-[#000000]">
          WAVE<br />AFTER<br />WAVE
        </span>
      </div>
    ),
  },
];

export default function KineticTypographyGallery() {
  return (
    <section className="w-full bg-[#000000] text-white py-20 sm:py-28 px-4 sm:px-8 border-t border-[#141416]">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#141416] border border-[#353733] text-[#C8FF3D] text-[11px] font-mono tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C8FF3D]" />
              <span>Neo-Swiss Editorial Architecture</span>
            </div>
            <h2 className="font-hero-sans font-black text-[36px] sm:text-[54px] tracking-[-0.04em] leading-[0.96] text-white">
              Kinetic Creative Studio.
            </h2>
          </div>
          <p className="font-hero-sans font-normal text-sm sm:text-base text-neutral-400 max-w-md leading-relaxed">
            Pairing high-velocity publishing with Swiss editorial typography. Engineered to build distinct, unmistakable digital brand presence.
          </p>
        </div>

        {/* 4x2 Grid Matching User Screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div key={item.id} className="flex flex-col space-y-2 group">
              {/* Card Canvas */}
              <div
                className={`relative h-[280px] sm:h-[300px] rounded-3xl overflow-hidden p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${
                  item.bgImage ? 'bg-neutral-900' : item.bgColor || 'bg-[#141416]'
                }`}
                style={
                  item.bgImage
                    ? {
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url(${item.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : undefined
                }
              >
                {/* Top Code Pill */}
                <div className="flex items-center justify-between z-10">
                  <span
                    className={`text-[10px] font-mono font-bold tracking-widest uppercase ${
                      item.bgColor === 'bg-[#C8FF3D]'
                        ? 'text-[#000000]/70'
                        : item.bgColor === 'bg-[#F5F1EA]'
                        ? 'text-[#000000]/60'
                        : 'text-white/60'
                    }`}
                  >
                    {item.code}
                  </span>
                </div>

                {/* Main Visual Typography Content */}
                <div className="my-auto z-10 w-full flex items-center justify-center">
                  {item.content}
                </div>

                <div className="z-10" />
              </div>

              {/* Card Bottom Meta Bar */}
              <div className="flex items-center justify-between px-1 pt-1 text-[11px] font-mono text-neutral-400">
                <span className="font-semibold text-neutral-200">{item.title}</span>
                <span className="text-neutral-500 uppercase tracking-wider">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

