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
  CheckCircle2
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Quick Actions' | 'Channels' | 'AI Tools';
  subtitle?: string;
  icon: any;
  shortcut?: string;
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

  const navigateTo = (path: string) => {
    handleClose();
    router.push(path);
  };

  const allItems: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Dashboard Overview',
      category: 'Navigation',
      subtitle: 'Main workspace and scheduled posts feed',
      icon: LayoutDashboard,
      shortcut: 'G D',
      action: () => navigateTo('/dashboard'),
    },
    {
      id: 'nav-composer',
      title: 'Post Composer',
      category: 'Navigation',
      subtitle: 'Create, preview, and schedule multi-platform posts',
      icon: PenTool,
      shortcut: 'G C',
      action: () => navigateTo('/dashboard/composer'),
    },
    {
      id: 'nav-calendar',
      title: 'Content Calendar',
      category: 'Navigation',
      subtitle: 'Timeline agenda & month schedule view',
      icon: Calendar,
      shortcut: 'G K',
      action: () => navigateTo('/dashboard/calendar'),
    },
    {
      id: 'nav-analytics',
      title: 'Analytics & Intelligence',
      category: 'Navigation',
      subtitle: 'Reach, engagements, follower metrics, and best times',
      icon: TrendingUp,
      shortcut: 'G A',
      action: () => navigateTo('/dashboard/analytics'),
    },
    {
      id: 'nav-integrations',
      title: 'Channel Integrations',
      category: 'Navigation',
      subtitle: 'Real-time social connections & webhooks',
      icon: Globe,
      shortcut: 'G I',
      action: () => navigateTo('/dashboard'),
    },
    {
      id: 'nav-accounts',
      title: 'Connected Accounts',
      category: 'Navigation',
      subtitle: 'Manage OAuth permissions and profiles',
      icon: ShieldCheck,
      action: () => navigateTo('/dashboard/accounts'),
    },
    {
      id: 'nav-settings',
      title: 'Profile & Timezone Settings',
      category: 'Navigation',
      subtitle: 'Update user profile and workspace timezone',
      icon: Settings,
      shortcut: 'G S',
      action: () => navigateTo('/dashboard/settings'),
    },

    // Quick Actions
    {
      id: 'act-create-post',
      title: 'Schedule New Post',
      category: 'Quick Actions',
      subtitle: 'Open post creator modal',
      icon: Plus,
      shortcut: 'N',
      action: () => {
        handleClose();
        if (onOpenCreatePost) onOpenCreatePost();
        else router.push('/dashboard/composer');
      },
    },
    {
      id: 'act-simulator',
      title: 'Simulate Webhook Trigger',
      category: 'Quick Actions',
      subtitle: 'Test automated comment-to-DM flows',
      icon: Zap,
      action: () => {
        handleClose();
        if (onOpenSimulator) onOpenSimulator();
      },
    },

    // AI Tools
    {
      id: 'ai-auto-studio',
      title: 'AI Auto-Post Studio',
      category: 'AI Tools',
      subtitle: 'Generate bulk viral posts from custom prompts',
      icon: Sparkles,
      action: () => {
        handleClose();
        router.push('/dashboard/composer');
      },
    },
    {
      id: 'ai-trends',
      title: 'Discover Viral Trends',
      category: 'AI Tools',
      subtitle: 'Browse real-time hashtag ideas and hooks',
      icon: Bot,
      action: () => {
        handleClose();
        router.push('/dashboard/composer');
      },
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 sm:p-4 bg-black/50 backdrop-blur-xs font-sans animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[82dvh] flex flex-col shadow-2xl border-2 border-dashed border-[#CBD5E1] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-[#F5EFE8] flex items-center space-x-3 bg-[#FCFAF7]">
          <Search className="w-5 h-5 text-[#E05A2B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search (e.g. 'Composer', 'Calendar', 'Post')..."
            className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-hidden font-medium"
          />
          <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 bg-white border border-[#E2D9CF] rounded-lg text-[10px] font-mono text-[#64748B]">
            <span>ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto flex-1 max-h-[360px] divide-y divide-[#FAF8F5]">
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
                      ? 'bg-[#FFF0E6] text-[#E05A2B]'
                      : 'hover:bg-[#FAF8F5] text-[#1E293B]'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-[#E05A2B] text-white border-[#E05A2B]'
                          : 'bg-[#FCFAF7] text-[#64748B] border-[#E2D9CF]'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold truncate">{item.title}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                            isSelected
                              ? 'bg-white text-[#E05A2B]'
                              : 'bg-[#F0E8DF] text-[#64748B]'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.shortcut ? (
                    <span className="hidden sm:inline-block font-mono text-[10px] text-[#94A3B8] px-2 py-0.5 bg-white border border-[#E2D9CF] rounded-md shrink-0 ml-2">
                      {item.shortcut}
                    </span>
                  ) : (
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ml-2 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  )}
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-[#94A3B8]">
              No commands found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#F5EFE8] bg-[#FAF8F5] flex items-center justify-between text-[11px] text-[#94A3B8]">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E2D9CF] rounded text-[10px]">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E2D9CF] rounded text-[10px]">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E2D9CF] rounded text-[10px]">↵</kbd> to select
            </span>
          </div>
          <span className="font-medium text-[#E05A2B]">Buffermate Search</span>
        </div>
      </div>
    </div>
  );
}
