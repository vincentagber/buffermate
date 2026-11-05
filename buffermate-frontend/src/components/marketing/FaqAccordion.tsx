'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, Minus, Search, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: 'general' | 'features' | 'billing';
}

const FAQS: FaqItem[] = [
  {
    category: 'general',
    question: 'What is Buffermate AI and how does it work?',
    answer:
      'Buffermate AI is an autonomous social media management and lead conversion platform. It combines cross-platform scheduling (Instagram, TikTok, Threads, Facebook, X) with Google Gemini-powered viral hook generation and 24/7 automated comment-to-DM lead capture bots.',
  },
  {
    category: 'features',
    question: 'Which social media platforms are currently supported?',
    answer:
      'Buffermate AI officially integrates with Instagram (Reels & Feed), TikTok (Videos), Meta Threads, Facebook Pages, X (Twitter API v2), and WhatsApp Direct. All integrations connect securely through official OAuth 2.0 developer APIs.',
  },
  {
    category: 'features',
    question: 'How does AI content and viral hook generation work?',
    answer:
      'Our AI Script Studio utilizes Google Gemini 2.0 and GPT-4 to generate multi-channel captions, curiosity-driven hooks, and tailored call-to-actions based on your brand guidelines, target audience persona, and optimal character limits.',
  },
  {
    category: 'features',
    question: 'What are 24/7 Automated Comment Keyword Lead Bots?',
    answer:
      'When your audience comments a designated keyword (such as "PRICE", "GUIDE", or "BLUEPRINT") on your posts or reels, Buffermate AI automatically detects the comment and dispatches a personalized direct message containing your link within seconds—with smart anti-detection pacing.',
  },
  {
    category: 'features',
    question: 'Can I manage multiple accounts per platform?',
    answer:
      'Yes. On the Pro Growth and Scale & Agency plans, you can connect and publish to unlimited social accounts across all supported networks simultaneously.',
  },
  {
    category: 'billing',
    question: 'How does payment processing and subscription billing work?',
    answer:
      'All payments are processed securely through Bachs (https://docs.bachs.io), a global billing platform supporting international cards, African bank transfers (NGN, GHS, KES, ZAR), mobile money (M-Pesa, MTN MoMo), and stablecoins (USDT/USDC).',
  },
  {
    category: 'billing',
    question: 'Can I cancel or downgrade my subscription at any time?',
    answer:
      'Absolutely. There are no contracts or cancellation fees. You can downgrade to the Starter Free tier or pause your plan at any time directly from your workspace Settings view.',
  },
  {
    category: 'general',
    question: 'Is my account login information and OAuth token safe?',
    answer:
      'Yes. Buffermate AI never stores your social media passwords. All connections use official OAuth 2.0 tokens secured with AES-256 standard encryption on Supabase verified sessions.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'features' | 'billing'>('all');

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-full text-xs font-semibold overflow-x-auto">
          {(['all', 'general', 'features', 'billing'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full capitalize transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200/90 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-2xs"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'bg-white border-slate-300 shadow-2xs'
                    : 'bg-white/70 border-slate-200/80 hover:bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-5 sm:px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No questions found matching &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}

