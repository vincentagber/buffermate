'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Sparkles,
  RefreshCw,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Zap,
  TrendingUp,
  Layers,
  Send,
  Trash2,
  Sliders,
  Check,
  X,
  Filter,
  Search,
  BookOpen,
  ArrowRight,
  Globe,
  PenTool,
  Calendar,
  Share2,
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';

interface NewsSource {
  publisher: string;
  url: string;
  published_at?: string;
  snippet?: string;
}

interface NewsTopic {
  id: string;
  topic_hash: string;
  title: string;
  summary: string;
  category: string;
  discovery_source: string;
  source_urls?: NewsSource[];
  score: number;
  score_breakdown?: {
    relevance?: number;
    freshness?: number;
    quality?: number;
    age_hours?: number;
    explanation?: string;
  };
  editorial_risk_score: number;
  editorial_flags?: string[];
  status: 'discovered' | 'drafted' | 'scheduled' | 'published' | 'dismissed';
  created_at: string;
}

interface NewsFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  keywords?: string;
  priority: number;
  enabled: boolean;
  last_fetch_at?: string;
  last_error?: string;
}

interface SocialAccountAutomation {
  id: string;
  provider: string;
  name?: string;
  activeProfile?: string;
  enabled: boolean;
  publishing_mode: 'auto_publish' | 'manual_review';
  custom_instructions?: string;
}

interface NewsPilotViewProps {
  onOpenComposer?: (prefill?: { content: string; channels?: string[] }) => void;
}

