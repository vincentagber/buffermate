'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CommandPalette from '@/components/dashboard/CommandPalette';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans text-[#1E293B] antialiased">
      {children}

      {/* Global Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenCreatePost={() => router.push('/dashboard/composer')}
      />

      {/* Mobile Sticky Bottom Nav */}
      <MobileBottomNav
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenCreatePost={() => router.push('/dashboard/composer')}
      />
    </div>
  );
}
