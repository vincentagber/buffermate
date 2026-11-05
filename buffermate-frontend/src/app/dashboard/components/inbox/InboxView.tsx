'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Send,
  Clock,
  MessageSquare,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Check,
  Lock,
  FolderGit2,
  ExternalLink,
  User,
  AlertCircle,
  Tag,
  ChevronDown,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';
import { triggerConfetti } from '@/components/ui/Confetti';
import ComposeMessageModal from './ComposeMessageModal';
import JiraIssueDetailModal from '../jira/JiraIssueDetailModal';
import { JiraProject } from '../jira/types';

interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'customer' | 'agent' | 'system';
  sender_name: string;
  is_internal_note: boolean;
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  workspace_id: string;
  channel: 'instagram' | 'linkedin' | 'whatsapp' | 'tiktok';
  sender_name: string;
  sender_handle: string;
  sender_avatar: string;
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  assignee_id?: string | null;
  assignee_name?: string | null;
  work_item_id?: string | null;
  work_item_key?: string | null;
  unread: boolean;
  response_time_minutes: number;
  pipeline_value: string | number;
  last_message_preview?: string;
  last_message_at?: string;
  created_at: string;
  messages?: Message[];
  work_item?: any;
}

interface InboxStats {
  avg_reply_time: string;
  unread_inquiries: string;
  unread_count: number;
  high_priority_count: number;
  resolution_rate: string;
  pipeline_value: string;
  pipeline_raw: number;
}

