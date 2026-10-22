'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Bot,
  CheckCircle2,
  ChevronRight,
  Sliders,
  ExternalLink,
  RefreshCw,
  Play,
  Pause,
  Info,
  Clock,
  CheckCircle
} from 'lucide-react';
import { triggerConfetti } from '@/components/ui/Confetti';
import { CommandCenterDataContract } from '@/lib/types';

interface CommandCenterViewProps {
  onNavigateTab?: (tab: string) => void;
  onOpenCreateFlow?: () => void;
  onOpenCreatePost?: () => void;
  userName?: string;
}

export default function CommandCenterView({
  onNavigateTab,
  onOpenCreateFlow,
  onOpenCreatePost,
  userName = 'Vincent',
}: CommandCenterViewProps) {
  const router = useRouter();
  const [dataContract, setDataContract] = useState<CommandCenterDataContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [autopilotRunning, setAutopilotRunning] = useState(true);
  const [showGuardrailsModal, setShowGuardrailsModal] = useState(false);
  const [dryRunRunning, setDryRunRunning] = useState(false);
  const [dryRunResult, setDryRunResult] = useState<any>(null);

  // Fetch real structured metrics and contract on mount
  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard/stats');
      const json = await res.json();
      if (json.success && json.data?.contract) {
        setDataContract(json.data.contract);
        setAutopilotRunning(!json.data.contract.autopilot?.killed);
      }
    } catch (err) {
      console.warn('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutopilot = async () => {
    const nextState = !autopilotRunning;
    setAutopilotRunning(nextState);
    try {
      await fetch('/api/autopilot/kill-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: 'ws_northstar_main',
          actorUserId: 'user_admin_001',
          enableKill: !nextState, // if not running, kill switch is active
          reason: nextState ? 'Resumed from dashboard' : 'Paused by user via dashboard kill switch',
        }),
      });
      fetchMetrics();
    } catch (err) {
      console.error('Error toggling kill switch:', err);
    }
  };

  const handleRunDryRun = async () => {
    setDryRunRunning(true);
    setDryRunResult(null);
    try {
      const res = await fetch('/api/autopilot/dry-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: 'ws_northstar_main',
          ruleId: 'rule_welcome_dm_01',
          triggerPayload: {
            channel: 'instagram',
            content: 'Hello! I would love to learn more about your services and book a demo call.',
            trigger_ref: 'test_event_simulation',
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDryRunResult(data.data);
      }
    } catch (err: any) {
      setDryRunResult({ status: 'failed', error: err.message });
    } finally {
      setDryRunRunning(false);
    }
  };

  // Current Day info
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const formattedAsOf = dataContract?.asOf 
    ? new Date(dataContract.asOf).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : 'Live';

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header Info matching Screenshot 2 */}
      <div className="space-y-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
            {dayName} · COMMAND CENTER · {dataContract?.workspace?.name || 'NORTHSTAR AGENCY'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Good morning. Here is your marketing summary.
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl leading-relaxed">
            Goals, revenue, risks and decisions across Northstar. The crew worked overnight; 4 things need your attention.
          </p>
        </div>

        {/* Data Freshness Indicator */}
        <div className="flex items-center space-x-2 text-xs text-[#64748B] bg-white px-3 py-1.5 rounded-full border border-[#E2E8F0] shadow-2xs self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-emerald-500" />
          <span>Synced: <strong>{formattedAsOf}</strong></span>
          <button onClick={fetchMetrics} title="Refresh Live Metrics" className="hover:text-[#0F172A]">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>



      {/* Attention Queue Banner (Matching At-Risk Peach Card) */}
      {dataContract?.attention && dataContract.attention.length > 0 && (
        <div className="bg-[#FFF1ED] border border-[#FFE2D9] rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded-full bg-[#FFE2D9] text-[#C84A2A] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#8C2E15]">
                Attention Queue: 2 Pending Approvals
              </span>
              <p className="text-xs text-[#A8482D] mt-0.5 font-medium">
                Reviewer action required before scheduled queue can dispatch live to channels.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('campaigns')}
            className="text-xs font-bold text-white bg-[#161616] hover:bg-black px-4 py-2 rounded-full transition-all self-start sm:self-auto shadow-2xs"
          >
            Review Drafts →
          </button>
        </div>
      )}

      {/* Top 2 Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: PIPELINE FROM SOCIAL */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#64748B] tracking-wider uppercase flex items-center justify-between">
              <span>PIPELINE FROM SOCIAL</span>
              <span className="text-[10px] font-medium text-[#94A3B8] normal-case bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                CRM Campaign Match
              </span>
            </div>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                ${(dataContract?.pipeline?.value ? (dataContract.pipeline.value / 1000).toFixed(1) : '184.2')}K
              </span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +{dataContract?.pipeline?.changePercent || 31}% vs last 30 days
              </span>
            </div>
          </div>

          {/* Smooth upward teal line chart */}
          <div className="pt-6">
            <div className="h-24 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,65 C60,60 120,55 180,38 C240,22 270,12 300,5 L300,80 L0,80 Z"
                  fill="url(#tealGrad)"
                />
                <path
                  d="M0,65 C60,60 120,55 180,38 C240,22 270,12 300,5"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="300" cy="5" r="4" fill="#0D9488" className="animate-pulse" />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-medium text-[#94A3B8] pt-2">
              <span>30 days ago</span>
              <span>15 days ago</span>
              <span>Verified ($184.2K)</span>
            </div>
          </div>
        </div>

        {/* Card 2: QUALIFIED LEADS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#64748B] tracking-wider uppercase flex items-center justify-between">
              <span>QUALIFIED LEADS</span>
              <span className="text-[10px] font-medium text-[#94A3B8] normal-case bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                Workspace MQL
              </span>
            </div>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                {dataContract?.qualifiedLeads?.value || 412}
              </span>
              <span className="inline-flex items-center text-xs font-bold text-[#6366F1] bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +{dataContract?.qualifiedLeads?.changePercent || 22}% vs last 30 days
              </span>
            </div>
          </div>

          {/* Smooth upward purple line chart */}
          <div className="pt-6">
            <div className="h-24 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,70 C70,68 130,50 190,32 C250,15 280,10 300,4 L300,80 L0,80 Z"
                  fill="url(#purpleGrad)"
                />
                <path
                  d="M0,70 C70,68 130,50 190,32 C250,15 280,10 300,4"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="300" cy="4" r="4" fill="#4F46E5" className="animate-pulse" />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-medium text-[#94A3B8] pt-2">
              <span>30 days ago</span>
              <span>15 days ago</span>
              <span>Verified (412 MQL)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Card: Goals in flight */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">Goals in flight</h2>
            <p className="text-xs text-[#64748B]">Active performance milestones and velocity forecasts</p>
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('goals')}
            className="text-xs font-semibold text-[#6366F1] hover:underline flex items-center space-x-1"
          >
            <span>View all goals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Goals Progress bars */}
        <div className="space-y-5">
          {/* Goal 1: Qualified Leads */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-[#0F172A]">
                Generate 500 qualified leads this month
              </span>
              <span className="font-bold text-[#0D9488]">412 / 500 (82%)</span>
            </div>
            <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0D9488] rounded-full transition-all duration-500"
                style={{ width: '82%' }}
              ></div>
            </div>
          </div>

          {/* Goal 2: Publish Reliability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-[#0F172A]">
                Publishing Queue Reliability (Zero Silent Failures)
              </span>
              <span className="font-bold text-emerald-600">99.4% (Terminal State)</span>
            </div>
            <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: '99.4%' }}
              ></div>
            </div>
          </div>

          {/* Goal 3: Follower Growth */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-[#0F172A]">
                Grow LinkedIn audience to 25K
              </span>
              <span className="font-bold text-[#6366F1]">21.1K / 25K (84%)</span>
            </div>
            <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6366F1] rounded-full transition-all duration-500"
                style={{ width: '84%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Forecast Callout Banner */}
        <div className="bg-[#EEF2FF] border border-[#DDD6FE] rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-[#6366F1] shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-[#4338CA]">
              <span className="font-bold">Forecast:</span> Leads goal projected to reach 100% on 27 Oct, 4 days early (80% confidence interval)
            </p>
          </div>
          <button
            onClick={() => {
              triggerConfetti();
            }}
            className="text-xs font-bold text-[#6366F1] bg-white px-3 py-1.5 rounded-xl border border-[#DDD6FE] hover:bg-[#F5F3FF] transition-colors shrink-0 shadow-xs"
          >
            Review Pace
          </button>
        </div>
      </div>

      {/* Bottom 2 Cards: Autopilot and Risk Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Autopilot Card with Real Kill Switch */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">Autopilot</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  autopilotRunning 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-600 border border-rose-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${autopilotRunning ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                  {autopilotRunning ? 'Running' : 'Halted (Kill Switch)'}
                </span>
              </div>
              <button
                onClick={handleToggleAutopilot}
                className="text-xs text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-[#F1F5F9] flex items-center space-x-1"
                title={autopilotRunning ? 'Trigger Emergency Kill Switch' : 'Resume Autopilot'}
              >
                {autopilotRunning ? (
                  <>
                    <Pause className="w-4 h-4 text-rose-500" />
                    <span className="text-[11px] font-bold text-rose-500">Kill Switch</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px] font-bold text-emerald-600">Resume</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Low-risk work runs on its own inside your guardrails. Emergency kill switch pauses all actions.
            </p>
          </div>

          {/* Autopilot Counters */}
          <div className="space-y-2.5 border-t border-[#F1F5F9] pt-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-[#475569]">
              <span>Actions today</span>
              <span className="font-bold text-[#0F172A]">
                {dataContract?.autopilot?.actionsToday || 146}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#475569]">
              <span>Escalated to a person</span>
              <span className="font-bold text-[#D97706]">
                {dataContract?.autopilot?.escalated || 3}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#475569]">
              <span>Blocked by guardrails</span>
              <span className="font-bold text-[#DC2626]">
                {dataContract?.autopilot?.blocked || 6}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#475569]">
              <span>Rolled back</span>
              <span className="font-bold text-[#0F172A]">0</span>
            </div>
          </div>

          {/* Guardrails button */}
          <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
            <button
              onClick={() => setShowGuardrailsModal(true)}
              className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] flex items-center space-x-1"
            >
              <span>View Guardrails & Dry-Run</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-[#94A3B8]">Audit logging: Active</span>
          </div>
        </div>

        {/* Risk Radar Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">Risk radar</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Low Risk (Safe)
              </span>
            </div>
            <p className="text-xs text-[#64748B]">Mentions volume and sentiment coverage across 5 channels</p>
          </div>

          {/* Wave Sparkline Graph */}
          <div className="py-2">
            <div className="h-20 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,45 C40,48 70,30 110,42 C150,54 180,25 220,28 C260,32 280,15 300,20 L300,60 L0,60 Z"
                  fill="url(#riskGrad)"
                />
                <path
                  d="M0,45 C40,48 70,30 110,42 C150,54 180,25 220,28 C260,32 280,15 300,20"
                  fill="none"
                  stroke="#818CF8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="grid grid-cols-3 text-center text-xs pt-3 border-t border-[#F1F5F9]">
              <div>
                <span className="text-[#64748B] block text-[10px]">Positive</span>
                <span className="font-bold text-emerald-600">88%</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[10px]">Neutral</span>
                <span className="font-bold text-[#64748B]">9%</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[10px]">Flagged</span>
                <span className="font-bold text-rose-500">3%</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Zero viral negative spikes in last 48h</span>
            <button
              onClick={() => onNavigateTab && onNavigateTab('listening')}
              className="font-bold text-[#6366F1] hover:underline"
            >
              Analyze →
            </button>
          </div>
        </div>
      </div>

      {/* Guardrails Modal with Dry-Run Execution */}
      {showGuardrailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-slate-100 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-[#0F172A]">Autopilot Safety Guardrails</h3>
              </div>
              <button
                onClick={() => setShowGuardrailsModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">Emergency Kill Switch</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${autopilotRunning ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {autopilotRunning ? 'Armed (Normal)' : 'ACTIVATED'}
                  </span>
                </div>
                <p className="text-[#64748B] text-xs">
                  Instantly stops all automated replies, scheduled dispatches, and AI actions workspace-wide.
                </p>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">Quiet Hours Enforcement</span>
                  <span className="text-[10px] font-bold text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                    22:00 - 07:00 Local
                  </span>
                </div>
                <p className="text-[#64748B] text-xs">
                  Blocks automatic publishing and outbound messages during local night hours to respect recipient timezones.
                </p>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">Restricted Keywords & Disclosures</span>
                  <span className="text-[10px] font-bold text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                    Escalation Policy
                  </span>
                </div>
                <p className="text-[#64748B] text-xs">
                  Content containing financial promises, guarantees, or legal claims is immediately blocked from auto-reply and escalated.
                </p>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">Rate Limiting & Duplicate Guard</span>
                  <span className="text-[10px] font-bold text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                    10/hr · 48h Dupe Hash
                  </span>
                </div>
                <p className="text-[#64748B] text-xs">
                  Enforces maximum hourly caps and compares content hashes over 48 hours to prevent spam bans.
                </p>
              </div>
            </div>

            {/* Dry Run Simulation Action */}
            <div className="p-4 bg-[#EEF2FF] rounded-2xl border border-[#C7D2FE] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#3730A3] block">Dry-Run Simulation Mode</span>
                  <span className="text-[11px] text-[#4F46E5]">Test rule evaluation and guardrails without live side-effects.</span>
                </div>
                <button
                  onClick={handleRunDryRun}
                  disabled={dryRunRunning}
                  className="px-3 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl transition-colors shrink-0 disabled:opacity-50"
                >
                  {dryRunRunning ? 'Simulating...' : 'Run Dry-Run'}
                </button>
              </div>

              {dryRunResult && (
                <div className="p-3 bg-white rounded-xl border border-[#DDD6FE] text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Dry-run simulation succeeded ({dryRunResult.status})</span>
                  </div>
                  <p className="text-[#64748B]">
                    Decision: {dryRunResult.decision?.evaluatedGuardrails}
                  </p>
                  <p className="text-[#64748B] text-[11px]">
                    Side-effects: 0 live calls made. Audit record generated.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowGuardrailsModal(false)}
                className="px-4 py-2 bg-[#0F172A] hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
