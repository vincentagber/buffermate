'use client';

import React from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mail
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import CtaBanner from '@/components/marketing/CtaBanner';

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      <MarketingNavbar />

      <main className="space-y-20 sm:space-y-28 pb-24 overflow-hidden">
        {/* Header */}
        <section className="pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & Documentation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-3xl mx-auto leading-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Buffermate AI, supported platforms, account safety, and subscription billing.
          </p>
        </section>

        {/* FAQ Interactive Accordion */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <FaqAccordion />
        </section>

        {/* Still Have Questions Box */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xs text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center mx-auto shadow-2xs">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Still have questions? We&apos;re here for you.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Can&apos;t find the answer you&apos;re looking for? Reach out to our creator support specialists directly.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#141416] hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02]"
              >
                <span>Contact Our Team</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-4 sm:px-6 lg:px-8">
          <CtaBanner />
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
