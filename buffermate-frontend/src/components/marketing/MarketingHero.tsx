'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton';

export default function MarketingHero() {
  return (
    <section className="relative pt-10 sm:pt-16 pb-16 lg:pb-24 overflow-hidden border-b border-[#E2E0D5]">
      {/* Decorative Sparkle */}
      <div className="absolute top-12 right-1/3 text-[#07B979] opacity-80 pointer-events-none hidden lg:block">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* =========================================================================
              LEFT COLUMN: HERO COPY & CTAs (Consistent Swiss Palette)
          ========================================================================= */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 animate-slide-up-fade">
            <h1 className="text-[44px] sm:text-[64px] lg:text-[76px] font-hero-sans font-normal tracking-[-0.04em] text-[#000000] leading-[1.02]">
              <span className="inline-block">Social media that</span>{' '}
              <br className="hidden sm:inline" />
              <span className="inline-block">
                <span className="font-editorial-italic text-[#141416] font-normal tracking-tight pr-2 sm:pr-3">
                  really
                </span>
                <span
                  className="font-hero-sans font-black tracking-[-0.04em] inline-block"
                  style={{
                    backgroundImage: 'linear-gradient(to right bottom in oklab, rgb(0, 120, 77) 0%, rgb(7, 185, 121) 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                  }}
                >
                  moves.
                </span>
              </span>
            </h1>

            <p className="font-hero-sans font-normal text-base sm:text-[18px] text-[#141416]/80 max-w-lg leading-relaxed tracking-tight text-balance">
              From raw creative ideas to an autonomous AI publishing engine across 6 channels. Turn viral post comments into direct paying clients 24/7.
            </p>

            {/* Animated Interactive CTA Button */}
            <div className="pt-2">
              <AnimatedButton href="/signup" size="lg">
                Start Free Workspace
              </AnimatedButton>
            </div>

            {/* Avatar Cluster with +2.4k Pill */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#E2E0D5] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                  alt="Creator"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#E2E0D5] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Creator"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#E2E0D5] object-cover"
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
                  alt="Creator"
                />
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#00784D] text-[#07B979] text-[11px] font-bold ring-2 ring-[#E2E0D5]">
                  +2.4k
                </div>
              </div>
              <p className="text-xs text-[#141416]/80 font-medium leading-snug">
                Over <strong className="text-[#000000]">2,420+ creators &amp; brands</strong> <br className="hidden sm:inline" />
                ready for automated deployment.
              </p>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: TILTED PHOTO & 3 FLOATING INTERFACE CARDS
          ========================================================================= */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            {/* Tilted Photo Card */}
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(20,20,22,0.18)] border-4 border-white ring-1 ring-[#141416]/10 rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="/marketing/hero-creator-man.jpg"
                alt="Young creator managing multiple social media accounts with Buffermate AI"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* FLOATING CARD 1: Top-Left "Posts Processed" (Crisp White SaaS Style) */}
            <div className="absolute -top-4 -left-2 sm:left-4 bg-white text-[#141416] rounded-2xl p-4 shadow-[0_20px_40px_rgba(20,20,22,0.12)] border border-[#141416]/10 z-20 animate-fade-in w-44">
              <div className="flex items-center space-x-1.5 text-[#62645F] text-[11px] font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-[#00784D]" />
                <span>Posts Processed</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#141416] tracking-tight">
                  1,420
                </span>
                <svg className="w-16 h-6 stroke-[#00784D] fill-none" viewBox="0 0 60 20">
                  <path
                    d="M 2 16 Q 15 18, 25 10 T 45 6 T 58 2"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="58" cy="2" r="2.5" className="fill-[#07B979]" />
                </svg>
              </div>
            </div>

            {/* FLOATING CARD 2: Bottom-Right Testimonial Card (Crisp White SaaS Style) */}
            <div className="absolute -bottom-4 right-0 sm:right-4 bg-white text-[#141416] rounded-2xl p-4 shadow-[0_20px_40px_rgba(20,20,22,0.12)] border border-[#141416]/10 z-20 max-w-[260px] animate-fade-in">
              <div className="flex items-center space-x-2.5">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Chukwuka Obiosa"
                  className="w-9 h-9 rounded-full object-cover border border-[#E2E0D5]"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-[#141416]">Chukwuka Obiosa</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00784D] fill-[#00784D]/15" />
                  </div>
                  <div className="flex text-[#00784D] space-x-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-[#00784D]" />
                    ))}
                    <span className="text-[10px] text-[#62645F] ml-1 font-semibold">(5.0)</span>
                  </div>
                </div>
              </div>
              <p className="font-editorial-italic text-[13px] text-[#141416]/85 mt-2.5 leading-snug">
                &ldquo;Consistently delivers 4x reach and 24/7 comment leads on Instagram &amp; TikTok.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
