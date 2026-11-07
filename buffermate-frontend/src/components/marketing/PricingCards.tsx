'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton';

interface PricingCardsProps {
  showTitle?: boolean;
}

export default function PricingCards({ showTitle = true }: PricingCardsProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="w-full max-w-7xl mx-auto font-sans">
      {showTitle && (
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5" />
            <span>Transparent Pricing & Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Predictable pricing. Scale without limits.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Start free, upgrade as you grow. No hidden platform fees, cancel or change plans anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center space-x-1 bg-slate-100 p-1.5 rounded-full border border-slate-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white shadow-2xs text-slate-900'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-[#141416] text-[#C8FF3D] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] rounded-full font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Tier 1: Starter Free */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-6 hover:shadow-xs transition-shadow">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Starter Free
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900">$0</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Essential scheduling and social calendar for solo content creators.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                What&apos;s Included:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>3 Connected</strong> Social Accounts</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>10 Scheduled Posts</strong> per channel</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Basic 7-day Analytics Dashboard</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Standard Visual Calendar View</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Community & Docs Support</span>
                </li>
              </ul>
            </div>
          </div>

          <Link
            href="/signup?plan=free"
            className="w-full py-3 rounded-full text-xs font-semibold text-center border border-slate-200/90 text-slate-800 hover:bg-slate-50 transition-all shadow-2xs block"
          >
            Get Started Free
          </Link>
        </div>

        {/* Tier 2: Pro Growth (Hero Highlight) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-xl flex flex-col justify-between space-y-6 relative hover:scale-[1.01] transition-transform">
          <div className="absolute -top-3.5 right-6 px-3.5 py-1 bg-[#141416] text-white text-[10px] font-extrabold rounded-full tracking-wider uppercase shadow-md flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>MOST POPULAR</span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
                Pro Growth Plan
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                  ${billingCycle === 'annual' ? '23' : '29'}
                </span>
                <span className="text-xs text-slate-400">
                  / month {billingCycle === 'annual' ? '(billed yearly)' : ''}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                For serious creators, coaches, and businesses scaling multi-channel authority.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Everything in Free, plus:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="font-semibold text-slate-900">Unlimited Connected Social Channels</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Unlimited Scheduled Queue</strong> & Calendar</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>Full 90-Day Analytics</strong> & CSV Export</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>AI Viral Script Studio</strong> (Google Gemini 2.0)</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>24/7 Comment Keyword Auto-DMs</strong></span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>AI Predictive Peak Time Heatmaps</span>
                </li>
              </ul>
            </div>
          </div>

          <AnimatedButton
            href="/signup?plan=pro"
            size="md"
            className="w-full text-center"
          >
            Start 14-Day Free Trial
          </AnimatedButton>
        </div>

        {/* Tier 3: Scale & Agency */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-6 hover:shadow-xs transition-shadow">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Scale & Agency
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                  ${billingCycle === 'annual' ? '63' : '79'}
                </span>
                <span className="text-xs text-slate-400">
                  / month {billingCycle === 'annual' ? '(billed yearly)' : ''}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                For marketing agencies, media teams, and fast-growing brand portfolios.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Everything in Pro Growth, plus:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>10 Team Member Seats</strong> & RBAC Roles</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span><strong>White-Label Client Analytics</strong> PDF Reports</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Custom Webhook Lead Sync & CRM API</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Enterprise Project Workflows & Dependency Timelines</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Dedicated Account Manager & 24/7 SLA</span>
                </li>
              </ul>
            </div>
          </div>

          <Link
            href="/signup?plan=agency"
            className="w-full py-3 rounded-full text-xs font-semibold text-center border border-slate-200/90 text-blue-700 hover:bg-blue-50/50 transition-all shadow-2xs block"
          >
            Upgrade to Agency Scale
          </Link>
        </div>
      </div>

      {/* Bachs Payments Trust Strip */}
      <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Secure checkout hosted via <strong>Bachs</strong> (<a href="https://docs.bachs.io" target="_blank" rel="noreferrer" className="underline hover:text-slate-800">docs.bachs.io</a>).
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Global Cards · Bank Transfers · Mobile Money (M-Pesa, MoMo) · Stablecoins (USDT/USDC)
        </div>
      </div>
    </div>
  );
}

