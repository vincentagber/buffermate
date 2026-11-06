'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingCta from '@/components/marketing/MarketingCta';
import MarketingFooter from '@/components/marketing/Footer';
import { BLOG_POSTS, BlogPost } from '@/lib/blog-data';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const categories = ['ALL', 'BUFFERMATE 101', 'AI STRATEGY', 'GROWTH & LEAD GEN', 'PRODUCT UPDATES'];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const displayedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1A202C] relative selection:bg-[#6F9C3E]/20 selection:text-[#6F9C3E]">
      {/* Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#6F9C3E]/12 to-transparent blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#FF882A]/8 to-transparent blur-[130px]" />
      </div>

      <MarketingNavbar />

      <main className="flex-1 flex flex-col w-full relative">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden w-full px-5 md:px-10 py-16 md:py-24 border-b border-[#E2E0D5]">
          <div className="absolute inset-0 pointer-events-none overflow-hidden text-[#1A202C] opacity-[0.03]">
            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute -top-16 -left-10 rotate-12">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10M6 10h10" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[30%] right-[10%] rotate-12">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>

          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6F9C3E]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-[800px] mx-auto text-center animate-slide-up-fade">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#E2E0D5] shadow-xs mb-6 mx-auto">
              <div className="w-2 h-2 rounded-full bg-[#6F9C3E] animate-pulse" />
              <span className="font-bold text-[12px] text-[#1A202C] tracking-wide uppercase">
                Editorial Insights
              </span>
            </div>

            <h1 className="font-extrabold text-[42px] sm:text-[56px] md:text-[68px] text-[#1A202C] leading-[1.08] mb-6 tracking-tight">
              Insights on <span className="text-[#6F9C3E]">Autonomous Social Growth</span>.
            </h1>

            <p className="font-medium text-[18px] md:text-[20px] text-[#6B6B60] leading-relaxed max-w-[700px] mx-auto mb-8">
              Expert playbooks, algorithm engineering teardowns, and creator monetization strategies from the Buffermate core team.
            </p>

            {/* Live Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search articles by keyword, topic, or author..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-[#E2E0D5] text-sm text-[#1A202C] font-medium shadow-xs focus:outline-none focus:border-[#6F9C3E] focus:ring-2 focus:ring-[#6F9C3E]/20 transition-all placeholder:text-[#A0AEC0]"
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CATEGORY PILL FILTER */}
        {/* ========================================================================= */}
        <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 pt-10 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1A202C] text-white shadow-md'
                    : 'bg-white hover:bg-slate-50 text-[#6B6B60] border border-[#E2E0D5]'
                }`}
              >
                {cat === 'ALL' ? 'All Guides' : cat}
              </button>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. ARTICLES GRID */}
        {/* ========================================================================= */}
        <section className="max-w-[1200px] mx-auto w-full px-5 md:px-10 py-10 md:py-16">
          {displayedPosts.length === 0 ? (
            <div className="bg-white rounded-[24px] p-12 text-center border border-[#E2E0D5] max-w-lg mx-auto space-y-4">
              <BookOpen className="w-8 h-8 text-[#A0AEC0] mx-auto" />
              <h3 className="font-bold text-lg text-[#1A202C]">No articles found</h3>
              <p className="text-sm text-[#6B6B60]">
                Try adjusting your search query or switching categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="px-5 py-2.5 rounded-full bg-[#1A202C] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-[28px] p-8 border border-[#E2E0D5] hover:border-[#C4C4B8] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${post.categoryColor}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-[#6B6B60] font-medium">
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="font-extrabold text-[20px] text-[#1A202C] group-hover:text-[#6F9C3E] transition-colors leading-snug mb-3">
                      {post.title}
                    </h2>

                    <p className="font-medium text-[15px] text-[#6B6B60] leading-relaxed line-clamp-3 mb-6">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#EFECE5] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-8 h-8 rounded-full object-cover border border-[#E2E0D5]"
                      />
                      <div>
                        <div className="font-bold text-xs text-[#1A202C] leading-none">
                          {post.author}
                        </div>
                        <div className="text-[11px] text-[#6B6B60] mt-0.5">
                          {post.date}
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
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-full bg-white border border-[#E2E0D5] text-[#1A202C] hover:bg-[#F5F4F0] disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentPage === idx + 1
                      ? 'bg-[#1A202C] text-white shadow-xs'
                      : 'bg-white border border-[#E2E0D5] text-[#1A202C] hover:bg-[#F5F4F0]'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-full bg-white border border-[#E2E0D5] text-[#1A202C] hover:bg-[#F5F4F0] disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 4. DUAL CLOSING CALL-TO-ACTION */}
        {/* ========================================================================= */}
        <MarketingCta />
      </main>

      <MarketingFooter />
    </div>
  );
}
