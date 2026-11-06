'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Plus,
  Minus
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import KobbleCta from '@/components/marketing/KobbleCta';
import MarketingFooter from '@/components/marketing/Footer';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const pricingFaqs = [
    {
      q: 'Can I start for free without entering a credit card?',
      a: 'Yes, absolutely. The Starter Free plan requires zero credit card or billing information. You can connect up to 3 channels and schedule up to 10 posts per channel completely free forever.'
    },
    {
      q: 'How does the Bachs payment gateway work?',
      a: 'Buffermate integrates with Bachs (docs.bachs.io) as our hosted subscription billing engine. Bachs securely processes international debit/credit cards, African local bank transfers (NGN, GHS, KES, ZAR), mobile money wallets, and crypto settlements with HMAC-SHA256 encrypted verification.'
    },
    {
      q: 'What happens if I exceed my 250 daily DM limit on Pro Growth?',
      a: 'To protect your social accounts from platform rate limits, excess DMs are queued and dispatched safely the following day. If your campaigns consistently drive higher volumes, you can upgrade to Scale & Agency for 1,000+ daily DMs and custom queue throttling.'
    },
    {
      q: 'Can I cancel or change my plan at any time?',
      a: 'Yes. You can upgrade, downgrade, or cancel your subscription at any time directly from your workspace Settings. If you cancel an annual plan, you retain access until the end of your billing cycle.'
    },
    {
      q: 'What makes the Scale & Agency plan ideal for marketing agencies?',
      a: 'The Scale & Agency plan includes 10 team member seats, unlimited connected accounts across multiple brands, white-label client PDF performance reports with custom agency logos, and direct webhook CRM lead sync.'
    }
  ];

  const comparisonRows = [
    { feature: 'Connected Social Channels', free: '3 channels', pro: 'Unlimited', agency: 'Unlimited' },
    { feature: 'Scheduled Posts in Queue', free: '10 per channel', pro: 'Unlimited', agency: 'Unlimited' },
    { feature: 'Gemini 2.0 Viral Script Studio', free: 'Trial Access', pro: 'Unlimited (GPT-4)', agency: 'Unlimited' },
    { feature: '24/7 Comment-to-DM Lead Bots', free: '—', pro: '250 DMs / day', agency: '1,000+ DMs / day' },
    { feature: 'Predictive Peak Audience Heatmaps', free: '—', pro: 'Included', agency: 'Included' },
    { feature: 'Unified Omnichannel Inbox', free: 'Basic Feed', pro: 'Full CRM Inbox', agency: 'Multi-User Queue' },
    { feature: 'Analytics Retention', free: '7 Days', pro: '90 Days', agency: 'Full History' },
    { feature: 'Team Member Seats', free: '1 Seat', pro: '1 Seat', agency: '10 Seats Included' },
    { feature: 'White-Label Client PDF Reports', free: '—', pro: '—', agency: 'Custom Branding' },
    { feature: 'Custom CRM Webhook Lead Sync', free: '—', pro: '—', agency: 'Included' },
    { feature: 'Support Standard', free: 'Community', pro: 'Priority Email', agency: '24/7 Dedicated SLA' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1A202C] relative selection:bg-[#6F9C3E]/20 selection:text-[#6F9C3E]">
      {/* Kobble Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#6F9C3E]/12 to-transparent blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#FF882A]/8 to-transparent blur-[130px]" />
      </div>

      <MarketingNavbar />

      <main className="flex-1 flex flex-col w-full relative">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Kobble exact layout & decorative floating SVG outlines) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden w-full px-5 md:px-10 py-16 md:py-24 border-b border-[#E2E0D5]">
          <div className="absolute inset-0 pointer-events-none overflow-hidden text-[#1A202C] opacity-[0.03]">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute -top-16 -left-10 rotate-12">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[30%] right-[10%] rotate-12">
              <rect width="20" height="14" x="2" y="6" rx="2" /><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>

          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6F9C3E]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-[800px] mx-auto text-center animate-slide-up-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#E2E0D5] shadow-xs mb-6 mx-auto">
              <div className="w-2 h-2 rounded-full bg-[#6F9C3E] animate-pulse" />
              <span className="font-bold text-[12px] text-[#1A202C] tracking-wide uppercase">
                Transparent Pricing
              </span>
            </div>

            <h1 className="font-extrabold text-[42px] sm:text-[56px] md:text-[68px] text-[#1A202C] leading-[1.08] mb-6 tracking-tight">
              Simple, transparent pricing <br className="hidden sm:inline" />
              <span className="text-[#6F9C3E]">for every creator</span>.
            </h1>

            <p className="font-medium text-[18px] md:text-[20px] text-[#6B6B60] leading-relaxed max-w-[700px] mx-auto mb-8">
              Start with our generous free tier. Upgrade when you need unlimited channels, autonomous comment-to-DM bots, and agency scale.
            </p>

            {/* Billing Switcher (Annual -20% / Monthly) */}
            <div className="inline-flex items-center p-1.5 rounded-full bg-white border border-[#E2E0D5] shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-[#1A202C] text-white shadow-xs'
                    : 'text-[#6B6B60] hover:text-[#1A202C]'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-extrabold bg-[#6F9C3E] text-white px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#1A202C] text-white shadow-xs'
                    : 'text-[#6B6B60] hover:text-[#1A202C]'
                }`}
              >
                Monthly Billing
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. PRICING CARDS (3 Tiers matching Buffermate Production Pricing) */}
        {/* ========================================================================= */}
        <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-16 md:py-24 border-b border-[#E2E0D5]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Starter Free */}
            <div className="bg-white rounded-[28px] border border-[#E2E0D5] p-8 md:p-9 flex flex-col justify-between hover:shadow-xl hover:border-[#C4C4B8] transition-all">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B60] mb-2">
                  Solo Creators
                </div>
                <h3 className="font-extrabold text-[26px] text-[#1A202C] mb-2">
                  Starter Free
                </h3>
                <p className="text-sm font-medium text-[#6B6B60] mb-6">
                  Essential scheduling tools to establish your daily posting consistency.
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-[44px] font-extrabold text-[#1A202C]">$0</span>
                  <span className="text-sm font-bold text-[#6B6B60]">/ forever</span>
                </div>

                <div className="space-y-3.5 mb-8">
                  {[
                    '3 Connected Social Channels',
                    '10 Scheduled Posts per channel',
                    'Basic 7-day Analytics',
                    'Community Support Forum',
                    'Standard Queue Engine',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs md:text-sm font-semibold text-[#4A5568]">
                      <div className="w-5 h-5 rounded-full bg-[#E2E0D5] text-[#1A202C] flex items-center justify-center font-bold text-[10px] shrink-0">
                        ✓
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/signup"
                className="w-full py-4 text-center rounded-full bg-[#F5F4F0] hover:bg-[#EAE6DD] text-[#1A202C] font-bold text-sm border border-[#E2E0D5] transition-all"
              >
                Start Free Workspace
              </Link>
            </div>

            {/* Tier 2: Pro Growth (Popular) */}
            <div className="bg-white rounded-[28px] border-2 border-[#6F9C3E] p-8 md:p-9 flex flex-col justify-between shadow-2xl relative">
              {/* Popular Pill */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#6F9C3E] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                Most Popular
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6F9C3E] mb-2">
                  High-Growth Creators
                </div>
                <h3 className="font-extrabold text-[26px] text-[#1A202C] mb-2">
                  Pro Growth
                </h3>
                <p className="text-sm font-medium text-[#6B6B60] mb-6">
                  Autonomous viral scripting, unlimited queue, and 24/7 comment-to-DM bots.
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-[44px] font-extrabold text-[#1A202C]">
                    ${billingCycle === 'annual' ? '23' : '29'}
                  </span>
                  <span className="text-sm font-bold text-[#6B6B60]">
                    / mo {billingCycle === 'annual' ? '(billed yearly)' : ''}
                  </span>
                </div>

                <div className="space-y-3.5 mb-8">
                  {[
                    'Unlimited Connected Channels',
                    'Unlimited Scheduled Posts in Queue',
                    'AI Viral Script Studio (Gemini 2.0 & GPT-4)',
                    '24/7 Comment Auto-DM Bots (250 DMs/day)',
                    'Predictive Peak Audience Heatmaps',
                    'Unified Omnichannel CRM Inbox',
                    '90-Day Deep Historical Analytics',
                    'Priority Email Support',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs md:text-sm font-semibold text-[#1A202C]">
                      <div className="w-5 h-5 rounded-full bg-[#6F9C3E] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        ✓
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/signup?plan=pro"
                className="w-full py-4 text-center rounded-full bg-[#6F9C3E] hover:bg-[#5f8734] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                Upgrade to Pro Growth
              </Link>
            </div>

            {/* Tier 3: Scale & Agency */}
            <div className="bg-white rounded-[28px] border border-[#E2E0D5] p-8 md:p-9 flex flex-col justify-between hover:shadow-xl hover:border-[#C4C4B8] transition-all">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF882A] mb-2">
                  Agencies &amp; Multi-Brand
                </div>
                <h3 className="font-extrabold text-[26px] text-[#1A202C] mb-2">
                  Scale &amp; Agency
                </h3>
                <p className="text-sm font-medium text-[#6B6B60] mb-6">
                  Multi-brand isolation, white-label client PDF reports, and 10 team seats.
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-[44px] font-extrabold text-[#1A202C]">
                    ${billingCycle === 'annual' ? '63' : '79'}
                  </span>
                  <span className="text-sm font-bold text-[#6B6B60]">
                    / mo {billingCycle === 'annual' ? '(billed yearly)' : ''}
                  </span>
                </div>

                <div className="space-y-3.5 mb-8">
                  {[
                    'Everything in Pro Growth',
                    '10 Team Member Workspace Seats',
                    'White-Label Client PDF Reports',
                    '1,000+ Comment Auto-DMs / day',
                    'Custom Webhook Lead Sync & CRM API',
                    'Multi-Client Workspace Isolation',
                    'Full Historical Data Retention',
                    'Dedicated SLA & WhatsApp Manager',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs md:text-sm font-semibold text-[#4A5568]">
                      <div className="w-5 h-5 rounded-full bg-[#1A202C] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        ✓
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/signup?plan=agency"
                className="w-full py-4 text-center rounded-full bg-[#1A202C] hover:bg-[#2D3748] text-white font-bold text-sm shadow-md transition-all"
              >
                Upgrade to Scale &amp; Agency
              </Link>
            </div>
          </div>

          {/* Bachs Payment Security Badge */}
          <div className="mt-12 p-6 rounded-2xl bg-white border border-[#E2E0D5] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6F9C3E]/10 text-[#6F9C3E] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#1A202C]">
                  Hosted Payment Infrastructure: Bachs (docs.bachs.io)
                </div>
                <div className="text-xs text-[#6B6B60]">
                  International Cards · African Bank Transfers (NGN, GHS, KES, ZAR) · Mobile Money · Crypto
                </div>
              </div>
            </div>

            <a
              href="https://docs.bachs.io"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#6F9C3E] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Learn About Bachs Security</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. DETAILED PLAN COMPARISON MATRIX */}
        {/* ========================================================================= */}
        <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-16 md:py-24 border-b border-[#E2E0D5]">
          <div className="text-center max-w-[700px] mx-auto mb-14">
            <h2 className="font-extrabold text-[32px] md:text-[42px] text-[#1A202C] leading-tight mb-3">
              Detailed Feature Comparison
            </h2>
            <p className="font-medium text-[16px] text-[#6B6B60]">
              Review side-by-side capabilities across Starter, Pro, and Scale tiers.
            </p>
          </div>

          <div className="bg-white rounded-[28px] border border-[#E2E0D5] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F5F4F0] border-b border-[#E2E0D5] text-xs font-bold text-[#6B6B60] uppercase tracking-wider">
                  <tr>
                    <th className="py-5 px-6 md:px-8 text-[#1A202C]">Capability</th>
                    <th className="py-5 px-6 text-[#4A5568]">Starter Free</th>
                    <th className="py-5 px-6 text-[#6F9C3E] font-extrabold bg-[#6F9C3E]/5">
                      Pro Growth ($23/mo)
                    </th>
                    <th className="py-5 px-6 text-[#1A202C] font-extrabold">
                      Scale &amp; Agency ($63/mo)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E0D5]">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F5F4F0]/50 transition-colors">
                      <td className="py-4 px-6 md:px-8 font-bold text-[#1A202C] text-sm">
                        {row.feature}
                      </td>
                      <td className="py-4 px-6 text-[#6B6B60] text-xs md:text-sm font-medium">
                        {row.free}
                      </td>
                      <td className="py-4 px-6 font-bold text-[#6F9C3E] text-xs md:text-sm bg-[#6F9C3E]/5">
                        {row.pro}
                      </td>
                      <td className="py-4 px-6 font-bold text-[#1A202C] text-xs md:text-sm">
                        {row.agency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. PRICING FAQS ACCORDION */}
        {/* ========================================================================= */}
        <section className="max-w-[850px] mx-auto w-full px-5 md:px-10 py-16 md:py-24 border-b border-[#E2E0D5]">
          <div className="text-center mb-12">
            <h2 className="font-extrabold text-[32px] md:text-[40px] text-[#1A202C] leading-tight mb-3">
              Pricing Questions &amp; Answers
            </h2>
            <p className="font-medium text-[16px] text-[#6B6B60]">
              Everything you need to know about billing, Bachs checkout, and team seats.
            </p>
          </div>

          <div className="space-y-4">
            {pricingFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-[24px] border border-[#E2E0D5] p-6 hover:border-[#C4C4B8] transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="font-extrabold text-[17px] text-[#1A202C] leading-snug">
                      {faq.q}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#F5F4F0] text-[#1A202C] flex items-center justify-center shrink-0">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-[#EFECE5] text-sm md:text-[15px] font-medium text-[#6B6B60] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. DUAL CLOSING CTA (Kobble Standard) */}
        {/* ========================================================================= */}
        <KobbleCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
