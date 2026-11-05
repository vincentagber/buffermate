'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

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
    <div className="w-full max-w-7xl mx-auto font-sans px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-[#141416] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-slate-800">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-purple-300 border border-white/10 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Autonomous Growth Starts Here</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
            Ready to put your social publishing on autopilot?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Create high-velocity content, schedule across 6 channels, and turn comment engagement into direct paying customers.
          </p>

          {/* Quick Signup Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2"
          >
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

          {/* Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>14-day Pro trial included</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cancel or downgrade anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

