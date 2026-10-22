'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sliders,
  Sparkles,
  Search,
  Check,
  MoreHorizontal
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';
import { triggerConfetti } from '@/components/ui/Confetti';

export interface Campaign {
  id: string;
  name: string;
  goal: string;
  channels: string[];
  status: 'Running' | 'Needs you' | 'Scheduled' | 'Paused' | 'Done';
  spend: number;
  budget: number;
  resultMetric: string;
  resultLabel: string;
  channelBreakdown: {
    channel: string;
    amount: number;
    color: string;
    percent: number;
  }[];
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'scorecard-lead-gen',
    name: 'Scorecard lead-gen',
    goal: 'Generate 100 qualified leads',
    channels: ['linkedin', 'facebook', 'instagram', 'googleads'],
    status: 'Running',
    spend: 4180,
    budget: 6000,
    resultMetric: '78 MQL',
    resultLabel: 'live tracking',
    channelBreakdown: [
      { channel: 'LinkedIn', amount: 2150, percent: 51, color: 'bg-[#7C3AED]' },
      { channel: 'Facebook', amount: 1230, percent: 29, color: 'bg-[#8B5CF6]' },
      { channel: 'Google Ads', amount: 800, percent: 20, color: 'bg-[#10B981]' },
    ],
  },
  {
    id: 'northstar-insights-launch',
    name: 'Northstar Insights launch',
    goal: 'Launch in 30 days',
    channels: ['linkedin', 'instagram', 'x', 'youtube'],
    status: 'Running',
    spend: 3200,
    budget: 5000,
    resultMetric: '54 MQL',
    resultLabel: 'live tracking',
    channelBreakdown: [
      { channel: 'LinkedIn', amount: 1600, percent: 50, color: 'bg-[#7C3AED]' },
      { channel: 'X (Twitter)', amount: 900, percent: 28, color: 'bg-[#161616]' },
      { channel: 'YouTube', amount: 700, percent: 22, color: 'bg-[#EF4444]' },
    ],
  },
  {
    id: 'proof-week',
    name: 'Proof week',
    goal: 'Social proof',
    channels: ['linkedin', 'instagram', 'tiktok'],
    status: 'Needs you',
    spend: 1850,
    budget: 2500,
    resultMetric: '32 MQL',
    resultLabel: 'pending asset review',
    channelBreakdown: [
      { channel: 'TikTok', amount: 950, percent: 51, color: 'bg-[#161616]' },
      { channel: 'Instagram', amount: 500, percent: 27, color: 'bg-[#E1306C]' },
      { channel: 'LinkedIn', amount: 400, percent: 22, color: 'bg-[#7C3AED]' },
    ],
  },
  {
    id: 'founder-notes',
    name: 'Founder notes',
    goal: 'Organic authority',
    channels: ['linkedin', 'x', 'threads'],
    status: 'Running',
    spend: 820,
    budget: 1500,
    resultMetric: '19 MQL',
    resultLabel: 'high engagement',
    channelBreakdown: [
      { channel: 'LinkedIn', amount: 500, percent: 61, color: 'bg-[#7C3AED]' },
      { channel: 'X (Twitter)', amount: 200, percent: 24, color: 'bg-[#161616]' },
      { channel: 'Threads', amount: 120, percent: 15, color: 'bg-[#64748B]' },
    ],
  },
];

