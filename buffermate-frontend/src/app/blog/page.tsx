'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import KobbleCta from '@/components/marketing/KobbleCta';
import MarketingFooter from '@/components/marketing/Footer';

interface Post {
  id: string;
  category: string;
  categoryStyle: string;
  title: string;
  description: string;
  author: string;
  date: string;
}

const POSTS: Post[] = [
  {
    id: 'post-1',
    category: 'BUFFERMATE 101',
    categoryStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'Why Buffermate Connects Exclusively via Official APIs',
    description: 'Understanding why we collect OAuth 2.0 authorization tokens directly from Meta and TikTok, and what it means for your account safety.',
    author: 'Buffermate Trust & Safety',
    date: 'Nov 4, 2026',
  },
  {
    id: 'post-2',
    category: 'GROWTH & MARKETING',
    categoryStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Introducing the Buffermate Creator Referral Program',
    description: 'A comprehensive guide to earning 20% recurring monthly revenue on every workspace referred to Buffermate AI.',
    author: 'Growth Team',
    date: 'Nov 2, 2026',
  },
  {
    id: 'post-3',
    category: 'BUFFERMATE 101',
    categoryStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'How to Stand Out on Social Feeds with Curiosity Hooks',
    description: 'Learn the daily posting cadence, opening curiosity triggers, and hashtag clustering strategies used by top-performing creators.',
    author: 'Editorial Staff',
    date: 'Oct 29, 2026',
  },
  {
    id: 'post-4',
    category: 'BUFFERMATE 101',
    categoryStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'How to Create Private Lead Funnels with Comment Keywords',
    description: 'Learn how to automatically dispatch direct messages with unlisted resources when followers comment specific triggers on your posts.',
    author: 'Lead Gen Team',
    date: 'Oct 24, 2026',
  },
  {
    id: 'post-5',
    category: 'PRODUCT UPDATES',
    categoryStyle: 'bg-blue-50 text-blue-800 border-blue-200',
    title: 'Buffermate Now Allows Up to 6 Connected Social Channels',
    description: 'We have updated our queue infrastructure to support simultaneous publishing across Instagram, TikTok, Threads, Facebook, X, and WhatsApp.',
    author: 'Product Team',
    date: 'Oct 19, 2026',
  },
  {
    id: 'post-6',
    category: 'PRODUCT UPDATES',
    categoryStyle: 'bg-blue-50 text-blue-800 border-blue-200',
    title: 'Platform Update: Predictive Peak Heatmap Engine Live',
    description: 'Our new algorithmic timing engine analyzes 2.4 million engagement points to calculate the optimal hour to dispatch content for maximum initial reach.',
    author: 'Data Science Team',
    date: 'Oct 14, 2026',
  },
  {
    id: 'post-7',
    category: 'BUFFERMATE 101',
    categoryStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'Why Was My Automated DM Dispatch Delayed?',
    description: 'Learn how our randomized human delay algorithm (15s–45s) protects your accounts from algorithmic spam triggers and shadowbans.',
    author: 'Support Engineering',
    date: 'Oct 10, 2026',
  },
  {
    id: 'post-8',
    category: 'BUFFERMATE 101',
    categoryStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'What Happens When You Delete a Queued Post?',
    description: 'Learn exactly what happens when you cancel or edit a post scheduled in the queue, and how cloud asset caches are purged safely.',
    author: 'Support Engineering',
    date: 'Oct 5, 2026',
  },
  {
    id: 'post-9',
    category: 'GROWTH & MARKETING',
    categoryStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    title: 'Setting Fair Pricing as an Agency Social Manager',
    description: 'How modern digital agencies package autonomous social scheduling, viral script generation, and lead conversion reports into high-margin retainer contracts.',
    author: 'Agency Growth Team',
    date: 'Sep 29, 2026',
  },
];

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');

  const filtered = POSTS.filter((p) => {
    const matchesCat =
      category === 'All Categories' ||
      (category === '101' && p.category.includes('101')) ||
      (category === 'Growth' && p.category.includes('GROWTH')) ||
      (category === 'Product' && p.category.includes('PRODUCT'));
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F6F4EE] font-sans text-slate-900 selection:bg-[#52832B]/20 selection:text-[#52832B]">
      <MarketingNavbar />

      <main className="overflow-hidden">
        {/* Blog Hero matching Kobble */}
        <section className="pt-12 sm:pt-16 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-[#E7E4DC] text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#52832B]" />
            <span>OUR BLOG</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[#141416] leading-[1.08] max-w-4xl mx-auto">
            Insights on Social <br className="hidden sm:inline" />
            <span className="text-[#52832B]">Intelligence.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Thoughts, tutorials, and case studies from the Buffermate team on how to build, scale, and automate in the modern creator economy.
          </p>
        </section>

        {/* Search & Category Filter matching Kobble */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto sm:mx-0">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#E7E4DC] text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#52832B] shadow-2xs"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full sm:w-48">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-8 py-2 bg-white rounded-xl border border-[#E7E4DC] text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#52832B] shadow-2xs cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="101">Buffermate 101</option>
                <option value="Growth">Growth &amp; Marketing</option>
                <option value="Product">Product Updates</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* 9 Editorial Cards (3x3 Grid) matching Kobble */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E4DC] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="space-y-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${post.categoryStyle}`}
                  >
                    {post.category}
                  </span>

                  <h3 className="text-base font-bold text-[#141416] tracking-tight leading-snug hover:text-[#52832B] transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-[#52832B]" />
                  <span className="font-medium text-slate-600">{post.author}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination matching Kobble */}
          <div className="pt-12 flex items-center justify-between text-xs text-slate-500 border-t border-[#E7E4DC] mt-12">
            <div>Showing 1–{filtered.length} of {POSTS.length} posts</div>
            <div className="flex items-center space-x-3">
              <button
                disabled
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#E7E4DC] bg-white text-slate-400 cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <span className="font-bold text-[#141416]">1 / 3</span>
              <button className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#E7E4DC] bg-white text-slate-700 hover:bg-slate-50 cursor-pointer">
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Dual Closing CTA */}
        <KobbleCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