export default function NewsPilotView({ onOpenComposer }: NewsPilotViewProps) {
  // Main state
  const [topics, setTopics] = useState<NewsTopic[]>([]);
  const [feeds, setFeeds] = useState<NewsFeed[]>([]);
  const [accounts, setAccounts] = useState<SocialAccountAutomation[]>([]);
  const [activeTab, setActiveTab] = useState<'topics' | 'feeds' | 'accounts' | 'settings'>('topics');

  // Loading states
  const [loading, setLoading] = useState(true);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & Draft Drawers
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState(false);
  const [feedNameInput, setFeedNameInput] = useState('');
  const [feedUrlInput, setFeedUrlInput] = useState('');
  const [feedCategoryInput, setFeedCategoryInput] = useState('Technology');
  const [isSavingFeed, setIsSavingFeed] = useState(false);

  // Quick Draft & Polish Modal
  const [draftingTopic, setDraftingTopic] = useState<NewsTopic | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [generatedDrafts, setGeneratedDrafts] = useState<{
    headline?: string;
    editorial_summary?: string;
    source_attribution?: string;
    platform_posts?: Record<string, { caption: string; hook: string; hashtags: string[] }>;
  } | null>(null);
  const [selectedDraftPlatform, setSelectedDraftPlatform] = useState<string>('facebook');
  const [editableCaption, setEditableCaption] = useState('');
  const [isPublishingDraft, setIsPublishingDraft] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    enabled: true,
    trends_enabled: true,
    trends_geo: 'US',
    keywords: ['AI', 'Tech', 'Marketing', 'Automation'],
    min_score: 35.0,
  });

  // Toast notifications
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3800);
  };

  // 1. Initial Data Fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [topicsRes, feedsRes, accountsRes, settingsRes] = await Promise.all([
        fetch('/api/news/topics'),
        fetch('/api/news/feeds'),
        fetch('/api/integrations'),
        fetch('/api/news/settings'),
      ]);

      if (topicsRes.ok) {
        const tData = await topicsRes.json();
        setTopics(tData.data || []);
      }
      if (feedsRes.ok) {
        const fData = await feedsRes.json();
        setFeeds(fData.data || []);
      }
      if (accountsRes.ok) {
        const aData = await accountsRes.json();
        const rawChannels = aData.channels || [];
        const mappedAccounts: SocialAccountAutomation[] = rawChannels.map((c: any) => ({
          id: c.dbAccountId || c.id,
          provider: c.provider,
          name: c.name,
          activeProfile: c.activeProfile,
          enabled: c.newsAutomation?.enabled ?? (c.status === 'connected'),
          publishing_mode: c.newsAutomation?.publishing_mode ?? 'manual_review',
          custom_instructions: c.newsAutomation?.custom_instructions ?? '',
        }));
        setAccounts(mappedAccounts);
      }
      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        if (sData.config) setSettings(sData.config);
      }
    } catch (e) {
      console.error('Error loading NewsPilot data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Run Pipeline Manually
  const handleRunPipeline = async () => {
    setIsRunningPipeline(true);
    try {
      const res = await fetch('/api/news/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true, max_topics: 2 }),
      });
      const data = await res.json();
      if (data.success) {
        const discCount = data.result?.discovery?.discovered ?? 0;
        const procCount = data.result?.processed_topics ?? 0;
        showToast(
          `Pipeline complete: ${discCount} new topics discovered, ${procCount} story processed!`,
          'success'
        );
        // Refresh topics
        fetchInitialData();
      } else {
        showToast(data.message || 'Pipeline execution completed', 'info');
      }
    } catch (err: any) {
      showToast('Pipeline execution error: ' + err.message, 'error');
    } finally {
      setIsRunningPipeline(false);
    }
  };

  // Add Feed
  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedUrlInput.trim()) return;

    setIsSavingFeed(true);
    try {
      const res = await fetch('/api/news/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: feedNameInput || 'News Feed',
          url: feedUrlInput,
          category: feedCategoryInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Feed added successfully!');
        setIsAddFeedModalOpen(false);
        setFeedNameInput('');
        setFeedUrlInput('');
        // Refresh feeds
        const fRes = await fetch('/api/news/feeds');
        if (fRes.ok) {
          const fData = await fRes.json();
          setFeeds(fData.data || []);
        }
      } else {
        showToast(data.message || 'Failed to add feed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Connection error', 'error');
    } finally {
      setIsSavingFeed(false);
    }
  };

  // Delete Feed
  const handleDeleteFeed = async (feedId: string, feedName: string) => {
    try {
      const res = await fetch(`/api/news/feeds/${feedId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFeeds((prev) => prev.filter((f) => f.id !== feedId));
        showToast(`Feed '${feedName}' removed`);
      }
    } catch (err) {
      showToast('Failed to delete feed', 'error');
    }
  };

  // Dismiss Topic
  const handleDismissTopic = async (topicId: string) => {
    try {
      const res = await fetch(`/api/news/topics/${topicId}/dismiss`, { method: 'POST' });
      if (res.ok) {
        setTopics((prev) => prev.map((t) => (t.id === topicId ? { ...t, status: 'dismissed' } : t)));
        showToast('Story dismissed from active feed');
      }
    } catch (err) {
      showToast('Failed to dismiss story', 'error');
    }
  };

  // Open Quick Draft Modal
  const handleOpenDraftModal = async (topic: NewsTopic) => {
    setDraftingTopic(topic);
    setIsGeneratingDraft(true);
    setGeneratedDrafts(null);

    try {
      const res = await fetch(`/api/news/topics/${topic.id}/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ create_post: false }),
      });
      const data = await res.json();
      if (data.success && data.generated) {
        setGeneratedDrafts(data.generated);
        const posts = data.generated.platform_posts || {};
        const availablePlatforms = Object.keys(posts);
        const initialPlat = availablePlatforms.includes('facebook') ? 'facebook' : availablePlatforms[0] || 'facebook';
        setSelectedDraftPlatform(initialPlat);
        setEditableCaption(posts[initialPlat]?.caption || data.suggested_caption || '');
      } else {
        setEditableCaption(`${topic.title}\n\n${topic.summary}`);
      }
    } catch (err) {
      setEditableCaption(`${topic.title}\n\n${topic.summary}`);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  // Switch Platform Preview in Draft Modal
  const handleSelectPlatformInDraft = (platform: string) => {
    setSelectedDraftPlatform(platform);
    if (generatedDrafts?.platform_posts?.[platform]) {
      setEditableCaption(generatedDrafts.platform_posts[platform].caption);
    }
  };

  // Save Draft to Approval Queue
  const handleSaveToApprovalQueue = async () => {
    if (!draftingTopic) return;
    setIsPublishingDraft(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editableCaption,
          scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
          status: 'draft',
          requireApproval: true,
          channels: [selectedDraftPlatform],
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Post sent to Approval Queue for editorial review!');
        setTopics((prev) =>
          prev.map((t) => (t.id === draftingTopic.id ? { ...t, status: 'drafted' } : t))
        );
        setDraftingTopic(null);
      } else {
        showToast(data.message || 'Failed to save draft', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving post', 'error');
    } finally {
      setIsPublishingDraft(false);
    }
  };

  // Publish / Schedule Directly
  const handleDirectSchedulePost = async () => {
    if (!draftingTopic) return;
    setIsPublishingDraft(true);
    try {
      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editableCaption,
          scheduled_at: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
          channels: [selectedDraftPlatform],
          requireApproval: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Post scheduled for publishing on ${selectedDraftPlatform.toUpperCase()}!`);
        setTopics((prev) =>
          prev.map((t) => (t.id === draftingTopic.id ? { ...t, status: 'scheduled' } : t))
        );
        setDraftingTopic(null);
      } else {
        showToast(data.message || 'Failed to schedule post', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error scheduling post', 'error');
    } finally {
      setIsPublishingDraft(false);
    }
  };

  // Update Account News Settings
  const handleUpdateAccountSettings = async (
    account: SocialAccountAutomation,
    updates: Partial<SocialAccountAutomation>
  ) => {
    const nextAccount = { ...account, ...updates };
    setAccounts((prev) => prev.map((a) => (a.provider === account.provider ? nextAccount : a)));

    try {
      const res = await fetch('/api/integrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: account.provider,
          action: 'update_news_automation',
          enabled: nextAccount.enabled,
          publishing_mode: nextAccount.publishing_mode,
          custom_instructions: nextAccount.custom_instructions,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${account.name || account.provider} automation updated`);
      }
    } catch (err) {
      showToast('Failed to update account automation', 'error');
    }
  };

  // Filtered Topics
  const filteredTopics = topics.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && t.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q);
    }
    return true;
  });

  // Metrics
  const discoveredCount = topics.filter((t) => t.status === 'discovered').length;
  const inReviewCount = topics.filter((t) => t.status === 'drafted').length;
  const scheduledCount = topics.filter((t) => t.status === 'scheduled' || t.status === 'published').length;
  const enabledAccountsCount = accounts.filter((a) => a.enabled).length;

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-20 animate-fade-in max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm animate-bounce-short ${
            toast.type === 'error' ? 'bg-rose-600' : toast.type === 'info' ? 'bg-blue-600' : 'bg-[#161616]'
          }`}
        >
          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-white/20">
            {toast.type === 'error' ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
          </div>
          <span>{toast.text}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">
              News Pilot & Trend Engine
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              Autonomous Newsroom
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Grounded news discovery, Gemini multi-platform synthesis, and scheduled publishing across connected channels.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRunPipeline}
            disabled={isRunningPipeline}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningPipeline ? 'animate-spin' : ''}`} />
            <span>{isRunningPipeline ? 'Discovering & Synthesizing...' : 'Run Pipeline Now'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenComposer) {
                onOpenComposer();
              }
            }}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center gap-2"
          >
            <PenTool className="w-3.5 h-3.5 text-slate-600" />
            <span>Manual Composer</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Discovered Stories
            </span>
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{discoveredCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Ranked & verified by relevance</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              In Review Queue
            </span>
            <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{inReviewCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Requires manual approval</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Scheduled / Dispatched
            </span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{scheduledCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Automated queue delivery</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Synced Channels
            </span>
            <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Share2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {enabledAccountsCount} / {accounts.length} Active
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Configured per account</p>
        </div>
      </div>

      {/* VIEW SUB-TABS */}
      <div className="flex border-b border-slate-200/80 space-x-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('topics')}
          className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'topics'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Discovered Stories & Trends</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {topics.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('accounts')}
          className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'accounts'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Account Rules (Auto vs Review)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-bold">
            {enabledAccountsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feeds')}
          className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
            activeTab === 'feeds'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>News Feeds & Sources</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {feeds.length}
          </span>
        </button>
      </div>

      {/* TAB 1: TOPICS FEED */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search discovered stories, keywords, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="discovered">Discovered</option>
                <option value="drafted">In Review</option>
                <option value="scheduled">Scheduled</option>
                <option value="dismissed">Dismissed</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="trending">Trending</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {/* Topics List */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Scanning feeds and scoring candidate stories...</p>
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Discovered Stories Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click &quot;Run Pipeline Now&quot; above to scan Google Trends and your connected RSS feeds, or add your favorite news feeds below.
              </p>
              <button
                type="button"
                onClick={handleRunPipeline}
                className="px-4 py-2 bg-[#161616] hover:bg-black text-white text-xs font-semibold rounded-full shadow-sm"
              >
                Run Discovery Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((topic) => {
                const primarySource = topic.source_urls?.[0];
                const isHighRisk = topic.editorial_risk_score >= 40;

                return (
                  <div
                    key={topic.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Category & Freshness row */}
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {topic.category}
                          </span>
                          <span className="text-slate-400">
                            {topic.discovery_source.replace('google_trends:', 'Google Trends ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              topic.score >= 75
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                            title={topic.score_breakdown?.explanation || `Score: ${topic.score}`}
                          >
                            ★ {topic.score} Quality
                          </span>

                          {isHighRisk && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1"
                              title={topic.editorial_flags?.join('; ') || 'High editorial sensitivity'}
                            >
                              <Shield className="w-2.5 h-2.5" />
                              Review Req
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Headline */}
                      <h2 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {topic.title}
                      </h2>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {topic.summary}
                      </p>

                      {/* Source attribution link */}
                      {primarySource && (
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                          <span className="truncate max-w-[200px]">
                            Source: <strong>{primarySource.publisher || 'Verified News'}</strong>
                          </span>
                          {primarySource.url && (
                            <a
                              href={primarySource.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                            >
                              <span>Original</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            topic.status === 'scheduled'
                              ? 'bg-emerald-500'
                              : topic.status === 'drafted'
                              ? 'bg-amber-500'
                              : 'bg-indigo-500'
                          }`}
                        />
                        <span className="text-[11px] text-slate-500 font-medium capitalize">
                          {topic.status === 'drafted' ? 'In Review Queue' : topic.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {topic.status !== 'dismissed' && (
                          <button
                            type="button"
                            onClick={() => handleDismissTopic(topic.id)}
                            className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-rose-600 font-semibold rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            Dismiss
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenDraftModal(topic)}
                          className="px-3.5 py-1.5 bg-[#161616] hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs transition-colors flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-300" />
                          <span>Draft Post</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PER-ACCOUNT AUTOMATION RULES */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Per-Account Publishing & Review Controls</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                For <strong>each connected social account</strong>, specify whether automated news posts can be dispatched, and whether they publish automatically or require manual editorial approval.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {accounts.map((acc) => (
                <div
                  key={acc.provider}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-bold shrink-0">
                      <SocialPlatformIcon channel={acc.provider as any} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 capitalize">
                          {acc.name || acc.provider}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            acc.enabled
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {acc.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        {acc.activeProfile || `@${acc.provider}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-medium">News Dispatch</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateAccountSettings(acc, { enabled: !acc.enabled })}
                        className={`w-9 h-5 rounded-full relative transition-colors ${
                          acc.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                            acc.enabled ? 'translate-x-4.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Mode Segment Switch */}
                    <div className="inline-flex rounded-xl bg-slate-100 p-1">
                      <button
                        type="button"
                        disabled={!acc.enabled}
                        onClick={() =>
                          handleUpdateAccountSettings(acc, { publishing_mode: 'manual_review' })
                        }
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                          acc.publishing_mode === 'manual_review'
                            ? 'bg-white text-indigo-700 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900 disabled:opacity-40'
                        }`}
                      >
                        🛡️ Manual Review
                      </button>
                      <button
                        type="button"
                        disabled={!acc.enabled}
                        onClick={() =>
                          handleUpdateAccountSettings(acc, { publishing_mode: 'auto_publish' })
                        }
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                          acc.publishing_mode === 'auto_publish'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900 disabled:opacity-40'
                        }`}
                      >
                        ⚡ Auto-Publish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NEWS FEEDS & SOURCES */}
      {activeTab === 'feeds' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Configured RSS Feeds</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ingests stories directly with SSRF protection, XML entity isolation, and category tagging.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddFeedModalOpen(true)}
              className="px-4 py-2 bg-[#161616] hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Feed</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{feed.name}</h4>
                      <p className="text-xs text-slate-400 font-mono truncate max-w-xs mt-0.5">
                        {feed.url}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {feed.category}
                    </span>
                  </div>

                  {feed.last_error && (
                    <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-xl mt-2">
                      Fetch issue: {feed.last_error}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {feed.last_fetch_at ? `Synced ${new Date(feed.last_fetch_at).toLocaleTimeString()}` : 'Not synced yet'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteFeed(feed.id, feed.name)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove Feed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK DRAFT & POLISH MODAL */}
      {draftingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  AI Social Editorial Studio
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 line-clamp-1">
                  {draftingTopic.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDraftingTopic(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              {['facebook', 'x', 'linkedin', 'instagram'].map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => handleSelectPlatformInDraft(plat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize transition-all flex items-center gap-1.5 ${
                    selectedDraftPlatform === plat
                      ? 'bg-[#161616] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <SocialPlatformIcon channel={plat as any} className="w-3.5 h-3.5" />
                  <span>{plat === 'x' ? 'X (Twitter)' : plat}</span>
                </button>
              ))}
            </div>

            {/* Post Caption Editor */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Platform Post Copy:</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {editableCaption.length} characters
                </span>
              </label>
              {isGeneratingDraft ? (
                <div className="h-44 flex items-center justify-center border border-slate-200 rounded-2xl bg-slate-50 text-xs text-slate-500">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 mr-2" />
                  Generating grounded social draft...
                </div>
              ) : (
                <textarea
                  rows={6}
                  value={editableCaption}
                  onChange={(e) => setEditableCaption(e.target.value)}
                  className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-sans leading-relaxed"
                />
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const content = editableCaption;
                  const channel = selectedDraftPlatform;
                  setDraftingTopic(null);
                  if (onOpenComposer) {
                    onOpenComposer({ content, channels: [channel] });
                  }
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
              >
                <span>Edit in Full Composer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSaveToApprovalQueue}
                  disabled={isPublishingDraft}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-full transition-colors"
                >
                  🛡️ Save to Review Queue
                </button>

                <button
                  type="button"
                  onClick={handleDirectSchedulePost}
                  disabled={isPublishingDraft}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold rounded-full shadow-2xs transition-all"
                >
                  ⚡ Schedule & Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD FEED MODAL */}
      {isAddFeedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleAddFeed}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-scale-in"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add News RSS / Atom Feed</h3>
              <button
                type="button"
                onClick={() => setIsAddFeedModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Publication / Feed Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TechCrunch, BBC World, Reuters"
                  value={feedNameInput}
                  onChange={(e) => setFeedNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">RSS or Atom Feed URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://feeds.example.com/rss.xml"
                  value={feedUrlInput}
                  onChange={(e) => setFeedUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Editorial Category</label>
                <select
                  value={feedCategoryInput}
                  onChange={(e) => setFeedCategoryInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Healthcare">Healthcare & Aesthetics</option>
                  <option value="Finance">Finance</option>
                  <option value="General">General News</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddFeedModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingFeed}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-full shadow-2xs"
              >
                {isSavingFeed ? 'Verifying...' : 'Verify & Add Feed'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
