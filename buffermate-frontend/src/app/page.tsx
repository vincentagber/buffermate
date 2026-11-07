'use client';

import React from 'react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingHero from '@/components/marketing/MarketingHero';
import MarketingMarquee from '@/components/marketing/MarketingMarquee';
import PlatformUseCases from '@/components/marketing/PlatformUseCases';
import MarketingWorkflowSpeed from '@/components/marketing/MarketingWorkflowSpeed';
import MarketingTrust from '@/components/marketing/MarketingTrust';
import MarketingFaq from '@/components/marketing/MarketingFaq';
import MarketingBlog from '@/components/marketing/MarketingBlog';
import MarketingCta from '@/components/marketing/MarketingCta';
import MarketingFooter from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1A202C] relative selection:bg-[#6F9C3E]/20 selection:text-[#6F9C3E]">
      {/* Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#6F9C3E]/12 to-transparent blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#FF882A]/8 to-transparent blur-[130px]" />
      </div>

      {/* 1. Header & Navigation */}
      <MarketingNavbar />

      <main className="flex-1 flex flex-col w-full relative">
        {/* 2. Hero Section */}
        <MarketingHero />

        {/* 3. Channels & Counting Marquee (Dual-Row Infinite Loop) */}
        <MarketingMarquee />

        {/* 4. Platform Capabilities Use Cases (6 Cards) */}
        <PlatformUseCases />

        {/* 5. Built for Speed (Interactive Multi-Step Workflows) */}
        <MarketingWorkflowSpeed />

        {/* 6. Built on a Foundation of Absolute Trust (Enterprise Container) */}
        <MarketingTrust />

        {/* 7. Frequently Asked Questions (FAQ with Filters) */}
        <MarketingFaq />

        {/* 8. Latest from the Blog (Editorial Knowledge Cards) */}
        <MarketingBlog />

        {/* 9. Dual Closing Call-to-Action Cards */}
        <MarketingCta />
      </main>

      {/* 10. Global Marketing Footer */}
      <MarketingFooter />
    </div>
  );
}
