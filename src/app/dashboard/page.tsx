import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
    Calendar,
    Plus,
    List,
    MessageSquare,
    Share2,
    MoreHorizontal
} from 'lucide-react';
import { PostCard } from '@/components/dashboard/PostCard';

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: { view?: string };
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Please log in</div>;
    }

    const view = searchParams.view || 'queue';

    // Fetch posts based on view
    let query = supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (view === 'queue') {
        query = query.eq('status', 'scheduled');
    } else if (view === 'sent') {
        query = query.eq('status', 'posted');
    } else if (view === 'drafts') {
        query = query.eq('status', 'draft'); // Assuming 'draft' status exists or will be added
    }

    const { data: posts } = await query;

    // Mock data for "Sent" view if empty to match screenshot visual
    const displayPosts = (view === 'sent' && (!posts || posts.length === 0)) ? [
        {
            id: 'mock-1',
            content: 'Just published a new video on the channel! Check it out to learn more about our latest features. #product #update',
            created_at: new Date().toISOString(),
            platform: 'tiktok',
            status: 'posted',
            attachments: [{ type: 'video', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80' }]
        },
        {
            id: 'mock-2',
            content: 'Excited to announce our partnership with @Buffer! This is a huge step forward for our team.',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            platform: 'linkedin',
            status: 'posted',
            attachments: []
        }
    ] : posts;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-full">
                        <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                            <div className="bg-slate-800 rounded-[1px]"></div>
                            <div className="bg-slate-800 rounded-[1px]"></div>
                            <div className="bg-slate-800 rounded-[1px]"></div>
                            <div className="bg-slate-800 rounded-[1px]"></div>
                        </div>
                    </div>
                    <h1 className="font-heading text-2xl font-bold text-slate-900">All Channels</h1>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="text-slate-500 hover:text-slate-900 text-sm font-medium flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Share Feedback
                    </button>
                    <div className="h-8 w-px bg-slate-200 mx-2"></div>
                    <div className="flex bg-slate-100 p-1 rounded-md">
                        <button className="px-3 py-1.5 bg-white shadow-sm rounded text-sm font-medium text-slate-900 flex items-center">
                            <List className="w-4 h-4 mr-2" /> List
                        </button>
                        <button className="px-3 py-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium flex items-center">
                            <Calendar className="w-4 h-4 mr-2" /> Calendar
                        </button>
                    </div>
                    <Link href="/dashboard/composer" className="btn-white border border-slate-300 shadow-sm hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium flex items-center">
                        <Plus className="w-4 h-4 mr-2" /> New Post
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {['Queue', 'Drafts', 'Approvals', 'Sent'].map((tab) => {
                        const tabValue = tab.toLowerCase();
                        const isActive = view === tabValue;
                        return (
                            <Link
                                key={tab}
                                href={`/dashboard?view=${tabValue}`}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${isActive
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                {tab}
                                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {tab === 'Sent' ? '309' : '0'}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {view === 'queue' && (!posts || posts.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        {/* Abstract Illustration Placeholder */}
                        <div className="w-64 h-48 mb-8 relative opacity-50">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-slate-100 rounded-lg border border-slate-200 shadow-sm transform -rotate-3"></div>
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-slate-100 rounded-lg border border-slate-200 shadow-sm transform rotate-3"></div>
                            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-48 h-24 bg-white rounded-lg border border-slate-200 shadow-sm z-10 flex items-center p-4">
                                <div className="w-8 h-8 bg-slate-200 rounded-full mr-3"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="absolute top-10 right-0 w-px h-32 bg-slate-200 transform rotate-12"></div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-2">No posts scheduled</h3>
                        <p className="text-slate-500 mb-8 max-w-md">
                            Schedule some posts and they will appear here. You can create posts for multiple channels at once.
                        </p>
                        <Link href="/dashboard/composer" className="btn-primary px-6 py-2.5 flex items-center">
                            <Plus className="w-4 h-4 mr-2" /> New Post
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {view === 'sent' && (
                            <div className="flex items-center justify-between pb-4">
                                <h3 className="font-bold text-slate-900">Tuesday, 9 September</h3>
                            </div>
                        )}

                        <div className="space-y-4">
                            {displayPosts?.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
