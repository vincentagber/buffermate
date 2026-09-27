'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PenTool,
  Calendar,
  TrendingUp,
  Globe,
  Search,
  Plus
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenCommandPalette?: () => void;
  onOpenCreatePost?: () => void;
}

export default function MobileBottomNav({
  onOpenCommandPalette,
  onOpenCreatePost,
}: MobileBottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Home',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      label: 'Calendar',
      href: '/dashboard/calendar',
      icon: Calendar,
      active: pathname === '/dashboard/calendar',
    },
    {
      label: 'Post',
      href: '/dashboard/composer',
      icon: Plus,
      isPrimary: true,
      active: pathname === '/dashboard/composer',
    },
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: TrendingUp,
      active: pathname === '/dashboard/analytics',
    },
    {
      label: 'Channels',
      href: '/dashboard/accounts',
      icon: Globe,
      active: pathname === '/dashboard/accounts',
    },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2D9CF] px-2 py-1.5 shadow-2xl flex items-center justify-around font-sans">
      {navItems.map((item) => {
        if (item.isPrimary) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-[#E05A2B] hover:bg-[#C8491E] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 transition-transform active:scale-95 border-2 border-white">
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-[#E05A2B] mt-0.5">Create</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
              item.active
                ? 'text-[#E05A2B]'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className={`text-[10px] mt-0.5 ${item.active ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Quick Search Trigger */}
      {onOpenCommandPalette && (
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#64748B] hover:text-[#1E293B]"
          title="Search / Command Palette"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Search</span>
        </button>
      )}
    </nav>
  );
}
