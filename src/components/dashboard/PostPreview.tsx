'use client';

import React, { useState, useMemo } from 'react';
import {
    Twitter,
    Linkedin,
    Instagram,
    Facebook,
    Heart,
    MessageCircle,
    Repeat2,
    Share2,
    Bookmark,
    ThumbsUp,
    Send,
    MoreHorizontal,
    Globe,
    CheckCircle2,
    Eye,
    AlertCircle,
    Sparkles,
    Image as ImageIcon,
    Video,
    Smile,
    MessageSquare,
} from 'lucide-react';

export type PlatformType = 'x' | 'linkedin' | 'instagram' | 'facebook';

interface PostPreviewProps {
    content: string;
    mode?: 'text' | 'video';
    mediaUrl?: string;
    thumbnailUrl?: string;
    userName?: string;
    userHandle?: string;
    activePlatform?: PlatformType;
    onPlatformChange?: (platform: PlatformType) => void;
    connectedPlatforms?: string[];
}

const PLATFORMS: { id: PlatformType; name: string; icon: React.ElementType; limit: number; color: string }[] = [
    { id: 'x', name: 'X (Twitter)', icon: Twitter, limit: 280, color: 'text-slate-900' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, limit: 3000, color: 'text-[#0a66c2]' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, limit: 2200, color: 'text-[#e1306c]' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, limit: 5000, color: 'text-[#1877f2]' },
];

