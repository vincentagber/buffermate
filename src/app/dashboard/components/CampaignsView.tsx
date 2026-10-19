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
  Sparkles
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
      { channel: 'LinkedIn', amount: 2150, percent: 51, color: 'bg-[#4338CA]' },
      { channel: 'Facebook', amount: 1230, percent: 29, color: 'bg-[#EF4444]' },
      { channel: 'Google Ads', amount: 800, percent: 20, color: 'bg-[#14B8A6]' },
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
      { channel: 'LinkedIn', amount: 1600, percent: 50, color: 'bg-[#4338CA]' },
      { channel: 'X (Twitter)', amount: 900, percent: 28, color: 'bg-[#0F172A]' },
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
      { channel: 'TikTok', amount: 950, percent: 51, color: 'bg-[#0F172A]' },
      { channel: 'Instagram', amount: 500, percent: 27, color: 'bg-[#E1306C]' },
      { channel: 'LinkedIn', amount: 400, percent: 22, color: 'bg-[#4338CA]' },
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
      { channel: 'LinkedIn', amount: 500, percent: 61, color: 'bg-[#4338CA]' },
      { channel: 'X (Twitter)', amount: 320, percent: 39, color: 'bg-[#0F172A]' },
    ],
  },
  {
    id: 'diwali-offer',
    name: 'Diwali offer',
    goal: 'Seasonal promo',
    channels: ['instagram', 'facebook', 'whatsapp'],
    status: 'Done',
    spend: 5000,
    budget: 5000,
    resultMetric: '112 MQL',
    resultLabel: 'target exceeded',
    channelBreakdown: [
      { channel: 'WhatsApp', amount: 2400, percent: 48, color: 'bg-[#10B981]' },
      { channel: 'Instagram', amount: 1600, percent: 32, color: 'bg-[#E1306C]' },
      { channel: 'Facebook', amount: 1000, percent: 20, color: 'bg-[#3B82F6]' },
    ],
  },
  {
    id: 'q3-webinar',
    name: 'Q3 webinar',
    goal: 'Event registrations',
    channels: ['linkedin', 'youtube'],
    status: 'Scheduled',
    spend: 0,
    budget: 3500,
    resultMetric: '0 MQL',
    resultLabel: 'launches in 5 days',
    channelBreakdown: [
      { channel: 'LinkedIn', amount: 2200, percent: 63, color: 'bg-[#4338CA]' },
      { channel: 'YouTube', amount: 1300, percent: 37, color: 'bg-[#EF4444]' },
    ],
  },
];

