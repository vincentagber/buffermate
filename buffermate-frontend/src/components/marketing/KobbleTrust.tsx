'use client';

import React from 'react';
import { Lock, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

export default function KobbleTrust() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Dark Navy Container matching Kobble */}
      <div className="bg-[#0A0F1D] text-white rounded-3xl p-8 sm:p-14 lg:p-16 border border-slate-800 shadow-2xl space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-bold uppercase tracking-widest text-slate-300">
            <span>ENTERPRISE-GRADE RELIABILITY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Built on a foundation of <br className="hidden sm:inline" />
            <span className="text-[#22C55E]">absolute trust.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We provide a secure, compliant infrastructure for creators and agencies. Your account safety and brand reputation are our top priorities.
          </p>
        </div>

        {/* 3 Dark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Data Security */}
          <div className="bg-[#111827]/70 rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Data Security &amp; Encryption
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              All account authentications use direct official OAuth 2.0 handshakes. We never ask for or store your social passwords. API tokens are encrypted with AES-256.
            </p>
          </div>

          {/* Card 2: Verified API Network */}
          <div className="bg-[#111827]/70 rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Verified API Network
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Buffermate communicates exclusively through sanctioned developer endpoints: Meta Graph API, TikTok Creator API, Threads API, and X API v2.
            </p>
          </div>

          {/* Card 3: Quality Assurance */}
          <div className="bg-[#111827]/70 rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-4">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Quality Assurance &amp; Guardrails
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Built-in natural human delay simulation (15s–45s) and strict daily DM thresholds prevent algorithmic trigger flags. Maintain 100% account health.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

