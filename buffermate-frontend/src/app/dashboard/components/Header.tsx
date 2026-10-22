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
  Command
} from 'lucide-react';
import { BufferMateLogo } from './Sidebar';
import { createClient } from '@/lib/supabase/client';

interface HeaderProps {
  currentTab?: string;
  userName?: string;
  onOpenCreateModal?: () => void;
  onOpenSimulatorModal?: () => void;
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
  userName = 'Vincent Agber',
  onOpenCreateModal,
  onOpenSimulatorModal,
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
  const [activeUserName, setActiveUserName] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('buffermate_user_profile');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.fullName) return parsed.fullName;
        }
      } catch (e) {}
    }
    return userName || 'Vincent Agber';
  });
  const [avatarUrl, setAvatarUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('buffermate_user_profile');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.avatarUrl) return parsed.avatarUrl;
        }
      } catch (e) {}
    }
    return '';
  });
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

  const notifications = [
    {
      id: 'n1',
      title: 'Goal Forecast Update',
      desc: 'Leads goal tracking 4 days ahead of schedule (80% confidence)',
      time: 'Just now',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Scorecard Campaign MQLs',
      desc: '78 qualified leads captured across LinkedIn & Meta ads',
      time: '12m ago',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Autopilot Action Completed',
      desc: '146 community responses processed inside guardrails',
      time: '1h ago',
      unread: false,
    },
  ];

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
          <span className="font-bold text-sm text-[#0F172A]">Socialyn</span>
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

      {/* Middle: Universal Search Bar matching Reports aesthetic */}
      <div className="flex-1 max-w-xl mx-3 sm:mx-6">
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
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-24px)] sm:w-80 max-w-sm bg-white rounded-3xl shadow-xl border border-slate-100 py-2.5 z-50 animate-scale-up">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#161616]">Notifications</span>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="px-3 pt-2 text-center border-t border-slate-100">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-purple-700 hover:underline"
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
