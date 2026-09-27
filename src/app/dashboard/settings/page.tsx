'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProfileSettingsView from '../components/ProfileSettingsView';
import PostSchedulerModal from '../components/PostSchedulerModal';
import SimulatorModal from '../components/SimulatorModal';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans antialiased text-[#1E293B]">
      {/* Sidebar */}
      <Sidebar
        currentTab="settings"
        onSelectTab={(tab) => {
          if (tab === 'overview') router.push('/dashboard');
          else router.push(`/dashboard?tab=${tab}`);
        }}
        onOpenCreateModal={() => setIsPostModalOpen(true)}
        onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
        onSignOut={handleSignOut}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* Header */}
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenPostModal={() => setIsPostModalOpen(true)}
          onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Content Body */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <ProfileSettingsView />
        </main>
      </div>

      {/* Modals */}
      <PostSchedulerModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSavePost={() => setIsPostModalOpen(false)}
      />

      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        automations={[]}
        onTriggerEvent={() => {}}
      />
    </div>
  );
}
