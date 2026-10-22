'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  Megaphone,
  Calendar,
  CheckSquare,
  PenTool,
  MessageSquare,
  Radio,
  BarChart3,
  TrendingUp,
  Compass,
  FlaskConical,
  DollarSign,
  Settings,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  ChevronRight,
  Plus,
  Crown,
  Sparkles,
  Building2,
  Check,
  HelpCircle
} from 'lucide-react';

// Socialyn / MedSpa / BufferMate Brand Logo with organic soft disc styling
export function BufferMateLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`${className} rounded-xl flex items-center justify-center relative flex-shrink-0`}>
      <div className="w-6 h-6 rounded-full bg-[#10B981] opacity-90 absolute left-0"></div>
      <div className="w-6 h-6 rounded-full bg-[#8B5CF6] opacity-80 absolute right-0"></div>
    </div>
  );
}

export const SocialFlowLogo = BufferMateLogo;

interface SidebarProps {
  currentTab?: string;
  onSelectTab?: (tabId: string) => void;
  onOpenCreateModal?: () => void;
  onOpenPostModal?: () => void;
  onOpenSimulatorModal?: () => void;
  onOpenFlowAssist?: () => void;
  onSignOut?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  alias?: string[];
  badge?: string;
  badgeColor?: string;
  activeBg?: string;
  activeIconColor?: string;
}

interface NavSection {
  group?: string;
  items: NavItem[];
}

