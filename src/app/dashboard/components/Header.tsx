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
} from 'lucide-react';
import { SocialFlowLogo } from './Sidebar';
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
}

export default function Header({
  currentTab = 'overview',
  userName = 'Alex Morgan',
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
}: HeaderProps) {
  const supabase = createClient();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeUserName, setActiveUserName] = useState(userName);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata) {
          if (user.user_metadata.name) setActiveUserName(user.user_metadata.name);
          if (user.user_metadata.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);
        } else {
          const cached = localStorage.getItem('socialflow_user_profile');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.fullName) setActiveUserName(parsed.fullName);
            if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
          }
        }
      } catch (e) {}
    }
    loadUser();

    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        if (e.detail.fullName) setActiveUserName(e.detail.fullName);
        if (e.detail.avatarUrl !== undefined) setAvatarUrl(e.detail.avatarUrl);
      }
    };
    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('user-profile-updated', handleProfileUpdate);
  }, []);

  const notifications = [
    {
      id: 'n1',
      title: 'Auto DM Sent',
      desc: 'Sent special promo link to @sophia_m on Instagram Reel',
      time: 'Just now',
      unread: true,
    },
    {
      id: 'n2',
      title: 'New Lead Captured',
      desc: '@alex_creative requested pricing on TikTok',
      time: '12m ago',
      unread: true,
    },
    {
      id: 'n3',
      title: 'AI Auto-Pilot Scheduled',
      desc: '2 viral posts queued for peak engagement hours',
      time: '1h ago',
      unread: false,
    },
  ];

  return (
    <header className="h-16 bg-white border-b border-[#F0E8DF] fixed top-0 inset-x-0 z-20 flex items-center justify-between px-3.5 sm:px-6 font-sans">
      {/* Left side: Mobile Toggle & Brand / Breadcrumb */}
      <div
        className={`flex items-center space-x-2.5 sm:space-x-3 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* Mobile menu trigger */}
        <button
          onClick={() => {
            if (onOpenMobileSidebar) onOpenMobileSidebar();
            else if (setIsMobileMenuOpen) setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          className="md:hidden p-2 text-[#64748B] hover:text-[#1E293B] rounded-xl hover:bg-[#FAF6F0] focus:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand indicator on mobile */}
        <div className="md:hidden flex items-center space-x-2">
          <SocialFlowLogo className="w-6 h-6" />
        </div>

        {/* Sidebar Collapse Toggle Button (Desktop) */}
        {onToggleSidebarCollapse && (
          <button
            onClick={onToggleSidebarCollapse}
            className="hidden md:flex p-1.5 text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#FAF6F0] rounded-xl transition-colors"
            title={isSidebarCollapsed ? "Maximize Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#E05A2B]" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        <div className="flex items-center space-x-2">
          <h1 className="text-xs sm:text-base font-bold text-[#1E293B] truncate max-w-[170px] sm:max-w-none">
            {(() => {
              const titles: Record<string, string> = {
                overview: 'Dashboard Overview',
                'social-crm': 'Social CRM & Leads',
                'post-manager': 'Posts & Schedule',
                'ai-autopilot': 'AI Auto-Pilot Studio',
                integrations: 'Channel Integrations',
                settings: 'Profile & Settings',
                instagram: 'Instagram Hub',
                'instagram-comments': 'Instagram · Comment Auto-DM',
                'instagram-stories': 'Instagram · Story Reply Bot',
                'instagram-dm': 'Instagram · DM Welcome Funnel',
                facebook: 'Facebook Hub',
                'facebook-messenger': 'Facebook · Messenger Funnel',
                'facebook-comments': 'Facebook · Comment Replies',
                'facebook-leads': 'Facebook · Lead Sync & CRM',
                tiktok: 'TikTok Hub',
                'tiktok-comments': 'TikTok · Comment Capture',
                'tiktok-dm': 'TikTok · Direct Message Deals',
                twitter: 'X (Twitter) Hub',
                'twitter-auto': 'X (Twitter) · Auto-Replies',
                'twitter-dm': 'X (Twitter) · DM Lead Funnel',
                linkedin: 'LinkedIn Hub',
                'linkedin-comments': 'LinkedIn · Post Outreach',
                'linkedin-dm': 'LinkedIn · InMail Outbound',
                threads: 'Threads Hub',
                'threads-auto': 'Threads · Keyword Auto-Reply',
                'threads-dm': 'Threads · Direct Messages',
                whatsapp: 'WhatsApp Hub',
                'whatsapp-auto': 'WhatsApp · Instant Replies',
                'whatsapp-inbox': 'WhatsApp · Live Chat Inbox',
                'whatsapp-crm': 'WhatsApp · Audience Lists',
              };
              return titles[currentTab] || currentTab.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
            })()}
          </h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA] shrink-0">
            Pro Plan
          </span>
        </div>
      </div>

      {/* Right side: Actions, Notifications, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3.5">
        {/* Simulator button */}
        <button
          onClick={onOpenSimulatorModal}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#E05A2B] border border-[#FED7AA] rounded-xl text-xs font-semibold transition-colors shadow-xs"
          title="Test live comment keyword and DM automation"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Simulate Trigger</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-[#64748B] hover:bg-[#FAF6F0] hover:text-[#1E293B] transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 rounded-full bg-[#E05A2B] ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-24px)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-xl border border-[#F0E8DF] py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-[#F5EFE8] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E293B]">Live Activity Notifications</span>
                <span className="text-[10px] font-semibold text-[#E05A2B] bg-[#FFF0E6] px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="divide-y divide-[#F5EFE8] max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-[#FAF8F5] transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-bold text-[#1E293B]">{item.title}</p>
                      <span className="text-[10px] text-[#94A3B8]">{item.time}</span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="px-3 pt-2 text-center border-t border-[#F5EFE8]">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-[#E05A2B] hover:underline"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <div
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-[#E2D9CF] bg-gradient-to-tr from-[#FED7AA] to-[#FDBA74] flex items-center justify-center text-[#9A3412] font-bold text-xs shadow-xs cursor-pointer hover:ring-2 hover:ring-[#E05A2B] transition-all"
            title={activeUserName}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={activeUserName} className="w-full h-full object-cover" />
            ) : (
              <span>{activeUserName ? activeUserName.charAt(0).toUpperCase() : 'A'}</span>
            )}
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#F0E8DF] py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-[#F5EFE8]">
                <p className="text-xs font-bold text-[#1E293B] truncate">{activeUserName}</p>
                <p className="text-[10px] text-[#94A3B8] truncate">Creator Account</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  if (onSelectTab) onSelectTab('settings');
                }}
                className="w-full px-4 py-2 text-left text-xs font-semibold text-[#475569] hover:bg-[#FAF6F0] hover:text-[#E05A2B] flex items-center space-x-2"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Profile Settings</span>
              </button>
              <div className="pt-1 border-t border-[#F5EFE8]">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onSignOut) onSignOut();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
