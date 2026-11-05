'use client';

import React from 'react';
import Link from 'next/link';
import {
  Crown,
  Check,
  X,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';
import PricingCards from '@/components/marketing/PricingCards';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import CtaBanner from '@/components/marketing/CtaBanner';

export default function PricingPage() {
  const comparisonRows = [
    { feature: 'Connected Social Accounts', free: '3 accounts', pro: 'Unlimited', agency: 'Unlimited' },
    { feature: 'Scheduled Posts in Queue', free: '10 per channel', pro: 'Unlimited', agency: 'Unlimited' },
    { feature: 'Analytics Retention', free: '7 Days', pro: '90 Days', agency: 'Full History' },
    { feature: 'AI Viral Script Studio (Gemini 2.0)', free: 'Limited Trial', pro: 'Full Access (GPT-4)', agency: 'Full Access' },
    { feature: '24/7 Comment Auto-DM Bots', free: '—', pro: '250 DMs / day', agency: '1,000+ DMs / day' },
    { feature: 'Unified Social Inbox', free: 'Basic', pro: 'Full Multi-Platform', agency: 'Multi-User Queue' },
    { feature: 'Predictive Peak Time Heatmaps', free: '—', pro: 'Included', agency: 'Included' },
    { feature: 'Team Member Workspace Seats', free: '1 Seat', pro: '1 Seat', agency: '10 Seats Included' },
    { feature: 'White-Label Client PDF Reports', free: '—', pro: '—', agency: 'Custom Branding' },
    { feature: 'Custom Webhook Lead Sync & CRM API', free: '—', pro: '—', agency: 'Direct Endpoints' },
    { feature: 'Support Standard', free: 'Community', pro: 'Priority Email', agency: '24/7 Dedicated SLA' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      <MarketingNavbar />

      <main className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
        {/* Header */}
        <section className="pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-3xl mx-auto leading-tight">
            Plans built for creators at every stage.
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Start with our generous free tier. Upgrade when you need unlimited channels, autonomous DM bots, and agency scale.
          </p>
        </section>

        {/* Pricing Cards Component */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <PricingCards showTitle={false} />
        </section>

        {/* Detailed Feature Comparison Table */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Detailed Plan Comparison
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Review side-by-side capabilities across all workspace tiers.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-4 px-6 text-slate-900 font-bold">Feature</th>
                    <th className="py-4 px-6 text-slate-700">Starter Free</th>
                    <th className="py-4 px-6 text-purple-900 font-bold">Pro Growth</th>
                    <th className="py-4 px-6 text-blue-900 font-bold">Scale & Agency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-slate-900">{row.feature}</td>
                      <td className="py-3.5 px-6 text-slate-600">
                        {row.free === '—' ? <X className="w-4 h-4 text-slate-300" /> : row.free}
                      </td>
                      <td className="py-3.5 px-6 text-purple-900 font-semibold">{row.pro}</td>
                      <td className="py-3.5 px-6 text-blue-900 font-semibold">{row.agency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pricing FAQs */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Billing & Account FAQs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Common questions regarding payments, refunds, and upgrades.
            </p>
          </div>
          <FaqAccordion />
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
