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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0F172A] antialiased">
      {children}

      {/* Global Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenCreatePost={() => router.push('/dashboard?create=true')}
      />

      {/* Mobile Sticky Bottom Nav */}
      <MobileBottomNav
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenCreatePost={() => router.push('/dashboard?create=true')}
      />
    </div>
  );
}
