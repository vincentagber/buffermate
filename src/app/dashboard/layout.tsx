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
    X
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
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Composer', href: '/dashboard/composer', icon: PenTool },
        { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
        { name: 'Accounts', href: '/dashboard/accounts', icon: Users },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-secondary/30 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-background border-r border-border">
                <div className="flex items-center h-16 px-6 border-b border-border">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight">Buffermate</span>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto py-6 px-3 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                                        }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-muted-foreground rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-50 bg-background border-b border-border flex items-center justify-between px-4 h-16">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-heading font-bold text-xl">Buffermate</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-md text-muted-foreground hover:bg-secondary"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-background pt-20 px-4">
                    <div className="space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center px-4 py-3 text-base font-medium rounded-lg ${pathname === item.href
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-secondary'
                                    }`}
                            >
                                <item.icon className="mr-4 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center px-4 py-3 text-base font-medium text-muted-foreground rounded-lg hover:bg-destructive/10 hover:text-destructive"
                        >
                            <LogOut className="mr-4 h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen transition-all duration-300 ease-in-out">
                <div className="max-w-7xl mx-auto p-6 md:p-8 animate-[fade-in_0.5s_ease-out]">
                    {children}
                </div>
            </main>
        </div>
    );
}
