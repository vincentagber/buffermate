'use client';

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  RefreshCw,
  Eye,
  Sliders,
  Instagram,
  X as XIconClose
} from 'lucide-react';
import { InstagramIcon, TikTokIcon, ThreadsIcon, XIcon } from '@/components/SocialIcons';

export default function KobbleBuiltForSpeed() {
  const [activeTab, setActiveTab] = useState<'pending' | 'published'>('pending');
  const [approvedPosts, setApprovedPosts] = useState<string[]>([]);

  const handleApprove = (id: string) => {
    setApprovedPosts((prev) => [...prev, id]);
  };

  return (
    <section className="py-20 bg-[#F6F4EE] border-t border-[#EBE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141416] leading-tight">
            Built for speed.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Our platform is designed to make scheduling and scaling your social publishing as fast and frictionless as possible.
          </p>
        </div>

        {/* STAGE 1: Post your content in minutes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Interactive Phone Mockup Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E7E4DC] space-y-6">
              {/* Green Success Badge */}
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#141416]">Post Scheduled!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your post is now active in the autonomous queue.
                  </p>
                </div>
              </div>

              {/* Metric Row matching Kobble */}
              <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 text-center">
                <div className="space-y-0.5">
                  <div className="text-xs text-slate-400 font-medium">Channels</div>
                  <div className="text-base font-extrabold text-[#141416]">4 Synced</div>
                </div>
                <div className="space-y-0.5 border-x border-slate-100">
                  <div className="text-xs text-slate-400 font-medium">Dispatch</div>
                  <div className="text-base font-extrabold text-[#52832B]">7:45 PM</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs text-slate-400 font-medium">Auto-DM</div>
                  <div className="text-base font-extrabold text-purple-700">Active</div>
                </div>
              </div>

              {/* Preview Snippet */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Hook Score: 98/100 · High Curiosity</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 italic">
                  &ldquo;Most businesses spend $5,000/mo on social ads without fixing this one conversion leak first...&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right: Stage 1 Copy & Green Number 1 */}
          <div className="lg:col-span-6 space-y-6">
            <div className="w-10 h-10 rounded-full bg-[#52832B] text-white font-extrabold text-base flex items-center justify-center shadow-xs">
              1
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#141416] tracking-tight">
                Post your content in minutes.
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Add a title, pick your channels, set your schedule time, and describe what needs to be published. Your post queues instantly — or use AI to craft the entire multi-channel copy with just your voice.
              </p>
            </div>

            <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>6+ connected social networks with one click</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>AI voice &amp; prompt-powered copy generation</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Automatic 9:16 and 1:1 image and video aspect ratio formatting</span>
              </li>
            </ul>
          </div>
        </div>

        {/* STAGE 2: Review work. Pay on approval. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-8">
          {/* Left: Stage 2 Copy & Dark Number 2 */}
          <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
            <div className="w-10 h-10 rounded-full bg-[#141416] text-white font-extrabold text-base flex items-center justify-center shadow-xs">
              2
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#141416] tracking-tight">
                Review work. Publish with confidence.
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Every queued post lands in your review dashboard. Inspect live previews across Instagram, TikTok, and X before release. Algorithmically timed dispatches guarantee maximum audience exposure.
              </p>
            </div>

            <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Approve or edit each submission before dispatch</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Dispatches released only at verified peak audience heatmaps</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Autonomous 24/7 comment keyword DM funnels active</span>
              </li>
            </ul>
          </div>

          {/* Right: Tilted Interactive Review Submissions Card */}
          <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E7E4DC] rotate-1 hover:rotate-0 transition-transform duration-300 space-y-5">
              {/* Header with Tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    STAGING DASHBOARD
                  </span>
                  <h4 className="text-sm font-bold text-[#141416]">Review queued posts</h4>
                </div>
                <div className="flex bg-slate-100 p-0.5 rounded-full text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeTab === 'pending' ? 'bg-white text-[#141416] shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Pending (2)
                  </button>
                  <button
                    onClick={() => setActiveTab('published')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeTab === 'published' ? 'bg-white text-[#141416] shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Published
                  </button>
                </div>
              </div>

              {/* Review Item 1 */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"
                      alt="Author"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#141416]">@sarah_agency</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">Instagram &amp; Threads</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                    In 2h 14m
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  &ldquo;Stop losing leads from viral reels. Comment &apos;PRICE&apos; below for our automated client pipeline guide!&rdquo;
                </p>

                <div className="flex items-center space-x-2 pt-1">
                  {approvedPosts.includes('post-1') ? (
                    <div className="w-full py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl text-center flex items-center justify-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approved · Queued for Peak Velocity</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove('post-1')}
                        className="flex-1 py-2 bg-[#52832B] hover:bg-[#436e22] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        Approve · Publish
                      </button>
                      <button className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer">
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Review Item 2 */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                      alt="Author"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#141416]">@tunde_growth</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">TikTok &amp; X</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">
                    In 5h 30m
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  &ldquo;Here is the exact 3-step script we used to generate 40+ agency calls weekly without ads 🧵👇&rdquo;
                </p>

                <div className="flex items-center space-x-2 pt-1">
                  {approvedPosts.includes('post-2') ? (
                    <div className="w-full py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl text-center flex items-center justify-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approved · Queued for Peak Velocity</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove('post-2')}
                        className="flex-1 py-2 bg-[#52832B] hover:bg-[#436e22] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        Approve · Publish
                      </button>
                      <button className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer">
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

