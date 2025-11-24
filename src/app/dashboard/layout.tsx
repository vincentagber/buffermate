'use client';
import './design/globals.css';
import Sidebar from '@/app/dashboard/components/Sidebar';
import Header from '@/app/dashboard/components/Header';

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
    BarChart3,
    Plus,
    ChevronDown,
    HelpCircle,
    Gift,
    User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [accounts, setAccounts] = useState<any[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchAccounts = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('social_accounts')
                    .select('*')
                    .eq('user_id', user.id);
                if (data) setAccounts(data);
            }
        };
        fetchAccounts();
    }, []);

    const topNavigation = [
        { name: 'Create', href: '/dashboard/composer' },
        { name: 'Publish', href: '/dashboard' },
        { name: 'Analyze', href: '/dashboard/analytics' },
        { name: 'Start Page', href: '/dashboard/start-page' }, // Placeholder
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
            <Header topNavigation={topNavigation} pathname={pathname} handleSignOut={handleSignOut} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-4 animate-[fade-in_0.2s_ease-out]">
                    <nav className="flex flex-col space-y-4">
                        {topNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-lg font-medium ${pathname === item.href ? 'text-blue-600' : 'text-slate-600'}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <hr className="border-slate-100" />
                        <button onClick={handleSignOut} className="text-lg font-medium text-red-600 text-left">
                            Sign Out
                        </button>
                    </nav>
                </div>
            )}

            <div className="flex flex-1 pt-16">
                <Sidebar accounts={accounts} />
                <main className="flex-1 md:pl-64 min-h-[calc(100vh-4rem)] bg-slate-50 transition-all duration-300">
                    <div className="max-w-6xl mx-auto p-6 md:p-8 animate-[fade-in_0.5s_ease-out]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
