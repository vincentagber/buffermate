'use client';

import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Sparkles,
  Share2,
  Calendar,
  Send,
  CheckCircle2,
  ArrowRight,
  Clock,
  Zap,
  Play,
  RotateCcw,
  Check
} from 'lucide-react';
import {
  InstagramIcon,
  TikTokIcon,
  ThreadsIcon,
  FacebookIcon,
  XIcon
} from '@/components/SocialIcons';

interface StepData {
  number: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  detailTitle: string;
  description: string;
  badge: string;
}

const STEPS: StepData[] = [
  {
    number: '01',
    title: 'Create Your Content',
    subtitle: 'Draft thoughts or raw briefs',
    icon: <PenTool className="w-4 h-4" />,
    detailTitle: '1. Fast, Distraction-Free Draft Composer',
    description: 'Jot down an idea, upload a video asset, or paste a link. Buffermate AI provides an uncluttered workspace to capture high-velocity thoughts in seconds.',
    badge: 'Stage 1: Ideation',
  },
  {
    number: '02',
    title: 'Enhance With AI',
    subtitle: 'Gemini viral hooks & tone',
    icon: <Sparkles className="w-4 h-4" />,
    detailTitle: '2. Google Gemini 2.0 Viral Hook Engine',
    description: 'Transform a single draft into high-curiosity hooks, formatted carousel scripts, and tailored call-to-actions tailored to your specific creator persona and niche.',
    badge: 'Stage 2: AI Optimization',
  },
  {
    number: '03',
    title: 'Select Social Platforms',
    subtitle: 'Instagram, TikTok, Threads, FB, X',
    icon: <Share2 className="w-4 h-4" />,
    detailTitle: '3. Multi-Channel Distribution Matrix',
    description: 'Select which networks receive your post. Buffermate automatically respects platform character limits, aspect ratios (1:1, 4:5, 9:16), and hashtag formatting.',
    badge: 'Stage 3: Channel Matrix',
  },
  {
    number: '04',
    title: 'Schedule Publication',
    subtitle: 'Predictive peak heatmaps',
    icon: <Calendar className="w-4 h-4" />,
    detailTitle: '4. AI Peak Engagement Slot Selection',
    description: 'Eliminate guesswork. Our predictive audience intelligence maps the exact hour your specific followers are active, scheduling each network at its highest viral window.',
    badge: 'Stage 4: Time Orchestration',
  },
  {
    number: '05',
    title: 'Publish Automatically',
    subtitle: '24/7 comment lead funnels',
    icon: <Zap className="w-4 h-4" />,
    detailTitle: '5. Autonomous Dispatch & Auto-DM Lead Capture',
    description: 'Content dispatches automatically without phone notifications. Interested commenters who type trigger keywords instantly receive personalized DMs with your link.',
    badge: 'Stage 5: Autonomous Conversion',
  },
];

export default function InteractiveWorkflowDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % STEPS.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const step = STEPS[currentStep];

  return (
    <div className="w-full max-w-6xl mx-auto font-sans">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-1">
              <span>Interactive Workflow Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              From raw thought to automated conversion.
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer self-start sm:self-auto ${
              isPlaying
                ? 'bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
            }`}
          >
            {isPlaying ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Auto-Playing (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
                <span>Auto-Play Sequence</span>
              </>
            )}
          </button>
        </div>

        {/* 5-Stage Stepper Navigation Bar (Kobble numbered layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-slate-200/80 bg-white">
          {STEPS.map((s, idx) => {
            const isActive = currentStep === idx;
            const isCompleted = currentStep > idx;
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => {
                  setCurrentStep(idx);
                  setIsPlaying(false);
                }}
                className={`p-4 text-left transition-all border-b-2 sm:border-b-2 sm:border-r last:border-r-0 border-slate-100 cursor-pointer ${
                  isActive
                    ? 'border-b-purple-600 bg-purple-50/30'
                    : 'hover:bg-slate-50 border-b-transparent'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                      isActive
                        ? 'bg-[#141416] text-white shadow-2xs'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700 font-bold'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : s.number}
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate">{s.title}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate pl-8 hidden sm:block">
                  {s.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Interactive Stage Visualization Card */}
        <div className="p-6 sm:p-10 bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Explanation */}
            <div className="lg:col-span-6 space-y-5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#141416] text-white">
                {step.badge}
              </span>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {step.detailTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => (prev + 1) % STEPS.length)}
                  className="px-5 py-2.5 rounded-full bg-[#141416] hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <span>{currentStep === 4 ? 'Loop Back to Step 1' : 'Next Stage →'}</span>
                </button>
                <span className="text-xs text-slate-400">Step {currentStep + 1} of 5</span>
              </div>
            </div>

            {/* Right Live Stage Mockup */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              {currentStep === 0 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">
                    <span>Draft Workspace</span>
                    <span className="text-slate-400 font-mono">Word count: 38</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-700 leading-relaxed font-mono">
                    &ldquo;Need a promotional post about our new agency client acquisition system. Emphasize speed-to-lead and automated comment replies.&rdquo;
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-800 text-[11px] font-medium flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Click &apos;Enhance with AI&apos; to generate hooks across 5 platforms</span>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <span className="font-bold text-purple-900">Google Gemini 2.0 Engine Active</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      Score: 97/100
                    </span>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs font-bold text-purple-950">
                    Pattern Interrupt Hook Formulation:
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    &ldquo;Stop letting $5k agency leads slip through your comments while you sleep. Here is the 8-second DM automation engine we used to book 40+ client calls this week.&rdquo;
                  </p>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-800">Cross-Platform Channels Configured</span>
                    <span className="text-[11px] text-purple-700 font-bold">4 Channels Linked</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 flex items-center space-x-2 font-semibold">
                      <InstagramIcon className="w-4 h-4 text-pink-600" />
                      <span>Instagram Reel</span>
                      <Check className="w-3.5 h-3.5 text-purple-600 ml-auto" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 flex items-center space-x-2 font-semibold">
                      <TikTokIcon className="w-4 h-4" />
                      <span>TikTok Video</span>
                      <Check className="w-3.5 h-3.5 text-slate-700 ml-auto" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-sky-50 text-sky-900 border border-sky-200 flex items-center space-x-2 font-semibold">
                      <ThreadsIcon className="w-4 h-4 text-sky-600" />
                      <span>Threads Post</span>
                      <Check className="w-3.5 h-3.5 text-sky-600 ml-auto" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center space-x-2 font-semibold">
                      <FacebookIcon className="w-4 h-4 text-blue-600" />
                      <span>Facebook Page</span>
                      <Check className="w-3.5 h-3.5 text-blue-600 ml-auto" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-800">Peak Audience Time Slot Detected</span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      +34% Comment Velocity
                    </span>
                  </div>
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                      <span>🔥 Highest Engagement Slot</span>
                      <span>Wednesday @ 10:00 AM WAT</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Follower activity across your connected accounts peaks midweek between 9:45 AM and 10:30 AM.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between font-mono">
                    <span>Queue status: Ready for autonomous dispatch</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Post Dispatched & Lead Bot Live</span>
                    </span>
                    <span className="text-[11px] text-purple-700 font-bold">14 Leads Captured</span>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2 text-xs">
                    <p className="font-bold text-purple-950">Commenter Trigger Received:</p>
                    <p className="text-slate-800 italic bg-white p-2 rounded-lg border border-purple-100">
                      @david_creative: &ldquo;This looks incredible. Can you send the pricing link? PRICE&rdquo;
                    </p>
                    <p className="text-emerald-800 font-semibold text-[11px]">
                      ⚡️ DM auto-dispatched in 12s with personalized checkout link.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
