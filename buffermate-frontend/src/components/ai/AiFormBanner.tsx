'use client';

import React from 'react';
import { Sparkles, Mic, ArrowRight } from 'lucide-react';

interface AiFormBannerProps {
  onOpenModal: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export default function AiFormBanner({
  onOpenModal,
  title = 'Generate post with AI',
  description = 'Speak your idea or paste a brief — AI extracts channels, schedules time & auto-fills.',
  buttonText = 'Generate with AI',
  className = '',
}: AiFormBannerProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white p-3 sm:px-4 sm:py-3 shadow-sm hover:border-indigo-500/50 transition-all ${className}`}
    >
      <div className="absolute inset-0 bg-radial-at-t from-purple-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left Information */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-xs shrink-0 ring-1 ring-white/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {title}
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-purple-200 border border-white/10">
                <Mic className="w-2.5 h-2.5 text-purple-300" /> Voice + Text
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate mt-0.5">
              {description}
            </p>
          </div>
        </div>

        {/* Right Trigger Button */}
        <div className="shrink-0 flex items-center">
          <button
            type="button"
            onClick={onOpenModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>{buttonText}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