export default function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Running' | 'Needs you' | 'Scheduled' | 'Paused' | 'Done'>('All');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('scorecard-lead-gen');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Form State
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignGoal, setNewCampaignGoal] = useState('');
  const [newCampaignBudget, setNewCampaignBudget] = useState('5000');
  const [newSelectedChannels, setNewSelectedChannels] = useState<string[]>(['linkedin', 'instagram']);

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  const counts = {
    All: campaigns.length,
    Running: campaigns.filter((c) => c.status === 'Running').length,
    'Needs you': campaigns.filter((c) => c.status === 'Needs you').length,
    Scheduled: campaigns.filter((c) => c.status === 'Scheduled').length,
    Paused: campaigns.filter((c) => c.status === 'Paused').length,
    Done: campaigns.filter((c) => c.status === 'Done').length,
  };

  const filteredCampaigns = campaigns.filter((c) => {
    if (selectedFilter !== 'All' && c.status !== selectedFilter) return false;
    if (searchQuery.trim()) {
      return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.goal.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;

    const budgetNum = parseFloat(newCampaignBudget) || 3000;
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: newCampaignName,
      goal: newCampaignGoal || 'Lead generation & brand awareness',
      channels: newSelectedChannels.length > 0 ? newSelectedChannels : ['linkedin', 'instagram'],
      status: 'Running',
      spend: 0,
      budget: budgetNum,
      resultMetric: '0 MQL',
      resultLabel: 'new campaign',
      channelBreakdown: [
        { channel: 'LinkedIn', amount: Math.round(budgetNum * 0.6), percent: 60, color: 'bg-[#7C3AED]' },
        { channel: 'Instagram', amount: Math.round(budgetNum * 0.4), percent: 40, color: 'bg-[#8B5CF6]' },
      ],
    };

    setCampaigns([newCamp, ...campaigns]);
    setSelectedCampaignId(newCamp.id);
    setIsNewModalOpen(false);
    setNewCampaignName('');
    setNewCampaignGoal('');
    triggerConfetti();
    showToast(`Campaign "${newCampaignName}" launched successfully!`);
  };

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'Running':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F7D4] text-[#3B6B15]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B6B15] mr-1.5 animate-pulse"></span>
            Running
          </span>
        );
      case 'Needs you':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#B45309]">
            <AlertCircle className="w-3 h-3 mr-1" />
            Needs you
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#6D28D9]">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </span>
        );
      case 'Paused':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
            <PauseCircle className="w-3 h-3 mr-1" />
            Paused
          </span>
        );
      case 'Done':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Done
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-900 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#161616] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm animate-bounce-short">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER: Context, Search & New Campaign CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">Campaigns</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            4 active marketing flights · $10,050 total spend to date · BufferMate Growth
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campaigns, goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-white rounded-full border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 shadow-2xs transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </span>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New campaign</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEGMENTED TABS */}
      <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-slate-200/60 shadow-2xs w-fit overflow-x-auto">
        {(['All', 'Running', 'Needs you', 'Scheduled', 'Paused', 'Done'] as const).map((filterKey) => {
          const isActive = selectedFilter === filterKey;
          const count = counts[filterKey];

          return (
            <button
              key={filterKey}
              onClick={() => setSelectedFilter(filterKey)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#161616] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              {filterKey} {count}
            </button>
          );
        })}
      </div>

      {/* BENTO KPI SUMMARY ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Spend</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">$10,050</div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                67% of total budget
              </span>
            </div>
          </div>
        </div>

        {/* LAVENDER ACCENT CARD */}
        <div className="bg-[#E9E4FD] rounded-3xl p-5 border border-[#DDD6FE] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-900/80 mb-2">
            <span className="text-xs font-semibold">Total MQL Results</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-purple-700">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-purple-950">183 MQL</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                +28% vs previous month
              </span>
            </div>
          </div>
        </div>

        {/* SAGE GREEN ACCENT CARD */}
        <div className="bg-[#EAF6DA] rounded-3xl p-5 border border-[#DCF0C4] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-900/80 mb-2">
            <span className="text-xs font-semibold">Active Flights</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#558327]">
              <Megaphone className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-emerald-950">4 Live</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                3 on track · 1 review
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Cost per MQL</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">$54.91</div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                -12% acquisition cost
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CAMPAIGNS TABLE LIST (Clean Luxury Squircle Container) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs space-y-4">
        <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100 px-3">
          <div className="col-span-8">CAMPAIGN</div>
          <div className="col-span-4 text-right">CHANNELS</div>
        </div>

        {/* Rows */}
        <div className="space-y-1.5">
          {filteredCampaigns.map((camp) => {
            const isSelected = camp.id === selectedCampaignId;

            return (
              <div
                key={camp.id}
                onClick={() => setSelectedCampaignId(camp.id)}
                className={`grid grid-cols-12 items-center p-4 rounded-2xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#E9E4FD] border-[#DDD6FE] shadow-2xs'
                    : 'bg-white border-transparent hover:bg-slate-50'
                }`}
              >
                {/* Left: Campaign Info */}
                <div className="col-span-8 space-y-0.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-bold text-sm text-[#161616]">
                      {camp.name}
                    </span>
                    {getStatusBadge(camp.status)}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {camp.goal}
                  </div>
                </div>

                {/* Right: Channel Icons */}
                <div className="col-span-4 flex items-center justify-end space-x-2">
                  {camp.channels.map((ch, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-2xs hover:scale-105 transition-transform"
                      title={ch}
                    >
                      <SocialPlatformIcon channel={ch} className="w-3.5 h-3.5" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredCampaigns.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No campaigns matching filter "{selectedFilter}".
            </div>
          )}
        </div>
      </div>

      {/* SELECTED CAMPAIGN DETAIL CARD */}
      {selectedCampaign && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                CAMPAIGN DETAILS
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#161616] tracking-tight mt-0.5">
                {selectedCampaign.name}
              </h2>
            </div>
            {getStatusBadge(selectedCampaign.status)}
          </div>

          {/* Spend and Result Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SPEND */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                SPEND PACING
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#161616]">
                ${selectedCampaign.spend.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {Math.round((selectedCampaign.spend / (selectedCampaign.budget || 1)) * 100)}% of ${selectedCampaign.budget.toLocaleString()} budget to date
              </div>
            </div>

            {/* RESULT */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                MEASURED OUTCOME
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#161616]">
                {selectedCampaign.resultMetric}
              </div>
              <div className="text-xs text-emerald-700 font-semibold">
                {selectedCampaign.resultLabel}
              </div>
            </div>
          </div>

          {/* Spend by channel bars */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-[#161616]">
              Budget allocation by channel
            </div>

            <div className="space-y-3">
              {selectedCampaign.channelBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.channel}</span>
                    <span className="font-bold text-[#161616]">
                      ${item.amount.toLocaleString()} ({item.percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Campaign Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-100 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#161616]">Create New Campaign</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn Facial Glow Blitz"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campaign Goal / Objective
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50 new consultation bookings"
                  value={newCampaignGoal}
                  onChange={(e) => setNewCampaignGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Budget (USD)
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  value={newCampaignBudget}
                  onChange={(e) => setNewCampaignBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#161616] hover:bg-black text-white text-xs font-bold rounded-full shadow-sm transition-transform active:scale-95"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
