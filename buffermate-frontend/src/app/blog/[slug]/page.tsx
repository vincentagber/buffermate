import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  CheckCircle2,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import MarketingNavbar from '@/components/marketing/Navbar';
import MarketingCta from '@/components/marketing/MarketingCta';
import MarketingFooter from '@/components/marketing/Footer';
import { BLOG_POSTS } from '@/lib/blog-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Related posts (excluding current post)
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1A202C] relative selection:bg-[#6F9C3E]/20 selection:text-[#6F9C3E]">
      {/* Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#6F9C3E]/12 to-transparent blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#FF882A]/8 to-transparent blur-[130px]" />
      </div>

      <MarketingNavbar />

      <main className="flex-1 flex flex-col w-full relative">
        {/* Article Header & Breadcrumbs */}
        <section className="relative overflow-hidden w-full px-5 md:px-10 pt-12 pb-16 md:py-20 border-b border-[#E2E0D5]">
          <div className="max-w-[850px] mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6B60] mb-6">
              <Link href="/blog" className="hover:text-[#1A202C] flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Guides</span>
              </Link>
              <ChevronRight className="w-3 h-3 text-[#A0AEC0]" />
              <span className="text-[#1A202C] font-bold line-clamp-1">{post.title}</span>
            </div>

            {/* Pill & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${post.categoryColor}`}>
                {post.category}
              </span>
              <span className="text-xs font-medium text-[#6B6B60] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </span>
              <span className="text-xs font-medium text-[#6B6B60] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.date}</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-extrabold text-[36px] sm:text-[48px] md:text-[56px] text-[#1A202C] leading-[1.12] mb-6 tracking-tight">
              {post.title}
            </h1>

            {/* Subtitle */}
            <p className="font-medium text-[18px] md:text-[20px] text-[#6B6B60] leading-relaxed mb-8">
              {post.description}
            </p>

            {/* Author Badge */}
            <div className="flex items-center gap-3.5 pt-6 border-t border-[#E2E0D5]">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="w-11 h-11 rounded-full object-cover border border-[#E2E0D5]"
              />
              <div>
                <div className="font-bold text-sm text-[#1A202C]">
                  {post.author}
                </div>
                <div className="text-xs text-[#6B6B60]">
                  {post.authorRole}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Body Content */}
        <section className="max-w-[850px] mx-auto w-full px-5 md:px-10 py-16">
          {/* Key Takeaways Box */}
          <div className="bg-white rounded-[24px] p-6 md:p-8 border border-[#E2E0D5] mb-12 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6F9C3E] uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Key Editorial Takeaways</span>
            </div>
            <div className="space-y-3">
              {post.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#6F9C3E]/10 text-[#6F9C3E] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <p className="text-sm md:text-[15px] font-semibold text-[#1A202C] leading-snug">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Formatted Paragraphs */}
          <div className="space-y-6 font-medium text-[17px] md:text-[18px] text-[#4A5568] leading-relaxed">
            {post.content.map((paragraph, idx) => (
              <p key={idx} className="leading-[1.75]">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Author Callout Box */}
          <div className="mt-14 p-8 bg-white rounded-[24px] border border-[#E2E0D5] flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md shrink-0"
            />
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-[#1A202C]">
                Written by {post.author}
              </h3>
              <p className="text-xs text-[#6B6B60] leading-relaxed">
                Contributing editor at Buffermate AI, researching autonomous creator publishing workflows, official OAuth protocols, and algorithmic growth architectures.
              </p>
            </div>
          </div>
        </section>

        {/* Related Articles Section */}
        <section className="w-full bg-[#FAF8F4] border-t border-b border-[#E2E0D5] py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-extrabold text-[28px] md:text-[34px] text-[#1A202C]">
                Related Guides
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#6F9C3E] hover:underline"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group bg-white rounded-[24px] p-7 border border-[#E2E0D5] hover:border-[#C4C4B8] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${related.categoryColor}`}>
                        {related.category}
                      </span>
                      <span className="text-xs text-[#6B6B60]">
                        {related.readTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-[18px] text-[#1A202C] group-hover:text-[#6F9C3E] transition-colors leading-snug mb-3">
                      {related.title}
                    </h3>

                    <p className="font-medium text-[14px] text-[#6B6B60] leading-relaxed line-clamp-2 mb-6">
                      {related.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs text-[#6B6B60]">
                    <span className="font-semibold text-[#1A202C]">{related.author}</span>
                    <ArrowRight className="w-4 h-4 text-[#A0AEC0] group-hover:text-[#6F9C3E] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Dual Closing Call-to-Action */}
        <MarketingCta />
      </main>

      <MarketingFooter />
    </div>
  );
}

