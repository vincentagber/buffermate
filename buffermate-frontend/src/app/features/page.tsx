'use client';

import React from 'react';
import Link from 'next/link';
import MarketingNavbar from '@/components/marketing/Navbar';
import KobbleUseCases from '@/components/marketing/KobbleUseCases';
import KobbleBuiltForSpeed from '@/components/marketing/KobbleBuiltForSpeed';
import KobbleTrust from '@/components/marketing/KobbleTrust';
import KobbleCta from '@/components/marketing/KobbleCta';
import MarketingFooter from '@/components/marketing/Footer';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F6F4EE] font-sans text-slate-900 selection:bg-[#52832B]/20 selection:text-[#52832B]">
      <MarketingNavbar />

      <main className="overflow-hidden">
        {/* Features Hero matching Kobble */}
        <section className="pt-12 sm:pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-[#E7E4DC] text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#52832B]" />
            <span>PLATFORM FEATURES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[#141416] leading-[1.08] max-w-4xl mx-auto">
            Every channel, <br className="hidden sm:inline" />
            <span className="text-[#52832B]">one autonomous engine.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From AI viral script generation and multi-channel scheduling to automated comment DM lead capture and peak heatmaps, Buffermate unifies your social publishing — and scales it autonomously.
          </p>
        </section>

        {/* 6 Capabilities Use Cases Grid */}
        <KobbleUseCases />

        {/* Built for speed interactive demo */}
        <KobbleBuiltForSpeed />

        {/* Enterprise trust dark section */}
        <KobbleTrust />

        {/* Dual Closing CTA */}
        <KobbleCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
