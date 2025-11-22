import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
    ArrowUpRight,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Plus,
    Zap,
    MoreHorizontal
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
                    <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link
                        href="/dashboard/composer"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary text-white font-medium shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Post
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-green-500 flex items-center">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +12%
                        </span>
                    </div>
                    <h3 className="text-muted-foreground text-sm font-medium">Scheduled Posts</h3>
                    <p className="text-3xl font-bold mt-1">{scheduledCount || 0}</p>
                </div>

                <div className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-green-500 flex items-center">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +5%
                        </span>
                    </div>
                    <h3 className="text-muted-foreground text-sm font-medium">Successfully Posted</h3>
                    <p className="text-3xl font-bold mt-1">{postedCount || 0}</p>
                </div>

                <div className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                            Last 30 days
                        </span>
                    </div>
                    <h3 className="text-muted-foreground text-sm font-medium">Failed Attempts</h3>
                    <p className="text-3xl font-bold mt-1">{failedCount || 0}</p>
                </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 bg-background border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h3 className="font-heading text-lg font-bold">Recent Activity</h3>
                        <Link href="/dashboard/calendar" className="text-sm text-primary hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-border">
                        {recentPosts?.map((post) => (
                            <div key={post.id} className="p-6 hover:bg-secondary/30 transition-colors flex items-start space-x-4">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${post.status === 'posted' ? 'bg-green-500' :
                                        post.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {post.content}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {post.status === 'scheduled' ? 'Scheduled for ' : 'Created on '}
                                        {new Date(post.scheduled_at || post.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${post.status === 'posted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                            post.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                        {post.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!recentPosts || recentPosts.length === 0) && (
                            <div className="p-12 text-center text-muted-foreground">
                                <Zap className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                                <p>No recent activity found.</p>
                                <Link href="/dashboard/composer" className="text-primary hover:underline mt-2 inline-block">
                                    Create your first post
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Promo */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary to-purple-700 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="font-heading text-lg font-bold mb-2">Upgrade to Pro</h3>
                        <p className="text-white/80 text-sm mb-4">
                            Unlock unlimited AI generations and advanced analytics.
                        </p>
                        <button className="w-full bg-white text-primary font-bold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                            View Plans
                        </button>
                    </div>

                    <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="font-heading text-lg font-bold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link href="/dashboard/accounts" className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors group">
                                <span className="text-sm font-medium">Connect Account</span>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                            </Link>
                            <Link href="/dashboard/composer" className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors group">
                                <span className="text-sm font-medium">Draft New Post</span>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                            </Link>
                            <Link href="/dashboard/settings" className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors group">
                                <span className="text-sm font-medium">Settings</span>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
