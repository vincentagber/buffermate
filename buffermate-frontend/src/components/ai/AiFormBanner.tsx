'use client';

import React from 'react';
import { Sparkles, Mic } from 'lucide-react';

interface AiFormBannerProps {
  onOpenModal: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export default function AiFormBanner({
  onOpenModal,
  title = 'Generate task with AI',
  description = "Describe what you want out loud or paste a rough brief — we'll complete the form for you.",
  buttonText = 'Generate with AI',
  className = '',
}: AiFormBannerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-purple-200/70 bg-gradient-to-r from-purple-50/70 via-indigo-50/30 to-purple-50/50 p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Information */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-purple-200/70 flex items-center justify-center text-purple-700 shadow-2xs shrink-0">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                {title}
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-white text-purple-700 border border-purple-200/70 shadow-2xs">
                <Mic className="w-2.5 h-2.5 text-purple-600" /> Voice + Text
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Right Trigger Button - Luxury Black Pill */}
        <div className="shrink-0 flex items-center">
          <button
            type="button"
            onClick={onOpenModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#141416] hover:bg-black rounded-full text-xs font-semibold text-white shadow-2xs transition-all hover:scale-[1.02] active:scale-95 group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300 group-hover:rotate-12 transition-transform" />
            <span>{buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
