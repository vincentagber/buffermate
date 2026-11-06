'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  Zap,
  ArrowRight,
  TrendingUp,
  Tag,
  Share2,
  Heart,
  MessageCircle,
  Bookmark
} from 'lucide-react';
import {
  InstagramIcon,
  TikTokIcon,
  ThreadsIcon,
  FacebookIcon,
  XIcon
} from '@/components/SocialIcons';

interface ContentPreset {
  prompt: string;
  category: string;
  instagram: {
    hook: string;
    body: string;
    cta: string;
    hashtags: string[];
    score: number;
  };
  threads: {
    hook: string;
    body: string;
    cta: string;
    score: number;
  };
  x: {
    tweet: string;
    chars: number;
    score: number;
  };
  facebook: {
    headline: string;
    body: string;
    linkTitle: string;
    score: number;
  };
  tiktok: {
    videoHook: string;
    visualDirection: string;
    script: string;
    score: number;
  };
}

const PRESETS: ContentPreset[] = [
  {
    prompt: 'Create a promotional post for a digital marketing agency offering website development services',
    category: 'Agency Promotion',
    instagram: {
      hook: 'Is your current website actually converting visitors into paying clients, or is it just an expensive digital brochure? 💻✨',
      body: 'In 2026, a 3-second load delay costs you over 40% of mobile buyers.\n\nAt our digital marketing & web agency, we build lightning-fast web experiences engineered to convert social traffic into qualified booked appointments:\n\n1. Sub-second load times & modern mobile UX\n2. Direct CRM & automated WhatsApp/DM capture\n3. High-converting copywriting and SEO built-in\n\nStop losing potential clients to outdated website design.',
      cta: 'Drop "WEBSITE" below and our automated AI assistant will instantly send you our 2026 Web Conversion Audit & live pricing guide in your DMs!',
      hashtags: ['#WebDevelopment', '#DigitalMarketingAgency', '#WebDesign', '#ConversionOptimization', '#B2BGrowth'],
      score: 97,
    },
    threads: {
      hook: 'Hard truth about website development for modern agencies:',
      body: 'Your beautiful website is completely useless if social media visitors bounce in under 4 seconds.\n\nSpeed, clean typography, and instant DM/WhatsApp lead capture are what actually generate revenue.',
      cta: 'When was the last time you refreshed your agency website? Reply below.',
      score: 94,
    },
    x: {
      tweet: 'Most businesses spend thousands on social ads while sending traffic to a slow 2018-era website.\n\nWe design high-converting web applications and landing pages tailored for agencies and creators.\n\nHere are 5 website design mistakes draining your conversion rate 🧵👇',
      chars: 256,
      score: 95,
    },
    facebook: {
      headline: 'Transform Your Online Presence with Custom High-Converting Web Development',
      body: 'Ready for a website that actually drives inbound pipeline? Our digital agency specializes in bespoke web development, lightning-fast Next.js architecture, and automated lead capture funnels that turn clicks into clients.',
      linkTitle: 'Schedule a Free 15-Minute Web Architecture & Conversion Audit',
      score: 93,
    },
    tiktok: {
      videoHook: '[HOOK: 0-3s] "If your business website looks like it was built in 2015, here is why you are losing clients every single day."',
      visualDirection: 'Split screen comparing a slow clunky site with a slick modern 60fps responsive website with live instant booking.',
      script: 'People do not have 10 seconds to wait for your page to load. We re-engineer agency websites with instant load speeds and automated DM lead capture. Comment "DEV" and I will send you our exact design breakdown!',
      score: 98,
    },
  },
  {
    prompt: 'Launch our new AI analytics scorecard and feature update',
    category: 'Product Launch',
    instagram: {
      hook: 'We spent 6 months building the feature our creators requested most. It’s finally live. 🚀',
      body: 'Introducing Buffermate Predictive Audience Intelligence.\n\nNow you can see:\n• Exact peak engagement heatmaps across 6 platforms\n• Predictive viral hook scoring before you hit publish\n• Direct revenue pipeline attributed to comments and DMs',
      cta: 'Comment "SCORECARD" below to unlock early beta access and a 20% launch voucher!',
      hashtags: ['#ProductLaunch', '#AITools', '#CreatorEconomy', '#Analytics', '#BuffermateAI'],
      score: 98,
    },
    threads: {
      hook: 'Product update: You can now predict which post will go viral before publishing.',
      body: 'We analyzed 2.4 million creator engagement points to build our new predictive peak-time engine.\n\nNo more guessing whether Wednesday 10 AM or Friday 6 PM works best.',
      cta: 'Link in bio for full launch notes.',
      score: 95,
    },
    x: {
      tweet: 'Major product release 🚀\n\nBuffermate AI 2.0 is officially live.\n\n• Gemini 2.0 Viral Script Studio\n• Predictive Peak Publishing Heatmaps\n• Automated Comment-to-DM Funnels\n\nTry it free today without a credit card 👇',
      chars: 219,
      score: 95,
    },
    facebook: {
      headline: 'Buffermate AI 2.0: Predictive Analytics for High-Growth Brands',
      body: 'Take the guesswork out of social publishing. Our latest release brings enterprise audience intelligence, peak time heatmaps, and autonomous lead conversion to creators worldwide.',
      linkTitle: 'Explore Buffermate AI 2.0 — Live Product Overview',
      score: 92,
    },
    tiktok: {
      videoHook: '[HOOK: 0-2s] "This one AI tool just solved the hardest part of social media."',
      visualDirection: 'Side-by-side comparison of guessing post times vs seeing the AI heatmap peak.',
      script: 'It scans your actual followers across Instagram, TikTok, and Threads, and tells you the exact minute they are active. Watch how engagement spikes 34% on Wednesday morning.',
      score: 98,
    },
  },
];

