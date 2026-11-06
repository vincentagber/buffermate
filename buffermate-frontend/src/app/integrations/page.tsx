'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Zap,
  Globe,
  Layers
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingCta from '@/components/marketing/MarketingCta';
import MarketingFooter from '@/components/marketing/Footer';
import {
  InstagramIcon,
  TikTokIcon,
  ThreadsIcon,
  FacebookIcon,
  XIcon,
  WhatsAppIcon
} from '@/components/SocialIcons';

interface IntegrationChannel {
  name: string;
  category: string;
  status: 'Verified Partner' | 'Official API' | 'Hosted Gateway';
  badgeColor: string;
  description: string;
  capabilities: string[];
  icon: React.ReactNode;
  iconBg: string;
}

const INTEGRATIONS: IntegrationChannel[] = [
  {
    name: 'Instagram Graph API',
    category: 'Meta Verified',
    status: 'Verified Partner',
    badgeColor: 'bg-[#6F9C3E]/10 text-[#6F9C3E] border-[#6F9C3E]/20',
    description: 'Direct publishing for Reels, multi-image carousels, and feed photos. Reads real-time comments to trigger sub-15s direct message funnels.',
    capabilities: [
      'Reels & Video Publishing',
      'Photo Carousel Sequencing',
      'Comment Keyword DM Funnels',
      'Audience Engagement Metrics'
    ],
    icon: <InstagramIcon className="w-7 h-7 text-pink-600" />,
    iconBg: 'bg-pink-50 border-pink-100',
  },
  {
    name: 'TikTok Creator & Business API',
    category: 'Short-Form Video',
    status: 'Official API',
    badgeColor: 'bg-[#1A202C]/10 text-[#1A202C] border-[#1A202C]/20',
    description: 'Direct video dispatch to TikTok creator feeds with commercial disclosure flags, custom cover selections, and peak viewing slot scheduling.',
    capabilities: [
      'Direct HD Video Uploads',
      'Custom Cover Frame Selection',
      'Commercial Content Tags',
      'Audience Retention Analytics'
    ],
    icon: <TikTokIcon className="w-7 h-7 text-[#1A202C]" />,
    iconBg: 'bg-slate-100 border-slate-200',
  },
  {
    name: 'Meta Threads API',
    category: 'Conversational',
    status: 'Official API',
    badgeColor: 'bg-[#1A202C]/10 text-[#1A202C] border-[#1A202C]/20',
    description: 'Schedule high-curiosity conversational threads, reply to community discussions, and sync thought leadership text posts simultaneously.',
    capabilities: [
      'Text Posts up to 500 Chars',
      'Image & Video Attachments',
      'Thread Reply Trees',
      'Cross-Post Sync from X'
    ],
    icon: <ThreadsIcon className="w-7 h-7 text-[#1A202C]" />,
    iconBg: 'bg-slate-100 border-slate-200',
  },
  {
    name: 'Facebook Pages API',
    category: 'Meta Verified',
    status: 'Official API',
    badgeColor: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
    description: 'Manage brand presence across business pages, schedule status updates, and auto-reply to post comments with links and lead magnets.',
    capabilities: [
      'Page Feed Publishing',
      'Media Album Scheduling',
      'Auto-Comment Replies',
      'Follower Demographic Stats'
    ],
    icon: <FacebookIcon className="w-7 h-7 text-blue-600" />,
    iconBg: 'bg-blue-50 border-blue-100',
  },
  {
    name: 'X (Twitter API v2)',
    category: 'Microblogging',
    status: 'Official API',
    badgeColor: 'bg-[#1A202C]/10 text-[#1A202C] border-[#1A202C]/20',
    description: 'Automate high-velocity short updates, formatted tweet threads, and engagement analytics using official X Developer endpoints.',
    capabilities: [
      'Single Tweets & Multi-Part Threads',
      'Media Attachment Encoding',
      'Real-Time Retweet Counters',
      'B2B Inbound Lead Tracking'
    ],
    icon: <XIcon className="w-7 h-7 text-[#1A202C]" />,
    iconBg: 'bg-slate-100 border-slate-200',
  },
  {
    name: 'WhatsApp Direct Cloud API',
    category: 'Direct Messaging',
    status: 'Official API',
    badgeColor: 'bg-[#6F9C3E]/10 text-[#6F9C3E] border-[#6F9C3E]/20',
    description: 'Direct messaging connection for sending verified lead alerts, customer onboarding links, and priority client hand-offs directly to WhatsApp.',
    capabilities: [
      'Instant Inbound Lead Alerts',
      'Direct-to-Chat Short Links',
      'Automated Support Handoff',
      'High-Conversion Pipeline'
    ],
    icon: <WhatsAppIcon className="w-7 h-7 text-emerald-600" />,
    iconBg: 'bg-emerald-50 border-emerald-100',
  },
  {
    name: 'Bachs Hosted Payment Gateway',
    category: 'Billing & Checkout',
    status: 'Hosted Gateway',
    badgeColor: 'bg-[#FF882A]/10 text-[#FF882A] border-[#FF882A]/20',
    description: 'Global subscription billing infrastructure supporting international debit/credit cards, African bank settlement (NGN, GHS, KES, ZAR), mobile money, and crypto.',
    capabilities: [
      'Hosted & Overlay Checkout',
      'HMAC-SHA256 Webhook Security',
      'Automated Recurring Subscriptions',
      'Multi-Currency Settlement'
    ],
    icon: <ShieldCheck className="w-7 h-7 text-[#FF882A]" />,
    iconBg: 'bg-amber-50 border-amber-100',
  },
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1A202C] relative selection:bg-[#6F9C3E]/20 selection:text-[#6F9C3E]">
      {/* Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#6F9C3E]/12 to-transparent blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#FF882A]/8 to-transparent blur-[130px]" />
      </div>

      <MarketingNavbar />

      <main className="flex-1 flex flex-col w-full relative">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden w-full px-5 md:px-10 py-16 md:py-24 border-b border-[#E2E0D5]">
          <div className="absolute inset-0 pointer-events-none overflow-hidden text-[#1A202C] opacity-[0.03]">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute -top-16 -left-10 rotate-12">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[30%] right-[10%] rotate-12">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>

          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6F9C3E]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-[800px] mx-auto text-center animate-slide-up-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#E2E0D5] shadow-xs mb-6 mx-auto">
              <div className="w-2 h-2 rounded-full bg-[#6F9C3E] animate-pulse" />
              <span className="font-bold text-[12px] text-[#1A202C] tracking-wide uppercase">
                Official Integrations
              </span>
            </div>

            <h1 className="font-extrabold text-[42px] sm:text-[56px] md:text-[68px] text-[#1A202C] leading-[1.08] mb-6 tracking-tight">
              Connect every channel with <br className="hidden sm:inline" />
              <span className="text-[#6F9C3E]">verified developer APIs</span>.
            </h1>

            <p className="font-medium text-[18px] md:text-[20px] text-[#6B6B60] leading-relaxed max-w-[700px] mx-auto">
              We connect exclusively through officially sanctioned developer partner endpoints. Zero password sharing, zero browser scraping, and 100% compliant with platform security policies.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. INTEGRATIONS GRID */}
        {/* ========================================================================= */}
        <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-16 md:py-24 border-b border-[#E2E0D5]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTEGRATIONS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[28px] p-8 border border-[#E2E0D5] hover:border-[#C4C4B8] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${item.iconBg}`}>
                      {item.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B60] mb-1">
                    {item.category}
                  </div>
                  <h3 className="font-extrabold text-[20px] text-[#1A202C] mb-3 leading-snug">
                    {item.name}
                  </h3>

                  <p className="font-medium text-[14px] text-[#6B6B60] leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {item.capabilities.map((cap, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-2 text-xs font-semibold text-[#4A5568]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#6F9C3E] shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs font-semibold text-[#1A202C]">
                  <span>Status: Operational</span>
                  <span className="text-[#6F9C3E]">99.98% Dispatches →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SECURITY & TOKEN ENCRYPTION NOTICE */}
        {/* ========================================================================= */}
        <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-16 md:py-20">
          <div className="bg-[#1A202C] text-white rounded-[32px] p-8 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#6F9C3E]/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enterprise Security Standard</span>
                </div>
                <h3 className="font-extrabold text-[28px] md:text-[38px] text-white leading-tight">
                  Your credentials are never stored. <br />
                  <span className="text-[#6F9C3E]">Direct OAuth 2.0 handshake only.</span>
                </h3>
                <p className="font-normal text-[15px] md:text-[16px] text-slate-300 leading-relaxed max-w-2xl">
                  Buffermate never asks for your social passwords. Authentication happens directly on the verified login portals of Meta, TikTok, and X. Access tokens are encrypted at rest with AES-256 GCM encryption.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href="/signup"
                  className="px-7 py-3.5 bg-[#6F9C3E] hover:bg-[#5f8734] text-white text-center font-bold text-sm rounded-full shadow-lg transition-all"
                >
                  Connect Your First Channel
                </Link>
                <a
                  href="https://docs.bachs.io"
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-center font-bold text-sm rounded-full transition-all inline-flex items-center justify-center gap-1.5"
                >
                  <span>Bachs Payment Security Docs</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. DUAL CLOSING CALL-TO-ACTION */}
        {/* ========================================================================= */}
        <MarketingCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
