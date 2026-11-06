'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Sparkles, Building2, ShieldCheck, Zap } from 'lucide-react';

export default function CtaBanner() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      router.push(`/signup?email=${encodeURIComponent(email.trim())}`);
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Card: Self-Serve Growth (Black Pill Style) */}
        <div className="lg:col-span-7 relative rounded-3xl bg-[#141416] text-white p-8 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-purple-300 border border-white/10 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Self-Serve & Creator Plans</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to scale your social operations?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              Start publishing with AI today. Connect 3 social networks on the Free Forever plan with no credit card required.
            </p>

            {/* Quick Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email..."
                className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-xs shadow-inner"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center justify-center space-x-1.5 cursor-pointer hover:scale-[1.02]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant setup</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cancel anytime</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AES-256 OAuth security</span>
            </span>
          </div>
        </div>

        {/* Right Card: Agency & Enterprise Walkthrough */}
        <div className="lg:col-span-5 relative rounded-3xl bg-white text-slate-900 p-8 sm:p-10 lg:p-12 border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5 text-slate-700" />
              <span>Agencies & Enterprise</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Need an enterprise solution?
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Managing 10+ brand clients? Get dedicated API limits, white-label client PDF reports, custom webhook lead sync, and SOC-2 data compliance.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                <span>Unlimited team seats & client workspace isolation</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                <span>Custom webhook dispatches to HubSpot, Salesforce & Slack</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                <span>Dedicated Slack/WhatsApp support channel</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <Link
              href="/contact"
              className="w-full px-6 py-3.5 rounded-full bg-[#141416] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-2xs flex items-center justify-center space-x-2 hover:scale-[1.02]"
            >
              <span>Contact Enterprise Sales</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
