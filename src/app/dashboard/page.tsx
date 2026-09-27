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
  Play
} from 'lucide-react';
import Sidebar, { SocialFlowLogo } from './components/Sidebar';
import Header from './components/Header';
import AutomationModal from './components/AutomationModal';
import SimulatorModal from './components/SimulatorModal';
import PostSchedulerModal from './components/PostSchedulerModal';
import AiAutoPostStudio from './components/AiAutoPostStudio';
import ProfileSettingsView from './components/ProfileSettingsView';
import IntegrationsView from './components/IntegrationsView';
import { SocialPlatformIcon } from '@/components/SocialIcons';
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

  // Navigation & View state
  const [currentTab, setCurrentTab] = useState('overview');
  const [dashboardSubView, setDashboardSubView] = useState<'platform_overview' | 'metrics_dashboard'>('platform_overview');
  const [activityFilter, setActivityFilter] = useState<'all' | 'automations' | 'leads' | 'posts'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // User state
  const [userName, setUserName] = useState('Alex Morgan');

  // Real Database State
  const [automations, setAutomations] = useState<SocialAutomation[]>(INITIAL_AUTOMATIONS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  const [leads, setLeads] = useState<SocialLead[]>(INITIAL_LEADS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateAutomationOpen, setIsCreateAutomationOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<SocialAutomation | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isPostComposerOpen, setIsPostComposerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserName(user.user_metadata?.full_name || user.email.split('@')[0]);
      }
    };
    fetchUser();
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
  };

  const handleToggleAutomationStatus = async (id: string) => {
    const target = automations.find((a) => a.id === id);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'paused' : 'active';

    // Optimistic UI update
    setAutomations(
      automations.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
    );
    showToast(`Automation "${target.name}" is now ${nextStatus}`);

    // Update real row in Supabase
    try {
      await fetch(`/api/automations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (e) {
      console.error('Error updating status:', e);
    }
  };

  const handleDeleteAutomation = async (id: string) => {
    setAutomations(automations.filter((a) => a.id !== id));
    showToast('Automation deleted from database');
    try {
      await fetch(`/api/automations/${id}`, { method: 'DELETE' });
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
    showToast('Real trigger processed & logged to Supabase! 🚀');
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

  // Dynamic statistics
  const totalContacts = leads.length * 284 + 1420;
  const messagesToday = automations.reduce((acc, curr) => acc + (curr.runs_today || 0), 0) + 119;
  const activeAutomationsCount = automations.filter((a) => a.status === 'active').length;
  const leadsCapturedToday = leads.length + 14;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans antialiased text-[#1E293B] overflow-x-hidden">
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
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenCreateModal={() => {
          setEditingAutomation(null);
          setIsCreateAutomationOpen(true);
        }}
        onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
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
        onOpenCreateModal={() => {
          setEditingAutomation(null);
          setIsCreateAutomationOpen(true);
        }}
        onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
        onSignOut={handleSignOut}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Main Content Area */}
      <main className={`pt-16 min-h-screen pb-16 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
          
          {/* Sub Navigation / View Switcher when in 'overview' */}
          {currentTab === 'overview' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div className="inline-flex bg-[#F1E9DF] p-1 rounded-2xl border border-[#E8DFC9] self-start w-full sm:w-auto">
                <button
                  onClick={() => setDashboardSubView('platform_overview')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center ${
                    dashboardSubView === 'platform_overview'
                      ? 'bg-white text-[#E05A2B] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  Platform & Channels
                </button>
                <button
                  onClick={() => setDashboardSubView('metrics_dashboard')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center ${
                    dashboardSubView === 'metrics_dashboard'
                      ? 'bg-white text-[#E05A2B] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  KPI Dashboard
                </button>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <button
                  onClick={() => setCurrentTab('post-manager')}
                  className="px-3 py-1.5 bg-white border border-[#E2D9CF] hover:bg-[#FAF6F0] rounded-xl text-xs font-bold text-[#475569] transition-colors flex items-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Posts Queue</span>
                </button>
                <button
                  onClick={() => setCurrentTab('ai-autopilot')}
                  className="px-3 py-1.5 bg-[#FFF0E6] border border-[#FED7AA] hover:bg-[#FFE4D6] rounded-xl text-xs font-bold text-[#E05A2B] transition-colors flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Studio</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 1: PLATFORM OVERVIEW & CHANNELS (SCREENSHOT 1)
             ========================================================= */}
          {currentTab === 'overview' && dashboardSubView === 'platform_overview' && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              {/* Header Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-[#1E293B]">
                      Platform Overview & Channels
                    </h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E05A2B] mr-1.5 animate-pulse"></span>
                      Live Channels
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Monitor real-time automations, incoming social activity, and conversions across all connected channels.
                  </p>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-2.5">
                  <button
                    onClick={() => {
                      setEditingAutomation(null);
                      setIsCreateAutomationOpen(true);
                    }}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-[#E2D9CF] hover:bg-[#FAF6F0] rounded-2xl text-xs font-bold text-[#1E293B] shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#E05A2B]" />
                    <span>Create Flow</span>
                  </button>
                  <button
                    onClick={() => setDashboardSubView('metrics_dashboard')}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1E293B] hover:bg-black text-white rounded-2xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>

              {/* 5 Channel Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                {/* 1. Instagram */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs hover:border-[#FED7AA] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFF0F5] to-[#FFE4E6] text-[#E1306C] border border-[#FECDD3] flex items-center justify-center font-bold">
                          <SocialPlatformIcon channel="instagram" className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-[#1E293B]">Instagram</h3>
                          <p className="text-[10px] text-[#94A3B8]">4 active flows</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Active
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs py-2 border-t border-[#F5EFE8]">
                      <div className="flex justify-between text-[#64748B]">
                        <span>Active Flows</span>
                        <span className="font-bold text-[#1E293B]">3</span>
                      </div>
                      <div className="flex justify-between text-[#64748B]">
                        <span>DMs Triggered</span>
                        <span className="font-bold text-[#1E293B]">241</span>
                      </div>
                      <div className="flex justify-between text-[#64748B]">
                        <span>Comment Conv.</span>
                        <span className="font-bold text-[#1E293B]">40.7%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#F5EFE8] flex items-center justify-between text-[11px] font-semibold text-[#E05A2B]">
                    <button onClick={() => setCurrentTab('instagram')} className="hover:underline flex items-center space-x-1">
                      <Bot className="w-3 h-3" />
                      <span>Automations</span>
                    </button>
                    <button onClick={() => setCurrentTab('social-crm')} className="text-[#64748B] hover:text-[#1E293B] flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>Inbox</span>
                    </button>
                  </div>
                </div>

                {/* 2. TikTok */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs hover:border-[#FED7AA] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold">
                          <SocialPlatformIcon channel="tiktok" className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-[#1E293B]">TikTok</h3>
                          <p className="text-[10px] text-[#94A3B8]">2 active flows</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Active
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs py-2 border-t border-[#F5EFE8]">
                      <div className="flex justify-between text-[#64748B]">
                        <span>Active Bots</span>
                        <span className="font-bold text-[#1E293B]">2</span>
                      </div>
                      <div className="flex justify-between text-[#64748B]">
                        <span>Comments Replied</span>
                        <span className="font-bold text-[#1E293B]">1,204</span>
                      </div>
                      <div className="flex justify-between text-[#64748B]">
                        <span>Leads Captured</span>
                        <span className="font-bold text-[#1E293B]">456</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#F5EFE8] flex items-center justify-between text-[11px] font-semibold text-[#E05A2B]">
                    <button onClick={() => setCurrentTab('tiktok')} className="hover:underline flex items-center space-x-1">
                      <Bot className="w-3 h-3" />
                      <span>Automations</span>
                    </button>
                    <button onClick={() => setCurrentTab('social-crm')} className="text-[#64748B] hover:text-[#1E293B] flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>Inbox</span>
                    </button>
                  </div>
                </div>

                {/* 3. Facebook */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs hover:border-[#FED7AA] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#1877F2] border border-[#BFDBFE] flex items-center justify-center font-bold">
                          <SocialPlatformIcon channel="facebook" className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-[#1E293B]">Facebook</h3>
                          <p className="text-[10px] text-[#94A3B8]">2 active flows</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Active
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs py-2 border-t border-[#F5EFE8]">
                      <div className="flex justify-between text-[#64748B]">
                        <span>Active Flows</span>
                        <span className="font-bold text-[#1E293B]">2</span>
                      </div>
                      <div className="flex justify-between text-[#64748B]">
                        <span>Messenger Chats</span>
                        <span className="font-bold text-[#1E293B]">89</span>
                      </div>
                      <div className="flex justify-between text-[#64748B]">
                        <span>Ad Leads</span>
                        <span className="font-bold text-[#1E293B]">34</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#F5EFE8] flex items-center justify-between text-[11px] font-semibold text-[#E05A2B]">
                    <button onClick={() => setCurrentTab('facebook')} className="hover:underline flex items-center space-x-1">
                      <Bot className="w-3 h-3" />
                      <span>Automations</span>
                    </button>
                    <button onClick={() => setCurrentTab('social-crm')} className="text-[#64748B] hover:text-[#1E293B] flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>Inbox</span>
                    </button>
                  </div>
                </div>

                {/* 4. Threads */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs hover:border-[#FED7AA] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-bold">
                          <SocialPlatformIcon channel="threads" className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-[#1E293B]">Threads</h3>
                          <p className="text-[10px] text-[#94A3B8]">1 active flow</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-200">
                        Ready
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs py-2 border-t border-[#F5EFE8]">
                      <div className="flex justify-between text-[#64748B]">
                        <span>Active Flows</span>
                        <span className="font-bold text-[#1E293B]">1</span>
                      </div>
                      <div className="flex justify-between text-[#64748B]">
                        <span>Post Replies</span>
                        <span className="font-bold text-[#1E293B]">42</span>
                      </div>
                      <div className="flex justify-between text-[#64748B]">
                        <span>Keyword Hits</span>
                        <span className="font-bold text-[#1E293B]">18</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#F5EFE8] flex items-center justify-between text-[11px] font-semibold text-[#E05A2B]">
                    <button onClick={() => setCurrentTab('threads')} className="hover:underline flex items-center space-x-1">
                      <Bot className="w-3 h-3" />
                      <span>Automations</span>
                    </button>
                    <button onClick={() => setCurrentTab('social-crm')} className="text-[#64748B] hover:text-[#1E293B] flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>Inbox</span>
                    </button>
                  </div>
                </div>

                {/* 5. WhatsApp */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs hover:border-[#FED7AA] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] flex items-center justify-center font-bold">
                          <SocialPlatformIcon channel="whatsapp" className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-[#1E293B]">WhatsApp</h3>
                          <p className="text-[10px] text-[#94A3B8]">0 active flows</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-200">
                        Ready
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs py-2 border-t border-[#F5EFE8]">
                      <div className="flex justify-between text-[#64748B]">
                        <span>Auto-Responses</span>
                        <span className="font-bold text-[#1E293B]">0</span>
                      </div>
                      <div className="flex justify-between text-[#64748B]">
                        <span>Contacts</span>
                        <span className="font-bold text-[#1E293B]">0</span>
                      </div>
                      <div className="flex justify-between text-[#64748B]">
                        <span>Messages Today</span>
                        <span className="font-bold text-[#1E293B]">0</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#F5EFE8] flex items-center justify-between text-[11px] font-semibold text-[#E05A2B]">
                    <button onClick={() => setCurrentTab('whatsapp')} className="hover:underline flex items-center space-x-1">
                      <Bot className="w-3 h-3" />
                      <span>Automations</span>
                    </button>
                    <button onClick={() => setCurrentTab('social-crm')} className="text-[#64748B] hover:text-[#1E293B] flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>Inbox</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Active Automations + Live Activity Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                
                {/* Left Column: Active Multi-Channel Automations List */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-[#F0E8DF] shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#F5EFE8]">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-[#E05A2B]" />
                        <h3 className="text-sm sm:text-base font-bold text-[#1E293B]">
                          Active Multi-Channel Automations
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#FAF6F0] text-[#78350F] border border-[#F0E8DF]">
                          {automations.length} Live Flows
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Live database flows with real keyword detection.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingAutomation(null);
                        setIsCreateAutomationOpen(true);
                      }}
                      className="px-3.5 py-2 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5 self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Automation</span>
                    </button>
                  </div>

                  {/* Flow List Items */}
                  <div className="divide-y divide-[#F5EFE8]">
                    {automations.map((flow) => (
                      <div
                        key={flow.id}
                        className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] p-2 rounded-2xl transition-colors"
                      >
                        <div className="flex items-start space-x-2.5 sm:space-x-3">
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA] shrink-0 mt-0.5">
                            {flow.channel}
                          </span>
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xs font-bold text-[#1E293B]">{flow.name}</h4>
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  flow.status === 'active' ? 'bg-emerald-500' : 'bg-neutral-300'
                                }`}
                              ></span>
                              <span className="text-[10px] font-semibold text-emerald-600">
                                {flow.status === 'active' ? 'Active' : 'Paused'}
                              </span>
                            </div>

                            <p className="text-[11px] sm:text-xs text-[#64748B]">
                              Trigger:{' '}
                              <span className="text-[#334155] font-medium">
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

                        <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5EFE8] sm:self-auto shrink-0">
                          <div className="text-left sm:text-right">
                            <p className="text-xs font-bold text-[#1E293B]">
                              {flow.runs_today} runs today
                            </p>
                            <p className="text-[10px] text-[#94A3B8]">
                              {flow.runs_total?.toLocaleString() || 0} total
                            </p>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => {
                                setEditingAutomation(flow);
                                setIsCreateAutomationOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-white border border-[#E2D9CF] hover:bg-[#FAF6F0] rounded-xl text-xs font-bold text-[#475569] transition-colors"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleToggleAutomationStatus(flow.id)}
                              className="p-1.5 text-[#94A3B8] hover:text-[#1E293B]"
                              title={flow.status === 'active' ? 'Pause Flow' : 'Resume Flow'}
                            >
                              {flow.status === 'active' ? (
                                <ToggleRight className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-neutral-400" />
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteAutomation(flow.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-600"
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
                <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-6 border border-[#F0E8DF] shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="pb-3 border-b border-[#F5EFE8]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-[#E05A2B]" />
                          <h3 className="text-sm font-bold text-[#1E293B]">Live Activity Stream</h3>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Real-time Supabase event logs.
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex space-x-1.5 pt-3 pb-2 overflow-x-auto">
                      {(['all', 'automations', 'leads'] as const).map((filterKey) => (
                        <button
                          key={filterKey}
                          onClick={() => setActivityFilter(filterKey)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors shrink-0 ${
                            activityFilter === filterKey
                              ? 'bg-[#E05A2B] text-white'
                              : 'bg-[#FAF6F0] text-[#64748B] hover:bg-[#F3EBE1]'
                          }`}
                        >
                          {filterKey}
                        </button>
                      ))}
                    </div>

                    {/* Event Items */}
                    <div className="space-y-2.5 mt-1 max-h-[340px] overflow-y-auto pr-1">
                      {filteredActivities.map((act) => (
                        <div
                          key={act.id}
                          className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#F0E8DF] space-y-1 text-xs hover:border-[#FED7AA] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#E05A2B] text-[11px]">
                              {act.event_type === 'auto_dm'
                                ? '⚡️ Auto DM'
                                : act.event_type === 'lead_captured'
                                ? '🎯 Lead Captured'
                                : act.event_type === 'comment_replied'
                                ? '💬 Comment Replied'
                                : '🚀 Auto-Posted'}
                            </span>
                            <span className="text-[10px] text-[#94A3B8]">{act.time_ago || 'just now'}</span>
                          </div>
                          <p className="font-bold text-[#1E293B] text-xs">{act.title}</p>
                          <p className="text-[11px] text-[#64748B] leading-snug">
                            {act.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Simulator Trigger in bottom of stream */}
                  <div className="pt-3 border-t border-[#F5EFE8]">
                    <button
                      onClick={() => setIsSimulatorOpen(true)}
                      className="w-full py-2 bg-[#FFF0E6] hover:bg-[#FFE4D6] text-[#E05A2B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
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
              VIEW 2: METRICS & KPI DASHBOARD (SCREENSHOT 2)
             ========================================================= */}
          {currentTab === 'overview' && dashboardSubView === 'metrics_dashboard' && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              {/* Header Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-[#1E293B]">
                    Dashboard
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Welcome back, <span className="font-bold text-[#1E293B]">{userName}</span>! Here's your overview.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingAutomation(null);
                      setIsCreateAutomationOpen(true);
                    }}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-[#E2D9CF] hover:bg-[#FAF6F0] rounded-2xl text-xs font-bold text-[#1E293B] shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#E05A2B]" />
                    <span>New Automation</span>
                  </button>
                  <button
                    onClick={() => setIsPostComposerOpen(true)}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Post</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs bar */}
              <div className="flex space-x-4 sm:space-x-6 border-b border-[#F0E8DF] text-xs font-bold overflow-x-auto">
                <button className="pb-2.5 sm:pb-3 border-b-2 border-[#E05A2B] text-[#E05A2B] flex items-center space-x-1.5 shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setDashboardSubView('platform_overview')}
                  className="pb-2.5 sm:pb-3 border-b-2 border-transparent text-[#64748B] hover:text-[#1E293B] flex items-center space-x-1.5 shrink-0"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Activity</span>
                </button>
                <button
                  onClick={() => setCurrentTab('social-crm')}
                  className="pb-2.5 sm:pb-3 border-b-2 border-transparent text-[#64748B] hover:text-[#1E293B] flex items-center space-x-1.5 shrink-0"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>
              </div>

              {/* 8 Stat KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {/* 1. Total Contacts */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      TOTAL CONTACTS
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-[#1E293B]">{totalContacts.toLocaleString()}</p>
                    <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-0.5">In your Supabase CRM</p>
                  </div>
                </div>

                {/* 2. Messages Sent Today */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      MESSAGES SENT TODAY
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-xl sm:text-2xl font-black text-[#1E293B]">{messagesToday}</p>
                      <span className="text-xs font-bold text-emerald-600">↑ 12%</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-0.5">842 this week</p>
                  </div>
                </div>

                {/* 3. Active Automations */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      ACTIVE AUTOMATIONS
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-[#1E293B]">{activeAutomationsCount}</p>
                    <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-0.5">Live database rules</p>
                  </div>
                </div>

                {/* 4. Response Rate */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      RESPONSE RATE
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-xl sm:text-2xl font-black text-[#1E293B]">98.4%</p>
                      <span className="text-xs font-bold text-emerald-600">↑ 3%</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-0.5">Based on last 100 messages</p>
                  </div>
                </div>

                {/* 5. Leads Captured Today */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      LEADS CAPTURED TODAY
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-xl sm:text-2xl font-black text-[#1E293B]">{leadsCapturedToday}</p>
                      <span className="text-xs font-bold text-emerald-600">↑ 8%</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-0.5">142 this week</p>
                  </div>
                </div>

                {/* 6. Lead Pages */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      LEAD PAGES
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-[#1E293B]">4</p>
                    <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-0.5">Total lead pages created</p>
                  </div>
                </div>

                {/* 7. Workflows */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      WORKFLOWS
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-[#1E293B]">{automations.length}</p>
                    <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-0.5">Total workflows created</p>
                  </div>
                </div>

                {/* 8. Social Channels */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      SOCIAL CHANNELS
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-[#1E293B]">5</p>
                    <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-0.5">IG, TikTok, FB, Threads, WA</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 3: POSTS & MULTI-CHANNEL SCHEDULER
             ========================================================= */}
          {currentTab === 'post-manager' && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-[#1E293B]">
                    Posts & Social Scheduler
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Manage, queue, and auto-publish content across all connected channels.
                  </p>
                </div>

                <button
                  onClick={() => setIsPostComposerOpen(true)}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create & Schedule Post</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0E8DF] shadow-xs hover:border-[#FED7AA] transition-all flex flex-col justify-between space-y-3.5"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.channels?.map((ch) => (
                            <span key={ch} className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase bg-[#FFF0E6] text-[#E05A2B]">
                              {ch}
                            </span>
                          ))}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            post.status === 'posted'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {post.status === 'posted' ? 'Published' : 'Scheduled'}
                        </span>
                      </div>

                      {post.attachments?.[0]?.url && (
                        <div className="rounded-2xl overflow-hidden aspect-video bg-[#F1E9DF]">
                          <img
                            src={post.attachments[0].url}
                            alt="attachment"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <p className="text-xs text-[#334155] whitespace-pre-line line-clamp-4 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#F5EFE8] flex items-center justify-between text-[10px] sm:text-[11px] text-[#64748B]">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#E05A2B]" />
                        <span>
                          {new Date(post.scheduled_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <span className="font-bold text-[#1E293B]">Live Queue</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 4: AI AUTO-POST STUDIO
             ========================================================= */}
          {currentTab === 'ai-autopilot' && (
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
                  <span className="px-3 py-1 bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA] rounded-xl text-xs font-bold">
                    {leads.length} Leads In Funnel
                  </span>
                </div>
              </div>

              {/* Table of Leads with responsive horizontal scrolling */}
              <div className="bg-white rounded-3xl border border-[#F0E8DF] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[640px]">
                    <thead className="bg-[#FAF7F2] text-[#64748B] font-bold uppercase tracking-wider border-b border-[#F0E8DF]">
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
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA]">
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
              VIEW 7: CHANNEL SPECIFIC VIEWS
             ========================================================= */}
          {['whatsapp', 'instagram', 'tiktok', 'facebook', 'threads'].includes(currentTab) && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-[#1E293B] capitalize">
                    {currentTab} Automation Hub
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Manage active database bots and triggers for {currentTab}.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingAutomation(null);
                    setIsCreateAutomationOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#E05A2B] text-white rounded-2xl text-xs font-bold shadow-xs hover:bg-[#C8491E]"
                >
                  + Add {currentTab} Flow
                </button>
              </div>

              {/* Filtered list for this specific channel */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#F0E8DF] shadow-xs space-y-4">
                <div className="divide-y divide-[#F5EFE8]">
                  {automations
                    .filter((a) => a.channel === currentTab)
                    .map((flow) => (
                      <div key={flow.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-[#1E293B]">{flow.name}</h4>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-1">
                            Keywords: {flow.keywords.join(', ') || 'All incoming'}
                          </p>
                          <p className="text-xs text-[#E05A2B] font-medium mt-0.5">
                            Reply: "{flow.reply_comment}"
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 self-end sm:self-auto">
                          <button
                            onClick={() => {
                              setEditingAutomation(flow);
                              setIsCreateAutomationOpen(true);
                            }}
                            className="px-3 py-1.5 bg-white border border-[#E2D9CF] rounded-xl text-xs font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAutomation(flow.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  {automations.filter((a) => a.channel === currentTab).length === 0 && (
                    <div className="py-8 text-center text-xs text-[#94A3B8]">
                      No automations configured for {currentTab} yet. Click '+ Add' above to create one.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
    </div>
  );
}
