'use client';

import React, { useState } from 'react';
import {
  Target,
  CheckSquare,
  MessageSquare,
  Radio,
  Users,
  Compass,
  FlaskConical,
  Bot,
  Plus,
  Search,
  Check,
  Send,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Award,
  Clock,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';
import { triggerConfetti } from '@/components/ui/Confetti';

// -------------------------------------------------------------
// 1. GOALS VIEW
// -------------------------------------------------------------
export function GoalsView() {
  const [goals, setGoals] = useState([
    {
      id: 'g1',
      title: 'Generate 100 qualified leads this month',
      target: 100,
      current: 78,
      metric: 'MQL',
      deadline: 'Oct 31, 2026',
      status: 'On track',
      color: 'bg-[#0D9488]',
    },
    {
      id: 'g2',
      title: 'Launch Northstar insights in 30 days',
      target: 30,
      current: 18,
      metric: 'Days',
      deadline: 'Nov 15, 2026',
      status: 'In progress',
      color: 'bg-[#D97706]',
    },
    {
      id: 'g3',
      title: 'Grow LinkedIn followers to 25K',
      target: 25000,
      current: 21100,
      metric: 'Followers',
      deadline: 'Dec 1, 2026',
      status: 'Ahead',
      color: 'bg-[#10B981]',
    },
    {
      id: 'g4',
      title: 'Reach $250K pipeline from social ads',
      target: 250000,
      current: 184200,
      metric: 'USD',
      deadline: 'Dec 31, 2026',
      status: 'On track',
      color: 'bg-[#6366F1]',
    },
  ]);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">PLAN</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Goals</h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Quarterly growth objectives, revenue targets, and predictive velocity forecasts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          return (
            <div
              key={g.id}
              className="bg-white rounded-3xl p-6 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-4 hover:border-[#94A3B8] transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    TARGET · {g.deadline}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-[#0F172A] mt-0.5">{g.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#475569]">
                  {g.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#64748B]">Progress</span>
                  <span className="text-[#0F172A]">
                    {g.current.toLocaleString()} / {g.target.toLocaleString()} {g.metric} ({pct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className={`h-full ${g.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. TASKS VIEW
// -------------------------------------------------------------
export function TasksView() {
  const [tasks, setTasks] = useState([
    { id: 't1', text: 'Approve LinkedIn carousel creatives for Proof Week', done: false, priority: 'High', due: 'Today' },
    { id: 't2', text: 'Set up Meta Pixel conversion tracking on scorecards', done: true, priority: 'Medium', due: 'Yesterday' },
    { id: 't3', text: 'Schedule founder notes for Tuesday & Thursday', done: false, priority: 'Medium', due: 'Tomorrow' },
    { id: 't4', text: 'Review inbound inquiries from TikTok comments', done: false, priority: 'Urgent', due: 'Today' },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div>
        <div className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">PLAN</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Tasks</h1>
        <p className="text-xs sm:text-sm text-[#64748B]">Actionable marketing assignments and crew queue.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-3">
        {tasks.map((t) => (
          <div
            key={t.id}
            onClick={() => toggleTask(t.id)}
            className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
              t.done ? 'bg-[#F8FAFC] border-transparent opacity-60' : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                  t.done ? 'bg-[#0F172A] border-[#0F172A] text-white' : 'border-[#CBD5E1]'
                }`}
              >
                {t.done && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-xs sm:text-sm font-semibold ${t.done ? 'line-through text-[#94A3B8]' : 'text-[#0F172A]'}`}>
                {t.text}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                {t.due}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. INBOX VIEW (Badge "7" in Screenshot)
// -------------------------------------------------------------
export function InboxView() {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'Sophia Miller',
      handle: '@sophia_m',
      channel: 'instagram',
      preview: 'Hey! Loved the scorecard launch. Where can I sign up for the enterprise tier?',
      time: '12m ago',
      unread: true,
    },
    {
      id: 'm2',
      sender: 'David Chen',
      handle: 'David Chen · VP Growth',
      channel: 'linkedin',
      preview: 'Interested in partnering on your Q3 webinar series. Do you have 15 mins this Friday?',
      time: '34m ago',
      unread: true,
    },
    {
      id: 'm3',
      sender: 'Alex Creative',
      handle: '@alex_creative',
      channel: 'tiktok',
      preview: 'Can you DM me the template link mentioned in your latest video?',
      time: '1h ago',
      unread: true,
    },
    {
      id: 'm4',
      sender: 'Marcus Vance',
      handle: '@marcus_v',
      channel: 'x',
      preview: 'Great thread on B2B social attribution! Agree with point #3.',
      time: '2h ago',
      unread: false,
    },
    {
      id: 'm5',
      sender: 'Elena Rostova',
      handle: 'Elena Rostova',
      channel: 'whatsapp',
      preview: 'Invoice received and approved by our procurement department. Thank you!',
      time: '3h ago',
      unread: false,
    },
  ]);

  const [activeMessage, setActiveMessage] = useState(messages[0]);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    alert(`Reply dispatched to ${activeMessage.sender} via ${activeMessage.channel}!`);
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">ENGAGE</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Inbox</h1>
          <p className="text-xs sm:text-sm text-[#64748B]">Unified social messages, comments, and lead inquiries.</p>
        </div>
        <span className="px-3 py-1 bg-[#0F172A] text-white text-xs font-bold rounded-full">
          7 unread inquiries
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* Message List */}
        <div className="md:col-span-5 bg-white rounded-3xl p-4 sm:p-5 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-2">
          {messages.map((m) => (
            <div
              key={m.id}
              onClick={() => setActiveMessage(m)}
              className={`p-3 rounded-2xl cursor-pointer transition-all ${
                activeMessage.id === m.id
                  ? 'bg-[#EEF2FF] border border-[#C7D2FE]'
                  : 'hover:bg-[#F8FAFC] border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-md bg-[#F1F5F9] flex items-center justify-center">
                    <SocialPlatformIcon channel={m.channel} className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-xs text-[#0F172A]">{m.sender}</span>
                </div>
                <span className="text-[10px] text-[#94A3B8]">{m.time}</span>
              </div>
              <p className="text-xs text-[#64748B] line-clamp-2">{m.preview}</p>
            </div>
          ))}
        </div>

        {/* Message Thread */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border-2 border-dashed border-[#CBD5E1] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">{activeMessage.sender}</h3>
                <span className="text-xs text-[#64748B]">{activeMessage.handle}</span>
              </div>
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold">
                <SocialPlatformIcon channel={activeMessage.channel} className="w-3.5 h-3.5" />
                <span className="capitalize">{activeMessage.channel}</span>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-xs sm:text-sm text-[#1E293B] leading-relaxed">
              {activeMessage.preview}
            </div>
          </div>

          <form onSubmit={handleSendReply} className="pt-2 border-t border-[#F1F5F9] flex gap-2">
            <input
              type="text"
              placeholder={`Reply to ${activeMessage.sender}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#6366F1]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#0F172A] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center space-x-1 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

