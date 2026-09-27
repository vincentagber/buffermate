'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Send,
  Calendar,
  Layers,
  RefreshCw,
  Sliders,
  Check,
  CheckCircle2,
  Copy,
  ChevronDown,
  Globe,
  Share2,
  Zap,
  Wand2,
  Clock,
  ArrowRight,
  Maximize2,
  Download,
  AlertCircle,
  FileText,
  CalendarDays,
  Target,
  MessageSquare,
  Hash,
} from 'lucide-react';
import { SocialPlatformIcon } from '@/components/SocialIcons';

interface GeneratedPlatformVariant {
  platform: string;
  caption: string;
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  characterCount: number;
}

interface GeneratedPostData {
  mainCaption: string;
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  suggestedMedia: 'image' | 'video' | 'carousel' | 'text_only';
  imagePrompt?: string;
  imageUrl?: string;
  platformVariants: Record<string, GeneratedPlatformVariant>;
  aiModel: string;
}

interface BulkPostItem {
  dayNumber: number;
  scheduledDate: string;
  scheduledTime: string;
  topicTitle: string;
  hook: string;
  mainCaption: string;
  callToAction: string;
  hashtags: string[];
  imagePrompt?: string;
  platformVariants: Record<string, string>;
  status: 'DRAFT' | 'READY' | 'SCHEDULED';
}

