'use client';

import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Zap, Award, Server } from 'lucide-react';

export default function TrustSection() {
  return (
    <section className="space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Enterprise-Grade Reliability</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Built on a foundation of absolute trust.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          We provide a secure, compliant infrastructure for creators and agencies. Your account safety and brand reputation are our top priorities.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Pillar 1: Data Security */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold shadow-2xs">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Data Security & Encryption
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All account authentications use direct official OAuth 2.0 handshakes. We never ask for or store your social passwords. API access tokens are encrypted using AES-256 encryption at rest.
          </p>
          <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero password storage</span>
          </div>
        </div>

        {/* Pillar 2: Verified API Network */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold shadow-2xs">
            <Server className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Official Developer APIs
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Buffermate communicates exclusively through sanctioned developer endpoints: Meta Graph API, TikTok Creator API, Threads API, and X API v2. No brittle browser scraping or unauthorized extensions.
          </p>
          <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs font-semibold text-blue-700">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>100% platform policy compliant</span>
          </div>
        </div>

        {/* Pillar 3: Anti-Spam Guardrails */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold shadow-2xs">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Anti-Spam & Rate Guardrails
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Built-in natural human delay simulation (15s–45s) and strict daily DM thresholds prevent algorithmic trigger flags. Your accounts maintain perfect health scores and high organic deliverability.
          </p>
          <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs font-semibold text-purple-700">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>Smart anti-detection active</span>
          </div>
        </div>
      </div>
    </section>
  );
}

