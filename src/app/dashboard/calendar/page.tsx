import { createClient } from '@/lib/supabase/server';
import { Calendar as CalendarIcon, Clock, MoreHorizontal } from 'lucide-react';

export default async function CalendarPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Please log in</div>;
    }

    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: true });

    // Group posts by date
    const groupedPosts: { [key: string]: any[] } = {};
    posts?.forEach((post: any) => {
        const date = new Date(post.scheduled_at).toLocaleDateString();
        if (!groupedPosts[date]) {
            groupedPosts[date] = [];
        }
        groupedPosts[date].push(post);
    });

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading text-3xl font-bold">Calendar</h1>
                    <p className="text-muted-foreground">View and manage your scheduled content timeline.</p>
                </div>
                <div className="flex items-center space-x-2 bg-secondary/50 p-1 rounded-lg">
                    <button className="px-3 py-1.5 bg-background shadow-sm rounded-md text-sm font-medium text-foreground">List</button>
                    <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">Month</button>
                </div>
            </div>

            <div className="space-y-8">
                {Object.keys(groupedPosts).length > 0 ? (
                    Object.entries(groupedPosts).map(([date, dayPosts]) => (
                        <div key={date} className="relative pl-8 border-l border-border">
                            <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-primary"></div>
                            <h3 className="text-lg font-bold mb-4">{date}</h3>
                            <div className="grid gap-4">
                                {dayPosts.map((post: any) => (
                                    <div key={post.id} className="bg-background border-2 border-dashed border-[#CBD5E1] rounded-xl p-5 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center text-xs text-muted-foreground mb-2">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {new Date(post.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <p className="text-foreground font-medium line-clamp-2 mb-3">
                                                    {post.content}
                                                </p>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${post.status === 'posted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                            post.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        }`}>
                                                        {post.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-secondary/20 rounded-xl border border-dashed border-border">
                        <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No scheduled posts</h3>
                        <p className="text-muted-foreground">Your calendar is empty. Start creating content!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
