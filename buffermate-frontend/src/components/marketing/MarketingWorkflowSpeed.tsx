'use client';

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Eye
} from 'lucide-react';
import { InstagramIcon, TikTokIcon, ThreadsIcon, XIcon } from '@/components/SocialIcons';

export default function MarketingWorkflowSpeed() {
  const [activeTab, setActiveTab] = useState<'pending' | 'published'>('pending');
  const [approvedPosts, setApprovedPosts] = useState<string[]>([]);

  const handleApprove = (id: string) => {
    setApprovedPosts((prev) => [...prev, id]);
  };

  return (
    <section className="py-20 md:py-28 bg-[#E2E0D5] border-b border-[#141416]/15">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 space-y-20 sm:space-y-28">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-hero-sans font-normal tracking-[-0.04em] text-[#000000] leading-tight">
            Built for <span className="font-editorial-italic text-[#141416] font-normal tracking-tight">speed.</span>
          </h2>
          <p className="font-hero-sans font-normal text-base sm:text-lg text-[#141416]/75 leading-relaxed tracking-tight">
            Our platform is designed to make scheduling and scaling your social publishing as fast and frictionless as possible.
          </p>
        </div>

        {/* STAGE 1: Post your content in minutes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Interactive Phone Mockup Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-[#141416] rounded-[28px] p-6 sm:p-8 shadow-2xl border border-[#141416] space-y-6 text-[#E2E0D5]">
              {/* Green Success Badge */}
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="w-14 h-14 rounded-2xl bg-[#00784D]/30 text-[#07B979] border border-[#07B979]/40 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#E2E0D5]">Post Scheduled!</h3>
                  <p className="text-xs text-[#E2E0D5]/70 mt-1 font-medium">
                    Your post is now active in the autonomous queue.
                  </p>
                </div>
              </div>

              {/* Metric Row */}
              <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#E2E0D5]/15 text-center">
                <div className="space-y-0.5">
                  <div className="text-xs text-[#E2E0D5]/60 font-medium">Channels</div>
                  <div className="text-base font-extrabold text-[#E2E0D5]">4 Synced</div>
                </div>
                <div className="space-y-0.5 border-x border-[#E2E0D5]/15">
                  <div className="text-xs text-[#E2E0D5]/60 font-medium">Dispatch</div>
                  <div className="text-base font-extrabold text-[#07B979]">7:45 PM</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs text-[#E2E0D5]/60 font-medium">Auto-DM</div>
                  <div className="text-base font-extrabold text-[#07B979]">Active</div>
                </div>
              </div>

              {/* Preview Snippet */}
              <div className="p-4 bg-[#000000]/40 rounded-2xl border border-[#E2E0D5]/15 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#E2E0D5]">
                  <Sparkles className="w-3.5 h-3.5 text-[#07B979]" />
                  <span>AI Hook Score: 98/100 · High Curiosity</span>
                </div>
                <p className="text-xs text-[#E2E0D5]/70 line-clamp-2 italic font-medium">
                  &ldquo;Most businesses spend $5,000/mo on social ads without fixing this one conversion leak first...&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right: Stage 1 Copy & Number 1 */}
          <div className="lg:col-span-6 space-y-6">
            <div className="w-10 h-10 rounded-full bg-[#00784D] text-white font-black text-base flex items-center justify-center shadow-xs border border-[#07B979]/30">
              1
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#000000] tracking-tight">
                Post your content in minutes.
              </h3>
              <p className="font-medium text-sm sm:text-base text-[#141416]/75 leading-relaxed">
                Add a title, pick your channels, set your schedule time, and describe what needs to be published. Your post queues instantly — or use AI to craft the entire multi-channel copy with just your voice.
              </p>
            </div>

            <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-[#141416]/80 font-semibold">
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-[#00784D] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>6+ connected social networks with one click</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-[#00784D] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>AI voice &amp; prompt-powered copy generation</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-[#00784D] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Automatic 9:16 and 1:1 image and video aspect ratio formatting</span>
              </li>
            </ul>
          </div>
        </div>

        {/* STAGE 2: Review work. Publish with confidence. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-8">
          {/* Left: Stage 2 Copy & Number 2 */}
          <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
            <div className="w-10 h-10 rounded-full bg-[#00784D] text-white font-black text-base flex items-center justify-center shadow-xs border border-[#07B979]/30">
              2
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#000000] tracking-tight">
                Review work. Publish with confidence.
              </h3>
              <p className="font-medium text-sm sm:text-base text-[#141416]/75 leading-relaxed">
                Every queued post lands in your review dashboard. Inspect live previews across Instagram, TikTok, and X before release. Algorithmically timed dispatches guarantee maximum audience exposure.
              </p>
            </div>

            <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-[#141416]/80 font-semibold">
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-[#00784D] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Approve or edit each submission before dispatch</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-[#00784D] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Dispatches released only at verified peak audience heatmaps</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-[#00784D] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Autonomous 24/7 comment keyword DM funnels active</span>
              </li>
            </ul>
          </div>

          {/* Right: Interactive Review Queue Card */}
          <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
            <div className="w-full max-w-md bg-[#141416] rounded-[28px] p-6 shadow-2xl border border-[#141416] space-y-4 text-[#E2E0D5]">
              {/* Header with pill tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E0D5]/15">
                <div className="text-xs font-bold text-[#E2E0D5]">Review Queue</div>
                <div className="flex space-x-1 bg-[#000000]/60 p-1 rounded-xl border border-[#E2E0D5]/10">
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'pending'
                        ? 'bg-[#00784D] text-white shadow-xs'
                        : 'text-[#E2E0D5]/60 hover:text-[#E2E0D5]'
                    }`}
                  >
                    Pending (3)
                  </button>
                  <button
                    onClick={() => setActiveTab('published')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'published'
                        ? 'bg-[#00784D] text-white shadow-xs'
                        : 'text-[#E2E0D5]/60 hover:text-[#E2E0D5]'
                    }`}
                  >
                    Scheduled
                  </button>
                </div>
              </div>

              {/* Queued Submission Item 1 */}
              <div className="p-3.5 rounded-2xl border border-[#E2E0D5]/15 bg-[#000000]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-[#00784D]/30 border border-[#07B979]/40 flex items-center justify-center">
                      <InstagramIcon className="w-4 h-4 text-[#07B979]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#E2E0D5]">Instagram Reel</div>
                      <div className="text-[10px] text-[#E2E0D5]/60">Scheduled for 7:45 PM</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-white bg-[#00784D] px-2.5 py-0.5 rounded-full">
                    Approved
                  </span>
                </div>
                <p className="text-xs text-[#E2E0D5]/70 line-clamp-1 italic font-medium">
                  &ldquo;The 3 reasons your agency website isn&apos;t converting high-ticket clients...&rdquo;
                </p>
              </div>

              {/* Queued Submission Item 2 */}
              <div className="p-3.5 rounded-2xl border border-[#E2E0D5]/15 bg-[#000000]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-[#00784D]/30 border border-[#07B979]/40 flex items-center justify-center">
                      <TikTokIcon className="w-4 h-4 text-[#07B979]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#E2E0D5]">TikTok Short</div>
                      <div className="text-[10px] text-[#E2E0D5]/60">Scheduled for 8:15 PM</div>
                    </div>
                  </div>
                  {approvedPosts.includes('post-tiktok') ? (
                    <span className="text-[10px] font-bold text-white bg-[#00784D] px-2.5 py-0.5 rounded-full">
                      Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove('post-tiktok')}
                      className="text-[10px] font-bold text-white bg-[#00784D] hover:bg-[#07B979] px-3 py-1 rounded-full transition-colors cursor-pointer"
                    >
                      Approve Post
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#E2E0D5]/70 line-clamp-1 italic font-medium">
                  &ldquo;Hook: Stop manually replying to DMs at 2 AM. Here is what we do instead...&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
