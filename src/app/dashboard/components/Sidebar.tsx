'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  MessageCircle,
  Instagram,
  Facebook,
  AtSign,
  Users,
  Layers,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Bot,
  Calendar,
  Activity,
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';

// SocialFlow Brand Logo
export function SocialFlowLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`${className} bg-gradient-to-br from-[#F06535] to-[#E05A2B] rounded-xl flex items-center justify-center text-white shadow-sm shadow-orange-500/30 flex-shrink-0`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <path d="M8 12h.01" />
        <path d="M12 12h.01" />
        <path d="M16 12h.01" />
      </svg>
    </div>
  );
}

interface SidebarProps {
  currentTab?: string;
  onSelectTab?: (tabId: string) => void;
  onOpenCreateModal?: () => void;
  onOpenSimulatorModal?: () => void;
  onSignOut?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  currentTab = 'overview',
  onSelectTab,
  onOpenCreateModal,
  onOpenSimulatorModal,
  onSignOut,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    whatsapp: false,
    instagram: false,
    tiktok: false,
    facebook: false,
    threads: false,
  });

  const toggleDropdown = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleItemClick = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      color: 'text-emerald-500',
      activeCount: 'Ready',
      items: [
        { name: 'Auto-Responses', tab: 'whatsapp-auto' },
        { name: 'Live Chat Inbox', tab: 'whatsapp-inbox' },
        { name: 'Contact Lists', tab: 'social-crm' },
      ],
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: 'text-pink-500',
      activeCount: '4 flows',
      items: [
        { name: 'Comment Auto-DM', tab: 'instagram-comments' },
        { name: 'Story Reply Bot', tab: 'instagram-stories' },
        { name: 'DM Welcome Funnel', tab: 'instagram-dm' },
      ],
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      color: 'text-neutral-900',
      activeCount: '2 bots',
      items: [
        { name: 'Comment Lead Capture', tab: 'tiktok-comments' },
        { name: 'Direct Message Deals', tab: 'tiktok-dm' },
      ],
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: 'text-blue-600',
      activeCount: '2 flows',
      items: [
        { name: 'Messenger Auto-Funnel', tab: 'facebook-messenger' },
        { name: 'Post Comment Replies', tab: 'facebook-comments' },
        { name: 'Ad Lead Sync', tab: 'social-crm' },
      ],
    },
    {
      id: 'threads',
      name: 'Threads',
      color: 'text-neutral-800',
      activeCount: '1 flow',
      items: [
        { name: 'Keyword Link Auto-Reply', tab: 'threads-auto' },
        { name: 'Direct Messages', tab: 'threads-dm' },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white transition-all duration-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 sm:px-5 border-b border-[#F5EFE8]">
        <div
          className="flex items-center space-x-2.5 cursor-pointer overflow-hidden"
          onClick={() => handleItemClick('overview')}
        >
          <SocialFlowLogo />
          {!isCollapsed && (
            <div className="animate-fade-in">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-[15px] tracking-tight text-[#1E293B]">SocialFlow</span>
              </div>
              <span className="text-[10px] font-semibold text-[#E05A2B] tracking-wider uppercase">AI STUDIO</span>
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button on Desktop */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#FAF6F0] rounded-xl transition-colors"
            title={isCollapsed ? "Maximize Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#E05A2B]" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Close button on mobile drawer */}
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-[#64748B] hover:text-[#1E293B] rounded-lg hover:bg-[#FAF6F0]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-3' : 'px-3 py-4'} space-y-1.5`}>
        {/* Overview Item */}
        <button
          onClick={() => handleItemClick('overview')}
          title={isCollapsed ? "Overview" : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2.5'
          } rounded-xl text-sm font-semibold transition-all ${
            currentTab === 'overview'
              ? 'bg-[#FEF0E6] text-[#E05A2B]'
              : 'text-[#475569] hover:bg-[#FAF6F0] hover:text-[#1E293B]'
          }`}
        >
          <div className="flex items-center space-x-3">
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentTab === 'overview' ? 'text-[#E05A2B]' : 'text-[#64748B]'}`} />
            {!isCollapsed && <span>Overview</span>}
          </div>
          {!isCollapsed && currentTab === 'overview' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E05A2B]"></span>
          )}
        </button>

        {/* Channels Accordion */}
        <div className="pt-2 pb-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Channels
            </p>
          )}
          <div className="space-y-1">
            {channels.map((channel) => {
              const isOpen = openDropdowns[channel.id];
              const isChannelActive = currentTab.startsWith(channel.id);

              return (
                <div key={channel.id} className="space-y-0.5">
                  <div
                    onClick={() => handleItemClick(channel.id)}
                    title={isCollapsed ? channel.name : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2'
                    } rounded-xl text-sm font-medium transition-colors cursor-pointer group ${
                      isChannelActive
                        ? 'bg-[#FFF6F0] text-[#E05A2B] font-semibold'
                        : 'text-[#475569] hover:bg-[#FAF6F0] hover:text-[#1E293B]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <SocialPlatformIcon channel={channel.id} className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span>{channel.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={(e) => toggleDropdown(channel.id, e)}
                          className="p-1 text-[#94A3B8] hover:text-[#475569] rounded"
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Items (Only when expanded) */}
                  {!isCollapsed && isOpen && (
                    <div className="pl-9 pr-2 py-1 space-y-0.5 border-l-2 border-[#FED7AA] ml-5">
                      {channel.items.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleItemClick(item.tab)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            currentTab === item.tab
                              ? 'text-[#E05A2B] bg-[#FEF0E6] font-semibold'
                              : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#FAF6F0]'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tools & Management */}
        <div className="pt-2">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Management
            </p>
          )}

          <button
            onClick={() => handleItemClick('social-crm')}
            title={isCollapsed ? "Social CRM" : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2'
            } rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'social-crm'
                ? 'bg-[#FEF0E6] text-[#E05A2B] font-semibold'
                : 'text-[#475569] hover:bg-[#FAF6F0] hover:text-[#1E293B]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Users className="w-4 h-4 text-[#64748B] shrink-0" />
              {!isCollapsed && <span>Social CRM</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[11px] font-bold px-1.5 py-0.5 bg-[#F1E9DF] text-[#64748B] rounded-md">Live</span>
            )}
          </button>

          <button
            onClick={() => handleItemClick('post-manager')}
            title={isCollapsed ? "Posts & Schedule" : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2'
            } rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'post-manager'
                ? 'bg-[#FEF0E6] text-[#E05A2B] font-semibold'
                : 'text-[#475569] hover:bg-[#FAF6F0] hover:text-[#1E293B]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-[#64748B] shrink-0" />
              {!isCollapsed && <span>Posts & Schedule</span>}
            </div>
          </button>

          <button
            onClick={() => handleItemClick('ai-autopilot')}
            title={isCollapsed ? "AI Auto-Pilot" : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2'
            } rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'ai-autopilot'
                ? 'bg-[#FEF0E6] text-[#E05A2B] font-semibold'
                : 'text-[#475569] hover:bg-[#FAF6F0] hover:text-[#1E293B]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="w-4 h-4 text-[#E05A2B] shrink-0" />
              {!isCollapsed && <span className="text-[#E05A2B]">AI Auto-Pilot</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#E05A2B] text-white rounded-md">Pro</span>
            )}
          </button>

          <button
            onClick={() => handleItemClick('integrations')}
            title={isCollapsed ? "Integrations" : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2'
            } rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'integrations'
                ? 'bg-[#FEF0E6] text-[#E05A2B] font-semibold'
                : 'text-[#475569] hover:bg-[#FAF6F0] hover:text-[#1E293B]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Layers className="w-4 h-4 text-[#64748B] shrink-0" />
              {!isCollapsed && <span>Integrations</span>}
            </div>
          </button>

          <button
            onClick={() => handleItemClick('settings')}
            title={isCollapsed ? "Settings" : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2'
            } rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'settings'
                ? 'bg-[#FEF0E6] text-[#E05A2B] font-semibold'
                : 'text-[#475569] hover:bg-[#FAF6F0] hover:text-[#1E293B]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-4 h-4 text-[#64748B] shrink-0" />
              {!isCollapsed && <span>Profile & Settings</span>}
            </div>
          </button>
        </div>

        {/* Quick Simulator Button */}
        <div className="pt-4 px-1">
          {isCollapsed ? (
            <button
              onClick={() => {
                if (onOpenSimulatorModal) onOpenSimulatorModal();
                if (onCloseMobile) onCloseMobile();
              }}
              title="Test Live Keyword Trigger"
              className="w-full py-2.5 bg-[#FFF0E6] hover:bg-[#FFE4D6] text-[#E05A2B] border border-[#FED7AA] rounded-xl flex items-center justify-center transition-colors"
            >
              <Bot className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-3 bg-gradient-to-br from-[#FFF7ED] to-[#FEF3E2] border border-[#FED7AA] rounded-2xl">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#E05A2B] mb-1">
                <Bot className="w-3.5 h-3.5" />
                <span>Engine Simulator</span>
              </div>
              <p className="text-[11px] text-[#78350F] leading-tight mb-2.5">
                Simulate follower comments & test keyword DMs in real time.
              </p>
              <button
                onClick={() => {
                  if (onOpenSimulatorModal) onOpenSimulatorModal();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full py-1.5 px-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Test Live Trigger</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Sign Out */}
      <div className={`p-4 border-t border-[#F5EFE8] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <button
          onClick={onSignOut}
          title={isCollapsed ? "Sign out" : undefined}
          className={`flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'space-x-3 w-full px-3 py-2'
          } text-sm font-medium text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar with Dynamic Width */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-30 font-sans border-r border-[#F0E8DF] select-none transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-Over with Backdrop) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={onCloseMobile}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] flex-1 flex flex-col z-10 shadow-2xl animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