export default function InboxView() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [stats, setStats] = useState<InboxStats>({
    avg_reply_time: '8 mins',
    unread_inquiries: '7 unread',
    unread_count: 7,
    high_priority_count: 3,
    resolution_rate: '98.4%',
    pipeline_value: '$48,200',
    pipeline_raw: 48200,
  });

  const [activeChannelFilter, setActiveChannelFilter] = useState<'all' | 'instagram' | 'linkedin' | 'whatsapp' | 'tiktok'>('all');
  const [activeQueue, setActiveQueue] = useState<'all' | 'unassigned' | 'assigned_to_me' | 'waiting_support' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Composer & reply states
  const [replyMode, setReplyMode] = useState<'public' | 'internal'>('public');
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isConvertingToJira, setIsConvertingToJira] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Jira Issue Modal preview
  const [selectedJiraKey, setSelectedJiraKey] = useState<string | null>(null);
  const [defaultProject, setDefaultProject] = useState<JiraProject | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut ⌘K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchConversations();
    fetchStats();
    fetchDefaultProject();
  }, [activeChannelFilter, activeQueue]);

  const fetchDefaultProject = async () => {
    try {
      const res = await fetch('/api/jira/projects');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setDefaultProject(data.data[0]);
      }
    } catch (e) {
      console.error('Failed to load Jira default project:', e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/inbox/stats');
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (e) {
      console.error('Failed to load inbox stats:', e);
    }
  };

  const fetchConversations = async (preferredId?: string) => {
    try {
      const params = new URLSearchParams();
      if (activeChannelFilter !== 'all') params.append('channel', activeChannelFilter);
      if (activeQueue !== 'all') params.append('queue', activeQueue);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/inbox/conversations?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setConversations(data.data);

        // Preserve active conversation or select first
        if (data.data.length > 0) {
          const targetId = preferredId || activeConversation?.id;
          const match = targetId ? data.data.find((c: Conversation) => c.id === targetId) : data.data[0];
          const selected = match || data.data[0];
          loadConversationDetails(selected.id);
        } else {
          setActiveConversation(null);
        }
      }
    } catch (e) {
      console.error('Failed to load conversations:', e);
    }
  };

  const loadConversationDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/inbox/conversations/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setActiveConversation(data.data);
        // Optimistically update read status in conversations list
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
        );
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    } catch (e) {
      console.error('Failed to load conversation details:', e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchConversations();
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !replyText.trim() || isSendingReply) return;

    setIsSendingReply(true);
    const content = replyText.trim();
    const isInternal = replyMode === 'internal';

    try {
      const res = await fetch(`/api/inbox/conversations/${activeConversation.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          is_internal_note: isInternal,
          sender_name: 'Alex Morgan',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setActiveConversation(data.data);
        setReplyText('');
        triggerConfetti();
        showToast(
          isInternal
            ? 'Internal team note added to conversation'
            : `Reply dispatched to ${activeConversation.sender_name} via ${activeConversation.channel}!`
        );
        fetchStats();
        // Update item preview in left list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversation.id
              ? {
                  ...c,
                  last_message_preview: isInternal ? c.last_message_preview : content,
                  status: c.status === 'open' ? 'in_progress' : c.status,
                }
              : c
          )
        );
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    } catch (e) {
      console.error('Failed to send reply:', e);
      showToast('Error dispatching message. Please try again.');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleConvertToJira = async () => {
    if (!activeConversation || isConvertingToJira) return;

    setIsConvertingToJira(true);
    try {
      const res = await fetch(`/api/inbox/conversations/${activeConversation.id}/convert-to-jira`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'task' }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const updatedConv = data.data.conversation;
        setActiveConversation(updatedConv);
        triggerConfetti();
        showToast(`Converted to Jira issue ${data.data.work_item?.key || 'BM-WorkItem'}!`);

        // Update in list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === updatedConv.id
              ? { ...c, work_item_key: updatedConv.work_item_key, work_item_id: updatedConv.work_item_id }
              : c
          )
        );
      }
    } catch (e) {
      console.error('Failed to convert to Jira:', e);
      showToast('Error converting inquiry to Jira.');
    } finally {
      setIsConvertingToJira(false);
    }
  };

  const handleUpdateStatus = async (newStatus: Conversation['status']) => {
    if (!activeConversation) return;

    try {
      const res = await fetch(`/api/inbox/conversations/${activeConversation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setActiveConversation(data.data);
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConversation.id ? { ...c, status: newStatus } : c))
        );
        showToast(`Status updated to ${newStatus.replace('_', ' ')}`);
        fetchStats();
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleUpdatePriority = async (newPriority: Conversation['priority']) => {
    if (!activeConversation) return;

    try {
      const res = await fetch(`/api/inbox/conversations/${activeConversation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setActiveConversation(data.data);
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConversation.id ? { ...c, priority: newPriority } : c))
        );
        showToast(`Priority set to ${newPriority}`);
      }
    } catch (e) {
      console.error('Failed to update priority:', e);
    }
  };

  const handleUpdateAssignee = async (newAssignee: string) => {
    if (!activeConversation) return;

    try {
      const res = await fetch(`/api/inbox/conversations/${activeConversation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignee_name: newAssignee === 'unassigned' ? null : newAssignee }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setActiveConversation(data.data);
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConversation.id ? { ...c, assignee_name: newAssignee === 'unassigned' ? null : newAssignee } : c))
        );
        showToast(`Assigned to ${newAssignee}`);
      }
    } catch (e) {
      console.error('Failed to update assignee:', e);
    }
  };

  const handleApplyAiSuggestion = () => {
    if (!activeConversation) return;
    const firstName = activeConversation.sender_name.split(' ')[0] || 'there';

    if (activeConversation.channel === 'instagram') {
      setReplyText(
        `Hi ${firstName}! Thanks for reaching out. We would be thrilled to connect. You can book directly with our executive lead team right here: buffermate.ai/meet`
      );
    } else if (activeConversation.channel === 'linkedin') {
      setReplyText(
        `Hi ${firstName}! Thanks for getting in touch. I would love to connect this Friday for 15 minutes. Here is my direct scheduling link: buffermate.ai/meet/executive`
      );
    } else {
      setReplyText(
        `Hi ${firstName}! Thank you for your inquiry. Here is the direct link to the resource you requested: buffermate.ai/resources/access`
      );
    }
    setReplyMode('public');
  };

  // Format relative time (e.g. 12m ago, 2h ago)
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'just now';
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffSec < 60) return 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-900 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#161616] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm animate-bounce-short border border-slate-800">
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
            Unified real-time social inbox · {stats.unread_inquiries} across connected channels
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Search bar with ⌘K */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search conversations, handles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-white rounded-full border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-200 focus:border-purple-400 shadow-2xs transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono select-none">
              ⌘K
            </span>
          </form>

          {/* Outbound Composer Button */}
          <button
            onClick={() => setIsComposeOpen(true)}
            className="bg-[#141416] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Compose message</span>
          </button>
        </div>
      </div>

      {/* JIRA QUEUES & CHANNEL FILTER NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-2">
        {/* Jira Queues (JSM Parity) */}
        <div className="flex items-center overflow-x-auto gap-1.5 sm:gap-2 scrollbar-none pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
          {[
            { id: 'all', label: 'All Inquiries' },
            { id: 'unassigned', label: 'Unassigned' },
            { id: 'assigned_to_me', label: 'Assigned to me' },
            { id: 'waiting_support', label: 'Waiting for Support' },
            { id: 'resolved', label: 'Resolved & Closed' },
          ].map((queue) => (
            <button
              key={queue.id}
              onClick={() => setActiveQueue(queue.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                activeQueue === queue.id
                  ? 'bg-[#141416] text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {queue.label}
            </button>
          ))}
        </div>

        {/* Channel Filter Pills */}
        <div className="flex items-center overflow-x-auto gap-1.5 scrollbar-none shrink-0">
          {[
            { id: 'all', label: 'All Channels' },
            { id: 'instagram', label: 'Instagram' },
            { id: 'linkedin', label: 'LinkedIn' },
            { id: 'whatsapp', label: 'WhatsApp' },
            { id: 'tiktok', label: 'TikTok' },
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannelFilter(ch.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                activeChannelFilter === ch.id
                  ? 'bg-purple-100 text-purple-900 border border-purple-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {ch.id !== 'all' && <SocialPlatformIcon channel={ch.id} className="w-3 h-3" />}
              <span>{ch.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4 BENTO KPI CARDS (Matching Reports Rhythm) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Avg Reply Time */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Avg Reply Time</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">{stats.avg_reply_time}</div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                ↑ 42% faster
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: HERO LAVENDER CARD: Unread Inquiries */}
        <div className="bg-[#E9E4FD] rounded-3xl p-5 border border-[#DDD6FE] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-900/80 mb-2">
            <span className="text-xs font-semibold">Unread Inquiries</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-purple-700">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-purple-950">{stats.unread_inquiries}</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                {stats.high_priority_count} high priority
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: HERO MATCHA GREEN CARD: Resolution Rate */}
        <div className="bg-[#EAF6DA] rounded-3xl p-5 border border-[#DCF0C4] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-900/80 mb-2">
            <span className="text-xs font-semibold">Resolution Rate</span>
            <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#558327]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-emerald-950">{stats.resolution_rate}</div>
            <div className="mt-2 flex items-center">
              <span className="bg-white/90 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                ↑ 2 pts
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Pipeline from DMs */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pipeline from DMs</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">{stats.pipeline_value}</div>
            <div className="mt-2 flex items-center">
              <span className="bg-[#E8F7D4] text-[#3B6B15] text-[11px] font-bold px-2 py-0.5 rounded-full">
                ↑ $12k this month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SPLIT VIEW (40/60) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (Conversations List, 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/70 shadow-2xs space-y-3 flex flex-col h-[640px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900">Direct Conversations</span>
              <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold">
                Multi-Channel
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono font-medium">
              {conversations.length} total
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {conversations.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No inquiries matching the selected filters.
              </div>
            ) : (
              conversations.map((m) => {
                const isSelected = activeConversation?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => loadConversationDetails(m.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border relative ${
                      isSelected
                        ? 'bg-[#E9E4FD] border-[#DDD6FE] shadow-2xs'
                        : 'hover:bg-slate-50 border-transparent bg-slate-50/40'
                    }`}
                  >
                    {m.unread && (
                      <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                    )}

                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2 min-w-0 pr-4">
                        <img
                          src={m.sender_avatar}
                          alt={m.sender_name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                        <span className="font-bold text-xs text-slate-900 truncate">{m.sender_name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {formatTimeAgo(m.last_message_at || m.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2.5">
                      {m.last_message_preview}
                    </p>

                    {/* Metadata tags: Channel, Priority, Jira Issue Key */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/40">
                      <div className="flex items-center space-x-1.5">
                        <div className="p-1 rounded-md bg-white border border-slate-200/60 shadow-2xs">
                          <SocialPlatformIcon channel={m.channel} className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium capitalize">
                          {m.channel}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {m.work_item_key && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJiraKey(m.work_item_key || null);
                            }}
                            className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold hover:bg-blue-100 transition-colors"
                            title="Click to view Jira Issue"
                          >
                            {m.work_item_key}
                          </span>
                        )}

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.priority === 'urgent'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : m.priority === 'high'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {m.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (Active Thread & Jira Controls, 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/70 shadow-2xs flex flex-col justify-between h-[640px]">
          {activeConversation ? (
            <div className="flex flex-col h-full min-h-0">
              {/* Thread Header: Customer info & Jira controls */}
              <div className="pb-4 border-b border-slate-100 shrink-0 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeConversation.sender_avatar}
                      alt={activeConversation.sender_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-[#161616] flex items-center space-x-2">
                        <span>{activeConversation.sender_name}</span>
                        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-700">
                          <SocialPlatformIcon channel={activeConversation.channel} className="w-3 h-3" />
                          <span className="capitalize">{activeConversation.channel}</span>
                        </div>
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">{activeConversation.sender_handle}</span>
                    </div>
                  </div>

                  {/* Jira Issue Conversion / Open Button */}
                  <div>
                    {activeConversation.work_item_key ? (
                      <button
                        onClick={() => setSelectedJiraKey(activeConversation.work_item_key || null)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold font-mono flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>{activeConversation.work_item_key}</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </button>
                    ) : (
                      <button
                        onClick={handleConvertToJira}
                        disabled={isConvertingToJira}
                        className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>{isConvertingToJira ? 'Converting...' : 'Convert to Jira Issue'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Workflow Status, Priority & Assignee selectors */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {/* Status Dropdown */}
                  <select
                    value={activeConversation.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as any)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold cursor-pointer text-xs shadow-2xs"
                  >
                    <option value="open">Status: Open</option>
                    <option value="in_progress">Status: In Progress</option>
                    <option value="waiting_customer">Status: Waiting for Customer</option>
                    <option value="resolved">Status: Resolved</option>
                    <option value="closed">Status: Closed</option>
                  </select>

                  {/* Priority Dropdown */}
                  <select
                    value={activeConversation.priority}
                    onChange={(e) => handleUpdatePriority(e.target.value as any)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold cursor-pointer text-xs shadow-2xs"
                  >
                    <option value="urgent">Priority: Urgent</option>
                    <option value="high">Priority: High</option>
                    <option value="normal">Priority: Normal</option>
                    <option value="low">Priority: Low</option>
                  </select>

                  {/* Assignee Dropdown */}
                  <select
                    value={activeConversation.assignee_name || 'unassigned'}
                    onChange={(e) => handleUpdateAssignee(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold cursor-pointer text-xs shadow-2xs"
                  >
                    <option value="unassigned">Assignee: Unassigned</option>
                    <option value="Alex Morgan">Assignee: Alex Morgan</option>
                    <option value="Elena Rostova">Assignee: Elena Rostova</option>
                    <option value="Liam Patel">Assignee: Liam Patel</option>
                    <option value="Sarah Chen">Assignee: Sarah Chen</option>
                  </select>
                </div>
              </div>

              {/* Message Thread List (Scrollable Area) */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 min-h-0 pr-1">
                {activeConversation.messages && activeConversation.messages.length > 0 ? (
                  activeConversation.messages.map((msg) => {
                    if (msg.sender_type === 'system') {
                      return (
                        <div key={msg.id} className="flex justify-center my-2">
                          <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200 flex items-center space-x-1.5">
                            <FolderGit2 className="w-3 h-3 text-blue-600" />
                            <span>{msg.content}</span>
                          </div>
                        </div>
                      );
                    }

                    if (msg.is_internal_note) {
                      return (
                        <div key={msg.id} className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs space-y-1">
                          <div className="flex items-center justify-between text-amber-900 font-bold text-[10px]">
                            <div className="flex items-center space-x-1.5">
                              <Lock className="w-3 h-3 text-amber-700" />
                              <span>Internal Team Note · {msg.sender_name}</span>
                            </div>
                            <span className="text-amber-700/70 font-normal">{formatTimeAgo(msg.created_at)}</span>
                          </div>
                          <p className="text-amber-950 font-medium leading-relaxed">{msg.content}</p>
                        </div>
                      );
                    }

                    const isAgent = msg.sender_type === 'agent';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                            isAgent
                              ? 'bg-[#141416] text-white rounded-br-xs'
                              : 'bg-slate-50 border border-slate-200/80 text-slate-900 rounded-bl-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between space-x-2 text-[10px] mb-1 opacity-70">
                            <span className="font-bold">{msg.sender_name}</span>
                            <span>{formatTimeAgo(msg.created_at)}</span>
                          </div>
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs sm:text-sm text-slate-800 leading-relaxed shadow-2xs">
                    {activeConversation.last_message_preview}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* AI Smart Draft Recommendation Banner */}
              <div className="bg-[#EAF6DA] border border-[#DCF0C4] rounded-2xl p-3 flex items-center justify-between gap-3 shrink-0 mb-3">
                <div className="flex items-center gap-2 text-xs text-[#2D5018] font-medium min-w-0">
                  <Sparkles className="w-4 h-4 text-[#52802B] shrink-0" />
                  <span className="truncate">Auto-drafted personalized response ready for review</span>
                </div>
                <button
                  type="button"
                  onClick={handleApplyAiSuggestion}
                  className="bg-white hover:bg-slate-50 text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs shrink-0 transition-transform active:scale-95 cursor-pointer"
                >
                  Insert Draft
                </button>
              </div>

              {/* Reply Mode Switcher & Form */}
              <div className="shrink-0 space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setReplyMode('public')}
                    className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      replyMode === 'public'
                        ? 'bg-[#141416] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Reply to Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyMode('internal')}
                    className={`px-3 py-1 rounded-full font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      replyMode === 'internal'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Lock className="w-3 h-3 text-amber-700" />
                    <span>Internal Note</span>
                  </button>
                </div>

                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={
                      replyMode === 'internal'
                        ? 'Add internal team note (visible only to team)...'
                        : `Reply to ${activeConversation.sender_name} via ${activeConversation.channel}...`
                    }
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className={`flex-1 px-4 py-2.5 rounded-full text-xs font-medium focus:outline-hidden transition-all ${
                      replyMode === 'internal'
                        ? 'bg-amber-50/70 border border-amber-200 focus:ring-2 focus:ring-amber-300 text-amber-950 placeholder-amber-700/60'
                        : 'bg-slate-50 border border-slate-200/80 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-slate-900'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isSendingReply || !replyText.trim()}
                    className={`px-5 py-2.5 text-xs font-bold rounded-full flex items-center space-x-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer ${
                      replyMode === 'internal'
                        ? 'bg-amber-800 hover:bg-amber-900 text-white'
                        : 'bg-[#161616] hover:bg-black text-white'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingReply ? 'Sending...' : replyMode === 'internal' ? 'Add Note' : 'Send'}</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 opacity-40" />
              <p className="text-sm font-medium">Select a conversation from the left to view inquiry thread.</p>
            </div>
          )}
        </div>
      </div>

      {/* Outbound Compose Message Modal */}
      <ComposeMessageModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onCreated={(newConv) => {
          showToast(`Outbound message conversation initiated with ${newConv.sender_name}!`);
          fetchConversations(newConv.id);
          fetchStats();
        }}
      />

      {/* Jira Issue Detail Modal (Seamless In-Place Jira Inspection) */}
      {selectedJiraKey && defaultProject && (
        <JiraIssueDetailModal
          issueIdOrKey={selectedJiraKey}
          onClose={() => setSelectedJiraKey(null)}
          onIssueUpdated={(updated) => {
            fetchConversations();
          }}
          onIssueDeleted={(deletedId) => {
            setSelectedJiraKey(null);
            fetchConversations();
          }}
          project={defaultProject}
        />
      )}
    </div>
  );
}
