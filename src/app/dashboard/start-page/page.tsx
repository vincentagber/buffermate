'use client';

import { Plus, Zap, Layout, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StartPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center py-8">
                <h1 className="font-heading text-3xl font-bold text-slate-900 mb-3">Good morning, Creator! ☀️</h1>
                <p className="text-slate-500 text-lg">Here's what's happening with your content today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard/composer" className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Create Post</h3>
                    <p className="text-sm text-slate-500">Draft a new post or use AI to generate content ideas.</p>
                </Link>

                <Link href="/dashboard/composer" className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Generate Ideas</h3>
                    <p className="text-sm text-slate-500">Let AI brainstorm your next viral campaign.</p>
                </Link>

                <Link href="/dashboard" className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-green-200 transition-all">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
                        <Layout className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Manage Queue</h3>
                    <p className="text-sm text-slate-500">Review and approve your scheduled content.</p>
                </Link>
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Connect more channels</h3>
                        <p className="text-slate-300 max-w-md">Expand your reach by connecting your TikTok, YouTube, and Instagram accounts.</p>
                    </div>
                    <Link href="/dashboard/accounts" className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors flex items-center">
                        Connect Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
            </div>
        </div>
    );
}
