'use client';

import React from 'react';
import Link from 'next/link';
import AnimatedButton from '../ui/AnimatedButton';

export default function MarketingCta() {
  return (
    <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Growth / Self-Serve */}
        <div className="rounded-[32px] p-8 md:p-14 flex flex-col items-start justify-between bg-white border border-[#E2E0D5] relative overflow-hidden hover:shadow-xl hover:border-[#C4C4B8] transition-all">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#6F9C3E]/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10 mb-8">
            <h3 className="font-extrabold text-[30px] md:text-[38px] text-[#1A202C] mb-4 leading-tight">
              Ready to scale <br />
              your operations?
            </h3>
            <p className="font-medium text-[16px] md:text-[17px] text-[#6B6B60] max-w-[360px] leading-relaxed">
              Launch your first workspace today and get autonomous multi-channel scheduling with AI-driven content generation.
            </p>
          </div>

          <div className="relative z-10 w-full sm:w-auto">
            <AnimatedButton href="/signup" size="lg">
              Start Free Workspace
            </AnimatedButton>
          </div>
        </div>

        {/* Card 2: Enterprise */}
        <div className="rounded-[32px] p-8 md:p-14 flex flex-col items-start justify-between bg-white border border-[#E2E0D5] relative overflow-hidden hover:shadow-xl hover:border-[#C4C4B8] transition-all">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#FF882A]/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10 mb-8">
            <h3 className="font-extrabold text-[30px] md:text-[38px] text-[#1A202C] mb-4 leading-tight">
              Need an agency <br />
              solution?
            </h3>
            <p className="font-medium text-[16px] md:text-[17px] text-[#6B6B60] max-w-[360px] leading-relaxed">
              Custom multi-brand workspaces, 10 team member seats, white-label client PDF reports, and dedicated account management.
            </p>
          </div>

          <div className="relative z-10 w-full sm:w-auto">
            <AnimatedButton href="/pricing" variant="brand" size="lg">
              Explore Agency Plans
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  );
}
