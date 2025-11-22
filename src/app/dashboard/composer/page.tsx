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
    Wand2
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
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading text-3xl font-bold">Create Content</h1>
                    <p className="text-muted-foreground">Draft text posts or produce AI videos automatically.</p>
                </div>
                <div className="flex bg-secondary p-1 rounded-lg">
                    <button
                        onClick={() => setMode('text')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'text' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Text Post
                    </button>
                    <button
                        onClick={() => setMode('video')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${mode === 'video' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Video className="w-4 h-4 mr-2" />
                        Video Mode
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Editor / Workflow */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Selector */}
                    <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
                        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Post to:</h3>
                        <div className="flex flex-wrap gap-2">
                            {accounts.length > 0 ? accounts.map((acc) => (
                                <button
                                    key={acc.id}
                                    onClick={() => toggleAccount(acc.id)}
                                    className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${selectedAccounts.includes(acc.id)
                                        ? 'bg-primary text-white border-primary shadow-md'
                                        : 'bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80'
                                        }`}
                                >
                                    {acc.provider === 'x' ? 'X (Twitter)' : acc.provider}
                                    {selectedAccounts.includes(acc.id) && <Check className="w-3 h-3 ml-2" />}
                                </button>
                            )) : (
                                <p className="text-sm text-muted-foreground italic">No accounts connected</p>
                            )}
                        </div>
                    </div>

                    {mode === 'text' ? (
                        /* TEXT MODE */
                        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/10">
                                <span className="text-sm font-medium">Composer</span>
                                <button onClick={() => setShowAiModal(true)} className="text-xs flex items-center text-primary hover:underline">
                                    <Sparkles className="w-3 h-3 mr-1" /> AI Assist
                                </button>
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full h-64 p-6 resize-none focus:outline-none bg-transparent text-lg"
                            />
                            <div className="bg-secondary/30 px-4 py-3 border-t border-border flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
                                        <ImageIcon className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
                                        <Smile className="w-5 h-5" />
                                    </button>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {content.length} characters
                                </span>
                            </div>
                        </div>
                    ) : (
                        /* VIDEO MODE */
                        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
                            <div className="flex border-b border-border">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${videoStep >= step ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>
                                        Step {step}: {step === 1 ? 'Script' : step === 2 ? 'Production' : 'Review'}
                                    </div>
                                ))}
                            </div>

                            <div className="p-6">
                                {videoStep === 1 && (
                                    <div className="space-y-4 animate-[fade-in_0.3s_ease-out]">
                                        <label className="block text-sm font-medium">What is your video about?</label>
                                        <textarea
                                            value={videoTopic}
                                            onChange={(e) => setVideoTopic(e.target.value)}
                                            placeholder="e.g., Top 5 tips for productivity in 2025..."
                                            className="w-full h-32 p-3 border border-input rounded-lg bg-secondary/30 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                                        />
                                        <button
                                            onClick={handleGenerateScript}
                                            disabled={generating || !videoTopic}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <PenTool className="w-4 h-4 mr-2" />}
                                            Generate Script with OpenAI
                                        </button>
                                    </div>
                                )}

                                {videoStep === 2 && (
                                    <div className="space-y-4 animate-[fade-in_0.3s_ease-out]">
                                        <label className="block text-sm font-medium">Review Generated Script</label>
                                        <div className="w-full h-48 p-4 border border-input rounded-lg bg-secondary/10 overflow-y-auto text-sm whitespace-pre-wrap font-mono">
                                            {generatedScript}
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => setVideoStep(1)}
                                                className="flex-1 px-4 py-3 border border-input rounded-lg font-medium hover:bg-secondary"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleGenerateVideo}
                                                disabled={generating}
                                                className="flex-[2] flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                                            >
                                                {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Video className="w-4 h-4 mr-2" />}
                                                Produce Video with XAI
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {videoStep === 3 && (
                                    <div className="space-y-4 animate-[fade-in_0.3s_ease-out]">
                                        <label className="block text-sm font-medium">Video Preview</label>
                                        <div className="aspect-video bg-black rounded-lg overflow-hidden relative group">
                                            <video src={generatedVideoUrl} controls className="w-full h-full object-cover" poster={generatedThumbnailUrl} />
                                        </div>
                                        <div className="flex items-center text-sm text-green-600">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Video generated successfully
                                        </div>
                                        <button
                                            onClick={() => setVideoStep(2)}
                                            className="text-sm text-muted-foreground hover:underline"
                                        >
                                            Regenerate
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Scheduling */}
                    <div className="bg-background border border-border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center w-full sm:w-auto">
                            <CalendarIcon className="w-5 h-5 text-muted-foreground mr-3" />
                            <input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                            <button
                                onClick={() => setScheduledAt('')}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Clear Schedule
                            </button>
                            <button
                                onClick={handlePost}
                                disabled={loading || (mode === 'text' ? !content : !generatedVideoUrl)}
                                className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 transition-all"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        {scheduledAt ? 'Schedule' : 'Post Now'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview */}
                <div className="hidden lg:block space-y-6">
                    <h3 className="font-heading text-lg font-bold">Platform Preview</h3>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-start space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div>
                                <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                                <div className="h-3 w-16 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {mode === 'text' ? (
                                content ? (
                                    <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
                                ) : (
                                    <>
                                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                                        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                                        <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                                    </>
                                )
                            ) : (
                                <div>
                                    <p className="text-gray-800 mb-2">{videoTopic ? videoTopic : "Video Caption..."}</p>
                                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                        {generatedThumbnailUrl ? (
                                            <img src={generatedThumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <Video className="w-12 h-12 opacity-20" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Modal (Text Mode) */}
            {showAiModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-background rounded-xl shadow-2xl max-w-md w-full p-6 animate-[fade-in_0.2s_ease-out]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-heading text-xl font-bold flex items-center">
                                <Sparkles className="w-5 h-5 text-primary mr-2" />
                                AI Assistant
                            </h3>
                            <button onClick={() => setShowAiModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            Describe what you want to post about, and let AI generate suggestions for you.
                        </p>
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="e.g., A professional post about the importance of consistency in social media marketing..."
                            className="w-full h-32 p-3 border border-input rounded-lg bg-secondary/30 focus:ring-2 focus:ring-primary focus:outline-none mb-4 resize-none"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAiModal(false)}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateAI}
                                disabled={generating || !aiPrompt}
                                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                            >
                                {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
