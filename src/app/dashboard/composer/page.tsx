'use client';

import { useState, useEffect } from 'react';
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
    CheckCircle,
    Video,
    PenTool,
    PlayCircle,
    Wand2,
    ChevronRight,
    LayoutTemplate,
    Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ComposerPage() {
    const [mode, setMode] = useState<'text' | 'video'>('text');
    const [content, setContent] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

    // Video Mode State
    const [videoStep, setVideoStep] = useState(1); // 1: Script, 2: Visuals, 3: Review
    const [videoTopic, setVideoTopic] = useState('');
    const [generatedScript, setGeneratedScript] = useState('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
    const [generatedThumbnailUrl, setGeneratedThumbnailUrl] = useState('');

    const [aiPrompt, setAiPrompt] = useState('');
    const [showAiModal, setShowAiModal] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        fetchAccounts();
    }, []);

    async function fetchAccounts() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('social_accounts')
            .select('*')
            .eq('user_id', user.id);

        if (data) {
            setAccounts(data);
            setSelectedAccounts(data.map(a => a.id));
        }
    }

    const handlePost = async () => {
        if (!content && !generatedVideoUrl) return;
        if (selectedAccounts.length === 0) {
            alert('Please select at least one account');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: mode === 'video' ? `${videoTopic} (Video Post)` : content,
                    scheduled_at: scheduledAt || new Date().toISOString(),
                    social_account_ids: selectedAccounts,
                    attachments: generatedVideoUrl ? [{ type: 'video', url: generatedVideoUrl, thumbnail: generatedThumbnailUrl }] : [],
                }),
            });

            if (res.ok) {
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
                body: JSON.stringify({ topic: aiPrompt, platform: 'all' }),
            });
            const data = await res.json();
            if (data.suggestions && data.suggestions.length > 0) {
                setContent(data.suggestions[0].text);
                setShowAiModal(false);
            }
        } catch (err) {
            alert('Failed to generate content');
        } finally {
            setGenerating(false);
        }
    };

    // Video Workflow Handlers
    const handleGenerateScript = async () => {
        if (!videoTopic) return;
        setGenerating(true);
        try {
            const res = await fetch('/api/ai/script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: videoTopic, tone: 'engaging' }),
            });
            const data = await res.json();
            if (data.script) {
                setGeneratedScript(data.script);
                setVideoStep(2);
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
            }
        } catch (err) {
            alert('Failed to generate video');
        } finally {
            setGenerating(false);
        }
    };

    const toggleAccount = (id: string) => {
        if (selectedAccounts.includes(id)) {
            setSelectedAccounts(selectedAccounts.filter(a => a !== id));
        } else {
            setSelectedAccounts([...selectedAccounts, id]);
        }
    };

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-slate-900">Create Content</h1>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                        onClick={() => setMode('text')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'text' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Text Post
                    </button>
                    <button
                        onClick={() => setMode('video')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center ${mode === 'video' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <Video className="w-3.5 h-3.5 mr-2" />
                        Video Mode
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Left Column: Editor / Workflow */}
                <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
                    {/* Account Selector */}
                    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm shrink-0">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Post to:</span>
                            {accounts.length > 0 ? accounts.map((acc) => (
                                <button
                                    key={acc.id}
                                    onClick={() => toggleAccount(acc.id)}
                                    className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${selectedAccounts.includes(acc.id)
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {acc.provider === 'x' ? 'X (Twitter)' : acc.provider}
                                    {selectedAccounts.includes(acc.id) && <Check className="w-3 h-3 ml-1.5" />}
                                </button>
                            )) : (
                                <p className="text-xs text-slate-400 italic">No accounts connected</p>
                            )}
                        </div>
                    </div>

                    {mode === 'text' ? (
                        /* TEXT MODE */
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col flex-1 min-h-0">
                            <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                <div className="flex space-x-1">
                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors" title="Add Image">
                                        <ImageIcon className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors" title="Add Emoji">
                                        <Smile className="w-4 h-4" />
                                    </button>
                                </div>
                                <button onClick={() => setShowAiModal(true)} className="text-xs flex items-center text-primary font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                                    <Sparkles className="w-3 h-3 mr-1.5" /> AI Assist
                                </button>
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What would you like to share?"
                                className="w-full flex-1 p-4 resize-none focus:outline-none bg-transparent text-base leading-relaxed text-slate-800 placeholder:text-slate-400"
                            />
                            <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 rounded-b-lg">
                                <span className="text-xs text-slate-400 font-medium">
                                    {content.length} chars
                                </span>
                            </div>
                        </div>
                    ) : (
                        /* VIDEO MODE */
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
                            {/* Stepper */}
                            <div className="flex border-b border-slate-100 bg-slate-50/50">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className={`flex-1 py-3 text-center text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${videoStep >= step ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>
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
                                        <button
                                            onClick={handleGenerateScript}
                                            disabled={generating || !videoTopic}
                                            className="w-full btn-primary flex items-center justify-center py-2.5"
                                        >
                                            {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                            Generate Script
                                        </button>
                                    </div>
                                )}

                                {videoStep === 2 && (
                                    <div className="space-y-6 h-full flex flex-col animate-[fade-in_0.3s_ease-out]">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-slate-900">Review Script</h3>
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">OpenAI Generated</span>
                                        </div>
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
                                                {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Video className="w-4 h-4 mr-2" />}
                                                Produce Video
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {videoStep === 3 && (
                                    <div className="space-y-6 h-full flex flex-col animate-[fade-in_0.3s_ease-out]">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-slate-900">Final Review</h3>
                                            <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium">
                                                <CheckCircle className="w-3 h-3 mr-1.5" /> Ready
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-black rounded-lg overflow-hidden relative group flex items-center justify-center">
                                            <video src={generatedVideoUrl} controls className="max-h-full max-w-full" poster={generatedThumbnailUrl} />
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
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center w-full sm:w-auto bg-slate-50 rounded-md border border-slate-200 px-3 py-2">
                            <CalendarIcon className="w-4 h-4 text-slate-400 mr-3" />
                            <input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                className="bg-transparent text-sm focus:outline-none text-slate-700 w-full"
                            />
                        </div>
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                            {scheduledAt && (
                                <button
                                    onClick={() => setScheduledAt('')}
                                    className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={handlePost}
                                disabled={loading || (mode === 'text' ? !content : !generatedVideoUrl)}
                                className="flex-1 sm:flex-none btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        {scheduledAt ? 'Schedule Post' : 'Post Now'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview */}
                <div className="hidden lg:flex flex-col gap-4 min-h-0">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-900 text-sm flex items-center">
                                <LayoutTemplate className="w-4 h-4 mr-2 text-slate-400" />
                                Preview
                            </h3>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-w-sm mx-auto">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
                                    <div>
                                        <div className="h-3 w-24 bg-slate-200 rounded mb-1.5"></div>
                                        <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {mode === 'text' ? (
                                        content ? (
                                            <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="h-3 bg-slate-100 rounded w-full"></div>
                                                <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                                                <div className="h-3 bg-slate-100 rounded w-4/6"></div>
                                            </div>
                                        )
                                    ) : (
                                        <div>
                                            <p className="text-slate-800 text-sm mb-3">{videoTopic ? videoTopic : "Video Caption..."}</p>
                                            <div className="aspect-[9/16] bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 relative overflow-hidden">
                                                {generatedThumbnailUrl ? (
                                                    <img src={generatedThumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Video className="w-12 h-12 opacity-20" />
                                                )}
                                                {generatedVideoUrl && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                        <PlayCircle className="w-12 h-12 text-white opacity-80" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <div className="flex space-x-4 text-slate-400">
                                        <div className="w-4 h-4 bg-slate-100 rounded"></div>
                                        <div className="w-4 h-4 bg-slate-100 rounded"></div>
                                        <div className="w-4 h-4 bg-slate-100 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Modal (Text Mode) */}
            {showAiModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-[fade-in_0.2s_ease-out] border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-heading text-xl font-bold flex items-center text-slate-900">
                                <Sparkles className="w-5 h-5 text-primary mr-2" />
                                AI Assistant
                            </h3>
                            <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">What should this post be about?</label>
                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="e.g., Announcing our new product launch with a focus on speed and efficiency..."
                                    className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none text-sm"
                                />
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg flex items-start">
                                <Sparkles className="w-4 h-4 text-primary mt-0.5 mr-2 shrink-0" />
                                <p className="text-xs text-blue-700">
                                    Pro tip: Be specific about the tone (e.g., "professional", "witty") and the target audience.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-8">
                            <button
                                onClick={() => setShowAiModal(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateAI}
                                disabled={generating || !aiPrompt}
                                className="btn-primary flex items-center"
                            >
                                {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                Generate Content
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
