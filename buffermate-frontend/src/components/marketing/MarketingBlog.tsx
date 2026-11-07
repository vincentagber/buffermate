'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function MarketingBlog() {
  const featuredArticles = BLOG_POSTS.slice(0, 3);

  return (
    <section className="py-20 md:py-28 max-w-[1200px] mx-auto w-full px-5 md:px-10 space-y-12 border-b border-[#141416]/15">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-hero-sans font-normal tracking-tight text-[#000000]">
            Latest from the <span className="font-editorial-italic text-[#141416]">blog</span>
            <span className="text-[#00784D] font-black">.</span>
          </h2>
          <p className="font-medium text-base text-[#141416]/75 max-w-xl">
            Guides, tutorials, and algorithmic insights on social media management, automation, and audience growth.
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center space-x-1.5 text-sm font-bold text-[#141416] hover:text-[#000000] underline decoration-[#00784D] decoration-2 transition-colors self-start sm:self-auto shrink-0"
        >
          <span>View all 9 guides</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3 Dark Editorial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group bg-[#141416] rounded-[28px] p-8 border border-[#141416] hover:border-[#07B979]/50 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Read Time */}
              <div className="flex items-center justify-between mb-5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00784D]/30 text-[#07B979] border border-[#07B979]/30">
                  {article.category}
                </span>
                <span className="text-xs text-[#E2E0D5]/60 font-medium">
                  {article.readTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-[19px] text-[#E2E0D5] group-hover:text-[#07B979] transition-colors leading-snug mb-3">
                {article.title}
              </h3>

              {/* Description */}
              <p className="font-medium text-[14px] text-[#E2E0D5]/70 leading-relaxed line-clamp-3 mb-6">
                {article.description}
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-5 border-t border-[#E2E0D5]/15 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={article.authorAvatar}
                  alt={article.author}
                  className="w-8 h-8 rounded-full object-cover border border-[#E2E0D5]/30"
                />
                <div>
                  <div className="text-xs font-bold text-[#E2E0D5]">
                    {article.author}
                  </div>
                  <div className="text-[11px] text-[#E2E0D5]/60">
                    {article.date}
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#000000] text-[#07B979] border border-[#07B979]/30 group-hover:bg-[#00784D] group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
