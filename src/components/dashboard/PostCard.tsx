import { MoreHorizontal, ThumbsUp, MessageCircle, Eye, Share2, ArrowUpRight, Video, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

interface PostCardProps {
    post: any;
}

export function PostCard({ post }: PostCardProps) {
    const isVideo = post.attachments && post.attachments.length > 0 && post.attachments[0].type === 'video';
    const hasMedia = post.attachments && post.attachments.length > 0;
    const thumbnailUrl = hasMedia ? post.attachments[0].thumbnail || post.attachments[0].url : null;

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex-1 pr-6">
                    <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${post.platform === 'tiktok' ? 'bg-black' :
                                post.platform === 'linkedin' ? 'bg-[#0077b5]' :
                                    post.platform === 'instagram' ? 'bg-pink-600' :
                                        'bg-slate-500'
                            }`}>
                            {post.platform ? post.platform[0].toUpperCase() : 'S'}
                        </div>
                        <span className="text-xs text-slate-500">
                            {format(new Date(post.created_at), 'h:mm a')}
                        </span>
                    </div>

                    <p className="text-slate-900 text-base mb-4 line-clamp-3 whitespace-pre-wrap">
                        {post.content}
                    </p>

                    <div className="flex items-center space-x-6 text-slate-500 text-sm">
                        <div className="flex flex-col items-start">
                            <div className="flex items-center space-x-1.5 mb-1">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="font-medium">Likes</span>
                            </div>
                            <span className="text-slate-900 font-bold">1</span>
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="flex items-center space-x-1.5 mb-1">
                                <MessageCircle className="w-4 h-4" />
                                <span className="font-medium">Comments</span>
                            </div>
                            <span className="text-slate-900 font-bold">0</span>
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="flex items-center space-x-1.5 mb-1">
                                <Eye className="w-4 h-4" />
                                <span className="font-medium">Views</span>
                            </div>
                            <span className="text-slate-900 font-bold">9</span>
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="flex items-center space-x-1.5 mb-1">
                                <Share2 className="w-4 h-4" />
                                <span className="font-medium">Shares</span>
                            </div>
                            <span className="text-slate-900 font-bold">-</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Published via {post.platform || 'Buffer'}</span>
                        <div className="flex space-x-2">
                            <button className="flex items-center px-3 py-1.5 border border-slate-200 rounded text-xs font-medium text-slate-700 hover:bg-slate-50">
                                <ArrowUpRight className="w-3 h-3 mr-1.5" />
                                View Post
                            </button>
                            <button className="p-1.5 border border-slate-200 rounded text-slate-500 hover:bg-slate-50">
                                <MoreHorizontal className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {hasMedia && (
                    <div className="w-48 h-32 bg-slate-100 rounded-md overflow-hidden relative flex-shrink-0 border border-slate-200">
                        {thumbnailUrl ? (
                            <img src={thumbnailUrl} alt="Post media" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                {isVideo ? <Video className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                            </div>
                        )}
                        {isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