export function PostPreview({
    content,
    mode = 'text',
    mediaUrl,
    thumbnailUrl,
    userName = 'Alex Morgan',
    userHandle = 'alexmorgan',
    activePlatform: controlledPlatform,
    onPlatformChange,
    connectedPlatforms = [],
}: PostPreviewProps) {
    const [internalPlatform, setInternalPlatform] = useState<PlatformType>('x');
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showFullText, setShowFullText] = useState(false);

    const activePlatform = controlledPlatform || internalPlatform;

    const handleSelectPlatform = (plat: PlatformType) => {
        setInternalPlatform(plat);
        if (onPlatformChange) {
            onPlatformChange(plat);
        }
    };

    const currentPlatformConfig = PLATFORMS.find((p) => p.id === activePlatform) || PLATFORMS[0];
    const charCount = content ? content.length : 0;
    const isOverLimit = charCount > currentPlatformConfig.limit;
    const remainingChars = currentPlatformConfig.limit - charCount;

    // Detect hashtags and mentions count
    const hashtagCount = useMemo(() => {
        const matches = content.match(/#[a-zA-Z0-9_]+/g);
        return matches ? matches.length : 0;
    }, [content]);

    const mentionCount = useMemo(() => {
        const matches = content.match(/@[a-zA-Z0-9_]+/g);
        return matches ? matches.length : 0;
    }, [content]);

    // Format content with highlight for tags, mentions, and urls
    const renderFormattedText = (text: string, platform: PlatformType) => {
        if (!text) return null;

        // Special handling for X: highlight characters exceeding 280 limit
        if (platform === 'x' && text.length > 280) {
            const validPart = text.slice(0, 280);
            const overflowPart = text.slice(280);

            return (
                <span className="whitespace-pre-wrap leading-relaxed break-words">
                    {renderTokens(validPart, platform)}
                    <span className="bg-rose-100 text-rose-900 px-0.5 rounded font-medium">
                        {renderTokens(overflowPart, platform)}
                    </span>
                </span>
            );
        }

        return (
            <span className="whitespace-pre-wrap leading-relaxed break-words">
                {renderTokens(text, platform)}
            </span>
        );
    };

    const renderTokens = (text: string, platform: PlatformType) => {
        // Match urls, hashtags, and mentions
        const regex = /(https?:\/\/[^\s]+|#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g;
        const parts = text.split(regex);

        return parts.map((part, index) => {
            if (!part) return null;

            if (part.startsWith('http://') || part.startsWith('https://')) {
                return (
                    <span key={index} className="text-blue-500 hover:underline cursor-pointer">
                        {part}
                    </span>
                );
            }

            if (part.startsWith('#')) {
                const colorClass =
                    platform === 'x'
                        ? 'text-sky-500 hover:underline'
                        : platform === 'linkedin'
                        ? 'text-[#0a66c2] font-semibold hover:underline'
                        : platform === 'instagram'
                        ? 'text-blue-600 hover:underline'
                        : 'text-blue-600 hover:underline';
                return (
                    <span key={index} className={`${colorClass} cursor-pointer`}>
                        {part}
                    </span>
                );
            }

            if (part.startsWith('@')) {
                const colorClass =
                    platform === 'x'
                        ? 'text-sky-500 hover:underline font-medium'
                        : platform === 'linkedin'
                        ? 'text-[#0a66c2] font-semibold hover:underline'
                        : 'text-blue-600 hover:underline font-medium';
                return (
                    <span key={index} className={`${colorClass} cursor-pointer`}>
                        {part}
                    </span>
                );
            }

            return <React.Fragment key={index}>{part}</React.Fragment>;
        });
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            {/* Top Toolbar / Platform Tabs */}
            <div className="bg-white border-b border-slate-200 p-3 shrink-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 scrollbar-none">
                        {PLATFORMS.map((plat) => {
                            const Icon = plat.icon;
                            const isActive = activePlatform === plat.id;
                            const isConnected = connectedPlatforms.includes(plat.id);

                            return (
                                <button
                                    key={plat.id}
                                    type="button"
                                    onClick={() => handleSelectPlatform(plat.id)}
                                    className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                                        isActive
                                            ? 'bg-slate-900 text-white shadow-xs'
                                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 mr-1.5 ${isActive ? 'text-white' : plat.color}`} />
                                    <span>{plat.id === 'x' ? 'X' : plat.name}</span>
                                    {isConnected && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1.5" title="Connected" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Character limit badge */}
                    <div
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border shrink-0 flex items-center ${
                            isOverLimit
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : remainingChars < 30
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                        title={`${charCount} / ${currentPlatformConfig.limit} characters`}
                    >
                        {isOverLimit && <AlertCircle className="w-3 h-3 mr-1 text-rose-600 shrink-0" />}
                        <span>
                            {charCount}/{currentPlatformConfig.limit}
                        </span>
                    </div>
                </div>

                {/* Sub-bar with metadata insight */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center space-x-3">
                        <span>
                            <strong>{hashtagCount}</strong> {hashtagCount === 1 ? 'hashtag' : 'hashtags'}
                        </span>
                        <span>•</span>
                        <span>
                            <strong>{mentionCount}</strong> {mentionCount === 1 ? 'mention' : 'mentions'}
                        </span>
                    </div>
                    <span className="text-slate-400 italic">Live interactive preview</span>
                </div>
            </div>

            {/* Preview Stage */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto flex items-start justify-center">
                {/* 1. X (TWITTER) PREVIEW */}
                {activePlatform === 'x' && (
                    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-4 transition-all animate-[fade-in_0.2s_ease-out]">
                        {/* Header: Avatar, Name, Handle, Menu */}
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                            <div className="flex items-start space-x-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                                    {userName[0]?.toUpperCase() || 'A'}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center space-x-1">
                                        <span className="font-bold text-slate-900 text-sm truncate hover:underline cursor-pointer">
                                            {userName}
                                        </span>
                                        <span className="text-sky-500 shrink-0" title="Verified">
                                            <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-white" />
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500 truncate">
                                        <span>@{userHandle}</span>
                                        <span className="mx-1">·</span>
                                        <span>Just now</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="text-[15px] text-slate-900 my-3 font-normal leading-[1.45]">
                            {content ? (
                                renderFormattedText(content, 'x')
                            ) : (
                                <p className="text-slate-400 italic">
                                    Start typing in the composer to preview your post on X...
                                </p>
                            )}
                        </div>

                        {/* Warning if over character limit */}
                        {isOverLimit && (
                            <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center">
                                <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-rose-600 shrink-0" />
                                <span>
                                    Post exceeds X&apos;s 280-character limit by{' '}
                                    <strong className="font-bold">{charCount - 280}</strong> characters.
                                </span>
                            </div>
                        )}

                        {/* Media Attachment (Video/Image) */}
                        {mode === 'video' && (mediaUrl || thumbnailUrl) ? (
                            <div className="mb-3 rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video relative flex items-center justify-center">
                                {thumbnailUrl ? (
                                    <img
                                        src={thumbnailUrl}
                                        alt="Video Thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400">
                                        <Video className="w-10 h-10 mb-2 text-slate-500" />
                                        <span className="text-xs">Generated Video</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                                        <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[11px] border-l-white border-b-[7px] border-b-transparent ml-0.5" />
                                    </div>
                                </div>
                                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                                    0:45
                                </span>
                            </div>
                        ) : mediaUrl ? (
                            <div className="mb-3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-80">
                                <img src={mediaUrl} alt="Post media" className="w-full h-full object-cover" />
                            </div>
                        ) : null}

                        {/* Twitter Action Bar */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500 text-xs px-1">
                            <button
                                type="button"
                                className="flex items-center space-x-1.5 hover:text-sky-500 transition-colors group"
                            >
                                <div className="p-1.5 rounded-full group-hover:bg-sky-50 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                </div>
                                <span>2</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center space-x-1.5 hover:text-emerald-500 transition-colors group"
                            >
                                <div className="p-1.5 rounded-full group-hover:bg-emerald-50 transition-colors">
                                    <Repeat2 className="w-4 h-4" />
                                </div>
                                <span>5</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLiked(!isLiked)}
                                className={`flex items-center space-x-1.5 transition-colors group ${
                                    isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                                }`}
                            >
                                <div className="p-1.5 rounded-full group-hover:bg-rose-50 transition-colors">
                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                                </div>
                                <span>{isLiked ? 29 : 28}</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center space-x-1.5 hover:text-sky-500 transition-colors group"
                            >
                                <div className="p-1.5 rounded-full group-hover:bg-sky-50 transition-colors">
                                    <Eye className="w-4 h-4" />
                                </div>
                                <span>1.2K</span>
                            </button>
                            <div className="flex items-center space-x-1">
                                <button
                                    type="button"
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    className={`p-1.5 rounded-full transition-colors group hover:text-sky-500 hover:bg-sky-50 ${
                                        isBookmarked ? 'text-sky-500' : ''
                                    }`}
                                    aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
                                >
                                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-sky-500' : ''}`} />
                                </button>
                                <button
                                    type="button"
                                    className="p-1.5 rounded-full hover:text-sky-500 hover:bg-sky-50 transition-colors"
                                    aria-label="Share post"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. LINKEDIN PREVIEW */}
                {activePlatform === 'linkedin' && (
                    <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-4 transition-all animate-[fade-in_0.2s_ease-out]">
                        {/* Header: Author Info */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-start space-x-2.5 min-w-0">
                                <div className="w-11 h-11 rounded-full bg-[#0a66c2] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                                    {userName[0]?.toUpperCase() || 'A'}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center space-x-1">
                                        <span className="font-bold text-slate-900 text-sm truncate hover:text-[#0a66c2] hover:underline cursor-pointer">
                                            {userName}
                                        </span>
                                        <span className="text-slate-400 text-xs font-normal">• 1st</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate">
                                        Founder & Content Strategist • Building with Buffermate
                                    </p>
                                    <div className="flex items-center text-[11px] text-slate-400 mt-0.5">
                                        <span>Just now</span>
                                        <span className="mx-1">•</span>
                                        <Globe className="w-3 h-3 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 text-slate-400">
                                <button
                                    type="button"
                                    className="hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
                                    aria-label="More options"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="text-[14px] text-slate-800 my-3 font-normal leading-relaxed">
                            {content ? (
                                <div>
                                    {content.length > 260 && !showFullText ? (
                                        <>
                                            {renderFormattedText(content.slice(0, 260) + '...', 'linkedin')}
                                            <button
                                                type="button"
                                                onClick={() => setShowFullText(true)}
                                                className="text-slate-500 hover:text-[#0a66c2] text-xs font-semibold ml-1 cursor-pointer"
                                            >
                                                ...see more
                                            </button>
                                        </>
                                    ) : (
                                        renderFormattedText(content, 'linkedin')
                                    )}
                                </div>
                            ) : (
                                <p className="text-slate-400 italic">
                                    Start typing in the composer to preview your post on LinkedIn...
                                </p>
                            )}
                        </div>

                        {/* Media Attachment */}
                        {mode === 'video' && (mediaUrl || thumbnailUrl) ? (
                            <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video relative flex items-center justify-center">
                                {thumbnailUrl ? (
                                    <img
                                        src={thumbnailUrl}
                                        alt="Video Thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400">
                                        <Video className="w-10 h-10 mb-2 text-slate-500" />
                                        <span className="text-xs">Professional Video</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-[#0a66c2]/90 backdrop-blur-xs flex items-center justify-center text-white shadow-md">
                                        <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[11px] border-l-white border-b-[7px] border-b-transparent ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        ) : mediaUrl ? (
                            <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 max-h-80">
                                <img src={mediaUrl} alt="Post media" className="w-full h-full object-cover" />
                            </div>
                        ) : null}

                        {/* LinkedIn Reaction Stats */}
                        <div className="flex items-center justify-between text-xs text-slate-500 py-2 border-b border-slate-100">
                            <div className="flex items-center space-x-1.5">
                                <div className="flex -space-x-1 items-center">
                                    <span className="w-4 h-4 rounded-full bg-[#0a66c2] text-white flex items-center justify-center text-[9px] shadow-xs">
                                        <ThumbsUp className="w-2.5 h-2.5" />
                                    </span>
                                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] shadow-xs">
                                        <Heart className="w-2.5 h-2.5" />
                                    </span>
                                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] shadow-xs">
                                        <Sparkles className="w-2.5 h-2.5" />
                                    </span>
                                </div>
                                <span className="hover:text-[#0a66c2] hover:underline cursor-pointer text-[11px]">
                                    {isLiked ? 'You and 42 others' : '42'}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-[11px]">
                                <span className="hover:text-[#0a66c2] hover:underline cursor-pointer">
                                    8 comments
                                </span>
                                <span>•</span>
                                <span className="hover:text-[#0a66c2] hover:underline cursor-pointer">
                                    3 reposts
                                </span>
                            </div>
                        </div>

                        {/* LinkedIn Actions Bar */}
                        <div className="grid grid-cols-4 gap-1 pt-1 text-slate-600 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setIsLiked(!isLiked)}
                                className={`flex items-center justify-center py-2 px-1 rounded-md hover:bg-slate-100 transition-colors ${
                                    isLiked ? 'text-[#0a66c2]' : ''
                                }`}
                            >
                                <ThumbsUp className={`w-4 h-4 mr-1.5 ${isLiked ? 'fill-[#0a66c2]' : ''}`} />
                                <span className="hidden sm:inline">Like</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center py-2 px-1 rounded-md hover:bg-slate-100 transition-colors"
                            >
                                <MessageSquare className="w-4 h-4 mr-1.5" />
                                <span className="hidden sm:inline">Comment</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center py-2 px-1 rounded-md hover:bg-slate-100 transition-colors"
                            >
                                <Repeat2 className="w-4 h-4 mr-1.5" />
                                <span className="hidden sm:inline">Repost</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center py-2 px-1 rounded-md hover:bg-slate-100 transition-colors"
                            >
                                <Send className="w-4 h-4 mr-1.5" />
                                <span className="hidden sm:inline">Send</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. INSTAGRAM PREVIEW */}
                {activePlatform === 'instagram' && (
                    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all animate-[fade-in_0.2s_ease-out]">
                        {/* Header: Profile with Story Ring */}
                        <div className="flex items-center justify-between p-3 border-b border-slate-100">
                            <div className="flex items-center space-x-2.5">
                                <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
                                    <div className="w-8 h-8 rounded-full bg-white p-0.5">
                                        <div className="w-full h-full rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                                            {userName[0]?.toUpperCase() || 'A'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 leading-tight">
                                        {userHandle}
                                    </p>
                                    <p className="text-[10px] text-slate-500">Original audio</p>
                                </div>
                            </div>
                            <button type="button" className="text-slate-500 hover:text-slate-800" aria-label="More options">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Media Box */}
                        <div className="aspect-square bg-slate-900 text-white flex items-center justify-center relative overflow-hidden">
                            {mode === 'video' && (mediaUrl || thumbnailUrl) ? (
                                <img
                                    src={thumbnailUrl || mediaUrl}
                                    alt="Post media"
                                    className="w-full h-full object-cover"
                                />
                            ) : mediaUrl ? (
                                <img src={mediaUrl} alt="Post media" className="w-full h-full object-cover" />
                            ) : (
                                <div className="p-6 text-center text-slate-400 flex flex-col items-center">
                                    <ImageIcon className="w-12 h-12 mb-2 text-slate-600" />
                                    <span className="text-xs">Photo or Reel Preview</span>
                                </div>
                            )}
                            {mode === 'video' && (
                                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                                    <Video className="w-3.5 h-3.5" />
                                </div>
                            )}
                        </div>

                        {/* Action Toolbar */}
                        <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3 text-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsLiked(!isLiked)}
                                        className={`transition-transform active:scale-125 ${
                                            isLiked ? 'text-rose-500' : ''
                                        }`}
                                        aria-label={isLiked ? 'Unlike post' : 'Like post'}
                                    >
                                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
                                    </button>
                                    <button type="button" aria-label="Comment">
                                        <MessageCircle className="w-5 h-5" />
                                    </button>
                                    <button type="button" aria-label="Send">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    className={isBookmarked ? 'text-slate-900' : 'text-slate-800'}
                                    aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
                                >
                                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-slate-900' : ''}`} />
                                </button>
                            </div>

                            <p className="text-xs font-bold text-slate-900 mb-1">
                                {isLiked ? '1,421 likes' : '1,420 likes'}
                            </p>

                            {/* Caption */}
                            <div className="text-xs text-slate-900 leading-relaxed">
                                <span className="font-bold mr-1.5">{userHandle}</span>
                                {content ? (
                                    renderFormattedText(content, 'instagram')
                                ) : (
                                    <span className="text-slate-400 italic">Caption preview here...</span>
                                )}
                            </div>

                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-2">
                                Just now
                            </p>
                        </div>
                    </div>
                )}

                {/* 4. FACEBOOK PREVIEW */}
                {activePlatform === 'facebook' && (
                    <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-4 transition-all animate-[fade-in_0.2s_ease-out]">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2.5">
                                <div className="w-10 h-10 rounded-full bg-[#1877f2] text-white font-bold text-sm flex items-center justify-center shrink-0">
                                    {userName[0]?.toUpperCase() || 'A'}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 leading-tight hover:underline cursor-pointer">
                                        {userName}
                                    </h4>
                                    <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                        <span>Just now</span>
                                        <span className="mx-1">·</span>
                                        <Globe className="w-3 h-3 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                            <button type="button" className="text-slate-400 hover:text-slate-600" aria-label="More options">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div
                            className={`text-slate-900 mb-3 ${
                                content.length < 90 ? 'text-base font-normal' : 'text-sm'
                            }`}
                        >
                            {content ? (
                                renderFormattedText(content, 'facebook')
                            ) : (
                                <p className="text-slate-400 italic">
                                    Start typing in the composer to preview your post on Facebook...
                                </p>
                            )}
                        </div>

                        {/* Media Attachment */}
                        {mode === 'video' && (mediaUrl || thumbnailUrl) ? (
                            <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 bg-black aspect-video relative flex items-center justify-center">
                                {thumbnailUrl ? (
                                    <img
                                        src={thumbnailUrl}
                                        alt="Video Thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400">
                                        <Video className="w-10 h-10 mb-2 text-slate-500" />
                                        <span className="text-xs">Facebook Video</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-[#1877f2]/90 flex items-center justify-center text-white shadow-md">
                                        <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[11px] border-l-white border-b-[7px] border-b-transparent ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        ) : mediaUrl ? (
                            <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 max-h-80">
                                <img src={mediaUrl} alt="Post media" className="w-full h-full object-cover" />
                            </div>
                        ) : null}

                        {/* Reactions Bar */}
                        <div className="flex items-center justify-between text-xs text-slate-500 py-2 border-b border-slate-100">
                            <div className="flex items-center space-x-1.5">
                                <span className="w-4 h-4 rounded-full bg-[#1877f2] text-white flex items-center justify-center text-[9px]">
                                    <ThumbsUp className="w-2.5 h-2.5" />
                                </span>
                                <span>{isLiked ? 'You, Sarah and 19 others' : '20'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>4 comments</span>
                                <span>·</span>
                                <span>2 shares</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-3 gap-1 pt-1 text-slate-600 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setIsLiked(!isLiked)}
                                className={`flex items-center justify-center py-2 rounded-md hover:bg-slate-100 transition-colors ${
                                    isLiked ? 'text-[#1877f2]' : ''
                                }`}
                            >
                                <ThumbsUp className={`w-4 h-4 mr-1.5 ${isLiked ? 'fill-[#1877f2]' : ''}`} />
                                <span>Like</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center py-2 rounded-md hover:bg-slate-100 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4 mr-1.5" />
                                <span>Comment</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center py-2 rounded-md hover:bg-slate-100 transition-colors"
                            >
                                <Share2 className="w-4 h-4 mr-1.5" />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
