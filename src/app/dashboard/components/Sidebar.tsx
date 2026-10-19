'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  Megaphone,
  Calendar,
  CheckSquare,
  PenTool,
  Palette,
  MessageSquare,
  Radio,
  BarChart3,
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
  Plus
} from 'lucide-react';

// Socialyn / BufferMate Brand Logo with OS badge
export function BufferMateLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`${className} bg-[#10B981] rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
      </svg>
    </div>
  );
}

export const SocialFlowLogo = BufferMateLogo;

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
  onOpenSimulatorModal,
  onSignOut,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const handleItemClick = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const navSections: NavSection[] = [
    {
      items: [
        {
          id: 'command-center',
          alias: ['overview'],
          label: 'Command center',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      group: 'PLAN',
      items: [
        {
          id: 'goals',
          label: 'Goals',
          icon: Target,
          badge: 'NEW',
          badgeColor: 'bg-[#FEF3C7] text-[#D97706]',
        },
        {
          id: 'campaigns',
          label: 'Campaigns',
          icon: Megaphone,
          activeBg: 'bg-[#EEF2FF] text-[#6366F1]',
          activeIconColor: 'text-[#6366F1]',
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: Calendar,
        },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: CheckSquare,
        },
      ],
    },
    {
      group: 'CREATE',
      items: [
        {
          id: 'content-studio',
          alias: ['ai-autopilot'],
          label: 'Content studio',
          icon: PenTool,
        },
        {
          id: 'creative-studio',
          label: 'Creative studio',
          icon: Palette,
        },
      ],
    },
    {
      group: 'ENGAGE',
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
          id: 'listening',
          label: 'Listening & crisis',
          icon: Radio,
        },
      ],
    },
    {
      group: 'GROW',
      items: [
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
        },
        {
          id: 'competitors',
          label: 'Competitors',
          icon: Compass,
        },
        {
          id: 'experiments',
          label: 'Experiments',
          icon: FlaskConical,
        },
        {
          id: 'roi-revenue',
          label: 'ROI & revenue',
          icon: DollarSign,
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
    <div className="flex flex-col h-full bg-white border-r border-[#E2E8F0] transition-all duration-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 sm:px-5 border-b border-[#F1F5F9]">
        <div
          className="flex items-center space-x-2.5 cursor-pointer overflow-hidden"
          onClick={() => handleItemClick('command-center')}
        >
          <BufferMateLogo />
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-[#0F172A]">Socialyn</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#0F172A] text-white text-[10px] font-bold tracking-wider">
                OS
              </span>
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button on Desktop */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-colors"
            title={isCollapsed ? 'Maximize Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#6366F1]" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Close button on mobile drawer */}
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F8FAFC]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-2' : 'px-3 py-2'} space-y-3.5 scrollbar-thin`}>
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-0.5">
            {section.group && !isCollapsed && (
              <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
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
                  } rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? item.activeBg || 'bg-[#EEF2FF] text-[#6366F1]'
                      : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? item.activeIconColor || 'text-[#6366F1]' : 'text-[#64748B]'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wide shrink-0 ${
                        item.badgeColor || 'bg-[#FEF3C7] text-[#D97706]'
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
      </div>

      {/* Footer Profile & Settings */}
      <div className="p-3 border-t border-[#F1F5F9] space-y-1">
        <button
          onClick={() => handleItemClick('integrations')}
          title={isCollapsed ? 'Integrations' : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
          } rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors`}
        >
          <Layers className="w-4 h-4 text-[#64748B] shrink-0" />
          {!isCollapsed && <span className="ml-2.5">Integrations</span>}
        </button>

        <button
          onClick={() => handleItemClick('settings')}
          title={isCollapsed ? 'Settings' : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
          } rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors`}
        >
          <Settings className="w-4 h-4 text-[#64748B] shrink-0" />
          {!isCollapsed && <span className="ml-2.5">Settings</span>}
        </button>

        {onSignOut && (
          <button
            onClick={onSignOut}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
            } rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-colors`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="ml-2.5">Sign Out</span>}
          </button>
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
