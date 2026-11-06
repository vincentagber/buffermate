'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Clock, Tag } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

const ARTICLES: Article[] = [
  {
    slug: 'why-multi-platform-scheduling-fails-without-heatmaps',
    title: 'Why Multi-Platform Scheduling Fails Without Peak Engagement Heatmaps',
    excerpt: 'Posting at the same static time across Instagram, TikTok, and X burns 60% of your potential reach. Here is how predictive audience clustering solves cross-channel distribution.',
    category: 'Intelligence',
    categoryColor: 'bg-purple-50 text-purple-700 border-purple-200',
    readTime: '4 min read',
    publishedAt: 'Nov 4, 2026',
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
];

export default function BlogResourcesSection() {
  return (
    <section className="space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-slate-700" />
            <span>Editorial & Engineering</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Latest from the blog.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
            Actionable playbooks, API security breakdowns, and algorithmic insights to help your brand compound reach.
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-900 hover:text-purple-700 transition-colors group self-start md:self-auto"
        >
          <span>View all articles</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {ARTICLES.map((article) => (
          <article
            key={article.slug}
            className="group flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="space-y-4">
              {/* Category Pill & Reading Time */}
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${article.categoryColor}`}>
                  {article.category}
                </span>
                <span className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-purple-900 transition-colors">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-none">
                    {article.author.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {article.publishedAt}
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
    </section>
  );
}

