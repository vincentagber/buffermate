'use client';

import React from 'react';
import {
  TrendingUp,
  Clock,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Users,
  Target,
  Sparkles
} from 'lucide-react';

export default function TestimonialsSection() {
  const verifiedMetrics = [
    {
      stat: '15+ hrs',
      label: 'Weekly Creator Time Saved',
      sub: 'Eliminates opening 6 separate apps to copy-paste captions and links.',
    },
    {
      stat: '98.4%',
      label: 'Lead Capture Resolution Rate',
      sub: 'Automatic delivery of requested links and price sheets to commenter DMs.',
    },
    {
      stat: '< 15s',
      label: 'Average Speed-to-Lead Delay',
      sub: 'Prospective buyers receive resources while interest is at its absolute peak.',
    },
    {
      stat: '100%',
      label: 'Official Graph API Compliant',
      sub: 'AES-256 encrypted OAuth 2.0 sessions protect accounts from unauthorized bans.',
    },
  ];

  const workflowArchetypes = [
    {
      role: 'Solo Creator & Solopreneur',
      headline: 'From Daily Chaos to 1-Hour Weekly Batching',
      challenge: 'Spent 2 to 3 hours every day manually formatting posts, hunting for hashtags, and copying text between Instagram, TikTok, and Threads.',
      transformation: 'Uses Buffermate AI to draft raw briefs, let Google Gemini generate platform-native hooks, and queues 30 days of cross-platform content in a single sitting.',
      metricBadge: '4x More Content Output',
    },
    {
      role: 'B2B SaaS Founder & Marketer',
      headline: 'Turning Passive Video Views into Qualified Pipeline',
      challenge: 'Gained 200k monthly video impressions, but bio links converted under 1.2% because mobile viewers rarely navigate to profiles.',
      transformation: 'Implemented keyword Auto-DMs ("SCORECARD"). When viewers comment, Buffermate dispatches personalized access links within 15 seconds, lifting pipeline by $12k/mo.',
      metricBadge: '$48,200 Attributed Pipeline',
    },
    {
      role: 'Social Media & Growth Agency',
      headline: 'Managing 10+ Client Workspaces with Zero Accidental Cross-Posts',
      challenge: 'Client account management in generic tools caused accidental cross-brand posting and lacked approval gates before publishing.',
      transformation: 'Employs Buffermate enterprise project workflows, permission roles, and automated queue reviews, delivering white-label analytics reports directly to clients.',
      metricBadge: '10 Team Seats & Approvals',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto font-sans">
      <div className="space-y-16">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Proven Workflow Impact</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Real velocity. Zero vanity metrics.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Engineered to turn social media from a time-draining obligation into a compounding customer acquisition engine.
          </p>
        </div>

        {/* 4 Verified Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {verifiedMetrics.map((m) => (
            <div
              key={m.label}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow space-y-2"
            >
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                {m.stat}
              </div>
              <p className="text-xs font-bold text-slate-800">{m.label}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* 3 Real Creator Workflow Archetypes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {workflowArchetypes.map((item) => (
            <div
              key={item.role}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-6 hover:shadow-xs transition-shadow"
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 inline-block">
                  {item.role}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                  {item.headline}
                </h3>
                <div className="space-y-2 text-xs text-slate-600 leading-relaxed pt-2">
                  <p>
                    <strong className="text-slate-900">The Problem:</strong> {item.challenge}
                  </p>
                  <p>
                    <strong className="text-slate-900">The Transformation:</strong> {item.transformation}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>{item.metricBadge}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

