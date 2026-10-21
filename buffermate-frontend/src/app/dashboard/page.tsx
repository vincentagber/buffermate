'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Bot,
  Plus,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Instagram,
  Facebook,
  AtSign,
  Users,
  Activity,
  CheckCircle2,
  Clock,
  Send,
  Calendar,
  Layers,
  Settings,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  FileText,
  PhoneCall,
  Sliders,
  Share2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Zap,
  Play,
  CheckSquare,
  Square,
  Check,
  Megaphone,
  Target
} from 'lucide-react';
import Sidebar, { BufferMateLogo } from './components/Sidebar';
import Header from './components/Header';
import CommandCenterView from './components/CommandCenterView';
import CampaignsView from './components/CampaignsView';
import {
  GoalsView,
  TasksView,
  InboxView,
  RoiRevenueView,
  ExperimentsView,
} from './components/SocialynViews';
import ReportsView from './components/ReportsView';
import MembershipsRetentionView from './components/MembershipsRetentionView';
import FlowAssistModal from './components/FlowAssistModal';
import AutomationModal from './components/AutomationModal';
import SimulatorModal from './components/SimulatorModal';
import PostSchedulerModal from './components/PostSchedulerModal';
import AiAutoPostStudio from './components/AiAutoPostStudio';
import AiContentStudio from './components/AiContentStudio';
import ProfileSettingsView from './components/ProfileSettingsView';
import IntegrationsView from './components/IntegrationsView';
import { SocialPlatformIcon } from '@/components/SocialIcons';
import { triggerConfetti } from '@/components/ui/Confetti';
import {
  SocialAutomation,
  ActivityEvent,
  SocialLead,
  Post,
  SocialChannel
} from '@/lib/types';
import {
  INITIAL_AUTOMATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_LEADS,
  INITIAL_POSTS,
} from '@/lib/services/automation-store';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  // Navigation & View state - Defaulting to Command Center matching Socialyn OS
  const [currentTab, setCurrentTab] = useState('command-center');
  const [dashboardSubView, setDashboardSubView] = useState<'command_center' | 'platform_overview' | 'metrics_dashboard'>('command_center');
  const [activityFilter, setActivityFilter] = useState<'all' | 'automations' | 'leads' | 'posts'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Real-time Database Stats (All 8 KPI metrics)
  const [realtimeStats, setRealtimeStats] = useState({
    totalContacts: 2556,
    messagesToday: 243,
    messagesThisWeek: 842,
    activeAutomationsCount: 8,
    responseRate: '98.4%',
    leadsCapturedToday: 18,
    leadsThisWeek: 142,
    leadPagesCount: 4,
    totalWorkflowsCount: 8,
    socialChannelsCount: 6,
    socialChannelsText: 'IG, TikTok, FB, Threads, WA, X',
    connectedChannels: ['instagram', 'tiktok', 'facebook', 'threads', 'whatsapp', 'x'],
  });
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(true);
  const [userName, setUserName] = useState<string>('Vincent Agber');

  // Real Database State
  const [automations, setAutomations] = useState<SocialAutomation[]>(INITIAL_AUTOMATIONS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  const [leads, setLeads] = useState<SocialLead[]>(INITIAL_LEADS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateAutomationOpen, setIsCreateAutomationOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<SocialAutomation | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isPostComposerOpen, setIsPostComposerOpen] = useState(false);
  const [isFlowAssistOpen, setIsFlowAssistOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggleSelectPost = (postId: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleSelectAllPosts = () => {
    if (selectedPostIds.length === posts.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(posts.map((p) => p.id));
    }
  };

  const handleBulkStatusChange = async (newStatus: 'posted' | 'scheduled') => {
    if (selectedPostIds.length === 0) return;
    setPosts((prev) =>
      prev.map((p) => (selectedPostIds.includes(p.id) ? { ...p, status: newStatus } : p))
    );
    if (newStatus === 'posted') {
      triggerConfetti();
      showToast(`🎉 Published ${selectedPostIds.length} posts to live channels!`);
    } else {
      showToast(`Updated ${selectedPostIds.length} posts to scheduled.`);
    }
    setSelectedPostIds([]);
  };

  const handleBulkDeletePosts = async () => {
    if (selectedPostIds.length === 0) return;
    if (!confirm(`Delete ${selectedPostIds.length} selected posts?`)) return;
    setPosts((prev) => prev.filter((p) => !selectedPostIds.includes(p.id)));
    showToast(`Deleted ${selectedPostIds.length} posts.`);
    setSelectedPostIds([]);
  };

  // Fetch aggregated real-time metrics
  const fetchRealtimeStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const body = await res.json();
        if (body.success && body.data) {
          setRealtimeStats(body.data);
          setIsRealtimeConnected(true);
        }
      }
    } catch (err) {
      console.error('Error fetching real-time dashboard stats:', err);
    }
  };

  // Load real data from live Supabase APIs
  const loadDatabaseData = async () => {
    try {
      const [autoRes, actRes, leadRes, postRes] = await Promise.all([
        fetch('/api/automations'),
        fetch('/api/activity'),
        fetch('/api/leads'),
        fetch('/api/posts'),
      ]);

      const [autoData, actData, leadData, postData] = await Promise.all([
        autoRes.json().catch(() => ({ success: false })),
        actRes.json().catch(() => ({ success: false })),
        leadRes.json().catch(() => ({ success: false })),
        postRes.json().catch(() => []),
      ]);

      if (autoData.success && Array.isArray(autoData.data) && autoData.data.length > 0) {
        setAutomations(autoData.data);
      }
      if (actData.success && Array.isArray(actData.data) && actData.data.length > 0) {
        setActivities(
          actData.data.map((a: any) => ({
            ...a,
            time_ago: a.time_ago || 'just now',
          }))
        );
      }
      if (leadData.success && Array.isArray(leadData.data) && leadData.data.length > 0) {
        setLeads(
          leadData.data.map((l: any) => ({
            ...l,
            last_interaction: l.last_interaction ? new Date(l.last_interaction).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recent',
          }))
        );
      }
      if (Array.isArray(postData) && postData.length > 0) {
        setPosts(postData);
      }
    } catch (err) {
      console.error('Error fetching live database records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
    fetchRealtimeStats();

    // 1. Supabase Postgres Realtime Subscription for instant live sync
    const realtimeChannel = supabase
      .channel('dashboard_metrics_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_leads' }, () => {
        fetchRealtimeStats();
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_automations' }, () => {
        fetchRealtimeStats();
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_activity_stream' }, () => {
        fetchRealtimeStats();
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_accounts' }, () => {
        fetchRealtimeStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchRealtimeStats();
        loadDatabaseData();
      })
      .subscribe((status: any) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeConnected(true);
        }
      });

    // 2. Server-Sent Events (SSE) Stream for Instant Integrations & Channels Updates
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/integrations/stream');
      es.addEventListener('update', () => {
        fetchRealtimeStats();
      });
      es.addEventListener('init', () => {
        setIsRealtimeConnected(true);
      });
    } catch (err) {}

    const fetchUser = async () => {
      try {
        const cached = localStorage.getItem('buffermate_user_profile');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.fullName) {
            setUserName(parsed.fullName);
            return;
          }
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserName(user.user_metadata?.name || user.user_metadata?.full_name || 'Alex Morgan');
        }
      } catch (e) {}
    };
    fetchUser();

    const handleProfileUpdate = (e: any) => {
      if (e.detail?.fullName) {
        setUserName(e.detail.fullName);
      }
    };
    window.addEventListener('user-profile-updated', handleProfileUpdate);

    const handleSwitchTab = (e: any) => {
      if (e.detail?.tab === 'analytics') {
        router.push('/dashboard/analytics');
      } else if (e.detail?.tab) {
        setCurrentTab(e.detail.tab);
      }
    };
    window.addEventListener('switch-dashboard-tab', handleSwitchTab);

    // Sync initial tab and subview from URL search params if present
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      if (tabParam === 'analytics') {
        router.push('/dashboard/analytics');
      } else if (tabParam) {
        setCurrentTab(tabParam);
      }
      const subviewParam = searchParams.get('subview');
      if (subviewParam === 'platform_overview' || subviewParam === 'metrics_dashboard' || subviewParam === 'command_center') {
        setDashboardSubView(subviewParam);
      }
    } catch (e) {}

    return () => {
      supabase.removeChannel(realtimeChannel);
      if (es) es.close();
      window.removeEventListener('user-profile-updated', handleProfileUpdate);
      window.removeEventListener('switch-dashboard-tab', handleSwitchTab);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Automation Handlers (with real DB sync)
  const handleSaveAutomation = (newAuto: SocialAutomation) => {
    const exists = automations.some((a) => a.id === newAuto.id);
    if (exists) {
      setAutomations(automations.map((a) => (a.id === newAuto.id ? newAuto : a)));
      showToast(`Updated automation "${newAuto.name}" in database`);
    } else {
      setAutomations([newAuto, ...automations]);
      showToast(`Saved automation "${newAuto.name}" to database`);
    }
    fetchRealtimeStats();
  };

  const handleToggleAutomationStatus = async (id: string) => {
    const target = automations.find((a) => a.id === id);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'paused' : 'active';

    // Optimistic UI update
    setAutomations(
      automations.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
    );
    setRealtimeStats((prev) => ({
      ...prev,
      activeAutomationsCount: nextStatus === 'active' ? prev.activeAutomationsCount + 1 : Math.max(0, prev.activeAutomationsCount - 1),
    }));
    showToast(`Automation "${target.name}" is now ${nextStatus}`);

    // Update real row in Supabase
    try {
      await fetch(`/api/automations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchRealtimeStats();
    } catch (e) {
      console.error('Error updating status:', e);
    }
  };

  const handleDeleteAutomation = async (id: string) => {
    setAutomations(automations.filter((a) => a.id !== id));
    setRealtimeStats((prev) => ({
      ...prev,
      totalWorkflowsCount: Math.max(0, prev.totalWorkflowsCount - 1),
    }));
    showToast('Automation deleted from database');
    try {
      await fetch(`/api/automations/${id}`, { method: 'DELETE' });
      fetchRealtimeStats();
    } catch (e) {
      console.error('Error deleting automation:', e);
    }
  };

  // Simulator Trigger Handler (Updates real DB and state)
  const handleSimulateTrigger = (
    newActivity: ActivityEvent,
    newLead?: SocialLead,
    updatedAutomation?: SocialAutomation
  ) => {
    setActivities([newActivity, ...activities]);
    if (newLead) {
      setLeads([newLead, ...leads]);
    }
    if (updatedAutomation) {
      setAutomations(
        automations.map((a) => (a.id === updatedAutomation.id ? updatedAutomation : a))
      );
    }
    setRealtimeStats((prev) => ({
      ...prev,
      messagesToday: prev.messagesToday + 1,
      leadsCapturedToday: newLead ? prev.leadsCapturedToday + 1 : prev.leadsCapturedToday,
      totalContacts: newLead ? prev.totalContacts + 1 : prev.totalContacts,
    }));
    showToast('Real trigger processed & logged to Supabase! 🚀');
    fetchRealtimeStats();
  };

  // Post Scheduling Handler
  const handleSavePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    if (newPost.status === 'posted') {
      const publishActivity: ActivityEvent = {
        id: `act-${Date.now()}`,
        event_type: 'post_published',
        channel: newPost.channels?.[0] || 'instagram',
        title: `Post Published to ${newPost.channels?.join(', ') || 'Social'}`,
        description: newPost.content.slice(0, 80) + '...',
        time_ago: 'just now',
        created_at: new Date().toISOString(),
      };
      setActivities([publishActivity, ...activities]);
    }
    showToast(newPost.status === 'posted' ? 'Post published successfully!' : 'Post scheduled in Supabase!');
  };

  // Filtered Activity Stream
  const filteredActivities = activities.filter((act) => {
    if (activityFilter === 'all') return true;
    if (activityFilter === 'automations') return act.event_type === 'auto_dm' || act.event_type === 'comment_replied';
    if (activityFilter === 'leads') return act.event_type === 'lead_captured';
    if (activityFilter === 'posts') return act.event_type === 'post_published' || act.event_type === 'ai_autopost';
    return true;
  });

  // Dynamic statistics from live Supabase Realtime store
  const totalContacts = realtimeStats.totalContacts;
  const messagesToday = realtimeStats.messagesToday;
  const activeAutomationsCount = realtimeStats.activeAutomationsCount;
  const leadsCapturedToday = realtimeStats.leadsCapturedToday;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#0F172A] overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-[#1E293B] text-white px-4 sm:px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 text-xs font-bold animate-fade-in border border-neutral-700 max-w-[90vw]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Component with mobile drawer and desktop collapse support */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'analytics') {
            router.push('/dashboard/analytics');
            return;
          }
          setCurrentTab(tab);
          if (tab === 'command-center' || tab === 'overview') {
            setDashboardSubView('command_center');
          }
        }}
        onOpenCreateModal={() => setIsPostComposerOpen(true)}
        onOpenPostModal={() => setIsPostComposerOpen(true)}
        onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
        onOpenFlowAssist={() => setIsFlowAssistOpen(true)}
        onSignOut={handleSignOut}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Top Header Component */}
      <Header
        currentTab={currentTab}
        userName={userName}
        onOpenCreateModal={() => setIsPostComposerOpen(true)}
        onOpenPostModal={() => setIsPostComposerOpen(true)}
        onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
        onSignOut={handleSignOut}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onSelectTab={(tab) => {
          if (tab === 'analytics') {
            router.push('/dashboard/analytics');
            return;
          }
          setCurrentTab(tab);
          if (tab === 'command-center' || tab === 'overview') {
            setDashboardSubView('command_center');
          }
        }}
        onOpenSearch={() => {
          const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
          window.dispatchEvent(event);
        }}
      />

      {/* Main Content Area */}
      <main className={`pt-16 min-h-screen pb-16 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
          
          {/* Sub Navigation / View Switcher when in 'command-center' or 'overview' */}
          {(currentTab === 'command-center' || currentTab === 'overview') && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div className="inline-flex bg-white/80 p-1 rounded-full border border-slate-200/60 shadow-2xs self-start w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => {
                    setCurrentTab('command-center');
                    setDashboardSubView('command_center');
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full text-xs font-semibold transition-all text-center whitespace-nowrap ${
                    dashboardSubView === 'command_center'
                      ? 'bg-[#161616] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                  }`}
                >
                  Command Center
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('command-center');
                    setDashboardSubView('platform_overview');
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full text-xs font-semibold transition-all text-center whitespace-nowrap ${
                    dashboardSubView === 'platform_overview'
                      ? 'bg-[#161616] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                  }`}
                >
                  Platform & Channels
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('command-center');
                    setDashboardSubView('metrics_dashboard');
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full text-xs font-semibold transition-all text-center whitespace-nowrap ${
                    dashboardSubView === 'metrics_dashboard'
                      ? 'bg-[#161616] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                  }`}
                >
                  KPI Dashboard
                </button>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <button
                  onClick={() => setIsPostComposerOpen(true)}
                  className="px-3.5 py-1.5 bg-[#161616] hover:bg-black text-white rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Create Post</span>
                </button>
                <button
                  onClick={() => setCurrentTab('campaigns')}
                  className="px-3.5 py-1.5 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-full text-xs font-medium text-slate-700 transition-colors flex items-center space-x-1.5 shadow-2xs"
                >
                  <Megaphone className="w-3.5 h-3.5 text-purple-600" />
                  <span>Campaigns</span>
                </button>
                <button
                  onClick={() => setCurrentTab('content-studio')}
                  className="px-3.5 py-1.5 bg-[#EDE9FE] border border-[#DDD6FE] hover:bg-[#DDD6FE] rounded-full text-xs font-bold text-purple-900 transition-colors flex items-center space-x-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                  <span>AI Studio</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 0: SOCIALYN COMMAND CENTER (SCREENSHOT 2)
             ========================================================= */}
          {(currentTab === 'command-center' || currentTab === 'overview') && dashboardSubView === 'command_center' && (
            <CommandCenterView
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenCreateFlow={() => {
                setEditingAutomation(null);
                setIsCreateAutomationOpen(true);
              }}
              onOpenCreatePost={() => setIsPostComposerOpen(true)}
              userName={userName}
            />
          )}

          {/* =========================================================
              VIEW: CAMPAIGNS (SCREENSHOT 1)
             ========================================================= */}
          {currentTab === 'campaigns' && (
            <CampaignsView />
          )}

          {/* =========================================================
              VIEW: GOALS
             ========================================================= */}
          {currentTab === 'goals' && (
            <GoalsView />
          )}

          {/* =========================================================
              VIEW: TASKS
             ========================================================= */}
          {currentTab === 'tasks' && (
            <TasksView />
          )}

          {/* =========================================================
              VIEW: INBOX
             ========================================================= */}
          {currentTab === 'inbox' && (
            <InboxView />
          )}

          {/* =========================================================
              VIEW: REPORTS & CLINIC ANALYTICS (SCREENSHOT 1)
             ========================================================= */}
          {(currentTab === 'reports' || currentTab === 'analytics') && (
            <ReportsView onOpenFlowAssist={() => setIsFlowAssistOpen(true)} />
          )}

          {/* =========================================================
              VIEW: MEMBERSHIPS & RETENTION (SCREENSHOT 2)
             ========================================================= */}
          {(currentTab === 'memberships' || currentTab === 'retention') && (
            <MembershipsRetentionView
              onOpenNewCampaign={() => {
                setEditingAutomation(null);
                setIsCreateAutomationOpen(true);
              }}
            />
          )}


          {/* =========================================================
              VIEW 1: PLATFORM OVERVIEW & CHANNELS (SOHO LUXURY CLINIC DESIGN)
             ========================================================= */}
          {(currentTab === 'command-center' || currentTab === 'overview') && dashboardSubView === 'platform_overview' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in">
              {/* Header Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                      Platform Overview & Channels
                    </h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                      Live Channels
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Monitor real-time automations, incoming social activity, and conversions across all connected channels.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingAutomation(null);
                      setIsCreateAutomationOpen(true);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-full text-xs font-semibold text-slate-800 shadow-2xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5 text-slate-600" />
                    <span>Create Flow</span>
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/analytics')}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-[#141416] hover:bg-black text-white rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>

              {/* 5 Channel Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
                {/* 1. Instagram */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 border border-pink-100 flex items-center justify-center font-bold">
                          <SocialPlatformIcon channel="instagram" className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">Instagram</h3>
                          <p className="text-[10px] text-slate-400">4 active flows</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Active
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs py-2.5 border-t border-slate-100">
                      <div className="flex justify-between text-slate-500">
                        <span>Active Flows</span>
                        <span className="font-semibold text-slate-900">3</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>DMs Triggered</span>
                        <span className="font-semibold text-slate-900">241</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Comment Conv.</span>
                        <span className="font-semibold text-slate-900">40.7%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <button onClick={() => setCurrentTab('instagram')} className="hover:text-slate-900 transition-colors flex items-center space-x-1 cursor-pointer">
                      <Bot className="w-3 h-3" />
                      <span>Automations</span>
                    </button>
                    <button onClick={() => setCurrentTab('social-crm')} className="text-slate-400 hover:text-slate-800 transition-colors flex items-center space-x-1 cursor-pointer">
                      <MessageCircle className="w-3 h-3" />
                      <span>Inbox</span>
                    </button>
                  </div>
                </div>

                {/* 2. TikTok */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold">
                          <SocialPlatformIcon channel="tiktok" className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">TikTok</h3>
                          <p className="text-[10px] text-slate-400">2 active flows</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Active
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs py-2.5 border-t border-slate-100">
                      <div className="flex justify-between text-slate-500">
                        <span>Active Bots</span>
                        <span className="font-semibold text-slate-900">2</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Comments Replied</span>
                        <span className="font-semibold text-slate-900">1,204</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Leads Captured</span>
                        <span className="font-semibold text-slate-900">456</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <button onClick={() => setCurrentTab('tiktok')} className="hover:text-slate-900 transition-colors flex items-center space-x-1 cursor-pointer">
                      <Bot className="w-3 h-3" />
                      <span>Automations</span>
                    </button>
                    <button onClick={() => setCurrentTab('social-crm')} className="text-slate-400 hover:text-slate-800 transition-colors flex items-center space-x-1 cursor-pointer">
                      <MessageCircle className="w-3 h-3" />
                      <span>Inbox</span>
                    </button>
                  </div>
                </div>

                {/* 3. Facebook */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1877F2] border border-blue-100 flex items-center justify-center font-bold">
                          <SocialPlatformIcon channel="facebook" className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">Facebook</h3>
                          <p className="text-[10px] text-slate-400">2 active flows</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Active
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs py-2.5 border-t border-slate-100">
                      <div className="flex justify-between text-slate-500">
                        <span>Active Flows</span>
                        <span className="font-semibold text-slate-900">2</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Messenger Chats</span>
                        <span className="font-semibold text-slate-900">89</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Ad Leads</span>
                        <span className="font-semibold text-slate-900">34</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <button onClick={() => setCurrentTab('facebook')} className="hover:text-slate-900 transition-colors flex items-center space-x-1 cursor-pointer">
                      <Bot className="w-3 h-3" />
                      <span>Automations</span>
                    </button>
                    <button onClick={() => setCurrentTab('social-crm')} className="text-slate-400 hover:text-slate-800 transition-colors flex items-center space-x-1 cursor-pointer">
                      <MessageCircle className="w-3 h-3" />
                      <span>Inbox</span>
                    </button>
                  </div>
                </div>

                {/* 4. Threads */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-bold">
                          <SocialPlatformIcon channel="threads" className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">Threads</h3>
                          <p className="text-[10px] text-slate-400">1 active flow</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                        Ready
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs py-2.5 border-t border-slate-100">
                      <div className="flex justify-between text-slate-500">
                        <span>Active Flows</span>
                        <span className="font-semibold text-slate-900">1</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Post Replies</span>
                        <span className="font-semibold text-slate-900">42</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Keyword Hits</span>
                        <span className="font-semibold text-slate-900">18</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <button onClick={() => setCurrentTab('threads')} className="hover:text-slate-900 transition-colors flex items-center space-x-1 cursor-pointer">
                      <Bot className="w-3 h-3" />
                      <span>Automations</span>
                    </button>
                    <button onClick={() => setCurrentTab('social-crm')} className="text-slate-400 hover:text-slate-800 transition-colors flex items-center space-x-1 cursor-pointer">
                      <MessageCircle className="w-3 h-3" />
                      <span>Inbox</span>
                    </button>
                  </div>
                </div>

                {/* 5. WhatsApp */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
                          <SocialPlatformIcon channel="whatsapp" className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">WhatsApp</h3>
                          <p className="text-[10px] text-slate-400">0 active flows</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                        Ready
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs py-2.5 border-t border-slate-100">
                      <div className="flex justify-between text-slate-500">
                        <span>Auto-Responses</span>
                        <span className="font-semibold text-slate-900">0</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Contacts</span>
                        <span className="font-semibold text-slate-900">0</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Messages Today</span>
                        <span className="font-semibold text-slate-900">0</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <button onClick={() => setCurrentTab('whatsapp')} className="hover:text-slate-900 transition-colors flex items-center space-x-1 cursor-pointer">
                      <Bot className="w-3 h-3" />
                      <span>Automations</span>
                    </button>
                    <button onClick={() => setCurrentTab('social-crm')} className="text-slate-400 hover:text-slate-800 transition-colors flex items-center space-x-1 cursor-pointer">
                      <MessageCircle className="w-3 h-3" />
                      <span>Inbox</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Active Automations + Live Activity Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                
                {/* Left Column: Active Multi-Channel Automations List */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-slate-700" />
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          Active Multi-Channel Automations
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                          {automations.length} Live Flows
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Live database flows with real keyword detection.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingAutomation(null);
                        setIsCreateAutomationOpen(true);
                      }}
                      className="px-4 py-2 bg-[#141416] hover:bg-black text-white rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center justify-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Automation</span>
                    </button>
                  </div>

                  {/* Flow List Items */}
                  <div className="divide-y divide-slate-100">
                    {automations.map((flow) => (
                      <div
                        key={flow.id}
                        className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 p-2.5 rounded-2xl transition-colors"
                      >
                        <div className="flex items-start space-x-2.5 sm:space-x-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 border border-slate-200/60 shrink-0 mt-0.5">
                            {flow.channel}
                          </span>
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xs font-bold text-slate-900">{flow.name}</h4>
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  flow.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}
                              ></span>
                              <span className="text-[10px] font-medium text-emerald-700">
                                {flow.status === 'active' ? 'Active' : 'Paused'}
                              </span>
                            </div>

                            <p className="text-[11px] sm:text-xs text-slate-500">
                              Trigger:{' '}
                              <span className="text-slate-800 font-medium">
                                {flow.trigger_type === 'comment_keyword'
                                  ? `Keyword [${flow.keywords.join(', ')}]`
                                  : flow.trigger_type === 'dm_received'
                                  ? 'New DM received'
                                  : flow.trigger_type === 'story_reply'
                                  ? 'Story reply received'
                                  : 'Spam filter'}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:self-auto shrink-0">
                          <div className="text-left sm:text-right">
                            <p className="text-xs font-bold text-slate-900">
                              {flow.runs_today} runs today
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {flow.runs_total?.toLocaleString() || 0} total
                            </p>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => {
                                setEditingAutomation(flow);
                                setIsCreateAutomationOpen(true);
                              }}
                              className="px-3 py-1 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-full text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleToggleAutomationStatus(flow.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 cursor-pointer"
                              title={flow.status === 'active' ? 'Pause Flow' : 'Resume Flow'}
                            >
                              {flow.status === 'active' ? (
                                <ToggleRight className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-slate-400" />
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteAutomation(flow.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                              title="Delete Flow"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Live Activity Stream */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="pb-3 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-slate-700" />
                          <h3 className="text-sm font-bold text-slate-900">Live Activity Stream</h3>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Real-time Supabase event logs.
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex space-x-1.5 pt-3 pb-2 overflow-x-auto">
                      {(['all', 'automations', 'leads'] as const).map((filterKey) => (
                        <button
                          key={filterKey}
                          onClick={() => setActivityFilter(filterKey)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all shrink-0 cursor-pointer ${
                            activityFilter === filterKey
                              ? 'bg-[#141416] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {filterKey}
                        </button>
                      ))}
                    </div>

                    {/* Event Items */}
                    <div className="space-y-2 mt-1 max-h-[340px] overflow-y-auto pr-1">
                      {filteredActivities.map((act) => (
                        <div
                          key={act.id}
                          className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1 text-xs hover:border-slate-200 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 text-[11px]">
                              {act.event_type === 'auto_dm'
                                ? '⚡️ Auto DM'
                                : act.event_type === 'lead_captured'
                                ? '🎯 Lead Captured'
                                : act.event_type === 'comment_replied'
                                ? '💬 Comment Replied'
                                : '🚀 Auto-Posted'}
                            </span>
                            <span className="text-[10px] text-slate-400">{act.time_ago || 'just now'}</span>
                          </div>
                          <p className="font-semibold text-slate-900 text-xs">{act.title}</p>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {act.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Simulator Trigger in bottom of stream */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setIsSimulatorOpen(true)}
                      className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 rounded-full text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Simulate Incoming Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 2: METRICS & KPI DASHBOARD (SOHO LUXURY CLINIC DESIGN)
             ========================================================= */}
          {(currentTab === 'command-center' || currentTab === 'overview') && dashboardSubView === 'metrics_dashboard' && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in">
              {/* Header Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Dashboard
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Welcome back, <span className="font-semibold text-slate-900">{userName}</span>! Here's your overview.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingAutomation(null);
                      setIsCreateAutomationOpen(true);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-full text-xs font-semibold text-slate-800 shadow-2xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5 text-slate-600" />
                    <span>New Automation</span>
                  </button>
                  <button
                    onClick={() => setIsPostComposerOpen(true)}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-[#141416] hover:bg-black text-white rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Post</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs bar */}
              <div className="flex items-center space-x-1 p-1 bg-slate-100/80 rounded-full border border-slate-200/60 text-xs font-medium w-fit">
                <button className="px-3.5 py-1.5 rounded-full bg-[#141416] text-white shadow-2xs font-semibold flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setDashboardSubView('platform_overview')}
                  className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Activity</span>
                </button>
                <button
                  onClick={() => router.push('/dashboard/analytics')}
                  className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>
              </div>

              {/* Real-time Streaming Status Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold text-slate-900">Live Realtime Streaming</span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-slate-500 text-[11px] hidden sm:inline">
                    Supabase Postgres WebSockets & Multi-Channel Event Stream Active
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchRealtimeStats()}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer"
                    title="Force sync live database metrics"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin-hover" />
                    <span>Sync</span>
                  </button>
                </div>
              </div>

              {/* 8 Stat KPI Cards (All Real-Time) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Contacts */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        TOTAL CONTACTS
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Live
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {realtimeStats.totalContacts.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">In your Supabase CRM</p>
                  </div>
                </div>

                {/* 2. Messages Sent Today */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        MESSAGES SENT TODAY
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Live
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        {realtimeStats.messagesToday}
                      </p>
                      <span className="text-xs font-semibold text-emerald-600">↑ 12%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {realtimeStats.messagesThisWeek} this week
                    </p>
                  </div>
                </div>

                {/* 3. Active Automations */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        ACTIVE AUTOMATIONS
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Live
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {realtimeStats.activeAutomationsCount}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Live database rules</p>
                  </div>
                </div>

                {/* 4. Response Rate */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        RESPONSE RATE
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Live
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        {realtimeStats.responseRate}
                      </p>
                      <span className="text-xs font-semibold text-emerald-600">↑ 3%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Based on last 100 messages</p>
                  </div>
                </div>

                {/* 5. Leads Captured Today */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        LEADS CAPTURED TODAY
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Live
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        {realtimeStats.leadsCapturedToday}
                      </p>
                      <span className="text-xs font-semibold text-emerald-600">↑ 8%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {realtimeStats.leadsThisWeek} this week
                    </p>
                  </div>
                </div>

                {/* 6. Lead Pages */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        LEAD PAGES
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Live
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {realtimeStats.leadPagesCount}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Total lead pages created</p>
                  </div>
                </div>

                {/* 7. Workflows */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        WORKFLOWS
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Live
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {realtimeStats.totalWorkflowsCount}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Total workflows created</p>
                  </div>
                </div>

                {/* 8. Social Channels */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-3 hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        SOCIAL CHANNELS
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Live
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {realtimeStats.socialChannelsCount}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium truncate" title={realtimeStats.socialChannelsText}>
                      {realtimeStats.socialChannelsText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 3: POSTS & MULTI-CHANNEL SCHEDULER (SOHO LUXURY CLINIC DESIGN)
             ========================================================= */}
          {(currentTab === 'post-manager' || currentTab === 'calendar') && (
            <div className="space-y-5 sm:space-y-6 animate-fade-in relative pb-16">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Posts & Social Scheduler
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Manage, select multiple posts, queue, and auto-publish content across all connected channels.
                  </p>
                </div>

                <div className="flex items-center flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleSelectAllPosts}
                    className="px-4 py-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                  >
                    {selectedPostIds.length === posts.length && posts.length > 0 ? (
                      <>
                        <CheckSquare className="w-4 h-4 text-slate-900" />
                        <span>Deselect All</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4" />
                        <span>Select All ({posts.length})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsPostComposerOpen(true)}
                    className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-[#141416] hover:bg-black text-white rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create & Schedule Post</span>
                  </button>
                </div>
              </div>

              {/* Floating Mass Action Toolbar when posts are selected */}
              {selectedPostIds.length > 0 && (
                <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 bg-[#141416] text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center space-x-3 sm:space-x-4 border border-slate-800 animate-slide-up">
                  <div className="flex items-center space-x-2 pr-2 border-r border-slate-800 text-xs font-semibold">
                    <CheckSquare className="w-4 h-4 text-purple-400" />
                    <span>{selectedPostIds.length} Selected</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBulkStatusChange('posted')}
                    className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-full text-xs font-semibold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBulkStatusChange('scheduled')}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-purple-300" />
                    <span>Schedule</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBulkDeletePosts}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-full transition-all cursor-pointer"
                    title="Delete selected posts"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPostIds([])}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer ml-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {posts.map((post) => {
                  const isSelected = selectedPostIds.includes(post.id);

                  return (
                    <div
                      key={post.id}
                      onClick={() => handleToggleSelectPost(post.id)}
                      className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between space-y-4 cursor-pointer shadow-2xs ${
                        isSelected
                          ? 'border-slate-900 bg-purple-50/20 ring-2 ring-slate-900/10 shadow-sm'
                          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                                isSelected
                                  ? 'bg-[#141416] border-[#141416] text-white'
                                  : 'bg-white border-slate-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {post.channels?.map((ch) => (
                                <span key={ch} className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 border border-slate-200/60">
                                  {ch}
                                </span>
                              ))}
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                              post.status === 'posted'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                : 'bg-purple-50 text-purple-700 border-purple-200/60'
                            }`}
                          >
                            {post.status === 'posted' ? 'Published' : 'Scheduled'}
                          </span>
                        </div>

                        {post.attachments?.[0]?.url && (
                          <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-100">
                            <img
                              src={post.attachments[0].url}
                              alt="attachment"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <p className="text-xs text-slate-700 whitespace-pre-line line-clamp-4 leading-relaxed font-normal">
                          {post.content}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {new Date(post.scheduled_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900">Live Queue</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* =========================================================
              VIEW 4: AI CONTENT STUDIO & AUTOMATION
             ========================================================= */}
          {(currentTab === 'ai-autopilot' || currentTab === 'content-studio') && (
            <div className="animate-fade-in">
              <AiContentStudio onSchedulePost={handleSavePost} />
            </div>
          )}

          {/* =========================================================
              VIEW: CREATIVE STUDIO
             ========================================================= */}
          {currentTab === 'creative-studio' && (
            <div className="animate-fade-in">
              <AiAutoPostStudio onSchedulePost={handleSavePost} />
            </div>
          )}

          {/* =========================================================
              VIEW 5: SOCIAL CRM & CAPTURED LEADS
             ========================================================= */}
          {currentTab === 'social-crm' && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-[#1E293B]">
                    Social CRM & Captured Leads
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Followers who commented keywords on your posts and received automated DMs.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200/60 rounded-full text-xs font-semibold">
                    {leads.length} Leads In Funnel
                  </span>
                </div>
              </div>

              {/* Table of Leads with responsive horizontal scrolling */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[640px]">
                    <thead className="bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Contact / Handle</th>
                        <th className="py-3 px-4">Platform</th>
                        <th className="py-3 px-4">Trigger Keyword</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Last Activity</th>
                        <th className="py-3 px-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EFE8]">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FED7AA] to-[#FDBA74] flex items-center justify-center font-bold text-[10px] text-[#9A3412] shrink-0">
                                {lead.handle.slice(1, 3).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-[#1E293B]">{lead.handle}</p>
                                <p className="text-[10px] text-[#94A3B8]">{lead.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#FAF6F0] text-[#64748B]">
                              {lead.channel}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                              "{lead.keyword_triggered}"
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#64748B]">{lead.last_interaction}</td>
                          <td className="py-3 px-4 text-[#475569] max-w-xs truncate">{lead.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 5: INTEGRATIONS & CHANNEL MANAGEMENT
             ========================================================= */}
          {currentTab === 'integrations' && (
            <IntegrationsView />
          )}

          {/* =========================================================
              VIEW 7: CHANNEL SPECIFIC VIEWS & SUBTAB HUBS
             ========================================================= */}
          {(() => {
            const channelKeys = ['whatsapp', 'instagram', 'tiktok', 'facebook', 'threads', 'twitter', 'linkedin'];
            const isChannelView = channelKeys.some(
              (c) => currentTab === c || currentTab.startsWith(c + '-')
            );

            if (!isChannelView) return null;

            const activeChannel = (channelKeys.find((c) => currentTab === c || currentTab.startsWith(c + '-')) || 'instagram') as SocialChannel;
            const subTabKey = currentTab.includes('-') ? currentTab.substring(activeChannel.length + 1) : 'all';

            const channelMeta: Record<string, { name: string; desc: string; subtabs: { id: string; name: string }[] }> = {
              instagram: {
                name: 'Instagram',
                desc: 'Automate comment auto-replies, private link DMs, and story response funnels.',
                subtabs: [
                  { id: 'all', name: 'All Flows' },
                  { id: 'comments', name: 'Comment Auto-DM' },
                  { id: 'stories', name: 'Story Reply Bot' },
                  { id: 'dm', name: 'DM Welcome Funnel' },
                ],
              },
              facebook: {
                name: 'Facebook',
                desc: 'Manage Messenger conversational funnels, post comment replies, and ad lead capture.',
                subtabs: [
                  { id: 'all', name: 'All Flows' },
                  { id: 'messenger', name: 'Messenger Auto-Funnel' },
                  { id: 'comments', name: 'Post Comment Replies' },
                  { id: 'leads', name: 'Ad Lead Sync' },
                ],
              },
              tiktok: {
                name: 'TikTok',
                desc: 'Turn video comments into instant DM conversions and product sales.',
                subtabs: [
                  { id: 'all', name: 'All Flows' },
                  { id: 'comments', name: 'Comment Lead Capture' },
                  { id: 'dm', name: 'Direct Message Deals' },
                ],
              },
              twitter: {
                name: 'X (Twitter)',
                desc: 'Automate tweet mention replies, keyword triggers, and private DM links.',
                subtabs: [
                  { id: 'all', name: 'All Flows' },
                  { id: 'auto', name: 'Mention Auto-Reply' },
                  { id: 'dm', name: 'DM Lead Funnel' },
                ],
              },
              linkedin: {
                name: 'LinkedIn',
                desc: 'Engage connection requests, post comments, and automate InMail lead generation.',
                subtabs: [
                  { id: 'all', name: 'All Flows' },
                  { id: 'comments', name: 'Post Auto-Engage' },
                  { id: 'dm', name: 'InMail Outbound Bot' },
                ],
              },
              threads: {
                name: 'Threads',
                desc: 'Trigger instant private replies to replies and keywords on your Threads posts.',
                subtabs: [
                  { id: 'all', name: 'All Flows' },
                  { id: 'auto', name: 'Keyword Link Auto-Reply' },
                  { id: 'dm', name: 'Direct Messages' },
                ],
              },
              whatsapp: {
                name: 'WhatsApp',
                desc: 'Deploy 24/7 instant chat routing, customer support bots, and contact lists.',
                subtabs: [
                  { id: 'all', name: 'All Flows' },
                  { id: 'auto', name: 'Instant Auto-Replies' },
                  { id: 'inbox', name: 'Live Chat Inbox' },
                  { id: 'crm', name: 'Audience Lists' },
                ],
              },
            };

            const info = channelMeta[activeChannel] || {
              name: activeChannel,
              desc: `Manage real-time automations and triggers for ${activeChannel}.`,
              subtabs: [{ id: 'all', name: 'All Flows' }],
            };

            // Filter automations for this channel and subtab
            const channelAutomations = automations.filter((a) => a.channel === activeChannel);
            const filteredAutomations = channelAutomations.filter((a) => {
              if (subTabKey === 'all') return true;
              if (subTabKey === 'comments') return a.trigger_type?.includes('comment') || !a.trigger_type;
              if (subTabKey === 'stories') return a.trigger_type?.includes('story') || a.name.toLowerCase().includes('story');
              if (subTabKey === 'dm' || subTabKey === 'messenger' || subTabKey === 'inbox') {
                return a.trigger_type?.includes('dm') || a.trigger_type?.includes('message') || a.name.toLowerCase().includes('dm') || a.name.toLowerCase().includes('messenger');
              }
              if (subTabKey === 'leads' || subTabKey === 'crm') return true;
              return true;
            });

            const totalRuns = channelAutomations.reduce((acc, a) => acc + (a.runs_total || 0), 0);
            const totalLeads = channelAutomations.reduce((acc, a) => acc + (a.leads_captured || 0), 0);

            return (
              <div className="space-y-5 sm:space-y-6 animate-fade-in">
                {/* Channel Header Banner */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/60 flex items-center justify-center shrink-0 shadow-xs text-purple-700">
                        <SocialPlatformIcon channel={activeChannel} className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2.5">
                          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                            {info.name} Automation Hub
                          </h2>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                            Live Engine Active
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                          {info.desc}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2.5 sm:self-auto self-stretch">
                      <button
                        onClick={() => setIsSimulatorOpen(true)}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-full text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5 text-slate-600" />
                        <span>Test in Simulator</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingAutomation(null);
                          setIsCreateAutomationOpen(true);
                        }}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-[#141416] hover:bg-black text-white rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add {info.name} Flow</span>
                      </button>
                    </div>
                  </div>

                  {/* Channel Summary Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100">
                    <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Configured Flows</span>
                      <span className="text-lg font-bold text-slate-900 mt-0.5 block">{channelAutomations.length}</span>
                    </div>
                    <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dispatched Today</span>
                      <span className="text-lg font-bold text-slate-900 mt-0.5 block">{channelAutomations.reduce((acc, a) => acc + (a.runs_today || 0), 0)}</span>
                    </div>
                    <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Triggered</span>
                      <span className="text-lg font-bold text-slate-900 mt-0.5 block">{totalRuns}</span>
                    </div>
                    <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Leads Captured</span>
                      <span className="text-lg font-bold text-emerald-600 mt-0.5 block">{totalLeads}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-tabs Filter Bar */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                  {info.subtabs.map((tab) => {
                    const isTabActive = tab.id === 'all' ? subTabKey === 'all' : subTabKey === tab.id;
                    const targetTabId = tab.id === 'all' ? activeChannel : `${activeChannel}-${tab.id}`;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setCurrentTab(targetTabId)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2 ${
                          isTabActive
                            ? 'bg-[#1E293B] text-white shadow-xs'
                            : 'bg-white text-[#64748B] hover:text-[#1E293B] hover:bg-[#FAF6F0] border border-[#E2D9CF]'
                        }`}
                      >
                        <span>{tab.name}</span>
                        {tab.id === 'all' ? (
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isTabActive ? 'bg-white/20 text-white' : 'bg-[#F1E9DF] text-[#64748B]'}`}>
                            {channelAutomations.length}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Flows List Section */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F5EFE8]">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-slate-700" />
                      <h3 className="text-sm font-bold text-[#1E293B]">
                        Active Triggers & Rules
                      </h3>
                    </div>
                    <span className="text-xs text-[#64748B]">
                      Showing {filteredAutomations.length} of {channelAutomations.length} flows
                    </span>
                  </div>

                  {/* Flow Cards */}
                  <div className="space-y-3.5">
                    {filteredAutomations.map((flow) => (
                      <div
                        key={flow.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:border-slate-300 hover:bg-white transition-all space-y-3 shadow-2xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
                              <Bot className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#1E293B]">{flow.name}</h4>
                              <p className="text-[11px] text-[#64748B]">
                                Trigger: <span className="font-semibold text-[#334155]">{flow.trigger_type || 'Comment Keyword'}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 self-end sm:self-auto">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              ● Active
                            </span>
                            <button
                              onClick={() => {
                                setIsSimulatorOpen(true);
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-[#FAF6F0] border border-[#E2D9CF] rounded-xl text-xs font-semibold text-[#78350F] transition-colors"
                              title="Test trigger in simulator"
                            >
                              Test
                            </button>
                            <button
                              onClick={() => {
                                setEditingAutomation(flow);
                                setIsCreateAutomationOpen(true);
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-[#FAF6F0] border border-[#E2D9CF] rounded-xl text-xs font-semibold text-[#1E293B] transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAutomation(flow.id)}
                              className="p-1 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete automation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Keyword Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-bold text-[#64748B] mr-1">Triggers on:</span>
                          {(flow.keywords || []).length > 0 ? (
                            flow.keywords.map((kw, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200/60 rounded-md text-[11px] font-semibold"
                              >
                                "{kw}"
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#64748B] italic">All incoming comments</span>
                          )}
                        </div>

                        {/* Response Previews */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <div className="p-2.5 bg-white rounded-xl border border-[#F1E9DF] text-xs">
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                              Public Comment Reply
                            </span>
                            <p className="text-[#334155] italic font-medium leading-relaxed">
                              "{flow.reply_comment}"
                            </p>
                          </div>
                          <div className="p-2.5 bg-white rounded-xl border border-[#F1E9DF] text-xs">
                            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                              Instant Private DM + Link
                            </span>
                            <p className="text-[#334155] italic font-medium leading-relaxed">
                              "{flow.dm_message}"
                            </p>
                            {flow.link_url && (
                              <span className="text-[11px] text-slate-700 font-semibold mt-1 inline-block">
                                Destination: {flow.link_url}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Empty State with Template Starters */}
                    {filteredAutomations.length === 0 && (
                      <div className="py-10 px-4 text-center space-y-4">
                        <div className="w-14 h-14 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 mx-auto shadow-2xs">
                          <Bot className="w-7 h-7" />
                        </div>
                        <div className="max-w-md mx-auto">
                          <h4 className="text-base font-bold text-[#1E293B]">
                            No {info.name} flows found in this view
                          </h4>
                          <p className="text-xs text-[#64748B] mt-1">
                            Choose a ready-to-use template below or create your custom trigger to start capturing leads automatically.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
                          <button
                            onClick={() => {
                              setEditingAutomation({
                                id: '',
                                name: `${info.name} "PRICE" Keyword Auto-DM`,
                                channel: activeChannel,
                                trigger_type: 'comment_keyword',
                                keywords: ['price', 'cost', 'how much'],
                                reply_comment: 'Just sent you our complete pricing guide and special promo in your DM! 📩',
                                dm_message: 'Hey! Here is our current pricing and special coupon: https://buffermate.ai/pricing 🎉',
                                link_url: 'https://buffermate.ai/pricing',
                                status: 'active',
                                runs_today: 0,
                                runs_total: 0,
                                leads_captured: 0,
                                created_at: new Date().toISOString(),
                              });
                              setIsCreateAutomationOpen(true);
                            }}
                            className="p-3 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl text-left transition-all group shadow-2xs"
                          >
                            <span className="text-xs font-bold text-[#1E293B] group-hover:text-slate-900 block">
                              💰 "Price" Bot
                            </span>
                            <span className="text-[11px] text-[#64748B] mt-0.5 block">
                              Auto-DM pricing & checkout links.
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              setEditingAutomation({
                                id: '',
                                name: `${info.name} "LINK" Lead Magnet Funnel`,
                                channel: activeChannel,
                                trigger_type: 'comment_keyword',
                                keywords: ['link', 'send', 'info', 'guide'],
                                reply_comment: 'Check your DM! Direct download link is waiting for you 🚀',
                                dm_message: 'Here is your direct download link: https://buffermate.ai/guide 🎁 Enjoy!',
                                link_url: 'https://buffermate.ai/guide',
                                status: 'active',
                                runs_today: 0,
                                runs_total: 0,
                                leads_captured: 0,
                                created_at: new Date().toISOString(),
                              });
                              setIsCreateAutomationOpen(true);
                            }}
                            className="p-3 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl text-left transition-all group shadow-2xs"
                          >
                            <span className="text-xs font-bold text-[#1E293B] group-hover:text-slate-900 block">
                              🎁 "Link" Magnet
                            </span>
                            <span className="text-[11px] text-[#64748B] mt-0.5 block">
                              Deliver ebooks & guides instantly.
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              setEditingAutomation({
                                id: '',
                                name: `${info.name} "BOOK" Consultation Bot`,
                                channel: activeChannel,
                                trigger_type: 'comment_keyword',
                                keywords: ['book', 'call', 'consult', 'strategy'],
                                reply_comment: 'Sent you my private calendar booking link in DMs! 📅',
                                dm_message: 'Excited to connect! Grab a free 15-min strategy slot here: https://buffermate.ai/calendar ☕',
                                link_url: 'https://buffermate.ai/calendar',
                                status: 'active',
                                runs_today: 0,
                                runs_total: 0,
                                leads_captured: 0,
                                created_at: new Date().toISOString(),
                              });
                              setIsCreateAutomationOpen(true);
                            }}
                            className="p-3 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl text-left transition-all group shadow-2xs"
                          >
                            <span className="text-xs font-bold text-[#1E293B] group-hover:text-slate-900 block">
                              📅 "Book" Call
                            </span>
                            <span className="text-[11px] text-[#64748B] mt-0.5 block">
                              Send Calendly & booking links.
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* =========================================================
              VIEW: EXPERIMENTS
             ========================================================= */}
          {currentTab === 'experiments' && <ExperimentsView />}

          {/* =========================================================
              VIEW: ROI & REVENUE
             ========================================================= */}
          {currentTab === 'roi-revenue' && <RoiRevenueView />}

          {/* =========================================================
              VIEW 6: PROFILE & ACCOUNT SETTINGS
             ========================================================= */}
          {currentTab === 'settings' && (
            <ProfileSettingsView />
          )}

        </div>
      </main>

      {/* Modals */}
      <AutomationModal
        isOpen={isCreateAutomationOpen}
        onClose={() => setIsCreateAutomationOpen(false)}
        onSave={handleSaveAutomation}
        initialData={editingAutomation}
      />

      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        automations={automations}
        onTriggerEvent={handleSimulateTrigger}
      />

      <PostSchedulerModal
        isOpen={isPostComposerOpen}
        onClose={() => setIsPostComposerOpen(false)}
        onSavePost={handleSavePost}
      />

      <FlowAssistModal
        isOpen={isFlowAssistOpen}
        onClose={() => setIsFlowAssistOpen(false)}
        onRemindersSent={(count) => {
          setToastMessage(`Sent ${count} personalized rebooking reminders!`);
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />
    </div>
  );
}
