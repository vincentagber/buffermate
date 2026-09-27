'use client';

import { useState, useEffect, useRef } from 'react';
import { GeneratedTrend, GeneratedTime } from '@/lib/ai/types';
import { createClient } from '@/lib/supabase/client';
import {
    Send,
    Calendar as CalendarIcon,
    Image as ImageIcon,
    Smile,
    Sparkles,
    Loader2,
    X,
    Check,
    CheckCircle2,
    Video,
    PenTool,
    Wand2,
    Briefcase,
    Eye,
    Save,
    RotateCcw,
    Trash2,
    Cloud,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PostPreview, PlatformType } from '@/components/dashboard/PostPreview';

const QUICK_EMOJIS = ['🚀', '✨', '🔥', '💡', '📈', '👏', '🎯', '👇', '🎉', '❤️', '💼', '🧵'];

const SAMPLE_MEDIA = [
    { label: 'Workspace Tech', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80' },
    { label: 'Metrics & Charts', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80' },
    { label: 'Creative Design', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80' },
];

export const DRAFT_STORAGE_KEY = 'buffermate_composer_draft';

export type AutosaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved';

export interface ComposerDraft {
    draftId?: string;
    content: string;
    mode: 'text' | 'video';
    scheduledAt: string;
    selectedAccounts: string[];
    videoTopic: string;
    generatedScript: string;
    generatedVideoUrl: string;
    generatedThumbnailUrl: string;
    imageUrl: string;
    previewPlatform: PlatformType;
    lastSavedAt: string;
}

export default function ComposerPage() {
    const [mode, setMode] = useState<'text' | 'video'>('text');
    const [content, setContent] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [trends, setTrends] = useState<GeneratedTrend[]>([]);
    const [bestTimes, setBestTimes] = useState<GeneratedTime[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [videoStep, setVideoStep] = useState(1);
    const [videoTopic, setVideoTopic] = useState('');
    const [generatedScript, setGeneratedScript] = useState('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
    const [generatedThumbnailUrl, setGeneratedThumbnailUrl] = useState('');
    const [aiPrompt, setAiPrompt] = useState('');
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiTone, setAiTone] = useState('professional');
    const [professionalMode, setProfessionalMode] = useState(true);

    // Live preview and media state
    const [previewPlatform, setPreviewPlatform] = useState<PlatformType>('x');
    const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
    const [userName, setUserName] = useState('Alex Morgan');
    const [userHandle, setUserHandle] = useState('alexmorgan');
    const [imageUrl, setImageUrl] = useState('');
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [customImageUrl, setCustomImageUrl] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Autosave & Draft State
    const [saveStatus, setSaveStatus] = useState<AutosaveStatus>('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [draftPostId, setDraftPostId] = useState<string | null>(null);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [restoredBanner, setRestoredBanner] = useState<{
        show: boolean;
        time: string;
        wordCount: number;
        source: string;
    } | null>(null);

    // Refs for safe synchronous state tracking in debounced/interval/event handlers
    const initializedRef = useRef(false);
    const hasUnsavedRef = useRef(false);
    const isSyncingDbRef = useRef(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const latestStateRef = useRef<ComposerDraft | null>(null);

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        fetchAccounts();
        initDraft();
    }, []);

    async function fetchAccounts() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (user.user_metadata?.name) {
            setUserName(user.user_metadata.name);
            setUserHandle(user.user_metadata.name.toLowerCase().replace(/\s+/g, '_'));
        } else if (user.email) {
            const handle = user.email.split('@')[0];
            setUserHandle(handle);
            setUserName(handle.charAt(0).toUpperCase() + handle.slice(1));
        }

        const { data } = await supabase.from('social_accounts').select('*').eq('user_id', user.id);
        if (data) {
            setAccounts(data);
            setSelectedAccounts(data.map((a: any) => a.id));
        }
    }

    async function initDraft() {
        if (typeof window === 'undefined') return;

        // Check if loading a specific draft via query parameter (?draftId=...)
        const searchParams = new URLSearchParams(window.location.search);
        const urlDraftId = searchParams.get('draftId');

        if (urlDraftId) {
            try {
                const res = await fetch(`/api/posts/${urlDraftId}`);
                if (res.ok) {
                    const post = await res.json();
                    if (post) {
                        setDraftPostId(post.id);
                        if (post.content) setContent(post.content);
                        if (post.scheduled_at) {
                            try {
                                const dt = new Date(post.scheduled_at);
                                setScheduledAt(dt.toISOString().slice(0, 16));
                            } catch {}
                        }
                        if (Array.isArray(post.social_account_ids) && post.social_account_ids.length > 0) {
                            setSelectedAccounts(post.social_account_ids);
                        }
                        if (post.attachments && post.attachments.length > 0) {
                            const first = post.attachments[0];
                            if (first.type === 'video') {
                                setMode('video');
                                setGeneratedVideoUrl(first.url || '');
                                setGeneratedThumbnailUrl(first.thumbnail || '');
                            } else if (first.type === 'image' || first.url) {
                                setImageUrl(first.url);
                            }
                        }
                        const savedDate = new Date(post.updated_at || post.created_at || Date.now());
                        setLastSavedAt(savedDate);
                        setSaveStatus('saved');
                        setRestoredBanner({
                            show: true,
                            time: savedDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
                            wordCount: (post.content || '').trim().split(/\s+/).filter(Boolean).length,
                            source: 'drafts queue',
                        });
                        initializedRef.current = true;
                        return;
                    }
                }
            } catch (err) {
                console.warn('Failed to fetch draft by ID', err);
            }
        }

        // Check LocalStorage for previously saved draft
        try {
            const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
            if (raw) {
                const draft: ComposerDraft = JSON.parse(raw);
                const hasMeaningfulWork =
                    (draft.content && draft.content.trim().length > 0) ||
                    (draft.videoTopic && draft.videoTopic.trim().length > 0) ||
                    Boolean(draft.imageUrl) ||
                    Boolean(draft.generatedVideoUrl);

                if (hasMeaningfulWork) {
                    if (draft.draftId) setDraftPostId(draft.draftId);
                    if (draft.content) setContent(draft.content);
                    if (draft.mode) setMode(draft.mode);
                    if (draft.scheduledAt) setScheduledAt(draft.scheduledAt);
                    if (Array.isArray(draft.selectedAccounts) && draft.selectedAccounts.length > 0) {
                        setSelectedAccounts(draft.selectedAccounts);
                    }
                    if (draft.videoTopic) setVideoTopic(draft.videoTopic);
                    if (draft.generatedScript) setGeneratedScript(draft.generatedScript);
                    if (draft.generatedVideoUrl) setGeneratedVideoUrl(draft.generatedVideoUrl);
                    if (draft.generatedThumbnailUrl) setGeneratedThumbnailUrl(draft.generatedThumbnailUrl);
                    if (draft.imageUrl) setImageUrl(draft.imageUrl);
                    if (draft.previewPlatform) setPreviewPlatform(draft.previewPlatform);

                    const savedDate = draft.lastSavedAt ? new Date(draft.lastSavedAt) : new Date();
                    setLastSavedAt(savedDate);
                    setSaveStatus('saved');
                    setRestoredBanner({
                        show: true,
                        time: savedDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
                        wordCount: (draft.content || '').trim().split(/\s+/).filter(Boolean).length,
                        source: 'autosave backup',
                    });
                }
            }
        } catch (err) {
            console.warn('Failed to parse local draft', err);
        }

        initializedRef.current = true;
    }

    // Keep latestStateRef updated and handle autosave debouncing
    useEffect(() => {
        latestStateRef.current = {
            draftId: draftPostId || undefined,
            content,
            mode,
            scheduledAt,
            selectedAccounts,
            videoTopic,
            generatedScript,
            generatedVideoUrl,
            generatedThumbnailUrl,
            imageUrl,
            previewPlatform,
            lastSavedAt: new Date().toISOString(),
        };

        if (!initializedRef.current) return;

        const hasContent =
            content.trim().length > 0 ||
            videoTopic.trim().length > 0 ||
            Boolean(imageUrl) ||
            Boolean(generatedVideoUrl);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (!hasContent && !draftPostId) {
            const idleTimer = setTimeout(() => {
                setSaveStatus('idle');
            }, 0);
            return () => clearTimeout(idleTimer);
        }

        hasUnsavedRef.current = true;
        const unsavedTimer = setTimeout(() => {
            setSaveStatus('unsaved');
        }, 0);

        // Autosave debounced every 2.5 seconds after changes stop
        debounceTimerRef.current = setTimeout(() => {
            triggerAutosave(false);
        }, 2500);

        return () => {
            clearTimeout(unsavedTimer);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [
        content,
        mode,
        scheduledAt,
        selectedAccounts,
        videoTopic,
        generatedScript,
        generatedVideoUrl,
        generatedThumbnailUrl,
        imageUrl,
        previewPlatform,
        draftPostId,
    ]);

    // Background interval, unload handlers, and keyboard shortcut
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (hasUnsavedRef.current && latestStateRef.current) {
                try {
                    const payload = {
                        ...latestStateRef.current,
                        lastSavedAt: new Date().toISOString(),
                    };
                    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
                } catch {}
            }
        };

        // Periodic check every 12 seconds to ensure no data loss even during long typing sessions
        const periodicInterval = setInterval(() => {
            if (hasUnsavedRef.current) {
                triggerAutosave(true);
            }
        }, 12000);

        // Shortcut: Cmd/Ctrl + S to manually trigger draft save
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                triggerAutosave(true);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pagehide', handleBeforeUnload);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pagehide', handleBeforeUnload);
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(periodicInterval);
        };
    }, []);

    // Core autosave routine: saves to localStorage + database draft state
    async function triggerAutosave(syncToDb = false) {
        if (!latestStateRef.current) return;
        const current = latestStateRef.current;

        const hasContent =
            (current.content && current.content.trim().length > 0) ||
            (current.videoTopic && current.videoTopic.trim().length > 0) ||
            Boolean(current.imageUrl) ||
            Boolean(current.generatedVideoUrl);

        if (!hasContent && !current.draftId) {
            setSaveStatus('idle');
            hasUnsavedRef.current = false;
            return;
        }

        setSaveStatus('saving');

        const now = new Date();
        const payload: ComposerDraft = {
            ...current,
            lastSavedAt: now.toISOString(),
        };

        // 1. Immediately persist to LocalStorage for instant zero-latency preservation
        try {
            localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
        } catch (err) {
            console.warn('LocalStorage draft write error:', err);
        }

        // 2. Persist to database draft state (always on explicit save, or during periodic autosave)
        if (syncToDb || (hasContent && !isSyncingDbRef.current)) {
            isSyncingDbRef.current = true;
            try {
                const attachments = [];
                if (current.mode === 'video' && current.generatedVideoUrl) {
                    attachments.push({
                        type: 'video',
                        url: current.generatedVideoUrl,
                        thumbnail: current.generatedThumbnailUrl,
                    });
                } else if (current.imageUrl) {
                    attachments.push({ type: 'image', url: current.imageUrl });
                }

                const res = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: current.draftId,
                        content: current.mode === 'video' ? (current.videoTopic || 'Draft Video Post') : current.content,
                        scheduled_at: current.scheduledAt || new Date().toISOString(),
                        social_account_ids: current.selectedAccounts,
                        attachments,
                        status: 'draft',
                    }),
                });

                if (res.ok) {
                    const postData = await res.json();
                    if (postData?.id && !current.draftId) {
                        setDraftPostId(postData.id);
                        payload.draftId = postData.id;
                        try {
                            localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
                        } catch {}
                    }
                }
            } catch (err) {
                console.warn('Database draft sync failed:', err);
            } finally {
                isSyncingDbRef.current = false;
            }
        }

        hasUnsavedRef.current = false;
        setLastSavedAt(now);
        setSaveStatus('saved');
    }

    const handleManualSaveDraft = async () => {
        setIsSavingDraft(true);
        await triggerAutosave(true);
        setIsSavingDraft(false);
    };

    const handleDiscardDraft = async () => {
        const hasWork = content || videoTopic || imageUrl || generatedVideoUrl;
        if (hasWork) {
            if (!confirm('Are you sure you want to discard this draft? Your unsaved text, topics, and media will be cleared.')) {
                return;
            }
        }

        try {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch {}

        if (draftPostId) {
            try {
                await fetch(`/api/posts/${draftPostId}`, { method: 'DELETE' });
            } catch {}
        }

        setContent('');
        setVideoTopic('');
        setGeneratedScript('');
        setGeneratedVideoUrl('');
        setGeneratedThumbnailUrl('');
        setImageUrl('');
        setScheduledAt('');
        setDraftPostId(null);
        setSaveStatus('idle');
        setLastSavedAt(null);
        setRestoredBanner(null);
    };

    const toggleAccount = (id: string, providerName?: string) => {
        if (selectedAccounts.includes(id)) {
            setSelectedAccounts(selectedAccounts.filter(a => a !== id));
        } else {
            setSelectedAccounts([...selectedAccounts, id]);
            if (providerName) {
                const norm = providerName.toLowerCase() === 'twitter' ? 'x' : providerName.toLowerCase();
                if (['x', 'linkedin', 'instagram', 'facebook'].includes(norm)) {
                    setPreviewPlatform(norm as PlatformType);
                }
            }
        }
    };

    const handleInsertEmoji = (emoji: string) => {
        setContent(prev => prev + emoji);
        setShowEmojiPicker(false);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    const handlePost = async () => {
        if (!content && !generatedVideoUrl && !imageUrl) return;
        if (selectedAccounts.length === 0) {
            alert('Please select at least one account');
            return;
        }
        setLoading(true);
        try {
            const attachments = [];
            if (mode === 'video' && generatedVideoUrl) {
                attachments.push({ type: 'video', url: generatedVideoUrl, thumbnail: generatedThumbnailUrl });
            } else if (imageUrl) {
                attachments.push({ type: 'image', url: imageUrl });
            }

            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: draftPostId || undefined,
                    content: mode === 'video' ? `${videoTopic} (Video Post)` : content,
                    scheduled_at: scheduledAt || new Date().toISOString(),
                    social_account_ids: selectedAccounts,
                    attachments,
                    status: 'scheduled',
                }),
            });
            if (res.ok) {
                // Remove local draft backup once submitted/scheduled
                try {
                    localStorage.removeItem(DRAFT_STORAGE_KEY);
                } catch {}
                router.push('/dashboard');
                router.refresh();
            } else {
                const data = await res.json();
                alert('Error: ' + data.error);
            }
        } catch (err) {
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt) return;
        setGenerating(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: aiPrompt,
                    platform: 'all',
                    tone: aiTone,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(`AI generation failed: ${data.error || 'Unknown error'}`);
                console.error('AI generation error (status', res.status, '):', data);
                return;
            }
            if (data.suggestions && data.suggestions.length > 0) {
                setContent(data.suggestions[0].text);
                setShowAiModal(false);
            } else {
                alert('No suggestions returned');
            }
        } catch (err) {
            alert('Failed to generate content');
        } finally {
            setGenerating(false);
        }
    };

    const handleGenerateScript = async () => {
        if (!videoTopic) return;
        setGenerating(true);
        try {
            const res = await fetch('/api/ai/script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: videoTopic, tone: aiTone }),
            });
            const data = await res.json();
            if (data.script) {
                setGeneratedScript(data.script);
                setVideoStep(2);
            } else {
                alert('Script generation failed');
            }
        } catch (err) {
            alert('Failed to generate script');
        } finally {
            setGenerating(false);
        }
    };

    const handleGenerateVideo = async () => {
        if (!generatedScript) return;
        setGenerating(true);
        try {
            const res = await fetch('/api/ai/video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ script: generatedScript, style: 'cinematic' }),
            });
            const data = await res.json();
            if (data.video_url) {
                setGeneratedVideoUrl(data.video_url);
                setGeneratedThumbnailUrl(data.thumbnail_url);
                setVideoStep(3);
            } else {
                alert('Video generation failed');
            }
        } catch (err) {
            alert('Failed to generate video');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shrink-0">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-slate-900">Create Content</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Draft, preview in real-time across platforms, and schedule</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Autosave Status Indicator Badge */}
                    <div className="flex items-center">
                        {saveStatus === 'saving' && (
                            <span className="inline-flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 shadow-2xs animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin mr-1.5 text-blue-500" />
                                Autosaving draft...
                            </span>
                        )}
                        {saveStatus === 'saved' && (
                            <span
                                className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs"
                                title="Draft preserved in database and local storage"
                            >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1.5" />
                                Saved {lastSavedAt ? lastSavedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'just now'}
                            </span>
                        )}
                        {saveStatus === 'unsaved' && (
                            <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-1.5" />
                                Unsaved changes
                            </span>
                        )}
                        {saveStatus === 'idle' && (
                            <span className="inline-flex items-center text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                                <Cloud className="w-3 h-3 mr-1.5 text-slate-400" />
                                Autosave active
                            </span>
                        )}
                    </div>

                    {/* Mode Selector */}
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setMode('text')}
                            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                mode === 'text' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Text Post
                        </button>
                        <button
                            onClick={() => setMode('video')}
                            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center ${
                                mode === 'video' ? 'bg-white shadow-xs text-primary' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Video className="w-3.5 h-3.5 mr-1.5" /> Video Mode
                        </button>
                    </div>

                    {/* Mobile/Tablet Screen Toggle: Compose vs Preview */}
                    <div className="flex lg:hidden bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setMobileTab('editor')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                mobileTab === 'editor' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                            }`}
                        >
                            Compose
                        </button>
                        <button
                            onClick={() => setMobileTab('preview')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center ${
                                mobileTab === 'preview' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                            }`}
                        >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Preview
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Left Column (Editor & Setup) */}
                <div className={`lg:col-span-2 flex flex-col gap-4 min-h-0 ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
                    {/* Restored Draft Banner */}
                    {restoredBanner?.show && (
                        <div className="bg-blue-50/95 border border-blue-200/90 rounded-lg p-3 flex items-center justify-between gap-3 text-xs text-blue-900 shadow-xs animate-[fade-in_0.2s_ease-out] shrink-0">
                            <div className="flex items-center gap-2 min-w-0">
                                <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                                <span className="truncate">
                                    Restored unsaved draft from <strong>{restoredBanner.time}</strong> ({restoredBanner.wordCount} words from {restoredBanner.source}). Your progress is safe.
                                </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleDiscardDraft}
                                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline px-1.5 py-0.5 transition-colors"
                                >
                                    Discard Draft
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRestoredBanner(null)}
                                    className="p-1 text-blue-500 hover:text-blue-800 rounded transition-colors"
                                    title="Dismiss alert"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Account Selector */}
                    <div className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-lg p-3 shadow-xs shrink-0">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2 shrink-0">Post to:</span>
                            {accounts.length > 0 ? (
                                accounts.map((acc) => {
                                    const isSelected = selectedAccounts.includes(acc.id);
                                    return (
                                        <button
                                            key={acc.id}
                                            onClick={() => toggleAccount(acc.id, acc.provider)}
                                            className={`flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                                                isSelected
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {acc.provider === 'x' ? 'X (Twitter)' : acc.provider.toUpperCase()}
                                            {isSelected && <Check className="w-3 h-3 ml-1.5" />}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-slate-400 italic">No accounts connected</p>
                            )}
                        </div>
                    </div>

                    {/* Editor */}
                    {mode === 'text' ? (
                        <div className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-lg shadow-xs flex flex-col flex-1 min-h-0">
                            {/* Toolbar */}
                            <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/60 rounded-t-lg">
                                <div className="flex items-center space-x-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowImagePicker(!showImagePicker)}
                                        className={`p-1.5 rounded transition-colors ${
                                            showImagePicker || imageUrl
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                        }`}
                                        title="Attach Image"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className={`p-1.5 rounded transition-colors ${
                                            showEmojiPicker
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                        }`}
                                        title="Add Emoji"
                                    >
                                        <Smile className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowAiModal(true)}
                                    className="text-xs flex items-center text-primary font-semibold hover:bg-blue-50 px-2.5 py-1.5 rounded-md transition-colors"
                                >
                                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Assist
                                </button>
                            </div>

                            {/* Quick Emoji Bar */}
                            {showEmojiPicker && (
                                <div className="p-2 bg-amber-50/70 border-b border-amber-200/60 flex items-center gap-1.5 overflow-x-auto animate-[fade-in_0.15s_ease-out]">
                                    <span className="text-[11px] font-semibold text-amber-800 mr-1 shrink-0">Quick Emojis:</span>
                                    {QUICK_EMOJIS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => handleInsertEmoji(emoji)}
                                            className="w-7 h-7 flex items-center justify-center hover:bg-amber-100 rounded-md text-base transition-transform active:scale-110 shrink-0"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Image Picker Dropdown */}
                            {showImagePicker && (
                                <div className="p-3 bg-blue-50/60 border-b border-blue-200/70 space-y-2 animate-[fade-in_0.15s_ease-out]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-blue-950">Attach Image to Post</span>
                                        <button
                                            type="button"
                                            onClick={() => setShowImagePicker(false)}
                                            className="text-xs text-blue-600 hover:text-blue-900"
                                        >
                                            Close
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            placeholder="Paste image URL (e.g., https://...)"
                                            value={customImageUrl}
                                            onChange={(e) => setCustomImageUrl(e.target.value)}
                                            className="flex-1 px-2.5 py-1.5 text-xs border border-blue-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (customImageUrl) {
                                                    setImageUrl(customImageUrl);
                                                    setCustomImageUrl('');
                                                    setShowImagePicker(false);
                                                }
                                            }}
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold"
                                        >
                                            Attach
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                                        <span className="text-[11px] text-slate-500 shrink-0">Sample Images:</span>
                                        {SAMPLE_MEDIA.map((item, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    setImageUrl(item.url);
                                                    setShowImagePicker(false);
                                                }}
                                                className="text-[11px] font-medium text-blue-700 hover:underline bg-white border border-blue-200 px-2 py-0.5 rounded shrink-0"
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Main Textarea with Real-Time Typing */}
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What would you like to share? Start typing to preview in real-time..."
                                className="w-full flex-1 p-4 resize-none focus:outline-none bg-transparent text-base leading-relaxed text-slate-800 placeholder:text-slate-400"
                            />

                            {/* Footer info and limits */}
                            <div className="p-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/40 rounded-b-lg">
                                <div className="flex items-center space-x-3 text-xs text-slate-500">
                                    <span>
                                        <strong className="font-semibold text-slate-800">{content.length}</strong> chars
                                    </span>
                                    <span>•</span>
                                    <span
                                        className={
                                            content.length > 280
                                                ? 'text-rose-600 font-bold'
                                                : content.length > 250
                                                ? 'text-amber-600 font-semibold'
                                                : 'text-slate-500'
                                        }
                                    >
                                        X: {280 - content.length >= 0 ? `${280 - content.length} left` : `${content.length - 280} over`}
                                    </span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="hidden sm:inline text-slate-400">LinkedIn: 3,000 max</span>
                                </div>

                                {imageUrl && (
                                    <div className="flex items-center space-x-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                                        <span className="font-medium">Media attached</span>
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl('')}
                                            className="text-blue-500 hover:text-rose-600 font-bold ml-1 p-0.5"
                                            title="Remove attachment"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-lg shadow-xs flex flex-col flex-1 min-h-0 overflow-hidden">
                            {/* Stepper */}
                            <div className="flex border-b border-slate-100 bg-slate-50/50">
                                {[1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className={`flex-1 py-3 text-center text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                                            videoStep >= step ? 'border-primary text-primary' : 'border-transparent text-slate-400'
                                        }`}
                                    >
                                        Step {step}: {step === 1 ? 'Script' : step === 2 ? 'Production' : 'Review'}
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto">
                                {videoStep === 1 && (
                                    <div className="space-y-6 max-w-lg mx-auto animate-[fade-in_0.3s_ease-out]">
                                        <div className="text-center space-y-2">
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-primary">
                                                <PenTool className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">Script Generation</h3>
                                            <p className="text-sm text-slate-500">Enter a topic and let AI write your script.</p>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-slate-700">Topic or Idea</label>
                                            <textarea
                                                value={videoTopic}
                                                onChange={(e) => setVideoTopic(e.target.value)}
                                                placeholder="e.g., 5 tips for remote work productivity..."
                                                className="w-full h-32 p-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-1">Tone</label>
                                                <select
                                                    value={aiTone}
                                                    onChange={(e) => setAiTone(e.target.value)}
                                                    className="w-full p-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                >
                                                    <option value="professional">Professional</option>
                                                    <option value="witty">Witty</option>
                                                    <option value="urgent">Urgent</option>
                                                    <option value="empathetic">Empathetic</option>
                                                    <option value="neutral">Neutral</option>
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <div
                                                    className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${
                                                        professionalMode ? 'bg-primary' : 'bg-slate-300'
                                                    }`}
                                                    onClick={() => setProfessionalMode(!professionalMode)}
                                                >
                                                    <div
                                                        className={`w-3 h-3 bg-white rounded-full shadow-xs transition-transform ${
                                                            professionalMode ? 'translate-x-4' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleGenerateScript}
                                            disabled={generating || !videoTopic}
                                            className="btn-primary w-full flex items-center justify-center py-2.5"
                                        >
                                            {generating ? (
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            ) : (
                                                <Sparkles className="w-4 h-4 mr-2" />
                                            )}
                                            {generating ? 'Generating Script...' : 'Generate Script'}
                                        </button>
                                    </div>
                                )}
                                {videoStep === 2 && (
                                    <div className="space-y-6 h-full flex flex-col animate-[fade-in_0.3s_ease-out]">
                                        <h3 className="text-lg font-bold text-slate-900">Review Script</h3>
                                        <div className="flex-1 p-4 border border-slate-200 rounded-md bg-slate-50 overflow-y-auto text-sm leading-relaxed text-slate-700 font-mono">
                                            {generatedScript}
                                        </div>
                                        <div className="flex space-x-3 pt-2">
                                            <button
                                                onClick={() => setVideoStep(1)}
                                                className="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleGenerateVideo}
                                                disabled={generating}
                                                className="flex-1 btn-primary flex items-center justify-center"
                                            >
                                                {generating ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                ) : (
                                                    <Video className="w-4 h-4 mr-2" />
                                                )}
                                                {generating ? 'Producing Video...' : 'Produce Video'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {videoStep === 3 && (
                                    <div className="space-y-6 h-full flex flex-col animate-[fade-in_0.3s_ease-out]">
                                        <h3 className="text-lg font-bold text-slate-900">Final Review</h3>
                                        <div className="flex-1 bg-black rounded-lg overflow-hidden relative group flex items-center justify-center">
                                            <video
                                                src={generatedVideoUrl}
                                                controls
                                                className="max-h-full max-w-full"
                                                poster={generatedThumbnailUrl}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <button
                                                onClick={() => setVideoStep(2)}
                                                className="text-sm text-slate-500 hover:text-slate-900 hover:underline"
                                            >
                                                Regenerate
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Scheduling & Actions */}
                    <div className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-lg p-4 shadow-xs shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center w-full sm:w-auto bg-slate-50 rounded-md border border-slate-200 px-3 py-2">
                            <CalendarIcon className="w-4 h-4 text-slate-400 mr-3" />
                            <input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                className="bg-transparent text-sm focus:outline-none text-slate-700 w-full"
                            />
                        </div>
                        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
                            {scheduledAt && (
                                <button
                                    type="button"
                                    onClick={() => setScheduledAt('')}
                                    className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors px-1"
                                >
                                    Clear Time
                                </button>
                            )}
                            {(content || videoTopic || imageUrl || generatedVideoUrl || draftPostId) && (
                                <button
                                    type="button"
                                    onClick={handleDiscardDraft}
                                    className="text-xs font-medium text-slate-500 hover:text-rose-600 flex items-center transition-colors px-2 py-1.5 rounded-md hover:bg-rose-50"
                                    title="Discard current draft"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                                    Discard
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleManualSaveDraft}
                                disabled={isSavingDraft || (!content && !videoTopic && !imageUrl && !generatedVideoUrl)}
                                className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-sm font-semibold flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                                title="Save as draft to finish later (Cmd/Ctrl + S)"
                            >
                                {isSavingDraft ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-1.5 text-slate-600" />
                                ) : (
                                    <Save className="w-4 h-4 mr-1.5 text-slate-500" />
                                )}
                                Save Draft
                            </button>
                            <button
                                onClick={handlePost}
                                disabled={loading || (mode === 'text' ? (!content && !imageUrl) : !generatedVideoUrl)}
                                className="flex-1 sm:flex-none btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        {scheduledAt ? 'Schedule Post' : 'Post Now'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Real-Time Post Preview */}
                <div className={`flex-col gap-4 min-h-0 ${mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
                    <PostPreview
                        content={mode === 'video' ? (videoTopic ? `${videoTopic}\n\n#video #creator` : '') : content}
                        mode={mode}
                        mediaUrl={mode === 'video' ? generatedVideoUrl : imageUrl}
                        thumbnailUrl={mode === 'video' ? generatedThumbnailUrl : imageUrl}
                        userName={userName}
                        userHandle={userHandle}
                        activePlatform={previewPlatform}
                        onPlatformChange={(plat) => setPreviewPlatform(plat)}
                        connectedPlatforms={accounts.map((a: any) =>
                            a.provider === 'twitter' ? 'x' : a.provider.toLowerCase()
                        )}
                    />
                </div>
            </div>
            {/* AI Modal (single) */}
            {showAiModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-[fade-in_0.2s_ease-out] border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-heading text-xl font-bold flex items-center text-slate-900"><Sparkles className="w-5 h-5 text-primary mr-2" /> AI Assistant</h3>
                            <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">What should this post be about?</label>
                                <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g., Announcing our new product launch..." className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Tone</label>
                                    <select value={aiTone} onChange={(e) => setAiTone(e.target.value)} className="w-full p-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20">
                                        <option value="professional">Professional</option>
                                        <option value="witty">Witty</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="empathetic">Empathetic</option>
                                        <option value="neutral">Neutral</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <div className={`w-full flex items-center justify-between p-2 border border-slate-200 rounded-md bg-slate-50`}>
                                        <span className="text-xs font-medium text-slate-600 flex items-center"><Briefcase className="w-3 h-3 mr-1.5" /> Pro Mode</span>
                                        <div className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${professionalMode ? 'bg-primary' : 'bg-slate-300'}`} onClick={() => setProfessionalMode(!professionalMode)}>
                                            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${professionalMode ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-8">
                                <button onClick={() => setShowAiModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Cancel</button>
                                <button onClick={handleGenerateAI} disabled={generating || !aiPrompt} className="btn-primary flex items-center">
                                    {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                    {generating ? 'Generating...' : 'Generate Content'}
                                </button>
                            </div>
                            {/* Trending Ideas Section */}
                            <div className="mt-6">
                                <button onClick={async () => {
                                    if (!aiPrompt) { alert('Enter a topic first'); return; }
                                    setGenerating(true);
                                    try {
                                        const res = await fetch('/api/ai/trends', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: aiPrompt }) });
                                        const data = await res.json();
                                        if (data.trends) setTrends(data.trends);
                                        else alert('No trends returned');
                                    } catch (e) { alert('Failed to fetch trends'); }
                                    setGenerating(false);
                                }} className="btn-primary w-full mb-2">Fetch Trending Ideas</button>
                                {trends.length > 0 && (
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-800">
                                        {trends.map((t, i) => (<li key={i}><strong>{t.topic}</strong>: {t.description} (Relevance: {t.relevance})</li>))}
                                    </ul>
                                )}
                            </div>
                            {/* Best Times Section */}
                            <div className="mt-6">
                                <button onClick={async () => {
                                    if (!aiPrompt) { alert('Enter a topic first'); return; }
                                    setGenerating(true);
                                    try {
                                        const res = await fetch('/api/ai/best-times', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: aiPrompt }) });
                                        const data = await res.json();
                                        if (data.times) setBestTimes(data.times);
                                        else alert('No times returned');
                                    } catch (e) { alert('Failed to fetch best times'); }
                                    setGenerating(false);
                                }} className="btn-primary w-full mb-2">Fetch Best Posting Times</button>
                                {bestTimes.length > 0 && (
                                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-800">
                                        {bestTimes.map((t, i) => (<li key={i}>{t.day} at {t.time} – {t.reason}</li>))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