export default function Sidebar({
  currentTab = 'command-center',
  onSelectTab,
  onOpenCreateModal,
  onOpenPostModal,
  onOpenSimulatorModal,
  onOpenFlowAssist,
  onSignOut,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const router = useRouter();

  // Dynamic user profile state synced with Profile & Settings
  const [profileName, setProfileName] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('buffermate_user_profile');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.fullName) return parsed.fullName;
        }
      } catch (e) {}
    }
    return 'Vincent Agber';
  });
  const [profileAvatar, setProfileAvatar] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('buffermate_user_profile');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.avatarUrl) return parsed.avatarUrl;
        }
      } catch (e) {}
    }
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
  });
  const [profileRole, setProfileRole] = useState('Owner · Administrator');

  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        if (e.detail.fullName) setProfileName(e.detail.fullName);
        if (e.detail.avatarUrl !== undefined) setProfileAvatar(e.detail.avatarUrl);
        if (e.detail.businessName) setProfileRole(`Founder · ${e.detail.businessName}`);
        else if (e.detail.niche) setProfileRole(`Lead · ${e.detail.niche.split('&')[0].trim()}`);
      }
    };
    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('user-profile-updated', handleProfileUpdate);
  }, []);

  const handleItemClick = (tabId: string) => {
    if (tabId === 'composer') {
      if (onOpenPostModal) onOpenPostModal();
      else if (onOpenCreateModal) onOpenCreateModal();
      if (onCloseMobile) onCloseMobile();
      return;
    }
    if (tabId === 'analytics') {
      router.push('/dashboard/analytics');
    } else if (tabId === 'overview' || tabId === 'command-center') {
      router.push('/dashboard');
    }
    if (onSelectTab) onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const navSections: NavSection[] = [
    {
      items: [
        {
          id: 'command-center',
          alias: ['overview'],
          label: 'Overview',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      group: 'WORKSPACE',
      items: [
        {
          id: 'composer',
          alias: ['create-post', 'new-post'],
          label: 'Composer',
          icon: PenTool,
          badge: 'POST',
          badgeColor: 'bg-emerald-100 text-emerald-800',
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: Calendar,
          badge: '19',
          badgeColor: 'bg-slate-100 text-slate-600',
        },
        {
          id: 'campaigns',
          alias: ['journeys'],
          label: 'Journeys',
          icon: Megaphone,
          badge: '8',
          badgeColor: 'bg-slate-100 text-slate-600',
        },
        {
          id: 'memberships',
          alias: ['retention'],
          label: 'Memberships',
          icon: Crown,
          badge: 'ADMIN',
          badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200/80 font-bold text-[9px]',
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          badge: 'LIVE',
          badgeColor: 'bg-[#E8F7D4] text-[#3B6B15]',
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: TrendingUp,
        },
        {
          id: 'goals',
          label: 'Goals',
          icon: Target,
        },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: CheckSquare,
        },
      ],
    },
    {
      group: 'ENGAGE & AI',
      items: [
        {
          id: 'inbox',
          alias: ['social-crm'],
          label: 'Inbox',
          icon: MessageSquare,
          badge: '7',
          badgeColor: 'bg-[#0F172A] text-white',
        },
        {
          id: 'content-studio',
          alias: ['ai-autopilot'],
          label: 'Content studio',
          icon: PenTool,
        },
      ],
    },
    {
      group: 'GROWTH',
      items: [
        {
          id: 'roi-revenue',
          label: 'ROI & revenue',
          icon: DollarSign,
        },
        {
          id: 'experiments',
          label: 'Experiments',
          icon: FlaskConical,
        },
      ],
    },
  ];

  const isTabActive = (item: any) => {
    if (currentTab === item.id) return true;
    if (item.alias && item.alias.includes(currentTab)) return true;
    return false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 transition-all duration-300 font-sans">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 sm:px-5 border-b border-slate-100 shrink-0">
        <div
          className="flex items-center space-x-2.5 cursor-pointer overflow-hidden"
          onClick={() => handleItemClick('command-center')}
        >
          <div className="flex items-center -space-x-1">
            <span className="w-3.5 h-3.5 rounded-full bg-[#86EFAC]"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#C084FC]"></span>
          </div>
          {!isCollapsed && (
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-[#161616]">medspa</span>
              <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-1 rounded">OS</span>
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button on Desktop */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title={isCollapsed ? 'Maximize Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-purple-600" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Close button on mobile drawer */}
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>



      {/* Primary Quick CTA: Create Post Button */}
      <div className={`${isCollapsed ? 'px-2 pt-2.5 pb-1 flex justify-center' : 'px-3 pt-2.5 pb-1'} shrink-0`}>
        {isCollapsed ? (
          <button
            onClick={() => {
              if (onOpenPostModal) onOpenPostModal();
              else if (onOpenCreateModal) onOpenCreateModal();
            }}
            title="Create Post"
            className="w-10 h-10 bg-[#161616] hover:bg-black text-white rounded-2xl shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5 text-emerald-400" />
          </button>
        ) : (
          <button
            onClick={() => {
              if (onOpenPostModal) onOpenPostModal();
              else if (onOpenCreateModal) onOpenCreateModal();
            }}
            className="w-full py-2.5 px-3.5 bg-[#161616] hover:bg-black text-white rounded-2xl shadow-sm flex items-center justify-center gap-2 text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span>Create Post</span>
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-2' : 'px-3 py-2'} space-y-3.5 scrollbar-thin`}>
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-0.5">
            {section.group && !isCollapsed && (
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.group}
              </div>
            )}

            {section.items.map((item) => {
              const active = isTabActive(item);
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-2 py-2' : 'justify-between px-3 py-2'
                  } rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#EDE9FE] text-[#6D28D9] font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-[#6D28D9]' : 'text-slate-500'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full tracking-wide shrink-0 ${
                        active ? 'bg-white/80 text-purple-900' : item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* EMBEDDED PROACTIVE FLOW ASSIST CARD IN SIDEBAR */}
        {!isCollapsed && (
          <div className="pt-2">
            <div className="bg-[#EAF6DA] border border-[#DCF0C4] rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D5018]">
                <Sparkles className="w-3.5 h-3.5 text-[#52802B]" />
                <span>Flow Assist</span>
              </div>
              <p className="text-[11px] text-[#3A6020] leading-snug">
                6 clients are due to rebook this week. Draft reminders?
              </p>
              <button
                onClick={onOpenFlowAssist}
                className="w-full bg-white hover:bg-slate-50 text-slate-900 text-[11px] font-bold py-1.5 px-3 rounded-full shadow-2xs transition-transform active:scale-95 text-center"
              >
                Review list
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Settings & Profile */}
      <div className="p-3 border-t border-slate-100 space-y-1 shrink-0">
        <button
          onClick={() => handleItemClick('integrations')}
          title={isCollapsed ? 'Integrations' : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'px-3 py-1.5'
          } rounded-xl text-xs font-medium transition-colors ${
            currentTab === 'integrations'
              ? 'bg-[#161616] text-white shadow-2xs font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Layers className={`w-4 h-4 shrink-0 ${currentTab === 'integrations' ? 'text-white' : 'text-slate-400'}`} />
          {!isCollapsed && <span className="ml-2.5">Integrations</span>}
        </button>

        <button
          onClick={() => handleItemClick('settings')}
          title={isCollapsed ? 'Settings' : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'px-3 py-1.5'
          } rounded-xl text-xs font-medium transition-colors ${
            currentTab === 'settings'
              ? 'bg-[#161616] text-white shadow-2xs font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings className={`w-4 h-4 shrink-0 ${currentTab === 'settings' ? 'text-white' : 'text-slate-400'}`} />
          {!isCollapsed && <span className="ml-2.5">Settings</span>}
        </button>

        {/* User Profile Bar */}
        {!isCollapsed ? (
          <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between px-1">
            <div 
              onClick={() => handleItemClick('settings')}
              className="flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
              title="Click to view Account Settings"
            >
              {profileAvatar ? (
                <img
                  src={profileAvatar}
                  alt={profileName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#161616] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {profileName[0]?.toUpperCase() || 'A'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{profileName}</p>
                <p className="text-[10px] text-slate-400 truncate">{profileRole}</p>
              </div>
            </div>

            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out"
              className="w-full flex items-center justify-center p-2 rounded-xl text-rose-500 hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