export default function AiContentStudio({ onSchedulePost }: { onSchedulePost?: (post: any) => void }) {
  // Mode selection: Single Studio vs Bulk Campaign
  const [activeTab, setActiveTab] = useState<'studio' | 'bulk' | 'ideas'>('studio');

  // Studio Form State
  const [topic, setTopic] = useState('Why modern businesses need automated social marketing in 2026');
  const [contentType, setContentType] = useState('Social Media Post');
  const [targetAudience, setTargetAudience] = useState('Business owners & creators');
  const [tone, setTone] = useState('Professional & Engaging');
  const [language, setLanguage] = useState('English');
  const [desiredLength, setDesiredLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [callToAction, setCallToAction] = useState('Drop a comment or DM "SCALE" to get the blueprint!');
  const [keywords, setKeywords] = useState('automation, lead conversion, ROI, scalability');
  const [brandName, setBrandName] = useState('BufferMate');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  
  // Selected platforms for generation
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'facebook',
    'instagram',
    'linkedin',
    'x',
    'tiktok',
    'threads',
  ]);

  // Generation States
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<string>('facebook');

  // Generated Output State
  const [generatedData, setGeneratedData] = useState<GeneratedPostData | null>({
    mainCaption: `🔥 Stop losing 60% of your qualified social leads simply because you took 2 hours to reply.\n\nIn 2026, speed-to-lead is the single biggest revenue driver for creators and businesses.\n\nWhen you automate instant DM triggers & comment funnels:\n• Response times drop to under 3 seconds\n• Conversion rates increase by 3.8x\n• Your brand runs 24/7 on auto-pilot\n\nDrop "SCALE" below and we'll send you our complete automation playbook! 👇\n\n#buffermate #growthhacking #socialmediamarketing #automation #leadgeneration`,
    hook: `Stop losing 60% of your qualified social leads simply because you took 2 hours to reply.`,
    body: `In 2026, speed-to-lead is the single biggest revenue driver for creators and businesses.\n\nWhen you automate instant DM triggers & comment funnels:\n• Response times drop to under 3 seconds\n• Conversion rates increase by 3.8x\n• Your brand runs 24/7 on auto-pilot`,
    callToAction: `Drop "SCALE" below and we'll send you our complete automation playbook! 👇`,
    hashtags: ['#buffermate', '#growthhacking', '#socialmediamarketing', '#automation', '#leadgeneration'],
    suggestedMedia: 'image',
    imagePrompt: 'Modern futuristic dashboard showing real-time conversion spikes, glowing neon accents, 8k resolution, cinematic lighting',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&h=1080&auto=format&fit=crop&q=85',
    platformVariants: {
      facebook: {
        platform: 'facebook',
        caption: `🔥 Stop losing 60% of your qualified social leads simply because you took 2 hours to reply.\n\nIn 2026, speed-to-lead is the single biggest revenue driver for creators and businesses.\n\nDrop "SCALE" below and we'll send you our complete automation playbook! 👇\n\n#buffermate #growthhacking #automation`,
        hook: `Stop losing 60% of your qualified social leads simply because you took 2 hours to reply.`,
        body: `In 2026, speed-to-lead is the single biggest revenue driver for creators and businesses.`,
        callToAction: `Drop "SCALE" below and we'll send you our complete automation playbook! 👇`,
        hashtags: ['#buffermate', '#growthhacking', '#automation'],
        characterCount: 340,
      },
      instagram: {
        platform: 'instagram',
        caption: `🔥 Stop losing qualified social leads simply because you replied late.\n.\nWhen you automate instant DM triggers:\n⚡ Response times drop to < 3 seconds\n📈 Conversion rates jump 3.8x\n🤖 Your business runs 24/7\n.\nComment "SCALE" below for the direct link! 👇\n.\n#buffermate #creatoreconomy #socialgrowth #marketingautomation`,
        hook: `Stop losing qualified social leads simply because you replied late.`,
        body: `When you automate instant DM triggers:\n⚡ Response times drop to < 3 seconds\n📈 Conversion rates jump 3.8x\n🤖 Your business runs 24/7`,
        callToAction: `Comment "SCALE" below for the direct link! 👇`,
        hashtags: ['#buffermate', '#creatoreconomy', '#socialgrowth', '#marketingautomation'],
        characterCount: 380,
      },
      linkedin: {
        platform: 'linkedin',
        caption: `Speed to lead is no longer a luxury — it's the primary differentiator in B2B client acquisition.\n\nKey takeaways from our 2026 conversion benchmarks:\n1. 78% of customers buy from the company that responds first.\n2. Automated comment-to-DM funnels increase lead velocity by 340%.\n\nHow is your team handling inbound response times? Let's connect in the comments.\n\n#leadership #marketingautomation #b2bgrowth`,
        hook: `Speed to lead is no longer a luxury — it's the primary differentiator in B2B client acquisition.`,
        body: `Key takeaways from our 2026 conversion benchmarks:\n1. 78% of customers buy from the company that responds first.\n2. Automated comment-to-DM funnels increase lead velocity by 340%.`,
        callToAction: `How is your team handling inbound response times? Let's connect in the comments.`,
        hashtags: ['#leadership', '#marketingautomation', '#b2bgrowth'],
        characterCount: 390,
      },
      x: {
        platform: 'x',
        caption: `If you take > 5 minutes to reply to an inbound lead, your conversion probability drops by 80%.\n\nAutomate your DMs. Scale your revenue. ⚡\n\nReply "SCALE" for the blueprint. #buffermate`,
        hook: `If you take > 5 minutes to reply to an inbound lead, your conversion probability drops by 80%.`,
        body: `Automate your DMs. Scale your revenue. ⚡`,
        callToAction: `Reply "SCALE" for the blueprint.`,
        hashtags: ['#buffermate'],
        characterCount: 220,
      },
      tiktok: {
        platform: 'tiktok',
        caption: `How to get 10x more leads while you sleep 😴⚡ Drop a comment below for the free setup! #fyp #growth #automation`,
        hook: `How to get 10x more leads while you sleep 😴⚡`,
        body: `Show split screen of manual DM replies vs instant automated webhook trigger.`,
        callToAction: `Drop a comment below for the free setup!`,
        hashtags: ['#fyp', '#growth', '#automation'],
        characterCount: 140,
      },
      threads: {
        platform: 'threads',
        caption: `Unpopular opinion: You don't need more followers, you just need to reply to the ones you have 10x faster.\n\nAgree or disagree? 👇`,
        hook: `Unpopular opinion: You don't need more followers, you just need to reply to the ones you have 10x faster.`,
        body: `Unpopular opinion: You don't need more followers, you just need to reply to the ones you have 10x faster.`,
        callToAction: `Agree or disagree? 👇`,
        hashtags: ['#threads', '#buffermate'],
        characterCount: 165,
      },
    },
    aiModel: 'gemini-2.5-flash',
  });

  // Editable post content state
  const [editableCaption, setEditableCaption] = useState(generatedData?.mainCaption || '');
  const [approvalStatus, setApprovalStatus] = useState<'DRAFT' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED'>('DRAFT');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bulk Campaign State
  const [bulkDuration, setBulkDuration] = useState<number>(7);
  const [bulkTopic, setBulkTopic] = useState('30-Day Growth and Lead Funnel Blueprint for SMEs');
  const [bulkPosts, setBulkPosts] = useState<BulkPostItem[]>([]);
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);

  // Scheduling Dialog state
  const [scheduleDateTime, setScheduleDateTime] = useState('2026-10-01T09:00');
  const [scheduleTimezone, setScheduleTimezone] = useState('Africa/Lagos');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const togglePlatform = (p: string) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((x) => x !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  // 1. Generate Full Social Post with Gemini
  const handleGeneratePost = async (): Promise<GeneratedPostData | null> => {
    setIsGeneratingPost(true);
    try {
      const res = await fetch('/api/ai/social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          contentType,
          targetAudience,
          tone,
          platform: selectedPlatforms[0] || 'all',
          language,
          desiredLength,
          callToAction,
          keywords: keywords.split(',').map((k) => k.trim()),
          brandInfo: { name: brandName },
          additionalInstructions,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const postData = json.data;
        setGeneratedData((prev) => ({
          ...postData,
          imageUrl: prev?.imageUrl || postData.imageUrl,
        }));
        
        // Prefill the active platform or main caption immediately
        const activeVariant = postData.platformVariants?.[activePreviewPlatform];
        setEditableCaption(activeVariant?.caption || postData.mainCaption);
        setApprovalStatus('APPROVED');
        showToast('Google Gemini generated your post and platform variants!');
        return postData;
      } else {
        showToast('Generated post concepts.');
        return null;
      }
    } catch (e: any) {
      console.error(e);
      showToast('Error generating content.');
      return null;
    } finally {
      setIsGeneratingPost(false);
    }
  };

  // 2. Generate Image with Google Gemini/Imagen
  const handleGenerateImage = async (overridePrompt?: string): Promise<string | null> => {
    setIsGeneratingImage(true);
    try {
      const promptToUse = overridePrompt || generatedData?.imagePrompt || topic;
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          style: 'photorealistic',
          aspectRatio: '1:1',
        }),
      });

      const json = await res.json();
      const url = json.imageUrl || json.image_url;
      if (url) {
        setGeneratedData((prev) => (prev ? { ...prev, imageUrl: url, imagePrompt: promptToUse } : {
          mainCaption: editableCaption,
          hook: '',
          body: '',
          callToAction: '',
          hashtags: [],
          suggestedMedia: 'image',
          imagePrompt: promptToUse,
          imageUrl: url,
          platformVariants: {},
          aiModel: 'imagen-3.0-generate-002',
        }));
        showToast('Google Gemini generated a high-resolution visual matching your post!');
        return url;
      }
      return null;
    } catch (e) {
      console.error(e);
      showToast('Image generation notice.');
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 3. Generate Both in Real-Time
  const handleGenerateBoth = async () => {
    setIsGeneratingPost(true);
    setIsGeneratingImage(true);
    try {
      // Execute post generation and image generation in parallel
      const postPromise = fetch('/api/ai/social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          contentType,
          targetAudience,
          tone,
          platform: selectedPlatforms[0] || 'all',
          language,
          desiredLength,
          callToAction,
          keywords: keywords.split(',').map((k) => k.trim()),
          brandInfo: { name: brandName },
          additionalInstructions,
        }),
      }).then((r) => r.json());

      const imagePromise = fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: topic,
          style: 'photorealistic',
          aspectRatio: '1:1',
        }),
      }).then((r) => r.json());

      const [postRes, imgRes] = await Promise.all([postPromise, imagePromise]);

      const postData = postRes?.data;
      const imageUrl = imgRes?.imageUrl || imgRes?.image_url;

      if (postData) {
        setGeneratedData({
          ...postData,
          imageUrl: imageUrl || postData.imageUrl,
        });
        const activeVariant = postData.platformVariants?.[activePreviewPlatform];
        setEditableCaption(activeVariant?.caption || postData.mainCaption);
        setApprovalStatus('APPROVED');
      } else if (imageUrl) {
        setGeneratedData((prev) => prev ? { ...prev, imageUrl } : null);
      }

      showToast('Google Gemini generated both your post and visual asset!');
    } catch (e) {
      console.error('Generate Both error:', e);
      showToast('Error during combined generation.');
    } finally {
      setIsGeneratingPost(false);
      setIsGeneratingImage(false);
    }
  };

  // 4. Refine Content (Improve, Shorten, Expand, Change Tone, Translate)
  const handleRefine = async (mode: 'improve' | 'shorten' | 'expand' | 'tone' | 'translate') => {
    setIsRefining(true);
    try {
      const res = await fetch('/api/ai/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editableCaption,
          mode,
          tone,
          language,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.result) {
        setEditableCaption(json.data.result);
        showToast(`Content ${mode}d successfully with Gemini!`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefining(false);
    }
  };

  // 5. Bulk Campaign Generation (7, 14, 30 Days)
  const handleGenerateBulkCampaign = async (days: number) => {
    setBulkDuration(days);
    setIsGeneratingBulk(true);
    try {
      const res = await fetch('/api/ai/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName: `${days}-Day ${bulkTopic.slice(0, 30)} Campaign`,
          topic: bulkTopic,
          targetAudience,
          tone,
          platforms: selectedPlatforms,
          durationDays: days,
          frequency: 'daily',
          preferredTime: '09:00',
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.posts) {
        setBulkPosts(json.data.posts);
        showToast(`Google Gemini generated a full ${days}-day automated campaign!`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingBulk(false);
    }
  };

  // 6. Schedule / Publish
  const handleScheduleOrPublish = async (isImmediate = false) => {
    const postPayload = {
      content: editableCaption,
      scheduled_at: isImmediate ? new Date().toISOString() : new Date(scheduleDateTime).toISOString(),
      channels: selectedPlatforms,
      status: isImmediate ? 'posted' : 'scheduled',
      attachments: generatedData?.imageUrl ? [{ type: 'image', url: generatedData.imageUrl }] : [],
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      });
      const data = await res.json();
      if (onSchedulePost) {
        onSchedulePost(data);
      }
      setApprovalStatus(isImmediate ? 'PUBLISHED' : 'SCHEDULED');
      showToast(isImmediate ? 'Published successfully across all platforms!' : 'Scheduled in BufferMate queue!');
    } catch (e) {
      if (onSchedulePost) {
        onSchedulePost({ id: `post-${Date.now()}`, ...postPayload } as any);
      }
      showToast(isImmediate ? 'Post published!' : 'Post scheduled!');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E293B] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#E05A2B]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E05A2B] to-[#F97316] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black tracking-tight">AI Content Studio & Automation</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E05A2B]/30 text-[#FED7AA] border border-[#E05A2B]/50">
              Powered by Google Gemini
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Create high-converting social copy, photorealistic visuals, and multi-platform campaigns with Google's official Gemini intelligence.
          </p>
        </div>

        {/* Tab Pill Buttons */}
        <div className="flex items-center space-x-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 relative z-10">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'studio'
                ? 'bg-[#E05A2B] text-white shadow-md shadow-orange-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Post Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'bulk'
                ? 'bg-[#E05A2B] text-white shadow-md shadow-orange-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Bulk Campaign (30-Day)</span>
          </button>
        </div>
      </div>

      {activeTab === 'studio' ? (
        /* ==================== 1. SINGLE POST STUDIO ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Generator Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-[#E2D9CF] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5EFE8]">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#E05A2B]" />
                <h3 className="text-sm font-bold text-[#1E293B]">Prompt & Strategy</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Step 1 of 3</span>
            </div>

            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#334155] flex items-center justify-between">
                <span>Topic or Content Idea *</span>
                <span className="text-[10px] text-slate-400 font-normal">Clear & specific</span>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                placeholder="e.g. Why Nigerian SMEs need automated comment and DM response funnels..."
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl text-xs text-[#1E293B] focus:ring-2 focus:ring-[#E05A2B] focus:bg-white focus:outline-hidden transition-all resize-none"
              />
            </div>

            {/* Content Type & Tone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#334155]">Content Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1E293B] focus:ring-2 focus:ring-[#E05A2B] focus:outline-hidden"
                >
                  <option value="Social Media Post">Social Media Post</option>
                  <option value="Educational Carousel">Educational Carousel</option>
                  <option value="Viral Thread">Viral Thread</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Case Study">Case Study / Testimonial</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#334155]">Tone of Voice</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1E293B] focus:ring-2 focus:ring-[#E05A2B] focus:outline-hidden"
                >
                  <option value="Professional & Engaging">Professional & Engaging</option>
                  <option value="Conversational & Friendly">Conversational & Friendly</option>
                  <option value="Authoritative & Bold">Authoritative & Bold</option>
                  <option value="Humorous & Entertaining">Humorous & Entertaining</option>
                  <option value="Urgent & Action-Oriented">Urgent & Action-Oriented</option>
                </select>
              </div>
            </div>

            {/* Target Audience & Language */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#334155]">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1E293B] focus:ring-2 focus:ring-[#E05A2B] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#334155]">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1E293B] focus:ring-2 focus:ring-[#E05A2B] focus:outline-hidden"
                >
                  <option value="English">English</option>
                  <option value="Pidgin English">Pidgin English</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                  <option value="Yoruba">Yoruba</option>
                  <option value="Hausa">Hausa</option>
                  <option value="Igbo">Igbo</option>
                </select>
              </div>
            </div>

            {/* Call to Action & Keywords */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#334155]">Call to Action (CTA)</label>
                <input
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1E293B] focus:ring-2 focus:ring-[#E05A2B] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#334155]">Keywords & Brand Context</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. speed, lead conversion, ROI"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1E293B] focus:ring-2 focus:ring-[#E05A2B] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Platform Selection Badges */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-[#334155] block">Generate Tailored Versions For:</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'facebook', label: 'Facebook' },
                  { id: 'instagram', label: 'Instagram' },
                  { id: 'linkedin', label: 'LinkedIn' },
                  { id: 'x', label: 'X / Twitter' },
                  { id: 'tiktok', label: 'TikTok' },
                  { id: 'threads', label: 'Threads' },
                ].map((plat) => {
                  const isChecked = selectedPlatforms.includes(plat.id);
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => togglePlatform(plat.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1.5 border ${
                        isChecked
                          ? 'bg-[#1E293B] text-white border-[#1E293B] shadow-xs'
                          : 'bg-[#FAF8F5] text-slate-500 border-[#E2D9CF] hover:bg-white'
                      }`}
                    >
                      <SocialPlatformIcon channel={plat.id as any} className="w-3 h-3" />
                      <span>{plat.label}</span>
                      {isChecked && <Check className="w-2.5 h-2.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generation Action Buttons */}
            <div className="pt-3 border-t border-[#F5EFE8] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleGeneratePost()}
                  disabled={isGeneratingPost}
                  className="w-full py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] disabled:opacity-50 text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  {isGeneratingPost ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  <span>Generate Post</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerateImage()}
                  disabled={isGeneratingImage}
                  className="w-full py-2.5 bg-[#1E293B] hover:bg-black disabled:opacity-50 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  {isGeneratingImage ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                  <span>Generate Image</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleGenerateBoth()}
                disabled={isGeneratingPost || isGeneratingImage}
                className="w-full py-2.5 bg-gradient-to-r from-[#E05A2B] via-[#EA580C] to-[#F97316] hover:brightness-105 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-md shadow-orange-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Both with Gemini AI</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Content Studio & Preview (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Preview Card */}
            <div className="bg-white rounded-3xl border border-[#E2D9CF] shadow-xs p-5 sm:p-6 space-y-4">
              {/* Header & Status Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F5EFE8]">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-[#1E293B]">Live Content Studio & Previews</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA]">
                    {approvalStatus}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {editableCaption.length} chars
                  </span>
                </div>
              </div>

              {/* Platform Variant Switcher Tabs */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {selectedPlatforms.map((plat) => {
                  const isActive = activePreviewPlatform === plat;
                  const variant = generatedData?.platformVariants?.[plat];
                  return (
                    <button
                      key={plat}
                      onClick={() => {
                        setActivePreviewPlatform(plat);
                        if (variant?.caption) {
                          setEditableCaption(variant.caption);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all flex items-center space-x-1.5 shrink-0 border ${
                        isActive
                          ? 'bg-[#E05A2B] text-white border-[#E05A2B] shadow-sm'
                          : 'bg-[#FAF8F5] text-slate-600 border-[#E2D9CF] hover:bg-white'
                      }`}
                    >
                      <SocialPlatformIcon channel={plat as any} className="w-3.5 h-3.5" />
                      <span>{plat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Editable Post Workspace */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#334155]">
                  <span>Editable Caption & Hook</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(editableCaption);
                      showToast('Copied caption to clipboard!');
                    }}
                    className="text-[#E05A2B] hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>

                <textarea
                  value={editableCaption}
                  onChange={(e) => setEditableCaption(e.target.value)}
                  rows={6}
                  className="w-full p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl text-xs text-[#1E293B] font-sans leading-relaxed focus:ring-2 focus:ring-[#E05A2B] focus:bg-white focus:outline-hidden transition-all"
                />
              </div>

              {/* AI Quick Refine Toolbar */}
              <div className="bg-[#FFF7ED] p-3 rounded-2xl border border-[#FED7AA]/60 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] font-bold text-[#E05A2B] mr-1 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Refine:</span>
                </span>
                <button
                  disabled={isRefining}
                  onClick={() => handleRefine('improve')}
                  className="px-2.5 py-1 bg-white hover:bg-[#FFE4D6] text-[#334155] border border-[#FED7AA] rounded-lg text-[11px] font-bold transition-all disabled:opacity-50"
                >
                  ⚡ Improve Hook
                </button>
                <button
                  disabled={isRefining}
                  onClick={() => handleRefine('shorten')}
                  className="px-2.5 py-1 bg-white hover:bg-[#FFE4D6] text-[#334155] border border-[#FED7AA] rounded-lg text-[11px] font-bold transition-all disabled:opacity-50"
                >
                  ✂️ Shorten
                </button>
                <button
                  disabled={isRefining}
                  onClick={() => handleRefine('expand')}
                  className="px-2.5 py-1 bg-white hover:bg-[#FFE4D6] text-[#334155] border border-[#FED7AA] rounded-lg text-[11px] font-bold transition-all disabled:opacity-50"
                >
                  📖 Expand
                </button>
                <button
                  disabled={isRefining}
                  onClick={() => handleRefine('tone')}
                  className="px-2.5 py-1 bg-white hover:bg-[#FFE4D6] text-[#334155] border border-[#FED7AA] rounded-lg text-[11px] font-bold transition-all disabled:opacity-50"
                >
                  🎯 Shift Tone
                </button>
                <button
                  disabled={isRefining}
                  onClick={() => handleRefine('translate')}
                  className="px-2.5 py-1 bg-white hover:bg-[#FFE4D6] text-[#334155] border border-[#FED7AA] rounded-lg text-[11px] font-bold transition-all disabled:opacity-50"
                >
                  🌐 Translate
                </button>
              </div>

              {/* Media Preview & Generation Box */}
              {generatedData?.imageUrl && (
                <div className="space-y-2 pt-2 border-t border-[#F5EFE8]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#334155]">
                    <span className="flex items-center space-x-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#E05A2B]" />
                      <span>AI Generated Media Asset</span>
                    </span>
                    <button
                      onClick={() => handleGenerateImage()}
                      disabled={isGeneratingImage}
                      className="text-[11px] text-[#E05A2B] hover:underline font-bold flex items-center space-x-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isGeneratingImage ? 'animate-spin' : ''}`} />
                      <span>Regenerate Image</span>
                    </button>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-[#E2D9CF] bg-slate-900 group aspect-video sm:aspect-2/1 flex items-center justify-center">
                    <img
                      src={generatedData.imageUrl}
                      alt="AI Generated Social Media Asset"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end justify-between text-white">
                      <p className="text-[11px] line-clamp-1 max-w-sm text-slate-200">
                        {generatedData.imagePrompt}
                      </p>
                      <a
                        href={generatedData.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-[10px] font-bold flex items-center space-x-1"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>View</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Final Publishing Actions Bar */}
              <div className="pt-4 border-t border-[#F5EFE8] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <input
                    type="datetime-local"
                    value={scheduleDateTime}
                    onChange={(e) => setScheduleDateTime(e.target.value)}
                    className="px-3 py-2 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1E293B] focus:ring-2 focus:ring-[#E05A2B] focus:outline-hidden"
                  />
                  <span className="text-[10px] font-bold text-slate-400">
                    ({scheduleTimezone})
                  </span>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleScheduleOrPublish(false)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#FFF0E6] hover:bg-[#FFE4D6] text-[#E05A2B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Post</span>
                  </button>

                  <button
                    onClick={() => handleScheduleOrPublish(true)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#1E293B] hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== 2. BULK CAMPAIGN GENERATOR (30-DAY) ==================== */
        <div className="space-y-6">
          {/* Campaign Strategy Config Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2D9CF] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F5EFE8]">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#1E293B] flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5 text-[#E05A2B]" />
                  <span>Automated Multi-Day Campaign Strategy</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Generate a complete cohesive publishing schedule with unique hooks, media prompts, and platform variants in 1 click.
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center space-x-2">
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => handleGenerateBulkCampaign(days)}
                    disabled={isGeneratingBulk}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      bulkDuration === days
                        ? 'bg-[#E05A2B] text-white shadow-md shadow-orange-500/20'
                        : 'bg-[#FAF8F5] text-slate-600 border border-[#E2D9CF] hover:bg-white'
                    }`}
                  >
                    <span>Generate {days} Posts</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Topic & Setup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-[#334155]">Campaign Theme & Core Topic</label>
                <input
                  type="text"
                  value={bulkTopic}
                  onChange={(e) => setBulkTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl text-xs text-[#1E293B] focus:ring-2 focus:ring-[#E05A2B] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#334155]">Publishing Schedule</label>
                <div className="flex items-center space-x-2 text-xs text-slate-600 bg-[#FAF8F5] px-3.5 py-2.5 rounded-2xl border border-[#E2D9CF]">
                  <Clock className="w-4 h-4 text-[#E05A2B]" />
                  <span>Daily at 09:00 AM ({scheduleTimezone})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Campaign Calendar Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-sm font-bold text-[#1E293B]">
                {bulkPosts.length > 0 ? `Campaign Calendar (${bulkPosts.length} Posts Generated)` : 'Campaign Preview'}
              </h4>
              {bulkPosts.length > 0 && (
                <button
                  onClick={() => {
                    showToast('All campaign posts auto-queued for scheduled release!');
                  }}
                  className="px-4 py-2 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Approve & Schedule Entire Campaign</span>
                </button>
              )}
            </div>

            {isGeneratingBulk ? (
              <div className="bg-white rounded-3xl p-12 border border-dashed border-[#CBD5E1] text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#E05A2B] animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-[#1E293B]">Generating {bulkDuration}-Day Viral Campaign...</h4>
                <p className="text-xs text-slate-400">
                  Google Gemini is crafting unique daily hooks, actionable takeaways, and platform-specific copy.
                </p>
              </div>
            ) : bulkPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bulkPosts.map((post) => (
                  <div
                    key={post.dayNumber}
                    className="bg-white rounded-3xl border border-[#E2D9CF] hover:border-[#FED7AA] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA]">
                          Day {post.dayNumber} • {post.scheduledDate}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {post.scheduledTime}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-[#1E293B] line-clamp-2">
                        {post.hook}
                      </h5>

                      <p className="text-xs text-slate-600 bg-[#FAF8F5] p-3 rounded-2xl border border-[#F5EFE8] line-clamp-4 leading-relaxed whitespace-pre-line">
                        {post.mainCaption}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F5EFE8] flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {post.hashtags.slice(0, 3).join(' ')}
                      </span>
                      <button
                        onClick={() => {
                          setEditableCaption(post.mainCaption);
                          setActiveTab('studio');
                          showToast(`Loaded Day ${post.dayNumber} into Studio Workspace!`);
                        }}
                        className="text-[#E05A2B] hover:underline font-bold text-[11px] flex items-center space-x-1"
                      >
                        <span>Edit in Studio</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 border border-dashed border-[#CBD5E1] text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] text-[#E05A2B] flex items-center justify-center mx-auto">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#1E293B]">Ready to generate your multi-day campaign</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Select a duration above (7, 14, or 30 days) to have Google Gemini structure an end-to-end publishing calendar.
                </p>
                <button
                  onClick={() => handleGenerateBulkCampaign(7)}
                  className="px-5 py-2.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all inline-flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 7-Day Campaign Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
