'use client';

import React from 'react';
import { Lock, ShieldCheck, Award } from 'lucide-react';

export default function MarketingTrust() {
  return (
    <section className="py-16 md:py-24 max-w-[1200px] mx-auto w-full px-5 md:px-10">
      {/* Dark Slate Container */}
      <div className="bg-[#141416] text-[#E2E0D5] rounded-[32px] p-8 sm:p-14 lg:p-16 border border-[#141416] shadow-2xl space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#07B979]/15 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#00784D]/30 border border-[#07B979]/40 text-[10px] font-black uppercase tracking-widest text-[#07B979]">
            <span>ENTERPRISE-GRADE RELIABILITY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-hero-sans font-normal tracking-[-0.04em] text-[#E2E0D5] leading-tight">
            Built on a foundation of <br className="hidden sm:inline" />
            <span className="font-editorial-italic text-[#07B979] font-normal tracking-tight pr-2">absolute</span>
            <span className="font-hero-sans font-black tracking-[-0.04em] text-[#E2E0D5]">trust.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#E2E0D5]/75 max-w-2xl mx-auto leading-relaxed">
            We provide a secure, compliant infrastructure for creators and agencies. Your account safety and brand reputation are our top priorities.
          </p>
        </div>

        {/* 3 Dark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Card 1: Data Security */}
          <div className="bg-[#000000]/50 rounded-[24px] p-7 border border-[#E2E0D5]/15 space-y-4 hover:border-[#07B979]/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#00784D]/25 border border-[#07B979]/30 text-[#07B979] flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#E2E0D5] tracking-tight">
              Data Security &amp; Encryption
            </h3>
            <p className="text-xs sm:text-sm text-[#E2E0D5]/70 leading-relaxed font-medium">
              All account authentications use direct official OAuth 2.0 handshakes. We never ask for or store your social passwords. API tokens are encrypted with AES-256.
            </p>
          </div>

          {/* Card 2: Verified API Network */}
          <div className="bg-[#000000]/50 rounded-[24px] p-7 border border-[#E2E0D5]/15 space-y-4 hover:border-[#07B979]/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#00784D]/25 border border-[#07B979]/30 text-[#07B979] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#E2E0D5] tracking-tight">
              Verified API Network
            </h3>
            <p className="text-xs sm:text-sm text-[#E2E0D5]/70 leading-relaxed font-medium">
              Buffermate communicates exclusively through sanctioned developer endpoints: Meta Graph API, TikTok Creator API, Threads API, and X API v2.
            </p>
          </div>

          {/* Card 3: Quality Assurance */}
          <div className="bg-[#000000]/50 rounded-[24px] p-7 border border-[#E2E0D5]/15 space-y-4 hover:border-[#07B979]/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#00784D]/25 border border-[#07B979]/30 text-[#07B979] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#E2E0D5] tracking-tight">
              Quality Assurance &amp; Guardrails
            </h3>
            <p className="text-xs sm:text-sm text-[#E2E0D5]/70 leading-relaxed font-medium">
              Built-in natural human delay simulation (15s–45s) and strict daily DM thresholds prevent algorithmic trigger flags. Maintain 100% account health.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
