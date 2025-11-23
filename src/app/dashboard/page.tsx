import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
    ArrowUpRight,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Plus,
    Zap,
    MoreHorizontal,
    Clock,
    BarChart3
} from 'lucide-react';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Please log in</div>;
    }

    // Fetch stats (Mocking some for visual purpose as we might not have enough data)
    const { count: scheduledCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'scheduled');

    const { count: postedCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'posted');

    const { count: failedCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'failed');

    // Fetch recent posts
    const { data: recentPosts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-slate-900">Publishing</h1>
                    <p className="text-slate-500 mt-1">Manage your content schedule and performance.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link
                        href="/dashboard/composer"
                        className="btn-primary flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Post
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 rounded-md text-primary">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Queue</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Scheduled Posts</h3>
                    <p className="text-3xl font-bold mt-1 text-slate-900">{scheduledCount || 0}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 rounded-md text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Sent</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Successfully Posted</h3>
                    <p className="text-3xl font-bold mt-1 text-slate-900">{postedCount || 0}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-50 rounded-md text-red-500">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Errors</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Failed Attempts</h3>
                    <p className="text-3xl font-bold mt-1 text-slate-900">{failedCount || 0}</p>
                </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-heading text-lg font-bold text-slate-900">Recent Activity</h3>
                        <Link href="/dashboard/calendar" className="text-sm text-primary hover:underline font-medium">View Calendar</Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentPosts?.map((post) => (
                            <div key={post.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start space-x-4 group">
                                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${post.status === 'posted' ? 'bg-green-500' :
                                    post.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-primary transition-colors">
                                        {post.content}
                                    </p>
                                    <div className="flex items-center mt-1 space-x-2">
                                        <p className="text-xs text-slate-500">
                                            {post.status === 'scheduled' ? 'Scheduled for ' : 'Created on '}
                                            {new Date(post.scheduled_at || post.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${post.status === 'posted' ? 'bg-green-50 text-green-700 border border-green-100' :
                                        post.status === 'failed' ? 'bg-red-50 text-red-700 border border-red-100' :
                                            'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                        }`}>
                                        {post.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!recentPosts || recentPosts.length === 0) && (
                            <div className="p-12 text-center text-slate-500">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="font-medium text-slate-900">No recent activity</p>
                                <p className="text-sm mt-1 mb-4">Get started by creating your first post.</p>
                                <Link href="/dashboard/composer" className="text-primary hover:underline text-sm font-medium">
                                    Create Post
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Promo */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary to-blue-700 rounded-lg p-6 text-white shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="font-heading text-lg font-bold mb-2">Upgrade to Pro</h3>
                        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                            Unlock unlimited AI generations, advanced analytics, and team collaboration features.
                        </p>
                        <button className="w-full bg-white text-primary font-bold py-2.5 px-4 rounded-md text-sm hover:bg-blue-50 transition-colors shadow-sm">
                            View Plans
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                        <h3 className="font-heading text-lg font-bold mb-4 text-slate-900">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link href="/dashboard/accounts" className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200">
                                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Connect Account</span>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                            </Link>
                            <Link href="/dashboard/composer" className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200">
                                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Draft New Post</span>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                            </Link>
                            <Link href="/dashboard/settings" className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200">
                                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Settings</span>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
