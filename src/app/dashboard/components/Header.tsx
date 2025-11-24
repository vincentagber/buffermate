import Link from 'next/link';
import { Zap, Plus, Gift, HelpCircle, User, X, Menu } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
    topNavigation: { name: string; href: string }[];
    pathname: string;
    handleSignOut: () => Promise<void>;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Header({
    topNavigation,
    pathname,
    handleSignOut,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
}: HeaderProps) {
    return (
        <header className="h-16 border-b border-slate-200 bg-white fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 lg:px-6">
            {/* Left side – brand and navigation */}
            <div className="flex items-center space-x-8">
                <div className="flex items-center">
                    <Zap className="w-6 h-6 text-primary mr-2" />
                    <span className="font-heading font-bold text-xl tracking-tight">Buffer</span>
                </div>
                <nav className="hidden md:flex items-center space-x-1">
                    {topNavigation.map((item) => {
                        const isActive =
                            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-5 text-sm font-bold border-b-2 transition-colors ${isActive
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-600 hover:text-slate-900'}`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Right side – actions */}
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/composer" className="btn-primary flex items-center px-4 py-2 text-sm">
                    <Plus className="w-4 h-4 mr-1.5" /> New
                </Link>
                <div className="hidden md:flex items-center space-x-4 text-slate-500">
                    <button className="hover:text-slate-900">
                        <Gift className="w-5 h-5" />
                    </button>
                    <button className="hover:text-slate-900">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <div
                        className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 cursor-pointer"
                        onClick={handleSignOut}
                        title="Sign Out"
                    >
                        <User className="w-5 h-5" />
                    </div>
                </div>
                {/* Mobile menu toggle */}
                <button
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
        </header>
    );
}
