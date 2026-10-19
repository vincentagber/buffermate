'use client';

import React from 'react';
import { Sparkles, Mic, Type } from 'lucide-react';

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
      className={`relative overflow-hidden rounded-2xl border border-[#d6e0ce] bg-gradient-to-r from-[#f4f7f2] via-[#eef4ea] to-[#f7f9f5] p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Information */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#c8d8be] flex items-center justify-center text-[#5f8e43] shadow-2xs shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                {title}
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white text-[#4d7438] border border-[#c8d8be] shadow-2xs">
                <Mic className="w-2.5 h-2.5 text-[#5f8e43]" /> Voice + Text
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Right Trigger Button (Matches Kobble Button Style) */}
        <div className="shrink-0 flex items-center">
          <button
            type="button"
            onClick={onOpenModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 active:scale-95 group cursor-pointer"
            style={{ backgroundColor: '#5f8e43' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white/90 group-hover:rotate-12 transition-transform" />
            <span>{buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
