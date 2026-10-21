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
  Share2,
  Calendar,
  Filter,
  MoreHorizontal,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  Bell,
  CheckCircle2,
  AlertCircle,
  Download,
  Zap,
  BarChart3,
  Flame,
  ShieldCheck,
  Eye,
  PieChart,
  Activity,
  X,
  FileText,
  Layers,
  ArrowDownRight,
  Trash2,
  User,
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';
import { triggerConfetti } from '@/components/ui/Confetti';

// -------------------------------------------------------------
// 1. GOALS VIEW
// -------------------------------------------------------------
export function GoalsView() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'revenue' | 'audience' | 'product'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [goals, setGoals] = useState([
    {
      id: 'g1',
      title: 'Generate 100 qualified leads this month',
      category: 'revenue',
      target: 100,
      current: 78,
      metric: 'MQL',
      deadline: 'Oct 31, 2026',
      status: 'On track',
      change: '+14% velocity',
      badgeColor: 'bg-[#E8F7D4] text-[#3B6B15]',
      barColor: 'bg-[#8B5CF6]',
      insight: 'LinkedIn ads generating 62% of lead volume',
    },
    {
      id: 'g2',
      title: 'Launch Northstar insights in 30 days',
      category: 'product',
      target: 30,
      current: 18,
      metric: 'Days',
      deadline: 'Nov 15, 2026',
      status: 'In progress',
      change: '12 days left',
      badgeColor: 'bg-[#FEF3C7] text-[#B45309]',
      barColor: 'bg-[#F6BA47]',
      insight: 'Beta test approval completed with 4 key accounts',
    },
    {
      id: 'g3',
      title: 'Grow LinkedIn followers to 25K',
      category: 'audience',
      target: 25000,
      current: 21100,
      metric: 'Followers',
      deadline: 'Dec 1, 2026',
      status: 'Ahead',
      change: '+22% growth',
      badgeColor: 'bg-[#E8F7D4] text-[#3B6B15]',
      barColor: 'bg-[#10B981]',
      insight: 'Founder note carousels driving 4x follower velocity',
    },
    {
      id: 'g4',
      title: 'Reach $250K pipeline from social ads',
      category: 'revenue',
      target: 250000,
      current: 184200,
      metric: 'USD',
      deadline: 'Dec 31, 2026',
      status: 'On track',
      change: '74% achieved',
      badgeColor: 'bg-[#EDE9FE] text-[#6D28D9]',
      barColor: 'bg-[#7C3AED]',
      insight: 'Closed won revenue up $44k from qualified scorecards',
    },
  ]);

  const filteredGoals = goals.filter((g) => {
    if (activeFilter !== 'all' && g.category !== activeFilter) return false;
    if (searchQuery.trim()) {
      return g.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-900 pb-12">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#161616] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm animate-bounce-short">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER: Context, Search & New Goal CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">Goals</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Quarterly growth objectives · 78% on track · Northstar Soho clinic
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search goals, targets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-white rounded-full border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 shadow-2xs transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </span>
          </div>

          <button
            onClick={() => {
              triggerConfetti();
              showToast('Goal creation modal opened');
            }}
            className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New goal</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-slate-200/60 shadow-2xs w-fit">
          {[
            { id: 'all', label: 'All Goals' },
            { id: 'revenue', label: 'Revenue' },
            { id: 'audience', label: 'Audience' },
            { id: 'product', label: 'Product' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#161616] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-700 flex items-center gap-2 shadow-2xs transition-colors">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Q4 2026 ⌄</span>
          </button>
        </div>
      </div>

      {/* 4 BENTO SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pipeline Target</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">$250,000</div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                74% closed
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Velocity Status</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">+18.2%</div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                Ahead of schedule
              </span>
            </div>
          </div>
        </div>

        {/* HERO LAVENDER ACCENT CARD */}
        <div className="bg-[#E9E4FD] rounded-3xl p-5 border border-[#DDD6FE] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-900/80 mb-2">
            <span className="text-xs font-semibold">Active Targets</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-purple-700">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-purple-950">4 of 4</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                3 on track · 1 review
              </span>
            </div>
          </div>
        </div>

        {/* HERO SAGE GREEN ACCENT CARD */}
        <div className="bg-[#EAF6DA] rounded-3xl p-5 border border-[#DCF0C4] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-900/80 mb-2">
            <span className="text-xs font-semibold">Forecast Confidence</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#558327]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-emerald-950">94.8%</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                High reliability
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GOALS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredGoals.map((g) => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          return (
            <div
              key={g.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      TARGET · {g.deadline}
                    </span>
                    <h3 className="font-bold text-base text-[#161616] mt-0.5">{g.title}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${g.badgeColor}`}>
                    {g.status}
                  </span>
                </div>

                <div className="space-y-1.5 mt-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-slate-900">
                      {g.current.toLocaleString()} / {g.target.toLocaleString()} {g.metric} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${g.barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Actionable Insight Strip */}
              <div className="bg-[#EAF6DA] border border-[#DCF0C4] rounded-2xl p-2.5 px-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-[#2D5018] font-medium min-w-0">
                  <Sparkles className="w-4 h-4 text-[#52802B] shrink-0" />
                  <span className="truncate">{g.insight}</span>
                </div>
                <button
                  onClick={() => {
                    triggerConfetti();
                    showToast(`Accelerated growth strategy applied to: ${g.title}`);
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs shrink-0"
                >
                  Boost
                </button>
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'today' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // New task form fields
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Leo Park, RN');
  const [newTaskChannel, setNewTaskChannel] = useState('LinkedIn');
  const [newTaskPriority, setNewTaskPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskDue, setNewTaskDue] = useState('Today');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const defaultTasks = [
    { id: 't1', text: 'Approve LinkedIn carousel creatives for Proof Week', done: false, priority: 'High', due: 'Today', channel: 'LinkedIn', assignee: 'Leo Park, RN' },
    { id: 't2', text: 'Set up Meta Pixel conversion tracking on scorecards', done: true, priority: 'Medium', due: 'Yesterday', channel: 'Meta', assignee: 'Dr. James Ortiz' },
    { id: 't3', text: 'Schedule founder notes for Tuesday & Thursday', done: false, priority: 'Medium', due: 'Tomorrow', channel: 'Content', assignee: 'Nina Alvarez' },
    { id: 't4', text: 'Review inbound inquiries from TikTok comments', done: false, priority: 'Urgent', due: 'Today', channel: 'TikTok', assignee: 'Dr. Ines Varga' },
    { id: 't5', text: 'Draft promotional copy for autumn dermal hydration series', done: false, priority: 'High', due: 'Friday', channel: 'Email', assignee: 'Emma Wilson' },
    { id: 't6', text: 'Export monthly retention cohort sheet for executive review', done: true, priority: 'Low', due: 'Yesterday', channel: 'Analytics', assignee: 'Alex Morgan' },
  ];

  const [tasks, setTasks] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('buffermate_clinic_tasks');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultTasks;
  });

  const saveTasks = (updated: any) => {
    setTasks(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('buffermate_clinic_tasks', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t: any) => {
      if (t.id === id) {
        const next = !t.done;
        if (next) triggerConfetti();
        showToast(next ? `Task completed: "${t.text}"` : 'Task marked pending');
        return { ...t, done: next };
      }
      return t;
    });
    saveTasks(updated);
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = tasks.filter((t: any) => t.id !== id);
    saveTasks(updated);
    showToast('Task removed from queue.');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) {
      showToast('Please enter a task title.');
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      done: false,
      priority: newTaskPriority,
      due: newTaskDue,
      channel: newTaskChannel,
      assignee: newTaskAssignee,
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    triggerConfetti();
    showToast(`Task added: "${newTask.text}" 🎉`);

    // Reset form and close
    setNewTaskText('');
    setNewTaskAssignee('Leo Park, RN');
    setNewTaskChannel('LinkedIn');
    setNewTaskPriority('Medium');
    setNewTaskDue('Today');
    setIsNewTaskModalOpen(false);
  };

  const filteredTasks = tasks.filter((t: any) => {
    if (activeFilter === 'urgent') {
      if (t.priority !== 'Urgent' && t.priority !== 'High') return false;
    } else if (activeFilter === 'today') {
      if (t.due !== 'Today') return false;
    } else if (activeFilter === 'completed') {
      if (!t.done) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.text.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.channel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = tasks.filter((t: any) => !t.done).length;

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-900 pb-12">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#161616] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm animate-bounce-short">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">Tasks</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Actionable crew queue · {pendingCount} pending items · Northstar Soho clinic
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tasks, crew..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white rounded-full border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsNewTaskModalOpen(true)}
            className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New task</span>
          </button>
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-slate-200/60 shadow-2xs w-fit overflow-x-auto">
        {[
          { id: 'all', label: `All (${tasks.length})` },
          { id: 'urgent', label: `Urgent (${tasks.filter((t: any) => t.priority === 'Urgent' || t.priority === 'High').length})` },
          { id: 'today', label: `Due Today (${tasks.filter((t: any) => t.due === 'Today').length})` },
          { id: 'completed', label: `Completed (${tasks.filter((t: any) => t.done).length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              activeFilter === tab.id
                ? 'bg-[#161616] text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TASKS CARD CONTAINER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No tasks found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {searchQuery ? `No tasks matched "${searchQuery}".` : 'There are no tasks matching the selected filter.'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Clear search
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsNewTaskModalOpen(true)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#161616] hover:bg-black text-white shadow-xs transition-colors"
              >
                + Create Task
              </button>
            </div>
          </div>
        ) : (
          filteredTasks.map((t: any) => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className={`group p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
                t.done
                  ? 'bg-slate-50/60 border-transparent opacity-60'
                  : 'bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
              }`}
            >
              <div className="flex items-center space-x-3.5 min-w-0 pr-3">
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                    t.done ? 'bg-[#161616] border-[#161616] text-white' : 'border-slate-300 bg-white hover:border-purple-400'
                  }`}
                >
                  {t.done && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <span className={`text-xs sm:text-sm font-semibold truncate block ${t.done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {t.text}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>Assignee: <strong className="font-medium text-slate-600">{t.assignee}</strong></span>
                    <span>·</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[9px]">{t.channel}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-700'
                      : t.priority === 'High'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t.priority}
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {t.due}
                </span>
                <button
                  type="button"
                  onClick={(e) => deleteTask(t.id, e)}
                  title="Delete task"
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =========================================================
          NEW TASK MODAL (WORKING)
         ========================================================= */}
      {isNewTaskModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsNewTaskModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200/80 shadow-2xl space-y-5 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create New Task</h3>
                  <p className="text-xs text-slate-500">Add an actionable item to the crew queue</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTaskModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Task Action / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Approve Instagram carousel creatives for Autumn Series"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assignee
                  </label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  >
                    <option value="Leo Park, RN">Leo Park, RN</option>
                    <option value="Dr. James Ortiz">Dr. James Ortiz</option>
                    <option value="Nina Alvarez">Nina Alvarez</option>
                    <option value="Dr. Ines Varga">Dr. Ines Varga</option>
                    <option value="Emma Wilson">Emma Wilson</option>
                    <option value="Alex Morgan (You)">Alex Morgan (You)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Channel / Touchpoint
                  </label>
                  <select
                    value={newTaskChannel}
                    onChange={(e) => setNewTaskChannel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Meta">Meta (Instagram/FB)</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Content">Content Studio</option>
                    <option value="Email">Email Broadcast</option>
                    <option value="Analytics">Analytics / ROI</option>
                    <option value="WhatsApp">WhatsApp Radar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl">
                    {(['Urgent', 'High', 'Medium', 'Low'] as const).map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setNewTaskPriority(p)}
                        className={`py-1.5 rounded-xl text-[11px] font-bold transition-all text-center ${
                          newTaskPriority === p
                            ? p === 'Urgent'
                              ? 'bg-rose-500 text-white shadow-xs'
                              : p === 'High'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-[#161616] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <select
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Friday">Friday</option>
                    <option value="Next Week">Next Week</option>
                    <option value="Yesterday">Yesterday</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 3. INBOX VIEW (EXACT REPORTS BENTO & SPLIT ARCHITECTURE)
// -------------------------------------------------------------
export function InboxView() {
  const [activeChannelFilter, setActiveChannelFilter] = useState<'all' | 'instagram' | 'linkedin' | 'whatsapp' | 'tiktok'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'Sophia Miller',
      handle: '@sophia_m',
      channel: 'instagram',
      preview: 'Hey! Loved the scorecard launch. Where can I sign up for the enterprise tier?',
      time: '12m ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'm2',
      sender: 'David Chen',
      handle: 'David Chen · VP Growth',
      channel: 'linkedin',
      preview: 'Interested in partnering on your Q3 webinar series. Do you have 15 mins this Friday?',
      time: '34m ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'm3',
      sender: 'Alex Creative',
      handle: '@alex_creative',
      channel: 'tiktok',
      preview: 'Can you DM me the template link mentioned in your latest video?',
      time: '1h ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'm4',
      sender: 'Marcus Vance',
      handle: '@marcus_v',
      channel: 'linkedin',
      preview: 'Great thread on B2B social attribution! Agree with point #3.',
      time: '2h ago',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'm5',
      sender: 'Elena Rostova',
      handle: 'Elena Rostova',
      channel: 'whatsapp',
      preview: 'Invoice received and approved by our procurement department. Thank you!',
      time: '3h ago',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&auto=format&fit=crop&q=80',
    },
  ]);

  const [activeMessage, setActiveMessage] = useState(messages[0]);
  const [replyText, setReplyText] = useState('');

  const filteredMessages = messages.filter((m) => {
    if (activeChannelFilter !== 'all' && m.channel !== activeChannelFilter) return false;
    if (searchQuery.trim()) {
      return m.sender.toLowerCase().includes(searchQuery.toLowerCase()) || m.preview.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    triggerConfetti();
    showToast(`Reply dispatched to ${activeMessage.sender} via ${activeMessage.channel}!`);
    setReplyText('');
  };

  const handleApplyAiSuggestion = () => {
    setReplyText(`Hi ${activeMessage.sender.split(' ')[0]}! Thanks for reaching out. We would be thrilled to connect. You can book directly with our executive lead team right here: medspa.os/meet`);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-900 pb-12">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#161616] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm animate-bounce-short">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER: Exact Reports Typography & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">Inbox</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            September 2026 · Soho clinic · 7 unread inquiries across 5 channels
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations, handles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-white rounded-full border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 shadow-2xs transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </span>
          </div>

          <button
            onClick={() => showToast('New outbound message composer opened')}
            className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Compose message</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEGMENTED TABS */}
      <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-slate-200/60 shadow-2xs w-fit overflow-x-auto">
        {[
          { id: 'all', label: 'All Inquiries' },
          { id: 'instagram', label: 'Instagram' },
          { id: 'linkedin', label: 'LinkedIn' },
          { id: 'whatsapp', label: 'WhatsApp' },
          { id: 'tiktok', label: 'TikTok' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveChannelFilter(tab.id as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              activeChannelFilter === tab.id
                ? 'bg-[#161616] text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 BENTO KPI CARDS (Matching Reports Rhythm) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Avg Reply Time</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">8 mins</div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                ↑ 42% faster
              </span>
            </div>
          </div>
        </div>

        {/* HERO LAVENDER CARD */}
        <div className="bg-[#E9E4FD] rounded-3xl p-5 border border-[#DDD6FE] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-900/80 mb-2">
            <span className="text-xs font-semibold">Unread Inquiries</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-purple-700">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-purple-950">7 unread</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                3 high priority
              </span>
            </div>
          </div>
        </div>

        {/* HERO MATCHA GREEN CARD */}
        <div className="bg-[#EAF6DA] rounded-3xl p-5 border border-[#DCF0C4] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-900/80 mb-2">
            <span className="text-xs font-semibold">Resolution Rate</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#558327]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-emerald-950">98.4%</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                ↑ 2 pts
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pipeline from DMs</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">$48,200</div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                ↑ $12k this month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SPLIT VIEW (40/60) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
            <span className="text-xs font-bold text-slate-900">Direct Conversations</span>
            <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold">
              Multi-Channel
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredMessages.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveMessage(m)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                  activeMessage.id === m.id
                    ? 'bg-[#E9E4FD] border-[#DDD6FE] shadow-2xs'
                    : 'hover:bg-slate-50 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <img src={m.avatar} alt={m.sender} className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <span className="font-bold text-xs text-slate-900">{m.sender}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{m.time}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{m.preview}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img src={activeMessage.avatar} alt={activeMessage.sender} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                <div>
                  <h3 className="font-bold text-sm text-[#161616]">{activeMessage.sender}</h3>
                  <span className="text-xs text-slate-400">{activeMessage.handle}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
                <SocialPlatformIcon channel={activeMessage.channel} className="w-3.5 h-3.5" />
                <span className="capitalize">{activeMessage.channel}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs sm:text-sm text-slate-800 leading-relaxed shadow-2xs">
              {activeMessage.preview}
            </div>

            {/* AI Smart Draft Recommendation Banner */}
            <div className="bg-[#EAF6DA] border border-[#DCF0C4] rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#2D5018] font-medium min-w-0">
                <Sparkles className="w-4 h-4 text-[#52802B] shrink-0" />
                <span className="truncate">Auto-drafted personalized response ready for review</span>
              </div>
              <button
                onClick={handleApplyAiSuggestion}
                className="bg-white hover:bg-slate-50 text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs shrink-0"
              >
                Insert Draft
              </button>
            </div>
          </div>

          <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder={`Reply to ${activeMessage.sender}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#161616] hover:bg-black text-white text-xs font-bold rounded-full flex items-center space-x-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
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

// -------------------------------------------------------------
// 4. ROI & REVENUE ATTRIBUTION VIEW
// -------------------------------------------------------------
export function RoiRevenueView() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'organic'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'Q3 2026' | 'Q2 2026' | 'Q1 2026' | 'FY 2026'>('Q3 2026');
  const [selectedCompare, setSelectedCompare] = useState<'vs Q2 2026' | 'vs Q1 2026' | 'vs FY 2025'>('vs Q2 2026');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string | null>(null);
  const [isBoostApplied, setIsBoostApplied] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'xlsx'>('pdf');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyBoost = () => {
    setIsBoostApplied(true);
    triggerConfetti();
    showToast('Applied! $400 Meta retargeting boost active. 8 stalled pipeline deals unlocked (+$32,000)!');
  };

  const handleToggleBoost = () => {
    if (isBoostApplied) {
      setIsBoostApplied(false);
      showToast('Meta retargeting boost reverted to baseline ($118,400)');
    } else {
      handleApplyBoost();
    }
  };

  // Period multiplier logic
  const periodMultiplier =
    selectedPeriod === 'FY 2026' ? 3.4 :
    selectedPeriod === 'Q2 2026' ? 0.78 :
    selectedPeriod === 'Q1 2026' ? 0.66 : 1.0;

  const baseRevenue = Math.round(118400 * periodMultiplier);
  const closedWonRevenue = isBoostApplied ? baseRevenue + 32000 : baseRevenue;
  const pipelineShare = isBoostApplied ? '75.2%' : selectedPeriod === 'FY 2026' ? '71.8%' : selectedPeriod === 'Q2 2026' ? '62.4%' : '68.4%';
  const averageDeal = isBoostApplied ? '$8,840' : selectedPeriod === 'FY 2026' ? '$8,920' : selectedPeriod === 'Q2 2026' ? '$7,900' : '$8,450';
  const blendedCac = isBoostApplied ? '$108' : selectedPeriod === 'FY 2026' ? '$114' : selectedPeriod === 'Q2 2026' ? '$136' : '$124';
  const roasMultiplier = isBoostApplied ? '9.6x' : selectedPeriod === 'FY 2026' ? '9.1x' : selectedPeriod === 'Q2 2026' ? '7.8x' : '8.4x';

  const channelBreakdown = [
    {
      ch: 'LinkedIn Lead Gen Ads',
      code: 'linkedin',
      revenue: `$${Math.round(54200 * periodMultiplier).toLocaleString()}`,
      pct: isBoostApplied ? 36 : 46,
      color: 'bg-[#7C3AED]',
      type: 'paid',
    },
    {
      ch: 'Instagram Stories & Reels Ads',
      code: 'meta',
      revenue: isBoostApplied
        ? `$${Math.round(64100 * periodMultiplier).toLocaleString()}`
        : `$${Math.round(32100 * periodMultiplier).toLocaleString()}`,
      pct: isBoostApplied ? 43 : 27,
      color: 'bg-[#8B5CF6]',
      type: 'paid',
      isBoosted: isBoostApplied,
    },
    {
      ch: 'WhatsApp Rebooking Radar',
      code: 'whatsapp',
      revenue: `$${Math.round(21400 * periodMultiplier).toLocaleString()}`,
      pct: isBoostApplied ? 14 : 18,
      color: 'bg-[#10B981]',
      type: 'organic',
    },
    {
      ch: 'TikTok Organic Virality',
      code: 'tiktok',
      revenue: `$${Math.round(10700 * periodMultiplier).toLocaleString()}`,
      pct: isBoostApplied ? 7 : 9,
      color: 'bg-[#161616]',
      type: 'organic',
    },
  ].filter((item) => {
    if (activeFilter === 'paid') return item.type === 'paid';
    if (activeFilter === 'organic') return item.type === 'organic';
    return true;
  });

  const rawDeals = [
    {
      client: 'Sophia Bennett',
      org: 'Luxury Skin Retreat NYC',
      treatment: 'VIP Injectables & Sculpt Protocol',
      dealValue: '$28,500',
      touchpoint: 'Meta Retargeting Ad → IG DM → Closed Won',
      channelCode: 'meta',
      cycleTime: '3.2 days',
      status: 'Closed Won',
    },
    {
      client: 'Marcus Vance',
      org: 'Apex Aesthetics Manhattan',
      treatment: 'Laser Suite Annual Retainer',
      dealValue: '$16,800',
      touchpoint: 'LinkedIn Sponsored InMail → Video Consult → Closed Won',
      channelCode: 'linkedin',
      cycleTime: '5.4 days',
      status: 'Closed Won',
    },
    {
      client: 'Elena Rostova',
      org: 'Soho Glow Studio',
      treatment: 'HydraFacial & Skin Barrier Package',
      dealValue: '$14,200',
      touchpoint: 'IG Reel Hook → Bio Link → WhatsApp Flow → Closed Won',
      channelCode: 'whatsapp',
      cycleTime: '2.1 days',
      status: 'Closed Won',
    },
    {
      client: 'David Sterling',
      org: 'Sterling Health & Aesthetics',
      treatment: 'Full Rejuvenation Clinical Series',
      dealValue: '$9,400',
      touchpoint: 'TikTok Viral Clip → Comment Auto-DM → Closed Won',
      channelCode: 'tiktok',
      cycleTime: '4.8 days',
      status: 'Closed Won',
    },
    {
      client: 'Camilla Thorne',
      org: 'Tribeca MedSpa Co',
      treatment: 'Botox & Dermal Filler Contour',
      dealValue: '$19,200',
      touchpoint: 'Meta Story Ads → WhatsApp Booking → Closed Won',
      channelCode: 'meta',
      cycleTime: '1.9 days',
      status: 'Closed Won',
    },
    {
      client: 'Julian Hayes',
      org: 'Gramercy Clinical Spa',
      treatment: 'Clear+Brilliant Laser Package',
      dealValue: '$11,600',
      touchpoint: 'LinkedIn Executive Showcase → Calendar Schedule → Closed Won',
      channelCode: 'linkedin',
      cycleTime: '4.1 days',
      status: 'Closed Won',
    },
  ];

  const attributedDeals = rawDeals.filter((deal) => {
    if (selectedChannelFilter && deal.channelCode !== selectedChannelFilter) return false;
    if (activeFilter === 'paid' && deal.channelCode !== 'meta' && deal.channelCode !== 'linkedin') return false;
    if (activeFilter === 'organic' && (deal.channelCode === 'meta' || deal.channelCode === 'linkedin')) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        deal.client.toLowerCase().includes(q) ||
        deal.org.toLowerCase().includes(q) ||
        deal.treatment.toLowerCase().includes(q) ||
        deal.touchpoint.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    setIsExportModalOpen(false);
    triggerConfetti();

    try {
      if (exportFormat === 'csv' || exportFormat === 'xlsx') {
        const csvHeader = 'Client,Clinic Organization,Treatment Protocol,Touchpoint Path,Deal Value,Cycle Time,Status\n';
        const csvRows = attributedDeals.map((d) =>
          `"${d.client}","${d.org}","${d.treatment}","${d.touchpoint}","${d.dealValue}","${d.cycleTime}","${d.status}"`
        ).join('\n');
        const csvContent = `${csvHeader}${csvRows}\n\nSummary Metrics\nClosed Won Revenue,${closedWonRevenue}\nPipeline Share,${pipelineShare}\nAverage Deal,${averageDeal}\nBlended CAC,${blendedCac}\nROAS Multiplier,${roasMultiplier}\n`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `soho_clinic_roi_attribution_${selectedPeriod.replace(/\\s+/g, '_').toLowerCase()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const reportText = `========================================================\\n` +
          `MEDSPA OS · SOHO CLINIC · MULTI-TOUCH REVENUE ATTRIBUTION AUDIT\\n` +
          `Period: ${selectedPeriod} (${selectedCompare})\\n` +
          `Date: ${new Date().toLocaleDateString()}\\n` +
          `========================================================\\n\\n` +
          `KEY ATTRIBUTION METRICS\\n` +
          `--------------------------------------------------------\\n` +
          `• Closed Won Social Revenue: $${closedWonRevenue.toLocaleString()}\\n` +
          `• Pipeline Share:            ${pipelineShare}\\n` +
          `• Average Deal Value:        ${averageDeal}\\n` +
          `• Blended Acquisition CAC:   ${blendedCac}\\n` +
          `• Return On Ad Spend (ROAS): ${roasMultiplier}\\n\\n` +
          `CHANNEL TOUCHPOINT BREAKDOWN\\n` +
          `--------------------------------------------------------\\n` +
          channelBreakdown.map((c) => `• ${c.ch.padEnd(30)}: ${c.revenue.padEnd(10)} (${c.pct}%)`).join('\\n') + `\\n\\n` +
          `VERIFIED ATTRIBUTED DEALS (${attributedDeals.length} Verified)\\n` +
          `--------------------------------------------------------\\n` +
          attributedDeals.map((d) => `• ${d.client} (${d.org}) - ${d.treatment} | ${d.dealValue} | ${d.touchpoint}`).join('\\n') +
          `\\n\\n========================================================\\n` +
          `Generated by MedSpa OS · Multi-Touch Social Attribution Engine\\n`;
        const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `soho_clinic_roi_attribution_${selectedPeriod.replace(/\\s+/g, '_').toLowerCase()}_audit.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      showToast(`Attribution report (${exportFormat.toUpperCase()}) downloaded successfully for Soho clinic!`);
    } catch (e) {
      showToast('Attribution export generated.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-900 pb-12 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#161616] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm animate-bounce-short">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Context & Global Utility (Reports Style) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">
              ROI & Revenue Attribution
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Multi-Touch Verified</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Multi-touch closed revenue sourced directly from social touchpoints · Soho clinic
          </p>
        </div>

        {/* Search, Notifications & Export CTA */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deals, touchpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-white rounded-full border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 shadow-2xs transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </span>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export attribution</span>
          </button>
        </div>
      </div>

      {/* FILTER & SUB-NAV ROW (Reports Capsule Segmented Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Segmented Pill Tabs */}
        <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-slate-200/60 shadow-2xs w-fit overflow-x-auto">
          {[
            { id: 'all', label: 'All Touchpoints (4)' },
            { id: 'paid', label: 'Paid Social Ads (2)' },
            { id: 'organic', label: 'Organic & Viral (2)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#161616] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interactive Dropdown Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="relative bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value as any);
                showToast(`Switched attribution period to ${e.target.value}`);
              }}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="Q3 2026">Q3 2026 (Jul - Sep)</option>
              <option value="Q2 2026">Q2 2026 (Apr - Jun)</option>
              <option value="Q1 2026">Q1 2026 (Jan - Mar)</option>
              <option value="FY 2026">Full Year 2026</option>
            </select>
          </div>

          <div className="relative bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors whitespace-nowrap">
            <select
              value={selectedCompare}
              onChange={(e) => {
                setSelectedCompare(e.target.value as any);
                showToast(`Comparing vs ${e.target.value}`);
              }}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="vs Q2 2026">vs Q2 2026</option>
              <option value="vs Q1 2026">vs Q1 2026</option>
              <option value="vs FY 2025">vs FY 2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5 BENTO KPI CARDS (Matching Reports Color Rhythm) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
        {/* 1. Closed Won Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Closed Won</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">
              ${closedWonRevenue.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isBoostApplied ? 'bg-emerald-100 text-emerald-800' : 'bg-[#E8F7D4] text-[#3B6B15]'
              }`}>
                {isBoostApplied ? '↑ +$32,000 Meta Lift' : '↑ 44% vs Q2'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Pipeline Share (Lavender #E9E4FD) */}
        <div className="bg-[#E9E4FD] rounded-3xl p-5 border border-purple-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-900">Pipeline Share</span>
            <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-800">
              <PieChart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">{pipelineShare}</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                {isBoostApplied ? 'Boost Active · Direct credit' : 'Direct social credit'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Average Deal (Matcha / Sage Green #EAF6DA) */}
        <div className="bg-[#EAF6DA] rounded-3xl p-5 border border-emerald-200/60 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-900">Average Deal</span>
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-800">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">{averageDeal}</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                {isBoostApplied ? '↑ $1,640 lift' : '↑ $1,250'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Blended CAC (White) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Blended CAC</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">{blendedCac}</div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                {isBoostApplied ? '↓ $34 acquisition' : '↓ $18 acquisition'}
              </span>
            </div>
          </div>
        </div>

        {/* 5. ROAS Multiplier (White) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">ROAS Multiplier</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">{roasMultiplier}</div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                {isBoostApplied ? 'Optimal scale' : 'High return'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CHANNEL BREAKDOWN CARD (Interactive click to filter deals) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-[#161616]">Revenue by Channel Touchpoint</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {isBoostApplied
                ? 'Meta retargeting boost active · Instagram & Meta revenue lifted to $64,100 (43%)'
                : 'LinkedIn & Meta ads drive 73% of social-attributed client revenue. Tap any channel to inspect deals.'}
            </p>
          </div>
          {selectedChannelFilter && (
            <button
              onClick={() => setSelectedChannelFilter(null)}
              className="text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1 rounded-full self-start sm:self-auto transition-colors flex items-center gap-1.5"
            >
              <span>Showing: {selectedChannelFilter.toUpperCase()}</span>
              <span>✕</span>
            </button>
          )}
        </div>

        <div className="space-y-3.5 pt-2">
          {channelBreakdown.map((row, i) => {
            const isSelected = selectedChannelFilter === row.code;
            return (
              <div
                key={i}
                onClick={() => setSelectedChannelFilter(isSelected ? null : row.code)}
                className={`space-y-1.5 text-xs p-2.5 rounded-2xl cursor-pointer transition-all ${
                  isSelected ? 'bg-purple-50/70 border border-purple-200/80 shadow-2xs' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{row.ch}</span>
                    {row.isBoosted && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[9px] font-bold">
                        +32k Boosted
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        Filtered
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-slate-900">{row.revenue} ({row.pct}%)</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.color} rounded-full transition-all duration-700`}
                    style={{ width: `${row.pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Recommendation Strip (Working Boost Trigger) */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="bg-[#EAF6DA] border border-[#DCF0C4] rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-[#2D5018] font-medium min-w-0">
              <Sparkles className="w-4 h-4 text-[#52802B] shrink-0" />
              <span>
                {isBoostApplied
                  ? 'Meta retargeting boost active! $400 budget allocated · 8 stalled pipeline deals unlocked (~$32k).'
                  : 'Increase Meta retargeting by $400 to capture 8 stalled pipeline deals (~$32k)'}
              </span>
            </div>
            {isBoostApplied ? (
              <button
                type="button"
                onClick={handleToggleBoost}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-2xs shrink-0 self-start sm:self-auto transition-transform active:scale-95"
                title="Click to reset to baseline"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Applied ✓ (Click to reset)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyBoost}
                className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-2xs shrink-0 transition-transform active:scale-95 self-start sm:self-auto"
              >
                Boost
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ATTRIBUTED CLOSED DEALS TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-[#161616]">Social Attributed Deals ({selectedPeriod})</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Verified client closed revenue with complete multi-touch journey credit
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full self-start sm:self-auto">
            {attributedDeals.length} Deals Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-1">Client & Clinic</th>
                <th className="pb-3">Treatment Protocol</th>
                <th className="pb-3">Touchpoint Path</th>
                <th className="pb-3">Deal Value</th>
                <th className="pb-3">Cycle Time</th>
                <th className="pb-3 text-right pr-1">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attributedDeals.map((deal, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-1">
                    <p className="font-bold text-slate-900">{deal.client}</p>
                    <p className="text-[11px] text-slate-400">{deal.org}</p>
                  </td>
                  <td className="py-3.5 text-slate-700 font-medium">
                    {deal.treatment}
                  </td>
                  <td className="py-3.5">
                    <span className="font-mono text-[11px] text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-md">
                      {deal.touchpoint}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-slate-900">
                    {deal.dealValue}
                  </td>
                  <td className="py-3.5 text-slate-500 font-medium">
                    {deal.cycleTime}
                  </td>
                  <td className="py-3.5 text-right pr-1">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {deal.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXPORT ATTRIBUTION MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200/80 p-6 space-y-5 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Export Attribution Report</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-touch revenue audit for Q3 2026 · Soho clinic
                </p>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-2 text-[10px]">
                  Select Export Format
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'pdf', label: 'PDF Report' },
                    { id: 'csv', label: 'CSV Raw' },
                    { id: 'xlsx', label: 'Excel Sheet' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setExportFormat(fmt.id as any)}
                      className={`p-3 rounded-2xl border text-center font-semibold transition-all ${
                        exportFormat === fmt.id
                          ? 'bg-[#161616] text-white border-[#161616] shadow-2xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1 text-slate-600">
                <p className="font-semibold text-slate-800">Included In This Export:</p>
                <p className="text-[11px] text-slate-500">• Closed revenue breakdown across all 4 touchpoint channels</p>
                <p className="text-[11px] text-slate-500">• Individual verified deals and lead cycle time</p>
                <p className="text-[11px] text-slate-500">• Blended CAC and ROAS calculation model</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="px-5 py-2.5 bg-[#141416] hover:bg-black text-white rounded-full text-xs font-semibold shadow-sm transition-all"
              >
                Download Attribution ({exportFormat.toUpperCase()})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 5. SOCIAL EXPERIMENTS VIEW
// -------------------------------------------------------------
export function ExperimentsView() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'running' | 'completed'>('all');
  const [isNewExperimentModalOpen, setIsNewExperimentModalOpen] = useState(false);
  const [selectedExperimentId, setSelectedExperimentId] = useState('exp-1');

  // Form State for New Experiment Modal
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState('Instagram Professional');
  const [newCategory, setNewCategory] = useState('VIRAL HOOKS');
  const [newVariantA, setNewVariantA] = useState('');
  const [newVariantB, setNewVariantB] = useState('');
  const [newMetric, setNewMetric] = useState('Click-Through Rate (CTR)');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [experiments, setExperiments] = useState([
    {
      id: 'exp-1',
      title: 'Question vs Statement Hooks for Soho Clinic',
      category: 'VIRAL HOOKS',
      channel: 'Instagram Professional',
      variantA: {
        label: 'Variant A (Question Hook)',
        text: '"Are you still manually booking client aesthetic consultations in 2026?"',
        ctr: '5.4%',
        leads: 142,
        isWinner: true,
      },
      variantB: {
        label: 'Variant B (Statement Hook)',
        text: '"How top Soho aesthetic clinics automate their client consultations."',
        ctr: '3.1%',
        leads: 76,
        isWinner: false,
      },
      status: 'Significant Result (95% Conf.)',
      statusType: 'completed' as const,
      uplift: '+74% CTR',
      impressions: '4,280 impressions',
      deployed: false,
    },
    {
      id: 'exp-2',
      title: 'Reels Video Length: 12s Punchy vs 45s Educational',
      category: 'VIDEO DURATION',
      channel: 'TikTok for Business',
      variantA: {
        label: 'Variant A (12s Hook + Quick B-Roll)',
        text: 'Fast cut aesthetic injection transformations with upbeat audio cue.',
        ctr: '6.8%',
        leads: 98,
        isWinner: true,
      },
      variantB: {
        label: 'Variant B (45s In-Depth Doctor Breakdown)',
        text: 'Comprehensive clinical rationale and anatomical safety walkthrough.',
        ctr: '4.2%',
        leads: 54,
        isWinner: false,
      },
      status: 'Active Testing · 68% Conf.',
      statusType: 'running' as const,
      uplift: '+38% Completion',
      impressions: '2,940 impressions',
      deployed: false,
    },
    {
      id: 'exp-3',
      title: 'Comment CTA: "DM SCALE" vs "Click Link in Bio"',
      category: 'CONVERSION CTA',
      channel: 'Threads Engine',
      variantA: {
        label: 'Variant A (Instant DM Keyword Trigger)',
        text: 'Drop "SCALE" below and our AI assistant will send the blueprint instantly.',
        ctr: '7.1%',
        leads: 165,
        isWinner: true,
      },
      variantB: {
        label: 'Variant B (Static Link in Bio)',
        text: 'Tap the link in our bio to download the clinical revenue roadmap.',
        ctr: '3.6%',
        leads: 62,
        isWinner: false,
      },
      status: 'Significant Result (99% Conf.)',
      statusType: 'completed' as const,
      uplift: '+97% Leads',
      impressions: '5,120 impressions',
      deployed: false,
    },
    {
      id: 'exp-4',
      title: 'Carousel Depth: 5 Slides vs 8 Slides Deep Dive',
      category: 'CAROUSEL DEPTH',
      channel: 'LinkedIn Organization',
      variantA: {
        label: 'Variant A (5 Punchy Slides)',
        text: '5 crisp slide deck covering the medspa automation workflow.',
        ctr: '4.9%',
        leads: 82,
        isWinner: false,
      },
      variantB: {
        label: 'Variant B (8 Slides Data-Heavy Framework)',
        text: '8 slide blueprint with verified client case studies and revenue charts.',
        ctr: '6.4%',
        leads: 114,
        isWinner: true,
      },
      status: 'Active Testing · 74% Conf.',
      statusType: 'running' as const,
      uplift: '+29% Saves',
      impressions: '3,480 impressions',
      deployed: false,
    },
  ]);

  const handleLaunchExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newVariantA.trim() || !newVariantB.trim()) {
      showToast('Please fill in experiment title and both variants');
      return;
    }

    const newExp = {
      id: `exp-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      channel: newChannel,
      variantA: {
        label: 'Variant A (Control)',
        text: newVariantA.trim(),
        ctr: '4.8%',
        leads: 12,
        isWinner: false,
      },
      variantB: {
        label: 'Variant B (Challenger)',
        text: newVariantB.trim(),
        ctr: '6.2%',
        leads: 19,
        isWinner: true,
      },
      status: 'Active Testing · 50% Conf.',
      statusType: 'running' as const,
      uplift: '+29% Initial Lift',
      impressions: '640 impressions',
      deployed: false,
    };

    setExperiments([newExp, ...experiments]);
    setSelectedExperimentId(newExp.id);
    setIsNewExperimentModalOpen(false);
    setNewTitle('');
    setNewVariantA('');
    setNewVariantB('');
    triggerConfetti();
    showToast(`🎉 New experiment "${newExp.title}" launched live with 50/50 traffic split!`);
  };

  const handleDeployWinner = (expId: string) => {
    setExperiments((prev) =>
      prev.map((exp) => (exp.id === expId ? { ...exp, deployed: true } : exp))
    );
    triggerConfetti();
    showToast('Winning variant deployed to all live automated sequences!');
  };

  const activeExp =
    experiments.find((e) => e.id === selectedExperimentId) || experiments[0];

  const filteredExperiments = experiments.filter((exp) => {
    if (activeFilter === 'running' && exp.statusType !== 'running') return false;
    if (activeFilter === 'completed' && exp.statusType !== 'completed') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        exp.title.toLowerCase().includes(q) ||
        exp.category.toLowerCase().includes(q) ||
        exp.channel.toLowerCase().includes(q) ||
        exp.variantA.text.toLowerCase().includes(q) ||
        exp.variantB.text.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-900 pb-12 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#161616] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm animate-bounce-short">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Context & Global Utility (Reports Style) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">
              Social Experiments
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            A/B hook split-testing, CTA variations & algorithmic velocity · Soho clinic
          </p>
        </div>

        {/* Search & New Experiment Button (WORKING) */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiments, tests..."
              className="w-full pl-9 pr-10 py-2 bg-white rounded-full border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 shadow-2xs transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsNewExperimentModalOpen(true)}
            className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New experiment</span>
          </button>
        </div>
      </div>

      {/* 4 BENTO KPI CARDS (Matching Reports Rhythm) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {/* WHITE CARD */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Active Experiments</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">
              {experiments.filter((e) => e.statusType === 'running').length} Running
            </div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                {experiments.filter((e) => e.statusType === 'completed').length} reaching significance
              </span>
            </div>
          </div>
        </div>

        {/* SAGE GREEN CARD: Top Uplift */}
        <div className="bg-[#EAF6DA] rounded-3xl p-5 border border-[#DCF0C4] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-emerald-900/80 mb-2">
            <span className="text-xs font-semibold">Top Hook Uplift</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#558327]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-emerald-950">+74% CTR</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                Question Hook wins
              </span>
            </div>
          </div>
        </div>

        {/* LAVENDER CARD: Confidence */}
        <div className="bg-[#E9E4FD] rounded-3xl p-5 border border-[#DDD6FE] shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-purple-900/80 mb-2">
            <span className="text-xs font-semibold">Avg Statistical Power</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-purple-700">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-purple-950">95% Conf.</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                Statistically robust
              </span>
            </div>
          </div>
        </div>

        {/* WHITE CARD: Leads Generated */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Inbound Leads Won</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">
              {experiments.reduce((acc, curr) => acc + curr.variantA.leads + curr.variantB.leads, 0)} Leads
            </div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                ↑ Direct from winning variants
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-slate-200/60 shadow-2xs w-fit overflow-x-auto">
        {[
          { id: 'all', label: `All Experiments (${experiments.length})` },
          { id: 'running', label: `Active Testing (${experiments.filter((e) => e.statusType === 'running').length})` },
          { id: 'completed', label: `Ready to Deploy (${experiments.filter((e) => e.statusType === 'completed').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === tab.id
                ? 'bg-[#161616] text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* EXPERIMENTS SELECTOR STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredExperiments.map((exp) => {
          const isSelected = exp.id === activeExp.id;
          return (
            <div
              key={exp.id}
              onClick={() => setSelectedExperimentId(exp.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-[#161616] shadow-sm ring-1 ring-[#161616]'
                  : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span>{exp.category}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                  exp.statusType === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}>
                  {exp.uplift}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{exp.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">{exp.channel}</p>
            </div>
          );
        })}
      </div>

      {/* ACTIVE EXPERIMENT DETAIL & VARIANT A/B COMPARISON */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/70 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {activeExp.category} · {activeExp.channel}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">({activeExp.impressions})</span>
            </div>
            <h3 className="font-bold text-base text-[#161616] mt-0.5">{activeExp.title}</h3>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto ${
            activeExp.statusType === 'completed'
              ? 'text-emerald-800 bg-[#E8F7D4]'
              : 'text-purple-800 bg-[#EDE9FE]'
          }`}>
            {activeExp.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Variant A (Sage Green or White based on winner) */}
          <div className={`p-5 rounded-2xl border space-y-2.5 transition-all ${
            activeExp.variantA.isWinner
              ? 'bg-[#EAF6DA] border-[#DCF0C4]'
              : 'bg-slate-50 border-slate-200/70'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-xs ${activeExp.variantA.isWinner ? 'text-emerald-950' : 'text-slate-700'}`}>
                {activeExp.variantA.label}
              </span>
              {activeExp.variantA.isWinner ? (
                <span className="bg-white/90 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  ★ Winner ({activeExp.uplift})
                </span>
              ) : (
                <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Baseline
                </span>
              )}
            </div>
            <p className={`font-bold text-sm leading-snug ${
              activeExp.variantA.isWinner ? 'text-emerald-950' : 'text-slate-800'
            }`}>
              {activeExp.variantA.text}
            </p>
            <div className={`flex items-center justify-between font-medium pt-2 border-t ${
              activeExp.variantA.isWinner ? 'text-emerald-900/80 border-emerald-900/10' : 'text-slate-500 border-slate-200'
            }`}>
              <span>CTR: <strong>{activeExp.variantA.ctr}</strong></span>
              <span>Leads: <strong>{activeExp.variantA.leads} generated</strong></span>
            </div>
          </div>

          {/* Variant B */}
          <div className={`p-5 rounded-2xl border space-y-2.5 transition-all ${
            activeExp.variantB.isWinner
              ? 'bg-[#EAF6DA] border-[#DCF0C4]'
              : 'bg-slate-50 border-slate-200/70'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-xs ${activeExp.variantB.isWinner ? 'text-emerald-950' : 'text-slate-700'}`}>
                {activeExp.variantB.label}
              </span>
              {activeExp.variantB.isWinner ? (
                <span className="bg-white/90 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  ★ Winner ({activeExp.uplift})
                </span>
              ) : (
                <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Baseline
                </span>
              )}
            </div>
            <p className={`font-bold text-sm leading-snug ${
              activeExp.variantB.isWinner ? 'text-emerald-950' : 'text-slate-800'
            }`}>
              {activeExp.variantB.text}
            </p>
            <div className={`flex items-center justify-between font-medium pt-2 border-t ${
              activeExp.variantB.isWinner ? 'text-emerald-900/80 border-emerald-900/10' : 'text-slate-500 border-slate-200'
            }`}>
              <span>CTR: <strong>{activeExp.variantB.ctr}</strong></span>
              <span>Leads: <strong>{activeExp.variantB.leads} generated</strong></span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          {activeExp.deployed ? (
            <span className="bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Check className="w-4 h-4" />
              <span>Deployed to All Live Sequences ✓</span>
            </span>
          ) : (
            <button
              onClick={() => handleDeployWinner(activeExp.id)}
              className="bg-[#161616] hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Deploy Winner to All Sequences
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          NEW EXPERIMENT MODAL (LAUNCH NEW GROWTH TEST)
         ========================================================= */}
      {isNewExperimentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200/80 p-6 space-y-5 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-700">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Launch New Growth Experiment
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automated 50/50 split test across hooks, CTAs, and timing.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewExperimentModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleLaunchExperiment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5 text-[10px]">
                  Experiment Name
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Question Hook vs Negative Bias Hook"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5 text-[10px]">
                    Target Channel
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-2xs"
                  >
                    <option value="Instagram Professional">Instagram Professional</option>
                    <option value="TikTok for Business">TikTok for Business</option>
                    <option value="Threads Engine">Threads Engine</option>
                    <option value="LinkedIn Organization">LinkedIn Organization</option>
                    <option value="Facebook Pages">Facebook Pages</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5 text-[10px]">
                    Test Variable
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-2xs"
                  >
                    <option value="VIRAL HOOKS">Headline / Hook Formula</option>
                    <option value="CONVERSION CTA">Call-to-Action Phrase</option>
                    <option value="VIDEO DURATION">Video Length / Pacing</option>
                    <option value="CAROUSEL DEPTH">Carousel Slide Depth</option>
                    <option value="SEND TIME">Posting Schedule Window</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5 text-[10px]">
                  Variant A (Control Phrase / Copy)
                </label>
                <textarea
                  rows={2}
                  required
                  value={newVariantA}
                  onChange={(e) => setNewVariantA(e.target.value)}
                  placeholder="e.g. 'Are you tired of spending hours on routine aesthetic bookings?'"
                  className="w-full p-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-2xs resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5 text-[10px]">
                  Variant B (Challenger Phrase / Copy)
                </label>
                <textarea
                  rows={2}
                  required
                  value={newVariantB}
                  onChange={(e) => setNewVariantB(e.target.value)}
                  placeholder="e.g. 'Why 90% of Soho clinics are switching to instant 24/7 DM automation.'"
                  className="w-full p-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-2xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5 text-[10px]">
                    Primary Metric (KPI)
                  </label>
                  <select
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-2xs"
                  >
                    <option value="Click-Through Rate (CTR)">Click-Through Rate (CTR %)</option>
                    <option value="DM Inquiries">Direct Message (DM) Inquiries</option>
                    <option value="Video Completion Rate">Video 100% Completion Rate</option>
                    <option value="Save Rate">Content Save & Share Rate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5 text-[10px]">
                    Traffic Allocation
                  </label>
                  <div className="px-3.5 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-100/60 text-xs text-slate-600 font-semibold shadow-2xs">
                    50% / 50% Automated Split
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewExperimentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#141416] hover:bg-black text-white rounded-full text-xs font-semibold shadow-sm transition-all"
                >
                  Launch Experiment 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
