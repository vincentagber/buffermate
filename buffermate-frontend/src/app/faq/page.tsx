'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Minus,
  Mail,
  ArrowRight,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingCta from '@/components/marketing/MarketingCta';
import MarketingFooter from '@/components/marketing/Footer';

interface FaqItem {
  q: string;
  a: string;
  category: 'General' | 'AI Content' | 'Comment Auto-DMs' | 'Billing & Bachs' | 'Security & APIs';
}

const FAQS: FaqItem[] = [
  {
    category: 'General',
    q: 'What is Buffermate AI and how is it different from traditional schedulers?',
    a: 'Traditional schedulers require manual copy-pasting, guesswork around post timing, and disjointed third-party DM tools. Buffermate is an autonomous social engine that unifies AI viral script generation (Gemini 2.0 & GPT-4), 6-channel precision scheduling, predictive audience heatmaps, and 24/7 automated comment-to-DM lead funnels in one workspace.'
  },
  {
    category: 'General',
    q: 'Which social networks does Buffermate currently support?',
    a: 'Buffermate natively supports 6 primary networks: Instagram (Reels, carousels, feed posts, comment reading), TikTok (Creator & Business direct video uploads), Meta Threads (text posts up to 500 chars, media), Facebook Pages (media albums, feed updates, auto-comments), X (Twitter API v2 single tweets and multi-part threads), and WhatsApp Direct Cloud API.'
  },
  {
    category: 'Security & APIs',
    q: 'Can my Instagram or TikTok account get banned for using Buffermate?',
    a: 'No. Buffermate connects strictly through official, verified developer partner OAuth 2.0 gateways. We do not use unofficial scrapers, reverse-engineered private mobile APIs, or automated browser clickers that violate platform terms of service. Your account safety is 100% safeguarded.'
  },
  {
    category: 'Security & APIs',
    q: 'Does Buffermate ever store my social media passwords?',
    a: 'Never. When you connect a social channel, you log in directly on the official authentication servers of Meta, TikTok, or X. We receive an encrypted OAuth 2.0 access token with strictly defined publishing and comment reading scopes. All tokens are encrypted at rest with AES-256 GCM encryption.'
  },
  {
    category: 'AI Content',
    q: 'How does the Gemini 2.0 Viral Script Studio formulate hooks?',
    a: 'Our AI engine combines Google Gemini 2.0 and GPT-4 architectures fine-tuned on over 2.4 million high-performing organic social posts. It evaluates psychological curiosity gaps, character-count pacing, and opening 3-second tension to produce platform-native hooks and scripts that achieve a viral score above 90.'
  },
  {
    category: 'Comment Auto-DMs',
    q: 'How does the 24/7 Comment-to-DM lead funnel work?',
    a: 'When you publish a post instructing followers to "Comment INFO below", our zero-lag webhook monitors comments on that post. When a follower comments your trigger keyword, Buffermate verifies the user profile and dispatches a personalized direct message containing your link within 3 to 15 seconds.'
  },
  {
    category: 'Comment Auto-DMs',
    q: 'Why is there a short delay before an automated DM is sent?',
    a: 'Buffermate employs an intentional randomized human typing jitter (between 15 and 45 seconds). Sending 50 identical DMs in 0.2 seconds flags platform anti-spam algorithms. By simulating realistic human response times, our engine maintains 100% account health and prevents shadowbans.'
  },
  {
    category: 'Billing & Bachs',
    q: 'What payment methods does the Bachs gateway accept?',
    a: 'Our hosted checkout powered by Bachs (docs.bachs.io) securely processes international Visa and Mastercard debit/credit cards, African domestic bank transfers (NGN, GHS, KES, ZAR), mobile money accounts (M-Pesa, MTN Mobile Money), and stablecoin crypto payments.'
  },
  {
    category: 'Billing & Bachs',
    q: 'Can I cancel or downgrade my subscription whenever I want?',
    a: 'Yes. You can cancel or switch tiers anytime directly inside your workspace Settings with one click. There are no cancellation penalties or hidden fees. If you cancel an annual plan, you continue enjoying full Pro or Agency features until the end of the paid billing cycle.'
  },
  {
    category: 'Billing & Bachs',
    q: 'What is included in the Scale & Agency plan for agency teams?',
    a: 'The Scale & Agency tier is built for multi-brand agencies. It provides 10 team member seats, unlimited connected client channels, custom multi-workspace isolation, white-label PDF client performance reports featuring your own logo, 1,000+ daily comment auto-DMs, and direct CRM webhook endpoints.'
  }
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['All', 'General', 'AI Content', 'Comment Auto-DMs', 'Billing & Bachs', 'Security & APIs'];

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesSearch =
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#E2E0D5] text-[#1A202C] relative selection:bg-[#00784D]/30 selection:text-[#00784D]">
      {/* Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#07B979]/15 to-transparent blur-[130px]" />
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
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[30%] right-[10%] rotate-12">
              <rect width="20" height="14" x="2" y="6" rx="2" /><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>

          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#07B979]/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-[800px] mx-auto text-center animate-slide-up-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#E2E0D5] shadow-xs mb-6 mx-auto">
              <div className="w-2 h-2 rounded-full bg-[#07B979] animate-pulse" />
              <span className="font-bold text-[12px] text-[#1A202C] tracking-wide uppercase">
                Support &amp; Documentation
              </span>
            </div>

            <h1 className="font-extrabold text-[42px] sm:text-[56px] md:text-[68px] text-[#1A202C] leading-[1.08] mb-6 tracking-tight">
              Frequently Asked <span className="text-[#00784D]">Questions</span>.
            </h1>

            <p className="font-medium text-[18px] md:text-[20px] text-[#6B6B60] leading-relaxed max-w-[700px] mx-auto mb-8">
              Everything you need to know about Buffermate AI, supported social platforms, account safety, and subscription billing.
            </p>

            {/* Live Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword, topic, or feature..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-[#E2E0D5] text-sm text-[#1A202C] font-medium shadow-xs focus:outline-none focus:border-[#07B979] focus:ring-2 focus:ring-[#07B979]/20 transition-all placeholder:text-[#A0AEC0]"
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CATEGORY TABS */}
        {/* ========================================================================= */}
        <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 pt-10 pb-4">
          <div className="flex items-center justify-center flex-wrap gap-2 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#00784D] text-white shadow-md'
                    : 'bg-white hover:bg-slate-50 text-[#6B6B60] border border-[#E2E0D5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. ACCORDION FAQ CARDS */}
        {/* ========================================================================= */}
        <section className="max-w-[850px] mx-auto w-full px-5 md:px-10 py-10 md:py-16">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-[24px] p-12 text-center border border-[#E2E0D5] space-y-4">
              <HelpCircle className="w-8 h-8 text-[#A0AEC0] mx-auto" />
              <h3 className="font-bold text-lg text-[#1A202C]">No matching questions found</h3>
              <p className="text-sm text-[#6B6B60]">
                Try adjusting your search terms or contact our support team directly.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-5 py-2.5 rounded-full bg-[#1A202C] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-[24px] border border-[#E2E0D5] p-6 md:p-7 hover:border-[#C4C4B8] hover:shadow-md transition-all"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#00784D]">
                          {faq.category}
                        </span>
                        <h3 className="font-extrabold text-[17px] md:text-[18px] text-[#1A202C] leading-snug">
                          {faq.q}
                        </h3>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#E2E0D5] text-[#1A202C] flex items-center justify-center shrink-0">
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
          )}
        </section>

        {/* ========================================================================= */}
        {/* 4. CONTACT SUPPORT CALLOUT CARD */}
        {/* ========================================================================= */}
        <section className="max-w-[850px] mx-auto w-full px-5 md:px-10 pb-16">
          <div className="bg-white rounded-[28px] p-8 md:p-10 border border-[#E2E0D5] shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00784D]/10 text-[#00784D] flex items-center justify-center mx-auto border border-[#07B979]/30">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-[22px] text-[#1A202C]">
              Still have questions? We are here for you.
            </h3>
            <p className="text-sm font-medium text-[#6B6B60] max-w-md mx-auto leading-relaxed">
              Cannot find the exact answer you are looking for? Reach out to our creator support specialists directly.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1A202C] hover:bg-[#2D3748] text-white text-sm font-bold shadow-md transition-all hover:-translate-y-0.5"
              >
                <span>Contact Our Team</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. DUAL CLOSING CTA */}
        {/* ========================================================================= */}
        <MarketingCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
