'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function MarketingHero() {
  return (
    <section className="relative pt-10 sm:pt-16 pb-16 lg:pb-24 overflow-hidden border-b border-[#E2E0D5]">
      {/* Decorative Sparkle */}
      <div className="absolute top-12 right-1/3 text-[#FF882A] opacity-60 pointer-events-none hidden lg:block">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* =========================================================================
              LEFT COLUMN: HERO COPY & CTAs
          ========================================================================= */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 animate-slide-up-fade">
            <h1 className="text-[42px] sm:text-[60px] lg:text-[66px] font-extrabold tracking-tight text-[#1A202C] leading-[1.06]">
              Your Social Media. <br />
              <span className="text-[#6F9C3E]">
                Smarter. Automated.
              </span>
            </h1>

            <p className="font-medium text-base sm:text-[18px] text-[#6B6B60] max-w-xl leading-relaxed">
              Connect with an autonomous AI network engineered to craft, schedule, and distribute high-converting content across 6 channels. Turn viral post comments into direct paying clients 24/7.
            </p>

            {/* Black Pill CTA Button */}
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-full bg-[#1A202C] hover:bg-[#2D3748] text-white text-[15px] font-bold shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Start Free Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Avatar Cluster with +2.4k Pill */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F5F4F0] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                  alt="Creator"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F5F4F0] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Creator"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F5F4F0] object-cover"
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
                  alt="Creator"
                />
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#1A202C] text-white text-[11px] font-bold ring-2 ring-[#F5F4F0]">
                  +2.4k
                </div>
              </div>
              <p className="text-xs text-[#6B6B60] font-medium leading-snug">
                Over <strong className="text-[#1A202C]">2,420+ creators &amp; brands</strong> <br className="hidden sm:inline" />
                ready for automated deployment.
              </p>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: TILTED PHOTO & 3 FLOATING INTERFACE CARDS
          ========================================================================= */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            {/* Tilted Photo Card */}
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=80"
                alt="Social Media Creator working with Buffermate AI"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* FLOATING CARD 1: Top-Left "Posts Processed" with orange trend */}
            <div className="absolute -top-4 -left-2 sm:left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#E2E0D5] z-20 animate-fade-in w-44">
              <div className="flex items-center space-x-1.5 text-[#6B6B60] text-[11px] font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-[#FF882A]" />
                <span>Posts Processed</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-[#1A202C] tracking-tight">
                  1,420
                </span>
                <svg className="w-16 h-6 stroke-[#FF882A] fill-none" viewBox="0 0 60 20">
                  <path
                    d="M 2 16 Q 15 18, 25 10 T 45 6 T 58 2"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="58" cy="2" r="2.5" className="fill-[#FF882A]" />
                </svg>
              </div>
            </div>

            {/* FLOATING CARD 2: Bottom-Left Testimonial Card */}
            <div className="absolute bottom-6 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-[#E2E0D5] z-20 max-w-[240px]">
              <div className="flex items-center space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Chukwuka"
                  className="w-8 h-8 rounded-full object-cover border border-[#E2E0D5]"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-[#1A202C]">Chukwuka Obiosa</span>
                    <CheckCircle2 className="w-3 h-3 text-[#6F9C3E] fill-[#6F9C3E]/20" />
                  </div>
                  <div className="flex text-amber-400 space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                    ))}
                    <span className="text-[10px] text-[#6B6B60] ml-1 font-semibold">(5.0)</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#6B6B60] mt-2 italic leading-snug">
                &ldquo;Consistently delivers 4x reach and 24/7 comment leads on Instagram &amp; TikTok.&rdquo;
              </p>
            </div>

            {/* FLOATING CARD 3: Bottom-Right "Active Queue Engine" */}
            <div className="absolute -bottom-4 right-0 sm:right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#E2E0D5] z-20 w-56">
              <div className="flex items-center justify-between pb-2">
                <div className="w-7 h-7 rounded-xl bg-[#6F9C3E]/10 text-[#6F9C3E] border border-[#6F9C3E]/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[#6F9C3E]" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#F5F4F0] text-[10px] font-semibold text-[#6B6B60]">
                  Just now
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#1A202C] leading-none">
                Active Queue Engine
              </h4>
              <p className="text-[11px] text-[#6B6B60] mt-1">
                Ready to publish on-demand
              </p>
              <div className="mt-3 pt-2 border-t border-[#EFECE5] flex items-center justify-between text-[11px]">
                <span className="text-[#6B6B60]">Available Channels</span>
                <span className="font-bold text-[#6F9C3E] font-mono">6 Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
