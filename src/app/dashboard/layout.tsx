'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    PenTool,
    Calendar,
    Users,
    Settings,
    LogOut,
    Zap,
    Menu,
    X,
    BarChart3
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const navigation = [
        { name: 'Publishing', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Create', href: '/dashboard/composer', icon: PenTool },
        { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
        { name: 'Channels', href: '/dashboard/accounts', icon: Users },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-secondary/50 flex font-sans">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-white border-r border-border shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="flex items-center h-16 px-6 border-b border-border/50">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight text-slate-900">Buffermate</span>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto py-6 px-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 text-primary'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'
                                        }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-border/50">
                    <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-50 bg-white border-b border-border flex items-center justify-between px-4 h-16 shadow-sm">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-heading font-bold text-xl text-slate-900">Buffermate</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-md text-slate-600 hover:bg-slate-100"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-4 animate-[fade-in_0.2s_ease-out]">
                    <div className="space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center px-4 py-3 text-base font-medium rounded-lg ${pathname === item.href
                                    ? 'bg-blue-50 text-primary'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <item.icon className="mr-4 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center px-4 py-3 text-base font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut className="mr-4 h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen transition-all duration-300 ease-in-out">
                <div className="max-w-7xl mx-auto p-6 md:p-10 animate-[fade-in_0.5s_ease-out]">
                    {children}
                </div>
            </main>
        </div>
    );
}
