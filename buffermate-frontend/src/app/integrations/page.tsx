'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Layers,
  Sparkles,
  Lock
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';
import CtaBanner from '@/components/marketing/CtaBanner';
import {
  InstagramIcon,
  TikTokIcon,
  ThreadsIcon,
  FacebookIcon,
  XIcon,
  WhatsAppIcon
} from '@/components/SocialIcons';

interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  status: 'Live' | 'Verified Partner';
  description: string;
  capabilities: string[];
  icon: React.ReactNode;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'instagram',
    name: 'Instagram Graph API',
    category: 'Social Media',
    status: 'Verified Partner',
    description: 'Publish Reels, carousels, and single images directly. Read organic comments in real time and trigger automated DM dispatches.',
    capabilities: ['Reels & Video Publishing', 'Photo Carousels', 'Comment Keyword DM Funnels', 'Audience Reach Analytics'],
    icon: <InstagramIcon className="w-8 h-8 text-pink-600" />,
  },
  {
    id: 'tiktok',
    name: 'TikTok Creator & Business API',
    category: 'Video & Short-Form',
    status: 'Live',
    description: 'Direct publishing to TikTok feeds with privacy settings, commercial content disclosures, and peak viewing slot scheduling.',
    capabilities: ['Direct Video Publishing', 'Custom Cover Image Selection', 'Sound & Hashtag Sync', 'Short-Form Video Metrics'],
    icon: <TikTokIcon className="w-8 h-8 text-slate-900" />,
  },
  {
    id: 'threads',
    name: 'Meta Threads API',
    category: 'Microblogging',
    status: 'Live',
    description: 'Schedule high-curiosity conversational threads, reply to community discussions, and sync thought leadership content simultaneously.',
    capabilities: ['Text Posts up to 500 Chars', 'Image & Video Attachments', 'Comment Thread Routing', 'Cross-Posting from X'],
    icon: <ThreadsIcon className="w-8 h-8 text-slate-900" />,
  },
  {
    id: 'facebook',
    name: 'Facebook Pages API',
    category: 'Social Media',
    status: 'Live',
    description: 'Manage brand presence across business pages, schedule status updates, and auto-reply to post comments with links.',
    capabilities: ['Page Feed Publishing', 'Media Album Scheduling', 'Page Engagement Stats', 'Auto-Comment Replies'],
    icon: <FacebookIcon className="w-8 h-8 text-blue-600" />,
  },
  {
    id: 'x',
    name: 'X (Twitter API v2)',
    category: 'Microblogging',
    status: 'Live',
    description: 'Automate high-velocity short updates, tweet threads, and engagement analytics using official developer endpoints.',
    capabilities: ['Single Tweets & Threads', 'Media Attachment Encoding', 'Real-Time Engagement Counters', 'B2B Lead Tracking'],
    icon: <XIcon className="w-8 h-8 text-slate-900" />,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Direct Gateway',
    category: 'Messaging',
    status: 'Live',
    description: 'Direct messaging connection for sending verified lead alerts, customer onboarding links, and priority support dispatch.',
    capabilities: ['Instant Lead Alerts', 'Direct-to-Chat Links', 'Customer Support Hand-off', 'High Conversion Rate'],
    icon: <WhatsAppIcon className="w-8 h-8 text-emerald-600" />,
  },
  {
    id: 'bachs',
    name: 'Bachs Payment Gateway',
    category: 'Billing & Checkout',
    status: 'Verified Partner',
    description: 'Global subscription infrastructure supporting international cards, African bank settlement (NGN, GHS, KES, ZAR), mobile money, and stablecoins.',
    capabilities: ['Hosted & Overlay Checkout', 'Automated Subscription Billing', 'HMAC-SHA256 Webhook Verification', 'Multi-Currency Settlement'],
    icon: <ShieldCheck className="w-8 h-8 text-purple-700" />,
  },
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      <MarketingNavbar />

      <main className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
        {/* Header */}
        <section className="pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>Supported Platforms & Partner Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-3xl mx-auto leading-tight">
            Connect all your channels. <br />
            Publish without limits.
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Buffermate AI connects exclusively via official developer APIs and OAuth 2.0 protocols to safeguard your account integrity.
          </p>
        </section>

        {/* Integrations Grid */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INTEGRATIONS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-6 hover:shadow-xs transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-2xs">
                      {item.icon}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{item.status}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-purple-700 font-semibold mt-0.5">{item.category}</p>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Capabilities:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {item.capabilities.map((cap) => (
                        <li key={cap} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/signup"
                    className="w-full py-2.5 rounded-full text-xs font-semibold text-center border border-slate-200/80 text-slate-800 hover:bg-slate-50 transition-colors block"
                  >
                    Connect {item.name.split(' ')[0]} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Authentication Notice */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-sm font-bold text-slate-900">
                Official API Security & Zero Password Storage
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Buffermate AI never asks for or stores your social media account passwords. We utilize official OAuth 2.0 authorization tokens encrypted with industry-standard AES-256 protocols.
              </p>
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

