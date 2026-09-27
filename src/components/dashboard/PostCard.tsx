'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    MoreHorizontal,
    ThumbsUp,
    MessageCircle,
    Eye,
    Share2,
    ArrowUpRight,
    Video,
    Image as ImageIcon,
    Trash2,
    Send,
    Edit3,
    Check,
    X,
    Loader2,
} from 'lucide-react';
import { format } from 'date-fns';

interface PostCardProps {
    post: any;
    onPostUpdated?: () => void;
}

export function PostCard({ post, onPostUpdated }: PostCardProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content || '');
    const [isLoading, setIsLoading] = useState(false);

    const isVideo = post.attachments && post.attachments.length > 0 && post.attachments[0].type === 'video';
    const hasMedia = post.attachments && post.attachments.length > 0;
    const thumbnailUrl = hasMedia ? post.attachments[0].thumbnail || post.attachments[0].url : null;

    const formattedDate = post.scheduled_at || post.created_at;
    let displayTime = '';
    try {
        displayTime = format(new Date(formattedDate), 'MMM d, h:mm a');
    } catch {
        displayTime = 'Scheduled';
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
            if (res.ok) {
                if (onPostUpdated) onPostUpdated();
                else router.refresh();
            } else {
                const data = await res.json();
                alert('Error: ' + (data.error || 'Failed to delete post'));
            }
        } catch {
            alert('Failed to delete post');
        } finally {
            setIsLoading(false);
            setIsMenuOpen(false);
        }
    };

    const handlePublishNow = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/social/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: post.id }),
            });
            if (res.ok) {
                if (onPostUpdated) onPostUpdated();
                else router.refresh();
            } else {
                const data = await res.json();
                alert('Publish error: ' + (data.error || 'Failed to publish'));
            }
        } catch {
            alert('Failed to publish post');
        } finally {
            setIsLoading(false);
            setIsMenuOpen(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim()) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/posts/${post.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editContent }),
            });
            if (res.ok) {
                setIsEditing(false);
                if (onPostUpdated) onPostUpdated();
                else router.refresh();
            } else {
                const data = await res.json();
                alert('Update error: ' + (data.error || 'Failed to update'));
            }
        } catch {
            alert('Failed to update post');
        } finally {
            setIsLoading(false);
        }
    };

    const getPlatformColor = (p?: string) => {
        switch (p) {
            case 'tiktok': return 'bg-black text-white';
            case 'linkedin': return 'bg-[#0077b5] text-white';
            case 'instagram': return 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white';
            case 'x':
            case 'twitter': return 'bg-slate-900 text-white';
            case 'facebook': return 'bg-[#1877f2] text-white';
            case 'youtube': return 'bg-red-600 text-white';
            default: return 'bg-blue-600 text-white';
        }
    };

    return (
        <div className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2.5 mb-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${getPlatformColor(post.platform)}`}>
                            {post.platform ? post.platform[0].toUpperCase() : 'B'}
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                            {displayTime}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                            post.status === 'posted'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : post.status === 'scheduled'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : post.status === 'draft'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                            {post.status || 'draft'}
                        </span>
                    </div>

                    {isEditing ? (
                        <div className="space-y-2 mb-4">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y min-h-[90px]"
                                placeholder="Edit post content..."
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md flex items-center shadow-xs"
                                >
                                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Check className="w-3.5 h-3.5 mr-1.5" />}
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setEditContent(post.content);
                                        setIsEditing(false);
                                    }}
                                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md flex items-center"
                                >
                                    <X className="w-3.5 h-3.5 mr-1" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-900 text-sm md:text-base mb-4 whitespace-pre-wrap leading-relaxed">
                            {post.content}
                        </p>
                    )}

                    {post.status === 'posted' && (
                        <div className="flex items-center space-x-6 text-slate-500 text-sm mb-4">
                            <div className="flex flex-col items-start">
                                <div className="flex items-center space-x-1.5 mb-0.5">
                                    <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs font-medium">Likes</span>
                                </div>
                                <span className="text-slate-900 font-bold text-sm">18</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="flex items-center space-x-1.5 mb-0.5">
                                    <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs font-medium">Comments</span>
                                </div>
                                <span className="text-slate-900 font-bold text-sm">3</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="flex items-center space-x-1.5 mb-0.5">
                                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs font-medium">Impressions</span>
                                </div>
                                <span className="text-slate-900 font-bold text-sm">242</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="flex items-center space-x-1.5 mb-0.5">
                                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs font-medium">Shares</span>
                                </div>
                                <span className="text-slate-900 font-bold text-sm">5</span>
                            </div>
                        </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                            {post.status === 'posted'
                                ? 'Published via Buffermate'
                                : post.status === 'draft'
                                ? 'Draft saved in Buffermate'
                                : 'Ready to publish'}
                        </span>
                        <div className="flex items-center space-x-2 relative">
                            {post.status === 'draft' ? (
                                <Link
                                    href={`/dashboard/composer?draftId=${post.id}`}
                                    className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
                                >
                                    <Edit3 className="w-3 h-3 mr-1.5" />
                                    Resume Draft
                                </Link>
                            ) : post.status !== 'posted' && (
                                <button
                                    onClick={handlePublishNow}
                                    disabled={isLoading}
                                    className="flex items-center px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Send className="w-3 h-3 mr-1.5" />}
                                    Publish Now
                                </button>
                            )}

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-md text-xs font-medium text-slate-700 flex items-center"
                            >
                                <Edit3 className="w-3 h-3 mr-1" />
                                Edit
                            </button>

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-1.5 border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50"
                                title="More options"
                            >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-8 z-30 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 animate-[fade-in_0.15s_ease-out]">
                                    <button
                                        onClick={handleDelete}
                                        disabled={isLoading}
                                        className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                                        Delete Post
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {hasMedia && (
                    <div className="w-40 sm:w-48 h-32 bg-slate-100 rounded-lg overflow-hidden relative shrink-0 border border-slate-200">
                        {thumbnailUrl ? (
                            <img src={thumbnailUrl} alt="Post media" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                {isVideo ? <Video className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                            </div>
                        )}
                        {isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-xs">
                                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
