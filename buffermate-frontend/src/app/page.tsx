'use client';

import React from 'react';
import MarketingNavbar from '@/components/marketing/Navbar';
import KobbleHero from '@/components/marketing/KobbleHero';
import KobbleMarquee from '@/components/marketing/KobbleMarquee';
import KobbleUseCases from '@/components/marketing/KobbleUseCases';
import KobbleBuiltForSpeed from '@/components/marketing/KobbleBuiltForSpeed';
import KobbleTrust from '@/components/marketing/KobbleTrust';
import KobbleFaq from '@/components/marketing/KobbleFaq';
import KobbleBlog from '@/components/marketing/KobbleBlog';
import KobbleCta from '@/components/marketing/KobbleCta';
import MarketingFooter from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1A202C] relative selection:bg-[#6F9C3E]/20 selection:text-[#6F9C3E]">
      {/* Kobble Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#6F9C3E]/12 to-transparent blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#FF882A]/8 to-transparent blur-[130px]" />
      </div>

      {/* 1. Header & Navigation */}
      <MarketingNavbar />

      <main className="flex-1 flex flex-col w-full relative">
        {/* 2. Hero Section (Exact 2-Column Split + Tilted Photo + 3 Floating Interface Cards) */}
        <KobbleHero />

        {/* 3. Channels & Counting Marquee (Dual-Row Infinite Loop) */}
        <KobbleMarquee />

        {/* 4. Use Cases (Scale your social presence with autonomous precision - 6 Cards) */}
        <KobbleUseCases />

        {/* 5. Built for speed (Interactive Stage 1 & Stage 2 Multi-Step Workflows) */}
        <KobbleBuiltForSpeed />

        {/* 6. Built on a foundation of absolute trust (Solid Dark Navy Enterprise Container) */}
        <KobbleTrust />

        {/* 7. Got questions? We've got answers (FAQ with Business/Creator Filters) */}
        <KobbleFaq />

        {/* 8. Latest from the blog (Editorial Knowledge Cards) */}
        <KobbleBlog />

        {/* 9. Dual Closing CTA Cards (Growth / Enterprise) */}
        <KobbleCta />
      </main>

      {/* 10. Global Marketing Footer */}
      <MarketingFooter />
    </div>
  );
}
