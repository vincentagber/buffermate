'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';

interface Article {
  slug: string;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

const ARTICLES: Article[] = [
  {
    slug: 'why-multi-platform-scheduling-fails-without-heatmaps',
    category: 'Buffermate 101',
    categoryColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    title: 'Why Multi-Platform Scheduling Fails Without Peak Engagement Heatmaps',
    excerpt: 'Posting at the same static time across Instagram, TikTok, and X burns 60% of your potential reach. Here is how predictive audience clustering solves cross-channel distribution.',
    readTime: '4 min read',
    publishedAt: 'Nov 4, 2026',
    author: {
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
  },
  {
    slug: '2026-playbook-automating-social-lead-capture-comment-keywords',
    category: 'Growth & Marketing',
    categoryColor: 'bg-purple-50 text-purple-800 border-purple-200',
    title: 'The 2026 Playbook: Automating B2B Lead Capture with Comment Keywords',
    excerpt: 'How high-growth agencies replace passive "link in bio" drop-offs with instant, autonomous direct message dispatches triggered by high-intent comment keywords.',
    readTime: '6 min read',
    publishedAt: 'Nov 2, 2026',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    },
  },
  {
    slug: 'connecting-instagram-and-tiktok-apis-securely-oauth-2',
    category: 'API & Security',
    categoryColor: 'bg-blue-50 text-blue-800 border-blue-200',
    title: 'Connecting Instagram Graph API & TikTok Creator API Securely via OAuth 2.0',
    excerpt: 'A technical deep-dive into token refreshing, zero password storage policies, and why enterprise SaaS tools rely strictly on AES-256 encrypted official API handshakes.',
    readTime: '5 min read',
    publishedAt: 'Oct 29, 2026',
    author: {
      name: 'David Okafor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
  },
];

export default function KobbleBlog() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header matching Kobble */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141416]">
            Latest from the blog<span className="text-[#52832B]">.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            Guides, tutorials, and algorithmic insights on social media management, automation, and audience growth.
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-[#52832B] hover:text-[#436e22] transition-colors self-start sm:self-auto"
        >
          <span>View all articles</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3 Editorial Cards matching Kobble */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {ARTICLES.map((article) => (
          <article
            key={article.slug}
            className="group flex flex-col justify-between bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E4DC] shadow-xs hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${article.categoryColor}`}>
                  {article.category}
                </span>
                <span className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-[#141416] tracking-tight group-hover:text-[#52832B] transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#141416] leading-none">
                    {article.author.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {article.publishedAt}
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[#141416] group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

