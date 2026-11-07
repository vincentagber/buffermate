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

export default function MarketingFaq() {
  const [selectedCategory, setSelectedCategory] = useState<'business' | 'creator'>('business');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((f) => f.category === selectedCategory);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 md:py-28 bg-[#E2E0D5] border-b border-[#141416]/15">
      <div className="max-w-[850px] mx-auto px-5 md:px-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#000000] leading-tight">
            Got questions? <br />
            <span className="font-editorial-italic font-normal text-[#141416]">We&apos;ve got answers.</span>
          </h2>
          <p className="font-medium text-base text-[#141416]/75 max-w-xl mx-auto">
            Everything you need to know about scheduling, supported networks, and automated comment leads.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-white border border-[#E2E0D5] shadow-xs">
            <button
              onClick={() => {
                setSelectedCategory('business');
                setOpenIndex(0);
              }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'business'
                  ? 'bg-[#00784D] text-white shadow-xs'
                  : 'text-[#6B6B60] hover:text-[#1A202C]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>For Agencies &amp; Brands</span>
            </button>
            <button
              onClick={() => {
                setSelectedCategory('creator');
                setOpenIndex(0);
              }}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'creator'
                  ? 'bg-[#00784D] text-white shadow-xs'
                  : 'text-[#6B6B60] hover:text-[#1A202C]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>For Solo Creators</span>
            </button>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-[24px] border border-[#E2E0D5] p-6 md:p-7 hover:border-[#C4C4B8] hover:shadow-md transition-all text-[#1A202C]"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <span className="font-extrabold text-[17px] md:text-[18px] text-[#1A202C] leading-snug">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#E2E0D5] text-[#1A202C] flex items-center justify-center shrink-0 transition-colors">
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

        {/* View Full FAQ Link */}
        <div className="text-center pt-2">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#141416] hover:text-[#000000] underline decoration-[#00784D] decoration-2"
          >
            <span>View all questions in Knowledge Center →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
