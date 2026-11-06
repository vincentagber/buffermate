'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus, Building2, User } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'business' | 'creator';
}

const FAQS: FaqItem[] = [
  {
    q: 'What is Buffermate AI?',
    a: 'Buffermate AI is an autonomous social media management platform that helps businesses and creators draft high-converting content with AI, schedule posts across 6 networks at peak engagement windows, and turn post comments into paying leads with 24/7 instant DM automation.',
    category: 'business',
  },
  {
    q: 'How does the comment-to-DM lead automation work?',
    a: 'You can set up keyword rules such as "LINK", "GUIDE", or "PRICE". When someone comments on your Instagram, TikTok, or Facebook post, Buffermate’s autonomous bot instantly dispatches a personalized direct message containing your booking link or resource in under 15 seconds.',
    category: 'business',
  },
  {
    q: 'Which social media platforms are supported?',
    a: 'Buffermate connects to Instagram (Feed, Reels & Stories), TikTok, Meta Threads, Facebook Pages, X (Twitter API v2), and WhatsApp Business API through direct official developer endpoints.',
    category: 'business',
  },
  {
    q: 'How does account verification and security work?',
    a: 'All accounts connect via standard OAuth 2.0. Buffermate never sees, asks for, or stores your passwords. All tokens are encrypted with AES-256 at rest, and each workspace is isolated via Supabase Row-Level Security (RLS).',
    category: 'business',
  },
  {
    q: 'Can I manage multiple clients under one account?',
    a: 'Yes. Our Scale & Agency tier supports multiple client workspaces with isolated team permissions, custom branding, and white-label PDF analytics reports.',
    category: 'business',
  },
  {
    q: 'Is there a free plan available for creators?',
    a: 'Yes! Our Starter tier is 100% free forever. It includes 3 social channels, 10 scheduled posts per channel, and basic 7-day analytics with no credit card required.',
    category: 'creator',
  },
  {
    q: 'Will automated publishing shadowban my accounts?',
    a: 'No. Buffermate integrates exclusively with sanctioned official Graph and Creator APIs. We include natural randomized human delays (15s–45s) and conservative daily DM thresholds to keep your accounts in perfect standing.',
    category: 'creator',
  },
  {
    q: 'How does Google Gemini 2.0 create post captions?',
    a: 'Our AI Viral Script Studio uses Gemini 2.0 and GPT-4 fine-tuned on hundreds of thousands of top-performing social posts. It predicts curiosity scores and automatically generates high-impact opening hooks, clean thread unrolls, and relevant hashtags.',
    category: 'creator',
  },
];

export default function KobbleFaq() {
  const [selectedCategory, setSelectedCategory] = useState<'business' | 'creator'>('business');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((f) => f.category === selectedCategory);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-[#F6F4EE] border-t border-[#EBE7DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header matching Kobble */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141416] leading-tight">
            Got questions? <br />
            <span className="text-[#52832B]">We&apos;ve got answers.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Everything you need to know about scheduling, supported networks, and automated comment leads.
          </p>
        </div>

        {/* Filter Switcher matching Kobble */}
        <div className="flex justify-center">
          <div className="inline-flex bg-[#EBE7DF] p-1 rounded-full text-xs font-bold">
            <button
              onClick={() => {
                setSelectedCategory('business');
                setOpenIndex(0);
              }}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full transition-all cursor-pointer ${
                selectedCategory === 'business'
                  ? 'bg-[#52832B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>For Businesses &amp; Agencies</span>
            </button>
            <button
              onClick={() => {
                setSelectedCategory('creator');
                setOpenIndex(0);
              }}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full transition-all cursor-pointer ${
                selectedCategory === 'creator'
                  ? 'bg-[#52832B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>For Solo Creators</span>
            </button>
          </div>
        </div>

        {/* Accordion List matching Kobble */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E7E4DC] shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-[#141416] hover:text-[#52832B] transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#52832B] text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Contact link matching Kobble */}
        <div className="text-center pt-2 text-xs sm:text-sm text-slate-500">
          Still have questions? Visit{' '}
          <Link href="/blog" className="text-[#52832B] font-bold hover:underline">
            the blog
          </Link>{' '}
          or{' '}
          <Link href="/contact" className="text-[#52832B] font-bold hover:underline">
            contact us
          </Link>
          .
        </div>
      </div>
    </section>
  );
}

