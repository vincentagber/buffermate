'use client';

import React, { useState } from 'react';
import {
  Download,
  Search,
  MessageSquare,
  Bell,
  Calendar,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Users,
  MoreHorizontal,
  Check,
  Filter,
  DollarSign,
  Syringe,
  Sparkle,
  Zap,
  Activity,
  ShoppingBag,
  ExternalLink,
  Info
} from 'lucide-react';
import { triggerConfetti } from '@/components/ui/Confetti';
import ChevronStepper, { ChevronStepItem } from '@/components/ui/ChevronStepper';

interface ReportsViewProps {
  onOpenFlowAssist?: () => void;
}

export default function ReportsView({ onOpenFlowAssist }: ReportsViewProps) {
  // Filters & Tabs state
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'retention' | 'providers' | 'marketing'>('overview');
  const [dateRange, setDateRange] = useState('1-30 Sep 2026');
  const [comparison, setComparison] = useState('vs Aug 2026');
  const [selectedProvider, setSelectedProvider] = useState('All providers');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Lift Recommendation State
  const [slotsLiftApplied, setSlotsLiftApplied] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplySlotLift = () => {
    setSlotsLiftApplied(true);
    triggerConfetti();
    showToast('Applied! 6 laser slots opened for Dr. Ortiz. Projected utilization lifted to 76%.');
  };

  const handleExport = (format: string) => {
    setIsExportModalOpen(false);
    triggerConfetti();
    showToast(`Exporting comprehensive ${format} report for ${dateRange}...`);
  };

  // Funnel data
  const funnelStages = [
    { name: 'Consult', rate: '100%', count: '212 clients', height: 100, isHighlight: false, color: 'bg-[#DDD6FE]' },
    { name: 'Plan', rate: '84%', count: '178 clients', height: 84, isHighlight: false, color: 'bg-[#DDD6FE]' },
    { name: 'Consent', rate: '58%', count: '123 clients', height: 58, isHighlight: true, color: 'bg-[#F6BA47]', note: 'Biggest drop' },
    { name: 'Appt', rate: '55%', count: '117 clients', height: 55, isHighlight: false, color: 'bg-[#DDD6FE]' },
    { name: 'Treated', rate: '53%', count: '112 clients', height: 53, isHighlight: false, color: 'bg-[#DDD6FE]' },
    { name: 'Aftercare', rate: '53%', count: '112 clients', height: 53, isHighlight: false, color: 'bg-[#DDD6FE]' },
    { name: 'Follow-up', rate: '47%', count: '100 clients', height: 47, isHighlight: false, color: 'bg-[#DDD6FE]' },
    { name: 'Rebooked', rate: '36%', count: '76 clients', height: 36, isHighlight: true, color: 'bg-[#BEE68D]', isSuccess: true },
  ];

  // Cohort Heatmap Data (Apr - Aug, M1 - M5)
  const cohortMatrix = [
    { month: 'Apr', m1: '78%', m2: '69%', m3: '64%', m4: '61%', m5: '58%' },
    { month: 'May', m1: '81%', m2: '72%', m3: '66%', m4: '62%', m5: null },
    { month: 'Jun', m1: '76%', m2: '70%', m3: '63%', m4: null, m5: null },
    { month: 'Jul', m1: '83%', m2: '74%', m3: null, m4: null, m5: null },
    { month: 'Aug', m1: '85%', m2: null, m3: null, m4: null, m5: null },
  ];

  const getHeatmapColor = (val: string | null) => {
    if (!val) return 'bg-[#F8FAFC] text-transparent border border-slate-100';
    const num = parseInt(val);
    if (num >= 80) return 'bg-[#7C3AED] text-white font-bold shadow-xs';
    if (num >= 70) return 'bg-[#8B5CF6] text-white font-medium';
    if (num >= 65) return 'bg-[#A78BFA] text-white';
    if (num >= 60) return 'bg-[#C4B5FD] text-slate-800';
    return 'bg-[#DDD6FE] text-slate-800';
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-16 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#161616] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm animate-bounce-short">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Context & Global Utility */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">Reports</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            September 2026 · BufferMate Intelligence · compared with August
          </p>
        </div>

        {/* Search, Notifications & Export CTA */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients, treatments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-white rounded-full border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 shadow-2xs transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </span>
          </div>

          <button 
            onClick={() => showToast('No new unread messages')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors shrink-0"
            title="Messages"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button 
            onClick={() => showToast('All notifications are up to date')}
            className="relative w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors shrink-0"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export report</span>
          </button>
        </div>
      </div>

      {/* FILTER & SUB-NAV ROW WITH CHEVRON STEPPER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        {/* Adopted Reusable Chevron Stepper Component for Reports Sub-Navigation */}
        <div className="w-full lg:max-w-2xl overflow-x-auto">
          <ChevronStepper
            steps={[
              { id: 'overview', title: 'Overview', subtitle: 'Executive KPI Summary' },
              { id: 'revenue', title: 'Revenue', subtitle: 'Attribution & MRR' },
              { id: 'retention', title: 'Retention', subtitle: 'Cohort & LTV' },
              { id: 'providers', title: 'Providers', subtitle: 'Staff Productivity' },
              { id: 'marketing', title: 'Marketing', subtitle: 'Campaign ROI' },
            ]}
            currentStep={activeTab}
            onChange={(stepId) => setActiveTab(stepId as any)}
            variant="blue"
            size="sm"
            showNumbers={true}
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="relative">
            <button className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-700 flex items-center gap-2 shadow-2xs transition-colors whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="relative">
            <button className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors whitespace-nowrap">
              <span>{comparison}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="relative">
            <button className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors whitespace-nowrap">
              <span>{selectedProvider}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI BENTO ROW (5 CARDS WITH HARMONIOUS COLOR ACCENTS) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
        {/* 1. Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Revenue</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#161616]">
              $142,380
            </div>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center gap-0.5 bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                18.4%
              </span>
            </div>
          </div>
        </div>

        {/* 2. Average ticket */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Average ticket</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#161616]">
              $412
            </div>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center gap-0.5 bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                $26
              </span>
            </div>
          </div>
        </div>

        {/* 3. Rebooking rate (HERO LAVENDER CARD) */}
        <div className="bg-[#E9E4FD] rounded-3xl p-5 border border-[#DDD6FE] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-purple-900/80 mb-2">
            <span className="text-xs font-semibold">Rebooking rate</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-purple-700">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-bold tracking-tight text-purple-950">
              68%
            </div>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center gap-0.5 bg-white/90 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                <ArrowUpRight className="w-3 h-3" />
                4 pts
              </span>
            </div>
          </div>
        </div>

        {/* 4. New clients */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">New clients</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#161616]">
              38
            </div>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center gap-0.5 bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                9
              </span>
            </div>
          </div>
        </div>

        {/* 5. 90-day retention (SOFT MATCHA GREEN CARD) */}
        <div className="bg-[#EAF6DA] col-span-2 md:col-span-1 rounded-3xl p-5 border border-[#DCF0C4] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-emerald-900/80 mb-2">
            <span className="text-xs font-semibold">90-day retention</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#558327]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-bold tracking-tight text-emerald-950">
              74%
            </div>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center gap-0.5 bg-rose-100 text-rose-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                <ArrowDownRight className="w-3 h-3" />
                2 pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: 60/40 SPLIT (REVENUE BY CATEGORY & PROVIDER UTILISATION) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card (60%): Revenue by Category */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#161616]">Revenue by category</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Injectables drive 43% of revenue
                </p>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { name: 'Injectables', icon: Syringe, pct: 72, amount: '$61.2k', change: '+ 22%', positive: true },
                { name: 'Facials & skin', icon: Sparkle, pct: 44, amount: '$32.4k', change: '+ 14%', positive: true },
                { name: 'Laser & light', icon: Zap, pct: 36, amount: '$24.9k', change: '+ 0%', neutral: true },
                { name: 'Body contouring', icon: Activity, pct: 22, amount: '$12.8k', change: '+ 31%', positive: true },
                { name: 'Retail', icon: ShoppingBag, pct: 18, amount: '$11.1k', change: '- 3%', negative: true },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="w-28 sm:w-32 font-semibold text-slate-700 truncate">{item.name}</span>
                    
                    {/* Visual bar */}
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8B5CF6] rounded-full transition-all duration-700"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>

                    <span className="font-bold text-slate-900 w-14 text-right">{item.amount}</span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold w-14 text-center shrink-0 ${
                        item.positive
                          ? 'bg-[#E8F7D4] text-[#3B6B15]'
                          : item.negative
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.change}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Card (40%): Provider Utilisation */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#161616]">Provider utilisation</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Booked hours ÷ available hours · Sep
            </p>

            <div className="mt-5 space-y-4">
              {[
                {
                  name: 'Dr. Ines Varga',
                  role: 'Injector · $58.4k',
                  rate: 86,
                  avatar: 'https://images.unsplash.com/photo-1594824813524-8b6b15a9ecdb?w=100&auto=format&fit=crop&q=80',
                },
                {
                  name: 'Leo Park, RN',
                  role: 'Aesthetics · $34.1k',
                  rate: 78,
                  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
                },
                {
                  name: 'Nina Alvarez',
                  role: 'Skin therapist · $22.6k',
                  rate: 72,
                  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
                },
                {
                  name: 'Dr. James Ortiz',
                  role: 'Laser & body · $27.3k',
                  rate: slotsLiftApplied ? 76 : 64,
                  avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80',
                  highlight: true,
                },
              ].map((prov, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <img
                    src={prov.avatar}
                    alt={prov.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="w-28 sm:w-36 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{prov.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{prov.role}</p>
                  </div>

                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        prov.highlight && slotsLiftApplied
                          ? 'bg-[#10B981]'
                          : prov.highlight
                          ? 'bg-[#A3E635]'
                          : 'bg-[#7C3AED]'
                      }`}
                      style={{ width: `${prov.rate}%` }}
                    />
                  </div>

                  <span className="font-bold text-slate-900 w-8 text-right">{prov.rate}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Proactive Action Callout Strip at bottom of Provider card */}
          <div className="mt-5 pt-3 border-t border-slate-100">
            <div className="bg-[#EAF6DA] border border-[#DCF0C4] rounded-2xl p-2.5 px-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-[#2D5018] font-medium min-w-0">
                <Sparkles className="w-4 h-4 text-[#52802B] shrink-0" />
                <span className="truncate">
                  {slotsLiftApplied
                    ? '✓ 6 laser slots opened! Ortiz lifted to 76%'
                    : 'Open 6 Tue/Thu laser slots to lift Dr. Ortiz to ~75%'}
                </span>
              </div>
              {!slotsLiftApplied ? (
                <button
                  onClick={handleApplySlotLift}
                  className="bg-white hover:bg-slate-50 text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs shrink-0 transition-transform active:scale-95"
                >
                  Apply
                </button>
              ) : (
                <span className="text-[11px] font-bold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-full shrink-0">
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 55/45 SPLIT (JOURNEY CONVERSION FUNNEL & COHORT HEATMAP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card (55%): Journey conversion funnel */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#161616]">Journey conversion</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Share of September consultations that reached each stage
                </p>
              </div>

              {/* Anomaly Badge */}
              <div className="bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto border border-[#FDE68A]">
                <Info className="w-3 h-3" />
                <span>Biggest drop: Plan → Consent</span>
              </div>
            </div>

            {/* Vertical Bar Funnel Chart */}
            <div className="mt-8 flex items-end justify-between gap-1 sm:gap-2 h-44 sm:h-48 pt-4 pb-2 border-b border-slate-100">
              {funnelStages.map((stage, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[11px] font-bold text-slate-700 mb-1 group-hover:text-purple-600 transition-colors">
                    {stage.rate}
                  </span>
                  
                  {/* Bar */}
                  <div
                    className={`w-full max-w-[36px] ${stage.color} rounded-t-xl transition-all duration-500 group-hover:opacity-90 shadow-2xs`}
                    style={{ height: `${stage.height}%` }}
                    title={`${stage.name}: ${stage.count} (${stage.rate})`}
                  />
                  
                  {/* Stage Label */}
                  <div className="mt-2 text-center">
                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-800 leading-tight">
                      {stage.name}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">
                      {stage.count.split(' ')[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>212 Total initial consults</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              36% Final Rebooking Conversion
            </span>
          </div>
        </div>

        {/* Right Card (45%): Retention by first-visit month Cohort Heatmap */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#161616]">Retention by first-visit month</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              % of new clients who returned in month n
            </p>

            {/* Heatmap Matrix Table */}
            <div className="mt-6">
              {/* Header Columns */}
              <div className="grid grid-cols-6 gap-2 text-[11px] font-semibold text-slate-400 pb-2 text-center">
                <div className="text-left"></div>
                <div>M1</div>
                <div>M2</div>
                <div>M3</div>
                <div>M4</div>
                <div>M5</div>
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {cohortMatrix.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-6 gap-2 text-xs items-center">
                    <span className="font-semibold text-slate-600 text-left text-xs">
                      {row.month}
                    </span>
                    <div className={`h-8 rounded-xl flex items-center justify-center text-[11px] ${getHeatmapColor(row.m1)}`}>
                      {row.m1}
                    </div>
                    <div className={`h-8 rounded-xl flex items-center justify-center text-[11px] ${getHeatmapColor(row.m2)}`}>
                      {row.m2}
                    </div>
                    <div className={`h-8 rounded-xl flex items-center justify-center text-[11px] ${getHeatmapColor(row.m3)}`}>
                      {row.m3}
                    </div>
                    <div className={`h-8 rounded-xl flex items-center justify-center text-[11px] ${getHeatmapColor(row.m4)}`}>
                      {row.m4}
                    </div>
                    <div className={`h-8 rounded-xl flex items-center justify-center text-[11px] ${getHeatmapColor(row.m5)}`}>
                      {row.m5}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Heatmap Legend */}
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Low</span>
            <div className="flex items-center gap-1">
              <span className="w-5 h-2 rounded-xs bg-[#DDD6FE]"></span>
              <span className="w-5 h-2 rounded-xs bg-[#C4B5FD]"></span>
              <span className="w-5 h-2 rounded-xs bg-[#A78BFA]"></span>
              <span className="w-5 h-2 rounded-xs bg-[#8B5CF6]"></span>
              <span className="w-5 h-2 rounded-xs bg-[#7C3AED]"></span>
            </div>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* EXPORT REPORT MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#161616]">Export Performance Report</h3>
                <p className="text-xs text-slate-500 mt-0.5">September 2026 executive summary & raw metrics</p>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleExport('PDF Presentation')}
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-purple-900">
                    Executive PDF Report
                  </div>
                  <div className="text-[11px] text-slate-500">
                    High-res visual graphs, insights, and provider rankings.
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
              </button>

              <button
                onClick={() => handleExport('CSV Spreadsheet')}
                className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 text-left flex items-center justify-between transition-all group"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-purple-900">
                    Raw Metrics (CSV / Excel)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Complete row-by-row consultations, tickets, and cohorts.
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
              </button>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
