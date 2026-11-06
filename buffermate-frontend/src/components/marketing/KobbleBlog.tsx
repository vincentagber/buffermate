'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function KobbleBlog() {
  const featuredArticles = BLOG_POSTS.slice(0, 3);

  return (
    <section className="py-20 md:py-28 max-w-[1200px] mx-auto w-full px-5 md:px-10 space-y-12 border-b border-[#E2E0D5]">
      {/* Header matching Kobble */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A202C]">
            Latest from the blog<span className="text-[#6F9C3E]">.</span>
          </h2>
          <p className="font-medium text-base text-[#6B6B60] max-w-xl">
            Guides, tutorials, and algorithmic insights on social media management, automation, and audience growth.
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center space-x-1.5 text-sm font-bold text-[#6F9C3E] hover:underline transition-colors self-start sm:self-auto shrink-0"
        >
          <span>View all 9 guides</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3 White Editorial Cards matching Kobble */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group bg-white rounded-[28px] p-8 border border-[#E2E0D5] hover:border-[#C4C4B8] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Read Time */}
              <div className="flex items-center justify-between mb-5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${article.categoryColor}`}>
                  {article.category}
                </span>
                <span className="text-xs text-[#6B6B60] font-medium">
                  {article.readTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-[19px] text-[#1A202C] group-hover:text-[#6F9C3E] transition-colors leading-snug mb-3">
                {article.title}
              </h3>

              {/* Description */}
              <p className="font-medium text-[14px] text-[#6B6B60] leading-relaxed line-clamp-3 mb-6">
                {article.description}
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-5 border-t border-[#EFECE5] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={article.authorAvatar}
                  alt={article.author}
                  className="w-8 h-8 rounded-full object-cover border border-[#E2E0D5]"
                />
                <div>
                  <div className="text-xs font-bold text-[#1A202C]">
                    {article.author}
                  </div>
                  <div className="text-[11px] text-[#6B6B60]">
                    {article.date}
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#F5F4F0] group-hover:bg-[#6F9C3E] group-hover:text-white flex items-center justify-center text-[#1A202C] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