export default function InteractiveAiStudioDemo() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customPrompt, setCustomPrompt] = useState(PRESETS[0].prompt);
  const [activePlatform, setActivePlatform] = useState<'instagram' | 'threads' | 'x' | 'facebook' | 'tiktok'>('instagram');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentPreset = PRESETS[selectedPresetIndex];

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setCustomPrompt(PRESETS[idx].prompt);
    triggerAiGeneration();
  };

  const triggerAiGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-sans">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Top Header / Prompt Input Strip (ColorInvoice pattern) */}
        <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Interactive AI Input-to-Output Showcase
              </span>
            </div>
            <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
              Simulated Gemini 2.0 Generator
            </span>
          </div>

          {/* Prompt Presets Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400">Sample Prompts:</span>
            {PRESETS.map((preset, idx) => (
              <button
                key={preset.category}
                type="button"
                onClick={() => handleSelectPreset(idx)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedPresetIndex === idx
                    ? 'bg-[#141416] text-white shadow-2xs font-semibold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {preset.category}
              </button>
            ))}
          </div>

          {/* Interactive User Prompt Box */}
          <div className="relative">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your content idea..."
              className="w-full pl-4 pr-32 py-3.5 rounded-2xl border border-slate-200/90 bg-white text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-2xs transition-all"
            />
            <button
              type="button"
              onClick={triggerAiGeneration}
              disabled={isGenerating}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Transform</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Platform Switcher Tabs */}
        <div className="px-6 sm:px-8 pt-4 pb-2 bg-white border-b border-slate-100 flex items-center space-x-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-2">
            Target Platform:
          </span>
          <button
            type="button"
            onClick={() => setActivePlatform('instagram')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
              activePlatform === 'instagram'
                ? 'bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
            <span>Instagram Reel</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('threads')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
              activePlatform === 'threads'
                ? 'bg-slate-100 text-slate-900 border border-slate-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ThreadsIcon className="w-3.5 h-3.5" />
            <span>Threads</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('x')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
              activePlatform === 'x'
                ? 'bg-slate-100 text-slate-900 border border-slate-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <XIcon className="w-3.5 h-3.5" />
            <span>X (Twitter)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('tiktok')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
              activePlatform === 'tiktok'
                ? 'bg-slate-100 text-slate-900 border border-slate-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TikTokIcon className="w-3.5 h-3.5 text-slate-900" />
            <span>TikTok Script</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('facebook')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 ${
              activePlatform === 'facebook'
                ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Facebook Page</span>
          </button>
        </div>

        {/* Live Preview Display Section */}
        <div className="p-6 sm:p-8 bg-slate-50/40">
          {isGenerating ? (
            <div className="py-16 text-center space-y-3 animate-pulse">
              <Sparkles className="w-8 h-8 text-purple-600 mx-auto animate-spin" />
              <p className="text-sm font-bold text-slate-900">Crafting platform-optimized post...</p>
              <p className="text-xs text-slate-500">Formulating viral hook & keyword DM triggers via Gemini 2.0 Flash</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Formatted Content */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                {/* Meta stats bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-slate-900">
                      Viral Hook Score:{' '}
                      <strong className="text-purple-700">
                        {activePlatform === 'instagram'
                          ? `${currentPreset.instagram.score}/100`
                          : activePlatform === 'threads'
                          ? `${currentPreset.threads.score}/100`
                          : activePlatform === 'x'
                          ? `${currentPreset.x.score}/100`
                          : activePlatform === 'tiktok'
                          ? `${currentPreset.tiktok.score}/100`
                          : `${currentPreset.facebook.score}/100`}
                      </strong>
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Character optimization: Pass
                  </span>
                </div>

                {/* Content based on Active Platform */}
                {activePlatform === 'instagram' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80 text-xs font-bold text-purple-950 leading-relaxed">
                      🔥 Hook: {currentPreset.instagram.hook}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                      {currentPreset.instagram.body}
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs font-semibold text-amber-950">
                      🎯 Keyword Lead Trigger: {currentPreset.instagram.cta}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {currentPreset.instagram.hashtags.map((h) => (
                        <span key={h} className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activePlatform === 'threads' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-900">
                      {currentPreset.threads.hook}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                      {currentPreset.threads.body}
                    </div>
                    <div className="text-xs text-purple-700 font-semibold pt-1">
                      {currentPreset.threads.cta}
                    </div>
                  </div>
                )}

                {activePlatform === 'x' && (
                  <div className="space-y-3">
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                      {currentPreset.x.tweet}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                      <span>{currentPreset.x.chars} / 280 characters</span>
                      <span className="text-emerald-600 font-bold">Optimal Thread Starter</span>
                    </div>
                  </div>
                )}

                {activePlatform === 'tiktok' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-900">
                      🎬 {currentPreset.tiktok.videoHook}
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900">
                      <strong>Visual Direction:</strong> {currentPreset.tiktok.visualDirection}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <strong>Voiceover Script:</strong> &ldquo;{currentPreset.tiktok.script}&rdquo;
                    </div>
                  </div>
                )}

                {activePlatform === 'facebook' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">
                      {currentPreset.facebook.headline}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                      {currentPreset.facebook.body}
                    </p>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium flex items-center justify-between">
                      <span>🔗 {currentPreset.facebook.linkTitle}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                )}

                {/* Actions Strip */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        activePlatform === 'instagram'
                          ? `${currentPreset.instagram.hook}\n\n${currentPreset.instagram.body}\n\n${currentPreset.instagram.cta}\n\n${currentPreset.instagram.hashtags.join(' ')}`
                          : activePlatform === 'threads'
                          ? `${currentPreset.threads.hook}\n\n${currentPreset.threads.body}\n\n${currentPreset.threads.cta}`
                          : activePlatform === 'x'
                          ? currentPreset.x.tweet
                          : activePlatform === 'tiktok'
                          ? `${currentPreset.tiktok.videoHook}\n\n${currentPreset.tiktok.script}`
                          : `${currentPreset.facebook.headline}\n\n${currentPreset.facebook.body}`
                      )
                    }
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Post Copy</span>
                      </>
                    )}
                  </button>

                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-xs flex items-center space-x-1.5 cursor-pointer hover:scale-[1.02] transition-all"
                  >
                    <span>Schedule in Buffermate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Mini Visual Mockup Card */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    BM
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">buffermate.ai</p>
                    <p className="text-[10px] text-slate-400">Verified Organization</p>
                  </div>
                </div>

                <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center border border-slate-200 relative">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-purple-700 mb-2">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Visual Graphic & Video Canvas</p>
                  <p className="text-[10px] text-slate-500 mt-1">Multi-format auto-scaling (1:1, 4:5, 9:16)</p>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold bg-black/75 text-white">
                    HD 1080p
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-xs pt-1 px-1">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-4 h-4 hover:text-rose-500 cursor-pointer" />
                    <MessageCircle className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
                    <Share2 className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
                  </div>
                  <Bookmark className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

