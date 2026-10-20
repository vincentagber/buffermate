'use client';

import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  Bell,
  Plus,
  Crown,
  Star,
  Shield,
  Check,
  AlertTriangle,
  ChevronRight,
  Filter,
  Sparkles,
  RefreshCw,
  Send,
  MoreHorizontal,
  ArrowUpRight,
  ChevronDown,
  X,
  HeartHandshake,
  Clock,
  Cake,
  TrendingUp,
  Percent
} from 'lucide-react';
import { triggerConfetti } from '@/components/ui/Confetti';

interface MembershipsRetentionViewProps {
  onOpenNewCampaign?: () => void;
}

export default function MembershipsRetentionView({ onOpenNewCampaign }: MembershipsRetentionViewProps) {
  // Filter tabs: 'all' | 'at_risk' | 'renewing' | 'paused'
  const [activeFilter, setActiveFilter] = useState<'all' | 'at_risk' | 'renewing' | 'paused'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('Last 6 months');
  
  // Interactive Modals
  const [isWinBackModalOpen, setIsWinBackModalOpen] = useState(false);
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Automations live state
  const [automations, setAutomations] = useState([
    {
      id: 'auto-1',
      title: 'Rebooking nudge',
      rule: '10 wks after Botox',
      stat: '84% book',
      active: true,
      icon: RefreshCw,
    },
    {
      id: 'auto-2',
      title: 'Aftercare check-in',
      rule: '48 h after any treatment',
      stat: '98% open',
      active: true,
      icon: HeartHandshake,
    },
    {
      id: 'auto-3',
      title: 'Renewal reminder',
      rule: '7 days before billing',
      stat: '92% renew',
      active: true,
      icon: Clock,
    },
    {
      id: 'auto-4',
      title: 'Win-back',
      rule: '90 days inactive',
      stat: '18% return',
      active: true,
      icon: Sparkles,
    },
    {
      id: 'auto-5',
      title: 'Birthday perk',
      rule: '$25 credit',
      stat: 'paused',
      active: false,
      icon: Cake,
    },
  ]);

  const handleToggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newState = !a.active;
          showToast(`${a.title} is now ${newState ? 'enabled' : 'paused'}`);
          return { ...a, active: newState };
        }
        return a;
      })
    );
  };

  // Members dataset matching screenshot
  const allMembers = [
    {
      id: 'm1',
      name: 'Emma Wilson',
      joined: 'Since Mar 2023',
      tier: 'Gold',
      credits: '1 left',
      lastVisit: 'Today',
      retention: 92,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'm2',
      name: 'Chloe Bennett',
      joined: 'Since Jan 2024',
      tier: 'Silver',
      credits: '0 left',
      lastVisit: 'Today',
      retention: 84,
      status: 'renewing',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'm3',
      name: 'Runa Ostby',
      joined: 'Since Jun 2025',
      tier: 'Platinum',
      credits: '2 left',
      lastVisit: '14 Jul',
      retention: 38,
      status: 'at_risk',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'm4',
      name: 'Sofia Laurent',
      joined: 'Since Nov 2024',
      tier: 'Gold',
      credits: '1 left',
      lastVisit: '21 Aug',
      retention: 76,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'm5',
      name: 'Hannah Brooks',
      joined: 'Since Feb 2025',
      tier: 'Gold',
      credits: '3 unused',
      lastVisit: '02 Jun',
      retention: 24,
      status: 'at_risk',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'm6',
      name: 'Mei Tanaka',
      joined: 'Since Aug 2025',
      tier: 'Silver',
      credits: '1 left',
      lastVisit: '02 Jul',
      retention: 68,
      status: 'paused',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&auto=format&fit=crop&q=80',
    },
  ];

  // Filtered members list
  const filteredMembers = allMembers.filter((m) => {
    if (activeFilter === 'at_risk' && m.status !== 'at_risk') return false;
    if (activeFilter === 'renewing' && m.status !== 'renewing') return false;
    if (activeFilter === 'paused' && m.status !== 'paused') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.tier.toLowerCase().includes(q);
    }
    return true;
  });

  const getRetentionBarColor = (score: number) => {
    if (score >= 75) return 'bg-[#10B981]'; // Green
    if (score >= 50) return 'bg-[#8B5CF6]'; // Purple
    return 'bg-[#EF4444]'; // Red
  };

  const getTierBadge = (tier: string) => {
    if (tier === 'Platinum') {
      return <span className="bg-[#161616] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Platinum</span>;
    }
    if (tier === 'Gold') {
      return <span className="bg-[#EDE9FE] text-[#6D28D9] text-[10px] font-bold px-2 py-0.5 rounded-full">Gold</span>;
    }
    return <span className="bg-[#F1F5F9] text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Silver</span>;
  };

  const handleSendWinBack = () => {
    setIsWinBackModalOpen(false);
    triggerConfetti();
    showToast('Win-back campaign dispatched to 12 at-risk members with $25 re-engagement credit!');
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">
            Memberships & retention
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            412 active members · $38.4k monthly recurring revenue
          </p>
        </div>

        {/* Search, Notifications & New Campaign CTA */}
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
          </button>

          <button
            onClick={() => {
              if (onOpenNewCampaign) onOpenNewCampaign();
              else setIsNewCampaignModalOpen(true);
            }}
            className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New campaign</span>
          </button>
        </div>
      </div>

      {/* TOP ROW: BENTO GRID (HERO MRR CARD + 3 TIER CARDS: WHITE, LAVENDER, OBSIDIAN) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
        {/* Card 1: Monthly Recurring Revenue (Hero Pastel Green Card - 4.5 cols) */}
        <div className="md:col-span-12 lg:col-span-4 bg-[#EAF6DA] rounded-3xl p-6 border border-[#DCF0C4] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-950">Monthly recurring revenue</span>
              <button className="bg-white/80 hover:bg-white text-[11px] font-semibold text-emerald-900 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                <span>{timeRange}</span>
                <ChevronDown className="w-3 h-3 text-emerald-700" />
              </button>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-950">
                $38,388
              </div>
              <span className="bg-white/80 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                loyalty
              </span>
            </div>

            <p className="text-xs text-emerald-900/80 font-medium mt-1">
              <span className="font-bold text-emerald-950">↑ $2,980</span> vs August · churn 2.1%
            </p>
          </div>

          {/* Mini 6-Month Stacked Bar Chart */}
          <div className="mt-6 pt-2">
            <div className="flex items-end justify-between gap-2 h-20">
              {[
                { m: 'Apr', h: 62 },
                { m: 'May', h: 68 },
                { m: 'Jun', h: 74 },
                { m: 'Jul', h: 81 },
                { m: 'Aug', h: 88 },
                { m: 'Sep', h: 100 },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div
                    className="w-full rounded-t-lg overflow-hidden flex flex-col justify-end"
                    style={{ height: `${bar.h}%` }}
                  >
                    {/* Stacked tiers: Platinum (Dark), Gold (Purple), Silver (Light) */}
                    <div className="h-[20%] bg-[#161616]" title="Platinum tier" />
                    <div className="h-[50%] bg-[#8B5CF6]" title="Gold tier" />
                    <div className="h-[30%] bg-[#C4B5FD]" title="Silver tier" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-900/70 mt-1.5">{bar.m}</span>
                </div>
              ))}
            </div>

            {/* Legend pills */}
            <div className="flex items-center justify-between text-[10px] text-emerald-900/70 font-semibold mt-3 pt-2 border-t border-emerald-900/10">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#161616]"></span> Platinum
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span> Gold
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C4B5FD]"></span> Silver
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Silver Tier (Clean White Card - 2.5 cols) */}
        <div className="md:col-span-4 lg:col-span-2.5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-xs text-slate-800">Silver</span>
              </div>
              <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#161616]">$59</span>
                <span className="text-xs text-slate-400 font-medium">/ mo</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                <span>1 facial credit monthly</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                <span>10% off add-ons</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
              <span>168 members</span>
              <span>41%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: '41%' }} />
            </div>
          </div>
        </div>

        {/* Card 3: Gold Tier (HIGHLIGHTED LAVENDER CARD - 2.8 cols) */}
        <div className="md:col-span-4 lg:col-span-3 bg-[#E9E4FD] rounded-3xl p-5 sm:p-6 border border-[#DDD6FE] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-purple-700" />
                <span className="font-bold text-xs text-purple-950">Gold</span>
              </div>
              <span className="bg-[#161616] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wide">
                Most popular
              </span>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-purple-950">$99</span>
                <span className="text-xs text-purple-800/70 font-medium">/ mo</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-purple-950/80">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-800 shrink-0" />
                <span>Botox credit $60 / month</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-800 shrink-0" />
                <span>10% off treatment plans</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-800 shrink-0" />
                <span>Priority booking</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3 border-t border-purple-200/50">
            <div className="flex items-center justify-between text-[11px] font-semibold text-purple-950 mb-1.5">
              <span>196 members</span>
              <span>48%</span>
            </div>
            <div className="h-1.5 w-full bg-purple-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-[#161616] rounded-full" style={{ width: '48%' }} />
            </div>
          </div>
        </div>

        {/* Card 4: Platinum Tier (MIDNIGHT OBSIDIAN VIP CARD - 2.5 cols) */}
        <div className="md:col-span-4 lg:col-span-2.5 bg-[#161616] text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs text-white">Platinum</span>
              </div>
              <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">$189</span>
                <span className="text-xs text-slate-400 font-medium">/ mo</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>2 treatment credits</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>15% off everything</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Free skin scan quarterly</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1.5">
              <span>48 members</span>
              <span>12%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '12%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 65/35 SPLIT (MEMBERS TABLE & ACTIONS/AUTOMATIONS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (65%): Members Management Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-1 overflow-x-auto">
                <span className="text-base font-bold text-[#161616] mr-2">Members</span>
                
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFilter === 'all'
                      ? 'bg-[#161616] text-white'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  All 412
                </button>

                <button
                  onClick={() => setActiveFilter('at_risk')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                    activeFilter === 'at_risk'
                      ? 'bg-rose-600 text-white'
                      : 'text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <span>At risk</span>
                  <span className="font-bold">12</span>
                </button>

                <button
                  onClick={() => setActiveFilter('renewing')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFilter === 'renewing'
                      ? 'bg-[#161616] text-white'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Renewing 38
                </button>

                <button
                  onClick={() => setActiveFilter('paused')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFilter === 'paused'
                      ? 'bg-[#161616] text-white'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Paused 5
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100">
                  <Filter className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <th className="py-2.5 font-bold">MEMBER</th>
                    <th className="py-2.5 font-bold">TIER</th>
                    <th className="py-2.5 font-bold">CREDITS</th>
                    <th className="py-2.5 font-bold">LAST VISIT</th>
                    <th className="py-2.5 font-bold">RETENTION</th>
                    <th className="py-2.5 text-right font-bold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Member Info */}
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{member.name}</p>
                            <p className="text-[10px] text-slate-400">{member.joined}</p>
                          </div>
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3 px-2">
                        {getTierBadge(member.tier)}
                      </td>

                      {/* Credits */}
                      <td className="py-3 px-2 font-medium text-slate-700">
                        {member.credits}
                      </td>

                      {/* Last Visit */}
                      <td className="py-3 px-2 text-slate-500 font-medium">
                        {member.lastVisit}
                      </td>

                      {/* Retention Indicator Bar + Score */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getRetentionBarColor(member.retention)}`}
                              style={{ width: `${member.retention}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700 w-5">{member.retention}</span>
                        </div>
                      </td>

                      {/* Row Action */}
                      <td className="py-3 pl-2 text-right">
                        <button className="text-slate-400 group-hover:text-slate-700 p-1 rounded-full hover:bg-slate-100">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 1-6 of 412 members</span>
            
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
                ‹
              </button>
              <button className="w-7 h-7 rounded-full bg-[#161616] text-white font-bold flex items-center justify-center text-xs">
                1
              </button>
              <button className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-xs text-slate-600">
                2
              </button>
              <button className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-xs text-slate-600">
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-xs text-slate-600">
                69
              </button>
              <button className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (35%): Action & Automations */}
        <div className="lg:col-span-4 space-y-4">
          {/* URGENT AT-RISK CHURN INTERCEPTOR CARD */}
          <div className="bg-[#FFF1ED] rounded-3xl p-5 border border-[#FFE2D9] shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFE2D9] text-[#C84A2A] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-extrabold text-[#8C2E15]">$1,640 MRR at risk</h4>
                <p className="text-xs text-[#A8482D] mt-0.5 font-medium">
                  12 members haven't visited in 60+ days
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => setIsWinBackModalOpen(true)}
                className="bg-[#161616] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Draft win-back offer</span>
              </button>

              <button
                onClick={() => {
                  setActiveFilter('at_risk');
                  showToast('Viewing 12 at-risk members');
                }}
                className="bg-transparent hover:bg-[#FFE2D9]/50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-full transition-colors"
              >
                View list
              </button>
            </div>
          </div>

          {/* AUTOMATIONS PANEL */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-[#161616]">Automations</h4>
                <button
                  onClick={() => {
                    if (onOpenNewCampaign) onOpenNewCampaign();
                    else setIsNewCampaignModalOpen(true);
                  }}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900"
                >
                  + New
                </button>
              </div>

              {/* Automations list */}
              <div className="mt-3 divide-y divide-slate-100">
                {automations.map((auto) => {
                  const Icon = auto.icon;
                  return (
                    <div key={auto.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{auto.title}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {auto.rule} · <span className="font-semibold text-emerald-700">{auto.stat}</span>
                          </p>
                        </div>
                      </div>

                      {/* iOS-style toggle */}
                      <button
                        onClick={() => handleToggleAutomation(auto.id)}
                        className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${
                          auto.active ? 'bg-[#161616]' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
                            auto.active ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ATTRIBUTED ROI FOOTER BANNER */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => showToast('Opening Q3 attribution report...')}
                className="w-full bg-slate-50 hover:bg-slate-100 p-2.5 px-3 rounded-2xl flex items-center justify-between text-left transition-colors group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">186 rebookings driven this quarter</p>
                  <p className="text-[10px] text-emerald-700 font-semibold">≈ $41.2k attributed revenue</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DRAFT WIN-BACK OFFER MODAL */}
      {isWinBackModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FFE2D9] text-[#C84A2A] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#161616]">Draft Win-Back Campaign</h3>
                  <p className="text-xs text-slate-500">Targeting 12 members inactive for 60+ days ($1,640 MRR)</p>
                </div>
              </div>
              <button
                onClick={() => setIsWinBackModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  AI Generated Message
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  "Hi [First Name], we noticed you have unused treatment credits waiting on your Lumière membership. We'd love to see you this month! Book by Friday and receive a complimentary hydration boost on us."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Recovery</span>
                  <div className="font-bold text-slate-900 mt-0.5">8-10 Members (~$1,320)</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Channels</span>
                  <div className="font-bold text-slate-900 mt-0.5">SMS + Direct WhatsApp</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsWinBackModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSendWinBack}
                className="bg-[#161616] hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch Win-back Offer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW CAMPAIGN MODAL */}
      {isNewCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#161616]">New Retention Campaign</h3>
                <p className="text-xs text-slate-500">Automate member rewards, rebooking triggers & perks</p>
              </div>
              <button
                onClick={() => setIsNewCampaignModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 VIP Loyalty Booster"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Target Segment</label>
                <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500">
                  <option>All Gold & Platinum members</option>
                  <option>Members with &gt; 2 unused credits</option>
                  <option>Members approaching 1-year anniversary</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsNewCampaignModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsNewCampaignModalOpen(false);
                  triggerConfetti();
                  showToast('Retention campaign created and activated!');
                }}
                className="bg-[#161616] hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Create Campaign</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
