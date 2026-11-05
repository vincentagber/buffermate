'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Sparkles,
  Plus,
  Menu,
  X,
  User,
  ExternalLink,
  Bot,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Search,
  Command,
  UserCheck,
  MessageSquare,
  AtSign,
  Check,
  CheckCheck,
  Play,
  Flag
} from 'lucide-react';
import { BufferMateLogo } from './Sidebar';
import { createClient } from '@/lib/supabase/client';
import ChevronStepper, { ChevronStepItem } from '@/components/ui/ChevronStepper';

interface HeaderProps {
  currentTab?: string;
  userName?: string;
  onOpenCreateModal?: () => void;
  onOpenSimulatorModal?: () => void;
  onOpenPayRunModal?: () => void;
  onSignOut?: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
  onOpenMobileSidebar?: () => void;
  onOpenPostModal?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
  onSelectTab?: (tab: string) => void;
  onOpenSearch?: () => void;
}

export default function Header({
  currentTab = 'command-center',
  userName = 'Alex Morgan',
  onOpenCreateModal,
  onOpenSimulatorModal,
  onOpenPayRunModal,
  onSignOut,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  onOpenMobileSidebar,
  onOpenPostModal,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
  onSelectTab,
  onOpenSearch,
}: HeaderProps) {
  const supabase = createClient();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeUserName, setActiveUserName] = useState(userName || 'Alex Morgan');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [activeRole, setActiveRole] = useState('Workspace Owner · Admin');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata) {
          if (user.user_metadata.name) setActiveUserName(user.user_metadata.name);
          if (user.user_metadata.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);
        } else {
          const cached = localStorage.getItem('buffermate_user_profile');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.fullName) setActiveUserName(parsed.fullName);
            if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
            if (parsed.businessName) setActiveRole(`Founder · ${parsed.businessName}`);
          }
        }
      } catch (e) {}
    }
    loadUser();

    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        if (e.detail.fullName) setActiveUserName(e.detail.fullName);
        if (e.detail.avatarUrl !== undefined) setAvatarUrl(e.detail.avatarUrl);
        if (e.detail.businessName) setActiveRole(`Founder · ${e.detail.businessName}`);
      }
    };
    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('user-profile-updated', handleProfileUpdate);
  }, []);

  // Jira Live Notifications System
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'assigned' | 'mentions'>('all');
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(false);

  const fetchNotifications = async (filter = notifFilter) => {
    try {
      setIsLoadingNotifs(true);
      const res = await fetch(`/api/jira/notifications?filter=${filter}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setNotifications(data.data);
        setUnreadCount(data.unread_count ?? 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoadingNotifs(false);
    }
  };

  useEffect(() => {
    fetchNotifications(notifFilter);
    const interval = setInterval(() => fetchNotifications(notifFilter), 15000);

    const handleRefresh = () => fetchNotifications(notifFilter);
    window.addEventListener('jira-notification-refresh', handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('jira-notification-refresh', handleRefresh);
    };
  }, [notifFilter]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await fetch(`/api/jira/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/jira/notifications/mark-all-read', { method: 'POST' });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = async (item: any) => {
    if (!item.is_read) {
      await handleMarkAsRead(item.id);
    }
    setShowNotifications(false);

    if (item.data?.issue_key || item.work_item_id) {
      const issueKey = item.data?.issue_key || item.work_item_id;
      try {
        sessionStorage.setItem('buffermate_pending_open_issue', issueKey);
        window.history.pushState(null, '', '/dashboard?tab=tasks');
      } catch {}
      if (onSelectTab) onSelectTab('tasks');
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('open-jira-issue', {
            detail: { issueIdOrKey: issueKey },
          })
        );
      }, 60);
    } else if (item.sprint_id) {
      if (onSelectTab) onSelectTab('tasks');
      try {
        window.history.pushState(null, '', '/dashboard?tab=tasks');
      } catch {}
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
      if (diffSec < 60) return 'just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return '';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'issue_assigned':
        return <UserCheck className="w-3.5 h-3.5 text-blue-600" />;
      case 'issue_mentioned':
        return <AtSign className="w-3.5 h-3.5 text-purple-600" />;
      case 'issue_status_changed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'issue_commented':
        return <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />;
      case 'sprint_started':
        return <Play className="w-3.5 h-3.5 text-amber-600" />;
      case 'sprint_completed':
        return <Flag className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] fixed top-0 inset-x-0 z-20 flex items-center justify-between px-3.5 sm:px-6 font-sans">
      {/* Left side: Mobile Toggle & Sidebar Collapse */}
      <div
        className={`flex items-center space-x-2.5 sm:space-x-4 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* Mobile menu trigger */}
        <button
          onClick={() => {
            if (onOpenMobileSidebar) onOpenMobileSidebar();
            else if (setIsMobileMenuOpen) setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          className="md:hidden p-2 text-[#64748B] hover:text-[#0F172A] rounded-xl hover:bg-[#F8FAFC]"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand indicator on mobile */}
        <div className="md:hidden flex items-center space-x-2">
          <BufferMateLogo className="w-6 h-6" />
          <span className="font-bold text-sm text-[#0F172A]">BufferMate</span>
        </div>

        {/* Sidebar Collapse Toggle Button (Desktop) */}
        {onToggleSidebarCollapse && (
          <button
            onClick={onToggleSidebarCollapse}
            className="hidden md:flex p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-colors"
            title={isSidebarCollapsed ? 'Maximize Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#6366F1]" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Center: Reusable Chevron Stepper Component adopted for Header Page Navigation */}
      <div className="hidden xl:flex items-center flex-1 max-w-xl mx-3 overflow-x-auto no-scrollbar">
        <ChevronStepper
          steps={[
            { id: 'command-center', title: 'Overview', subtitle: 'Command' },
            { id: 'campaigns', title: 'Journeys', subtitle: 'Campaigns' },
            { id: 'analytics', title: 'Analytics', subtitle: 'Live ROI' },
            { id: 'reports', title: 'Reports', subtitle: 'Clinic KPI' },
            { id: 'content-studio', title: 'Studio', subtitle: 'AI Engine' },
          ]}
          currentStep={currentTab === 'overview' ? 'command-center' : currentTab}
          onChange={(stepId) => onSelectTab && onSelectTab(String(stepId))}
          variant="blue"
          size="sm"
          showNumbers={false}
          showIcons={false}
        />
      </div>

      {/* Middle: Universal Search Bar matching Reports aesthetic */}
      <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <div
            onClick={onOpenSearch}
            className="w-full flex items-center bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-full px-4 py-2 transition-all cursor-pointer group shadow-2xs"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-700 mr-2.5 shrink-0" />
            <input
              type="text"
              readOnly
              value={searchValue}
              placeholder="Search clients, treatments, campaigns..."
              className="bg-transparent text-xs text-slate-900 placeholder-slate-400 w-full focus:outline-none cursor-pointer font-medium"
            />
            <div className="hidden sm:flex items-center space-x-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono shrink-0 ml-2">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </form>
      </div>

      {/* Right side: Actions, Notifications, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Quick Launch Pay Run Modal */}
        {onOpenPayRunModal && (
          <button
            onClick={onOpenPayRunModal}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all shadow-2xs"
            title="Generate Pay Run Cycle (Chevron Stepper)"
          >
            <span className="text-xs">⚡</span>
            <span>Pay Run</span>
          </button>
        )}


        {/* Messages quick toggle */}
        <button
          onClick={() => onSelectTab && onSelectTab('inbox')}
          className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors shrink-0"
          title="Messages & Inbox"
        >
          <span className="text-xs">💬</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 min-w-[18px] h-[18px] rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown: Jira Parity Notification Center */}
          {showNotifications && (
            <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-24px)] sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/80 py-3 z-50 animate-scale-up">
              {/* Dropdown Header */}
              <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 flex items-center space-x-1 cursor-pointer transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Jira Notification Filter Tabs */}
              <div className="px-3 pt-2 pb-1 flex items-center space-x-1 border-b border-slate-100">
                {(['all', 'unread', 'assigned', 'mentions'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setNotifFilter(tab)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize transition-all cursor-pointer ${
                      notifFilter === tab
                        ? 'bg-[#141416] text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab}
                  </button>
                ))}
              </div>

              {/* Notification Items List */}
              <div className="divide-y divide-slate-100 max-h-[min(380px,calc(100dvh-180px))] overflow-y-auto">
                {isLoadingNotifs && notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center space-y-1">
                    <p className="text-xs font-bold text-slate-700">All caught up!</p>
                    <p className="text-[11px] text-slate-400">No notifications in {notifFilter}.</p>
                  </div>
                ) : (
                  notifications.map((item) => {
                    const isUnread = !item.is_read;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-start space-x-3 group relative ${
                          isUnread ? 'bg-blue-50/20' : ''
                        }`}
                      >
                        {/* Event Icon */}
                        <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          {getEventIcon(item.event_type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            {item.data?.issue_key && (
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-blue-100/70 text-blue-800 rounded">
                                {item.data.issue_key}
                              </span>
                            )}
                            <p className={`text-xs text-slate-900 truncate ${isUnread ? 'font-bold' : 'font-medium'}`}>
                              {item.title}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 inline-block font-mono">
                            {formatTimeAgo(item.created_at)}
                          </span>
                        </div>

                        {/* Right: Unread indicator & Quick Mark Read */}
                        <div className="absolute right-3 top-3.5 flex items-center space-x-1.5">
                          {isUnread && (
                            <span
                              className="w-2 h-2 rounded-full bg-blue-600 shrink-0"
                              title="Unread notification"
                            />
                          )}
                          {isUnread && (
                            <button
                              type="button"
                              onClick={(e) => handleMarkAsRead(item.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 rounded-full transition-all cursor-pointer"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="px-4 pt-2.5 pb-1 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    if (onSelectTab) onSelectTab('tasks');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  View Tasks & Boards →
                </button>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors shadow-2xs"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={activeUserName}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#161616] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {activeUserName[0]?.toUpperCase() || 'A'}
              </div>
            )}
            <span className="hidden sm:inline-block text-xs font-bold text-slate-800 pr-1 max-w-[130px] truncate">
              {activeUserName}
            </span>
          </button>

          {showUserMenu && (
            <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-1.5 z-50 animate-fade-in">
              <div className="px-3.5 py-2 border-b border-[#F1F5F9]">
                <p className="text-xs font-bold text-[#0F172A] truncate">{activeUserName}</p>
                <p className="text-[10px] text-[#64748B]">{activeRole}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  if (onSelectTab) onSelectTab('settings');
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] flex items-center space-x-2"
              >
                <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Account Settings</span>
              </button>
              {onSignOut && (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSignOut();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 flex items-center space-x-2 border-t border-[#F1F5F9]"
                >
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
