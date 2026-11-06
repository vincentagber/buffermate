'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowUpRight, Search, Sparkles } from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingFooter from '@/components/marketing/Footer';
import CtaBanner from '@/components/marketing/CtaBanner';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  readTime: string;
  publishedAt: string;
  featured?: boolean;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

const POSTS: BlogPost[] = [
  {
    slug: 'why-multi-platform-scheduling-fails-without-heatmaps',
    title: 'Why Multi-Platform Scheduling Fails Without Peak Engagement Heatmaps',
    excerpt: 'Posting at the same static time across Instagram, TikTok, and X burns 60% of your potential reach. Here is how predictive audience clustering solves cross-channel distribution.',
    category: 'Intelligence',
    categoryColor: 'bg-purple-50 text-purple-700 border-purple-200',
    readTime: '4 min read',
    publishedAt: 'Nov 4, 2026',
    featured: true,
    author: {
      name: 'Alex Morgan',
      role: 'Growth Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
  },
  {
    slug: '2026-playbook-automating-social-lead-capture-comment-keywords',
    title: 'The 2026 Playbook: Automating B2B Lead Capture with Comment Keywords',
    excerpt: 'How high-growth agencies replace passive "link in bio" drop-offs with instant, autonomous direct message dispatches triggered by high-intent comment keywords.',
    category: 'Playbook',
    categoryColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    readTime: '6 min read',
    publishedAt: 'Nov 2, 2026',
    author: {
      name: 'Sarah Chen',
      role: 'Head of Social Engineering',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    },
  },
  {
    slug: 'connecting-instagram-and-tiktok-apis-securely-oauth-2',
    title: 'Connecting Instagram Graph API & TikTok Creator API Securely via OAuth 2.0',
    excerpt: 'A technical deep-dive into token refreshing, zero password storage policies, and why enterprise SaaS tools rely strictly on AES-256 encrypted official API handshakes.',
    category: 'Security & APIs',
    categoryColor: 'bg-blue-50 text-blue-700 border-blue-200',
    readTime: '5 min read',
    publishedAt: 'Oct 29, 2026',
    author: {
      name: 'David Okafor',
      role: 'API Infrastructure Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
  },
  {
    slug: 'anatomy-of-a-viral-b2b-social-hook-in-2026',
    title: 'Anatomy of a High-Converting Social Hook: Analyzing 500,000 Posts',
    excerpt: 'The curiosity gap, counter-intuitive opening lines, and how Google Gemini 2.0 predicts virality scores with 94% accuracy before publishing.',
    category: 'Intelligence',
    categoryColor: 'bg-purple-50 text-purple-700 border-purple-200',
    readTime: '7 min read',
    publishedAt: 'Oct 24, 2026',
    author: {
      name: 'Elena Rostova',
      role: 'Data Scientist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    },
  },
  {
    slug: 'how-to-scale-agency-client-retention-with-white-label-reports',
    title: 'How Agencies Retain 92% of Social Clients with White-Label PDF Analytics',
    excerpt: 'Clients cancel when they cannot see direct revenue attribution. Learn how to present comment conversions, click-throughs, and follower ROI clearly.',
    category: 'Agency Playbook',
    categoryColor: 'bg-amber-50 text-amber-700 border-amber-200',
    readTime: '5 min read',
    publishedAt: 'Oct 18, 2026',
    author: {
      name: 'Alex Morgan',
      role: 'Growth Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
  },
  {
    slug: 'avoiding-social-media-shadowbans-rate-limiting-guardrails',
    title: 'Avoiding Social Media Shadowbans: Human Delay & Rate-Limiting Guardrails',
    excerpt: 'Why high-frequency bots get banned and how Buffermate’s randomized 15-45 second anti-detection algorithms keep creator accounts completely safe.',
    category: 'Security & APIs',
    categoryColor: 'bg-blue-50 text-blue-700 border-blue-200',
    readTime: '6 min read',
    publishedAt: 'Oct 12, 2026',
    author: {
      name: 'David Okafor',
      role: 'API Infrastructure Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
  },
];

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Intelligence', 'Playbook', 'Security & APIs', 'Agency Playbook'];

  const filteredPosts = POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = POSTS.find((p) => p.featured) || POSTS[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      <MarketingNavbar />

      <main className="space-y-16 sm:space-y-24 py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Insights on Social Intelligence & Automation</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.08]">
            Latest from the blog.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            In-depth playbooks, API security breakdowns, and algorithmic growth strategies from the team engineering Buffermate AI.
          </p>
        </div>

        {/* Search & Category Filter Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#141416] text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-slate-200/90 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Featured Post Hero */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Featured Article
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {featuredPost.readTime}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight hover:text-purple-900 transition-colors">
              {featuredPost.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {featuredPost.excerpt}
            </p>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {featuredPost.author.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {featuredPost.author.role} · {featuredPost.publishedAt}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 hover:text-purple-900">
                <span>Read Full Article</span>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${post.categoryColor}`}>
                    {post.category}
                  </span>
                  <span className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-purple-900 transition-colors">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-none">
                      {post.author.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {post.publishedAt}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200/80 group-hover:bg-[#141416] group-hover:text-white flex items-center justify-center text-slate-400 transition-all shadow-2xs">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <CtaBanner />
      </main>

      <MarketingFooter />
    </div>
  );
}