export default function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Running' | 'Needs you' | 'Scheduled' | 'Paused' | 'Done'>('All');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('scorecard-lead-gen');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Campaign Form State
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignGoal, setNewCampaignGoal] = useState('');
  const [newCampaignBudget, setNewCampaignBudget] = useState('5000');
  const [newSelectedChannels, setNewSelectedChannels] = useState<string[]>(['linkedin', 'instagram']);

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  // Counts for filter pills
  const counts = {
    All: campaigns.length,
    Running: campaigns.filter((c) => c.status === 'Running').length,
    'Needs you': campaigns.filter((c) => c.status === 'Needs you').length,
    Scheduled: campaigns.filter((c) => c.status === 'Scheduled').length,
    Paused: campaigns.filter((c) => c.status === 'Paused').length,
    Done: campaigns.filter((c) => c.status === 'Done').length,
  };

  const filteredCampaigns = campaigns.filter((c) => {
    if (selectedFilter === 'All') return true;
    return c.status === selectedFilter;
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
        { channel: 'LinkedIn', amount: Math.round(budgetNum * 0.6), percent: 60, color: 'bg-[#4338CA]' },
        { channel: 'Instagram', amount: Math.round(budgetNum * 0.4), percent: 40, color: 'bg-[#E1306C]' },
      ],
    };

    setCampaigns([newCamp, ...campaigns]);
    setSelectedCampaignId(newCamp.id);
    setIsNewModalOpen(false);
    setNewCampaignName('');
    setNewCampaignGoal('');
    triggerConfetti();
  };

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'Running':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            Running
          </span>
        );
      case 'Needs you':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Needs you
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </span>
        );
      case 'Done':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Done
          </span>
        );
      case 'Paused':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <PauseCircle className="w-3 h-3 mr-1" />
            Paused
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header Info matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
            PLAN
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-3xl">
            Every campaign with its goal, channels, budget and live results. Click one to open...
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#0F172A] hover:bg-black text-white text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Filter Pills matching Screenshot 1 */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['All', 'Running', 'Needs you', 'Scheduled', 'Paused', 'Done'] as const).map((filterKey) => {
          const isActive = selectedFilter === filterKey;
          const count = counts[filterKey];

          return (
            <button
              key={filterKey}
              onClick={() => setSelectedFilter(filterKey)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'bg-white text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] border border-[#E2E8F0]'
              }`}
            >
              {filterKey} {count}
            </button>
          );
        })}
      </div>

      {/* Campaigns Table List (Dotted borderlines maintained on white card) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-4">
        <div className="grid grid-cols-12 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider pb-2 border-b border-[#F1F5F9] px-3">
          <div className="col-span-8 sm:col-span-8">CAMPAIGN</div>
          <div className="col-span-4 sm:col-span-4 text-right">CHANNELS</div>
        </div>

        {/* Rows */}
        <div className="space-y-1">
          {filteredCampaigns.map((camp) => {
            const isSelected = camp.id === selectedCampaignId;

            return (
              <div
                key={camp.id}
                onClick={() => setSelectedCampaignId(camp.id)}
                className={`grid grid-cols-12 items-center p-3.5 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F8FAFC] border border-[#CBD5E1] shadow-xs'
                    : 'hover:bg-[#F8FAFC] border border-transparent'
                }`}
              >
                {/* Left: Campaign Info */}
                <div className="col-span-8 sm:col-span-8 space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs sm:text-sm text-[#0F172A]">
                      {camp.name}
                    </span>
                    {getStatusBadge(camp.status)}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {camp.goal}
                  </div>
                </div>

                {/* Right: Channel Icons */}
                <div className="col-span-4 sm:col-span-4 flex items-center justify-end space-x-1.5 sm:space-x-2">
                  {camp.channels.map((ch, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#475569] shadow-2xs hover:scale-105 transition-transform"
                      title={ch}
                    >
                      <SocialPlatformIcon channel={ch} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredCampaigns.length === 0 && (
            <div className="py-12 text-center text-xs text-[#94A3B8]">
              No campaigns matching filter "{selectedFilter}".
            </div>
          )}
        </div>
      </div>

      {/* Selected Campaign Detail Card matching Bottom of Screenshot 1 (Dotted borderlines maintained) */}
      {selectedCampaign && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-[#64748B] tracking-wider uppercase">
              CAMPAIGN
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                {selectedCampaign.name}
              </h2>
              {getStatusBadge(selectedCampaign.status)}
            </div>
          </div>

          {/* Spend and Result Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F1F5F9]">
            {/* SPEND */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                SPEND
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                ${selectedCampaign.spend.toLocaleString()}
              </div>
              <div className="text-xs text-[#64748B]">
                {Math.round((selectedCampaign.spend / (selectedCampaign.budget || 1)) * 100)}% of ${selectedCampaign.budget.toLocaleString()} to date
              </div>
            </div>

            {/* RESULT */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                RESULT
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {selectedCampaign.resultMetric}
              </div>
              <div className="text-xs text-[#64748B]">
                {selectedCampaign.resultLabel}
              </div>
            </div>
          </div>

          {/* Spend by channel bars matching Screenshot 1 */}
          <div className="space-y-3 pt-3 border-t border-[#F1F5F9]">
            <div className="text-xs font-bold text-[#0F172A]">
              Spend by channel
            </div>

            <div className="space-y-2.5">
              {selectedCampaign.channelBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#475569]">{item.channel}</span>
                    <span className="font-bold text-[#0F172A]">
                      ${item.amount.toLocaleString()} ({item.percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border-2 border-dashed border-[#CBD5E1] shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <h3 className="font-bold text-base text-[#0F172A]">Create New Campaign</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn Webinar Blitz"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Campaign Goal / Objective
                </label>
                <input
                  type="text"
                  placeholder="e.g. Generate 200 attendee signups"
                  value={newCampaignGoal}
                  onChange={(e) => setNewCampaignGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Budget ($ USD)
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  value={newCampaignBudget}
                  onChange={(e) => setNewCampaignBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1.5">
                  Target Channels
                </label>
                <div className="flex flex-wrap gap-2">
                  {['linkedin', 'instagram', 'facebook', 'tiktok', 'x', 'youtube', 'whatsapp'].map((ch) => {
                    const isSelected = newSelectedChannels.includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => {
                          setNewSelectedChannels((prev) =>
                            isSelected ? prev.filter((c) => c !== ch) : [...prev, ch]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                          isSelected
                            ? 'bg-[#EEF2FF] border-[#6366F1] text-[#6366F1]'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]'
                        }`}
                      >
                        <SocialPlatformIcon channel={ch} className="w-3.5 h-3.5" />
                        <span className="capitalize">{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F172A] hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs"
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
