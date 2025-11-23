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
            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-slate-200 bg-white fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 lg:px-6">
                <div className="flex items-center space-x-8">
                    <div className="flex items-center">
                        <Zap className="w-6 h-6 text-primary mr-2" />
                        <span className="font-heading font-bold text-xl tracking-tight">Buffer</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-1">
                        {topNavigation.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`px-4 py-5 text-sm font-bold border-b-2 transition-colors ${isActive
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/composer" className="btn-primary flex items-center px-4 py-2 text-sm">
                        <Plus className="w-4 h-4 mr-1.5" /> New
                    </Link>
                    <div className="hidden md:flex items-center space-x-4 text-slate-500">
                        <button className="hover:text-slate-900"><Gift className="w-5 h-5" /></button>
                        <button className="hover:text-slate-900"><HelpCircle className="w-5 h-5" /></button>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 cursor-pointer" onClick={handleSignOut} title="Sign Out">
                            <User className="w-5 h-5" />
                        </div>
                    </div>
                    <button
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

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
                {/* Sidebar - Channels */}
                <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 top-16 border-r border-slate-200 bg-white z-40 overflow-y-auto">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Channels</h2>
                            <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                        </div>

                        <div className="space-y-1">
                            <button className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 rounded border-2 border-blue-600 grid grid-cols-2 gap-0.5 p-0.5 mr-3">
                                        <div className="bg-blue-600 rounded-[1px]"></div>
                                        <div className="bg-blue-600 rounded-[1px]"></div>
                                        <div className="bg-blue-600 rounded-[1px]"></div>
                                        <div className="bg-blue-600 rounded-[1px]"></div>
                                    </div>
                                    All Channels
                                </div>
                                <span className="text-xs font-bold">{accounts.length}</span>
                            </button>

                            {accounts.map((acc) => (
                                <button key={acc.id} className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md text-sm font-medium group transition-colors">
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 text-white text-[10px] font-bold ${acc.provider === 'x' ? 'bg-black' :
                                                acc.provider === 'linkedin' ? 'bg-[#0077b5]' :
                                                    acc.provider === 'facebook' ? 'bg-[#1877f2]' :
                                                        acc.provider === 'instagram' ? 'bg-pink-600' :
                                                            acc.provider === 'youtube' ? 'bg-red-600' :
                                                                'bg-slate-500'
                                            }`}>
                                            {acc.provider[0].toUpperCase()}
                                        </div>
                                        <span className="truncate max-w-[120px]">{acc.username || acc.provider}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 group-hover:text-slate-600">0</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 space-y-1">
                            <Link href="/dashboard/accounts" className="flex items-center px-3 py-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
                                <div className="w-5 h-5 rounded-full border border-dashed border-slate-400 flex items-center justify-center mr-3">
                                    <Plus className="w-3 h-3" />
                                </div>
                                Connect Channel
                            </Link>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <button className="flex items-center w-full px-3 py-2 text-slate-500 hover:text-slate-900 text-sm font-medium">
                                <ChevronDown className="w-4 h-4 mr-3" />
                                Show more channels
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto p-4 border-t border-slate-100">
                        <div className="space-y-1">
                            <button className="flex items-center w-full px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
                                <Settings className="w-4 h-4 mr-3" />
                                Manage Tags
                            </button>
                            <button className="flex items-center w-full px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
                                <Settings className="w-4 h-4 mr-3" />
                                Manage Channels
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 md:pl-64 min-h-[calc(100vh-4rem)] bg-slate-50 transition-all duration-300">
                    <div className="max-w-6xl mx-auto p-6 md:p-8 animate-[fade-in_0.5s_ease-out]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
