'use client';

import React from 'react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingHero from '@/components/marketing/MarketingHero';
import MarketingMarquee from '@/components/marketing/MarketingMarquee';
import PlatformUseCases from '@/components/marketing/PlatformUseCases';
import KineticTypographyGallery from '@/components/marketing/KineticTypographyGallery';
import MarketingWorkflowSpeed from '@/components/marketing/MarketingWorkflowSpeed';
import MarketingTrust from '@/components/marketing/MarketingTrust';
import MarketingFaq from '@/components/marketing/MarketingFaq';
import MarketingBlog from '@/components/marketing/MarketingBlog';
import MarketingCta from '@/components/marketing/MarketingCta';
import MarketingFooter from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#E2E0D5] text-[#000000] relative selection:bg-[#00784D]/30 selection:text-[#000000]">
      {/* Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#07B979]/15 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#141416]/8 to-transparent blur-[140px]" />
      </div>

      {/* 1. Header & Navigation */}
      <MarketingNavbar />

      <main className="flex-1 flex flex-col w-full relative">
        {/* 2. Restored BufferMate Hero Section with Swiss Editorial Typography */}
        <MarketingHero />

        {/* 3. Channels & Counting Marquee (Dual-Row Infinite Loop) */}
        <MarketingMarquee />

        {/* 4. Platform Capabilities Use Cases (6 Cards) */}
        <PlatformUseCases />

        {/* 4b. Kinetic Typography Gallery (Neo-Swiss Editorial Grid) */}
        <KineticTypographyGallery />

        {/* 5. Built for Speed (Interactive Multi-Step Workflows) */}
        <MarketingWorkflowSpeed />

        {/* 6. Built on a Foundation of Absolute Trust (Enterprise Container) */}
        <MarketingTrust />

        {/* 8. Frequently Asked Questions (FAQ with Filters) */}
        <MarketingFaq />

        {/* 9. Latest from the Blog (Editorial Knowledge Cards) */}
        <MarketingBlog />

        {/* 10. Dual Closing Call-to-Action Cards */}
        <MarketingCta />
      </main>

      {/* 11. Global Marketing Footer */}
      <MarketingFooter />
    </div>
  );
}
