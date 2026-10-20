'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  PenTool,
  Calendar,
  TrendingUp,
  Globe,
  Settings,
  Sparkles,
  Plus,
  Zap,
  Bot,
  Activity,
  LogOut,
  Command,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Crown,
  BarChart3,
  MessageSquare,
  DollarSign,
  Compass,
  FlaskConical,
  Radio,
  Layers,
  User,
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';

interface CommandItem {
  id: string;
  title: string;
  category: 'Workspace' | 'Engage & AI' | 'Growth' | 'Settings';
  subtitle?: string;
  icon: any;
  shortcut?: string;
  tabId?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenCreatePost?: () => void;
  onOpenSimulator?: () => void;
}

export default function CommandPalette({
  isOpen = false,
  onClose,
  onOpenCreatePost,
  onOpenSimulator,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(isOpen);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Global hotkey listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    setOpen(isOpen);
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    setQuery('');
    setSelectedIndex(0);
    if (onClose) onClose();
  };

  const navigateToTab = (tabId: string) => {
    handleClose();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('switch-dashboard-tab', { detail: { tab: tabId } })
      );
    }
  };

  const allItems: CommandItem[] = [
    // Workspace Category
    {
      id: 'nav-dashboard',
      title: 'Command Center Overview',
      category: 'Workspace',
      subtitle: 'Main workspace and scheduled posts feed',
      icon: LayoutDashboard,
      shortcut: 'G D',
      tabId: 'command-center',
      action: () => navigateToTab('command-center'),
    },
    {
      id: 'nav-analytics',
      title: 'Analytics & Audience Intelligence',
      category: 'Workspace',
      subtitle: 'Performance benchmarks, viral hook engagement & audience metrics',
      icon: BarChart3,
      shortcut: 'G A',
      tabId: 'analytics',
      action: () => {
        handleClose();
        router.push('/dashboard/analytics');
      },
    },
    {
      id: 'nav-reports',
      title: 'Reports & Intelligence',
      category: 'Workspace',
      subtitle: 'September 2026 performance, utilization & treatment revenue',
      icon: BarChart3,
      shortcut: 'G R',
      tabId: 'reports',
      action: () => navigateToTab('reports'),
    },
    {
      id: 'nav-calendar',
      title: 'Content Calendar',
      category: 'Workspace',
      subtitle: 'Timeline agenda & multi-channel scheduling',
      icon: Calendar,
      shortcut: 'G K',
      tabId: 'calendar',
      action: () => navigateToTab('calendar'),
    },
    {
      id: 'nav-memberships',
      title: 'Memberships & Retention',
      category: 'Workspace',
      subtitle: 'VIP client tiers, churn risk radar & rebooking funnels',
      icon: Crown,
      shortcut: 'G M',
      tabId: 'memberships',
      action: () => navigateToTab('memberships'),
    },

    // Engage & AI Category
    {
      id: 'nav-inbox',
      title: 'Unified Social Inbox',
      category: 'Engage & AI',
      subtitle: 'Live comments, DMs & auto-reply triage',
      icon: MessageSquare,
      shortcut: 'G I',
      tabId: 'inbox',
      action: () => navigateToTab('inbox'),
    },
    {
      id: 'nav-content-studio',
      title: 'Content Studio',
      category: 'Engage & AI',
      subtitle: 'AI copywriter, viral hook studio & caption generator',
      icon: PenTool,
      shortcut: 'G C',
      tabId: 'content-studio',
      action: () => navigateToTab('content-studio'),
    },
    {
      id: 'nav-creative-studio',
      title: 'Creative Studio',
      category: 'Engage & AI',
      subtitle: 'Visual templates, media assets & story layouts',
      icon: Sparkles,
      tabId: 'creative-studio',
      action: () => navigateToTab('creative-studio'),
    },

    // Growth Category
    {
      id: 'nav-roi-revenue',
      title: 'ROI & Revenue Attribution',
      category: 'Growth',
      subtitle: 'Closed revenue sourced from social touchpoints',
      icon: DollarSign,
      tabId: 'roi-revenue',
      action: () => navigateToTab('roi-revenue'),
    },
    {
      id: 'nav-experiments',
      title: 'Growth Experiments',
      category: 'Growth',
      subtitle: 'A/B hook testing, split traffic & algorithmic velocity',
      icon: FlaskConical,
      tabId: 'experiments',
      action: () => navigateToTab('experiments'),
    },

    // Settings Category
    {
      id: 'nav-integrations',
      title: 'Social Channel Integrations',
      category: 'Settings',
      subtitle: 'Meta Graph, TikTok Open API & real-time webhooks',
      icon: Layers,
      tabId: 'integrations',
      action: () => navigateToTab('integrations'),
    },
    {
      id: 'nav-settings',
      title: 'Profile & Account Settings',
      category: 'Settings',
      subtitle: 'Workspace tier, posting timezone & AI brand guidelines',
      icon: Settings,
      shortcut: 'G S',
      tabId: 'settings',
      action: () => navigateToTab('settings'),
    },
  ];

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Workspace':
        return 'bg-slate-100 text-slate-700';
      case 'Engage & AI':
        return 'bg-[#EDE9FE] text-[#6D28D9]';
      case 'Growth':
        return 'bg-[#EAF6DA] text-[#2D5018]';
      case 'Settings':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 sm:p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[82dvh] flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input (Reports Style) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center space-x-3 bg-white">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search (e.g. 'Reports', 'Inbox', 'ROI')..."
            className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />
          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 bg-slate-100 border border-slate-200/70 rounded-full text-[10px] font-mono text-slate-500 font-semibold shadow-2xs">
            <span>ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="p-2 sm:p-2.5 overflow-y-auto flex-1 max-h-[380px] space-y-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-slate-100/80 text-slate-900 shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? 'bg-[#161616] text-white border-[#161616] shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200/80'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getCategoryBadge(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-2">
                    {item.shortcut && (
                      <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400 font-semibold px-2 py-0.5 bg-white border border-slate-200/80 rounded-md shadow-2xs">
                        {item.shortcut}
                      </span>
                    )}
                    <ArrowRight
                      className={`w-3.5 h-3.5 text-slate-600 transition-opacity ${
                        isSelected ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No commands found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer (Clean Slate Aesthetic) */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200/80 rounded text-[10px] shadow-2xs">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200/80 rounded text-[10px] shadow-2xs">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200/80 rounded text-[10px] shadow-2xs">↵</kbd> to select
            </span>
          </div>
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>MedSpa Command · Soho clinic</span>
          </span>
        </div>
      </div>
    </div>
  );
}
