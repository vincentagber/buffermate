'use client';

import React from 'react';
import { Lock, ShieldCheck, Award } from 'lucide-react';

export default function KobbleTrust() {
  return (
    <section className="py-16 md:py-24 max-w-[1200px] mx-auto w-full px-5 md:px-10">
      {/* Dark Slate Container matching Kobble Enterprise Section */}
      <div className="bg-[#1A202C] text-white rounded-[32px] p-8 sm:p-14 lg:p-16 border border-slate-800 shadow-2xl space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#6F9C3E]/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold uppercase tracking-widest text-[#6F9C3E]">
            <span>ENTERPRISE-GRADE RELIABILITY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Built on a foundation of <br className="hidden sm:inline" />
            <span className="text-[#6F9C3E]">absolute trust.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We provide a secure, compliant infrastructure for creators and agencies. Your account safety and brand reputation are our top priorities.
          </p>
        </div>

        {/* 3 Dark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Card 1: Data Security */}
          <div className="bg-white/5 rounded-[24px] p-7 border border-white/10 space-y-4 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Data Security &amp; Encryption
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              All account authentications use direct official OAuth 2.0 handshakes. We never ask for or store your social passwords. API tokens are encrypted with AES-256.
            </p>
          </div>

          {/* Card 2: Verified API Network */}
          <div className="bg-white/5 rounded-[24px] p-7 border border-white/10 space-y-4 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#6F9C3E]/20 border border-[#6F9C3E]/30 text-[#6F9C3E] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Verified API Network
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              Buffermate communicates exclusively through sanctioned developer endpoints: Meta Graph API, TikTok Creator API, Threads API, and X API v2.
            </p>
          </div>

          {/* Card 3: Quality Assurance */}
          <div className="bg-white/5 rounded-[24px] p-7 border border-white/10 space-y-4 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FF882A]/20 border border-[#FF882A]/30 text-[#FF882A] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Quality Assurance &amp; Guardrails
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              Built-in natural human delay simulation (15s–45s) and strict daily DM thresholds prevent algorithmic trigger flags. Maintain 100% account health.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
