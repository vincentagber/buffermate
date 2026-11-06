'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function KobbleHero() {
  return (
    <section className="relative pt-8 sm:pt-14 pb-16 lg:pb-24 overflow-hidden">
      {/* Background Decorative Sparkles */}
      <div className="absolute top-12 right-1/3 text-amber-400 opacity-60 pointer-events-none hidden lg:block">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* =========================================================================
              LEFT COLUMN: HERO COPY & CTAs (Exact Kobble Typography)
          ========================================================================= */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-6xl lg:text-[66px] font-extrabold tracking-tight text-[#141416] leading-[1.06]">
              Your Social Media. <br />
              <span className="text-[#52832B]">
                Smarter. Automated.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Connect with an autonomous AI network engineered to craft, schedule, and distribute high-converting content across 6 channels. Turn viral post comments into direct paying clients 24/7.
            </p>

            {/* Black Pill CTA Button */}
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center space-x-2.5 px-7 py-3.5 rounded-full bg-[#141416] hover:bg-black text-white text-sm font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Start Free Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Avatar Cluster with +2.4k Pill */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#F6F4EE] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                  alt="Creator"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#F6F4EE] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Creator"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#F6F4EE] object-cover"
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
                  alt="Creator"
                />
                <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-slate-900 text-white text-[11px] font-bold ring-2 ring-[#F6F4EE]">
                  +2.4k
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-snug">
                Over <strong className="text-slate-900">2,420+ creators & brands</strong> <br className="hidden sm:inline" />
                ready for automated deployment.
              </p>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: TILTED PHOTO & 3 FLOATING INTERFACE CARDS (Exact Kobble Layout)
          ========================================================================= */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            {/* Tilted Photo Card */}
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=80"
                alt="Social Media Creator working with Buffermate AI"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* FLOATING CARD 1: Top-Left "Posts Processed" with orange trend */}
            <div className="absolute -top-4 -left-2 sm:left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100/90 z-20 animate-fade-in w-44">
              <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Posts Processed</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-[#141416] tracking-tight">
                  1,420
                </span>
                {/* Mini sparkline visualization */}
                <svg className="w-16 h-6 stroke-amber-500 fill-none" viewBox="0 0 60 20">
                  <path
                    d="M 2 16 Q 15 18, 25 10 T 45 6 T 58 2"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="58" cy="2" r="2.5" className="fill-amber-500" />
                </svg>
              </div>
            </div>

            {/* FLOATING CARD 2: Bottom-Left Testimonial Card */}
            <div className="absolute bottom-6 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-slate-100/90 z-20 max-w-[240px]">
              <div className="flex items-center space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Chukwuka"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-[#141416]">Chukwuka Obiosa</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                  </div>
                  <div className="flex text-amber-400 space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1 font-semibold">(5.0)</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 italic leading-snug">
                &ldquo;Consistently delivers 4x reach and 24/7 comment leads on Instagram &amp; TikTok.&rdquo;
              </p>
            </div>

            {/* FLOATING CARD 3: Bottom-Right "Active Queue Engine" */}
            <div className="absolute -bottom-4 right-0 sm:right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100/90 z-20 w-56">
              <div className="flex items-center justify-between pb-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500">
                  Just now
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#141416] leading-none">
                Active Queue Engine
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Ready to publish on-demand
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Available Channels</span>
                <span className="font-bold text-[#52832B] font-mono">6 Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

