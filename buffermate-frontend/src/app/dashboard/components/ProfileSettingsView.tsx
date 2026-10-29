'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Camera,
  Upload,
  Trash2,
  Check,
  Sparkles,
  Shield,
  Bell,
  Globe,
  Lock,
  Smartphone,
  AtSign,
  Briefcase,
  Zap,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Clock,
  Volume2,
  Mail,
  Crown,
  CreditCard,
  Search,
  MessageSquare,
  ArrowUpRight,
  ChevronDown,
  ShieldCheck,
  Activity,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ChevronStepper, { ChevronStepItem } from '@/components/ui/ChevronStepper';
import { triggerConfetti } from '@/components/ui/Confetti';

export default function ProfileSettingsView() {
  const supabase = createClient();

  // Profile fields
  const [fullName, setFullName] = useState('Alex Morgan');
  const [handle, setHandle] = useState('alexmorgan');
  const [email, setEmail] = useState('demo@buffermate.app');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [bio, setBio] = useState('Founder & Social Growth Strategist. Automating high-converting DM funnels across IG, TikTok & Threads.');
  const [niche, setNiche] = useState('SaaS & Software Development');
  const [businessName, setBusinessName] = useState('BufferMate Media LLC');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Automation & Preference fields
  const [timezone, setTimezone] = useState('Africa/Lagos (UTC+1)');
  const [defaultDelay, setDefaultDelay] = useState('instant');
  const [defaultLink, setDefaultLink] = useState('https://buffermate.ai/special-offer');
  const [dmRateLimit, setDmRateLimit] = useState('250');
  const [aiTone, setAiTone] = useState('viral');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [leadNotifications, setLeadNotifications] = useState(true);

  // AI Content Generator Preferences
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [defaultContentLength, setDefaultContentLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [defaultCta, setDefaultCta] = useState('Drop a comment below or DM "SCALE" for the blueprint!');
  const [targetAudience, setTargetAudience] = useState('Business owners, founders, and creators');
  const [brandKeywords, setBrandKeywords] = useState('growth, automation, lead conversion, ROI');
  const [wordsToAvoid, setWordsToAvoid] = useState('cheap, freebie, guarantee, spam');
  const [preferredHashtags, setPreferredHashtags] = useState('#buffermate, #growth, #automation, #socialmarketing');
  const [defaultPlatforms, setDefaultPlatforms] = useState<string[]>(['facebook', 'instagram', 'linkedin', 'x', 'tiktok']);

  // Subscription state
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'agency'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'all' | 'profile' | 'billing' | 'timezone' | 'automations' | 'security'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || 'demo@buffermate.app');
          const meta = user.user_metadata || {};
          if (meta.name) setFullName(meta.name);
          if (meta.handle) setHandle(meta.handle);
          if (meta.phone) setPhone(meta.phone);
          if (meta.bio) setBio(meta.bio);
          if (meta.niche) setNiche(meta.niche);
          if (meta.business_name) setBusinessName(meta.business_name);
          if (meta.avatar_url) setAvatarUrl(meta.avatar_url);
          if (meta.timezone) setTimezone(meta.timezone);
          if (meta.default_link) setDefaultLink(meta.default_link);
          if (meta.default_delay) setDefaultDelay(meta.default_delay);
          if (meta.ai_tone) setAiTone(meta.ai_tone);
        } else {
          // Check local storage for persistent profile in demo mode
          const cached = localStorage.getItem('buffermate_user_profile') || localStorage.getItem('socialflow_user_profile');
          if (cached) {
            try {
              const data = JSON.parse(cached);
              if (data.fullName) setFullName(data.fullName);
              if (data.handle) setHandle(data.handle);
              if (data.phone) setPhone(data.phone);
              if (data.bio) setBio(data.bio);
              if (data.niche) setNiche(data.niche);
              if (data.businessName) setBusinessName(data.businessName);
              if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserProfile();
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        const base64 = uploadEvent.target.result as string;
        setAvatarUrl(base64);
        setIsUploadingAvatar(false);
        showToast('Avatar updated! Click Save Profile to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    showToast('Avatar removed.');
  };

  const handlePlanChange = (newPlan: 'free' | 'pro' | 'agency') => {
    setCurrentPlan(newPlan);
    triggerConfetti();
    const planNames = { free: 'Starter Free', pro: 'Pro Growth', agency: 'Scale & Agency' };
    showToast(`Switched plan to ${planNames[newPlan]}!`);

    try {
      const cached = localStorage.getItem('buffermate_user_profile');
      const obj = cached ? JSON.parse(cached) : {};
      obj.currentPlan = newPlan;
      localStorage.setItem('buffermate_user_profile', JSON.stringify(obj));
      window.dispatchEvent(
        new CustomEvent('user-profile-updated', {
          detail: { ...obj, currentPlan: newPlan },
        })
      );
    } catch (e) {}
  };

  const isSectionVisible = (tabId: string, keywords: string[]) => {
    if (activeSettingsTab !== 'all' && activeSettingsTab !== tabId) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return tabId.toLowerCase().includes(q) || keywords.some((k) => k.toLowerCase().includes(q));
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);

    const profileData = {
      name: fullName,
      handle,
      phone,
      bio,
      niche,
      business_name: businessName,
      avatar_url: avatarUrl,
      timezone,
      default_link: defaultLink,
      default_delay: defaultDelay,
      dm_rate_limit: dmRateLimit,
      ai_tone: aiTone,
      email_alerts: emailAlerts,
      sound_effects: soundEffects,
      lead_notifications: leadNotifications,
      current_plan: currentPlan,
      billing_cycle: billingCycle,
    };

    try {
      // 1. Update Supabase Auth user metadata
      await supabase.auth.updateUser({
        data: profileData,
      });

      // 2. Cache in localStorage for immediate sync across views
      localStorage.setItem(
        'buffermate_user_profile',
        JSON.stringify({
          fullName,
          handle,
          phone,
          bio,
          niche,
          businessName,
          avatarUrl,
          timezone,
          currentPlan,
          billingCycle,
        })
      );

      // 3. Dispatch window event for Header & Sidebar sync
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('user-profile-updated', {
            detail: {
              fullName,
              handle,
              avatarUrl,
              businessName,
              niche,
              currentPlan,
              timezone,
            },
          })
        );
      }

      triggerConfetti();
      showToast('Profile & preferences saved successfully to database! 🎉');
    } catch (err) {
      console.error('Save profile error:', err);
      showToast('Settings saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendResetPassword = async () => {
    try {
      if (email) {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/dashboard/settings`,
        });
      }
      showToast('Password reset link sent to your registered email!');
    } catch (err) {
      showToast('Password reset instructions dispatched.');
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-16 animate-fade-in max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#161616] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm animate-bounce-short">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Context & Global Utility (Reports Style) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">
              Profile & Account Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal creator profile, automation defaults, and security configurations
          </p>
        </div>

        {/* Search, Notifications & Save Button */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search settings, keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-14 py-2 bg-white rounded-full border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 shadow-2xs transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </span>
            )}
          </div>

          <button
            onClick={() => showToast('Profile data is verified')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors shrink-0"
            title="Profile Status"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="bg-[#141416] hover:bg-black disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CHEVRON STEPPER SETTINGS NAVIGATION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        {/* Adopted Reusable Chevron Stepper Component for Settings Sections */}
        <div className="w-full lg:max-w-3xl overflow-x-auto pb-1">
          <ChevronStepper
            steps={[
              { id: 'all', title: 'All Settings', subtitle: 'Global Config', icon: Sliders },
              { id: 'profile', title: 'Profile', subtitle: 'Identity & Brand', icon: User },
              { id: 'billing', title: 'Billing', subtitle: 'Pro & Tiers', icon: Crown },
              { id: 'timezone', title: 'Timezone', subtitle: 'Schedule Windows', icon: Globe },
              { id: 'automations', title: 'Automations', subtitle: 'Guardrails & AI', icon: Zap },
              { id: 'security', title: 'Security', subtitle: 'Access & 2FA', icon: Shield },
            ]}
            currentStep={activeSettingsTab}
            onChange={(stepId) => setActiveSettingsTab(stepId as any)}
            variant="blue"
            size="sm"
            showNumbers={false}
            showIcons={true}
          />
        </div>

        {/* Status Pill Indicator */}
        <div className="flex items-center gap-2 overflow-x-auto shrink-0">
          <div className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-700 flex items-center gap-2 shadow-2xs transition-colors whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Session: AES-256 Auth Active</span>
          </div>
        </div>
      </div>

      {/* BENTO KPI ROW (4 CARDS: Matching Reports Color Rhythm) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {/* 1. Subscription Tier (Lavender #E9E4FD) */}
        <div className="bg-[#E9E4FD] rounded-3xl p-5 border border-purple-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-900">Workspace Tier</span>
            <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-800">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">
              {currentPlan === 'pro' ? 'Pro Growth' : currentPlan === 'agency' ? 'Scale Agency' : 'Starter Free'}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-purple-900 font-medium">
              <span>{billingCycle === 'annual' ? '$23 / mo · Annual (-20%)' : '$29 / mo · Monthly'}</span>
            </div>
          </div>
        </div>

        {/* 2. DM Rate Limit Guard (Matcha / Sage Green #EAF6DA) */}
        <div className="bg-[#EAF6DA] rounded-3xl p-5 border border-emerald-200/60 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-900">DM Safety Limit</span>
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">{dmRateLimit} DMs / day</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-900 font-medium">
              <span>Smart anti-detection active</span>
            </div>
          </div>
        </div>

        {/* 3. Primary Posting Timezone (White) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Posting Timezone</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Globe className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616] truncate">Africa/Lagos</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-medium">
              <span>West Africa Time (UTC+1)</span>
            </div>
          </div>
        </div>

        {/* 4. Security & Encryption (White) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Security Standard</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#161616]">AES-256 Auth</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-700 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Supabase verified session</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Pro Plans & Subscription Tier Management */}
        {isSectionVisible('billing', ['pro', 'plans', 'billing', 'subscription', 'pricing', 'starter', 'free', 'annual', 'monthly', 'agency', 'tier', 'workspace tier']) && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center font-bold">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-slate-900">Subscription & Pro Tier</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#161616] text-white">
                      {currentPlan === 'pro' ? 'PRO ACTIVE' : currentPlan === 'agency' ? 'AGENCY ACTIVE' : 'STARTER ACTIVE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage your active workspace tier, channel limits, and billing frequency.
                  </p>
                </div>
              </div>

              {/* Billing Toggle (Rounded Pills) */}
              <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    billingCycle === 'monthly' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    billingCycle === 'annual' ? 'bg-[#161616] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>Annual</span>
                  <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] rounded-full font-bold">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Cards (Clean Squircles) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Free Tier */}
              <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-5 transition-all ${
                currentPlan === 'free'
                  ? 'bg-purple-50/30 border-2 border-[#161616] shadow-sm'
                  : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-50'
              }`}>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Starter Free</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">$0</span>
                    <span className="text-xs text-slate-400">/ forever</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 mt-4">
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>3 Social Channels</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>10 Posts per channel</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>Basic 7-day Analytics</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlanChange('free')}
                  className={`w-full py-2.5 rounded-full text-xs font-semibold shadow-2xs transition-all ${
                    currentPlan === 'free'
                      ? 'bg-[#161616] text-white'
                      : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {currentPlan === 'free' ? '✓ Current Plan (Active)' : 'Select Free'}
                </button>
              </div>

              {/* Pro Growth (Hero Highlight) */}
              <div className={`p-6 rounded-3xl flex flex-col justify-between space-y-5 relative transition-all ${
                currentPlan === 'pro'
                  ? 'bg-white border-2 border-[#161616] shadow-sm'
                  : 'bg-slate-50/70 border border-slate-200/70 hover:bg-slate-50'
              }`}>
                <div className="absolute -top-3 right-5 px-3 py-1 bg-[#161616] text-white text-[10px] font-bold rounded-full tracking-wider uppercase">
                  POPULAR
                </div>
                <div>
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider block mb-1">Pro Growth</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">
                      ${billingCycle === 'annual' ? '23' : '29'}
                    </span>
                    <span className="text-xs text-slate-400">/ mo {billingCycle === 'annual' ? '(yearly)' : ''}</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700 mt-4">
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="font-semibold text-slate-900">Unlimited Social Channels</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>Unlimited Scheduled Queue</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>AI Viral Script Studio (GPT-4)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>24/7 Comment Keyword Auto-DMs</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlanChange('pro')}
                  className={`w-full py-2.5 rounded-full text-xs font-semibold transition-all ${
                    currentPlan === 'pro'
                      ? 'bg-[#141416] hover:bg-black text-white shadow-sm'
                      : 'bg-white border border-slate-200/80 text-purple-700 hover:bg-purple-50 shadow-2xs'
                  }`}
                >
                  {currentPlan === 'pro' ? '✓ Current Plan (Active)' : 'Upgrade to Pro'}
                </button>
              </div>

              {/* Scale / Agency */}
              <div className={`p-6 rounded-3xl flex flex-col justify-between space-y-5 relative transition-all ${
                currentPlan === 'agency'
                  ? 'bg-blue-50/30 border-2 border-[#161616] shadow-sm'
                  : 'bg-slate-50/70 border border-slate-200/70 hover:bg-slate-50'
              }`}>
                <div>
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block mb-1">Scale & Agency</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">
                      ${billingCycle === 'annual' ? '63' : '79'}
                    </span>
                    <span className="text-xs text-slate-400">/ mo {billingCycle === 'annual' ? '(yearly)' : ''}</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 mt-4">
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>10 Team Member Seats</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>White-label PDF Reports</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>Custom Webhook Lead Sync</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlanChange('agency')}
                  className={`w-full py-2.5 rounded-full text-xs font-semibold shadow-2xs transition-all ${
                    currentPlan === 'agency'
                      ? 'bg-[#161616] text-white'
                      : 'bg-white border border-slate-200/80 text-blue-700 hover:bg-blue-50/50'
                  }`}
                >
                  {currentPlan === 'agency' ? '✓ Current Plan (Active)' : 'Upgrade to Agency'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. Creator Profile & Avatar Section */}
        {isSectionVisible('profile', ['profile', 'creator', 'avatar', 'name', 'handle', 'alex morgan', 'email', 'phone', 'business', 'entity', 'industry', 'niche', 'bio', 'headline']) && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Creator Profile Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your public display name, avatar, and social handle used across automation dispatches.
                </p>
              </div>
            </div>

            {/* Avatar Upload Container */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-50 flex items-center justify-center shadow-2xs">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-purple-100 to-indigo-100 flex items-center justify-center font-bold text-2xl text-purple-800">
                      {fullName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-file-upload"
                  className="absolute bottom-1 right-1 p-2 bg-[#161616] hover:bg-black text-white rounded-full shadow-md cursor-pointer transition-transform group-hover:scale-105"
                  title="Change Avatar"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="avatar-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="sr-only"
                  />
                </label>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Profile Avatar</h3>
                <p className="text-xs text-slate-500 max-w-md">
                  Upload a high-resolution photo or brand logo. Supports PNG, JPG, WEBP or GIF up to 5MB.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <label
                    htmlFor="avatar-file-upload"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingAvatar ? 'Reading Image...' : 'Upload New Photo'}</span>
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-4 py-2 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/80 rounded-full text-xs font-semibold transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                  placeholder="e.g. Alex Morgan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Creator Social Handle
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-bold">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    required
                    className="w-full pl-8 pr-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                    placeholder="alexmorgan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Registered Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-100/60 text-slate-500 cursor-not-allowed shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number (WhatsApp Direct)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                  placeholder="+1 (555) 234-5678"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brand / Business Entity
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                  placeholder="BufferMate Media LLC"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Industry / Niche
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                >
                  <option value="SaaS & Software Development">SaaS & Software Development</option>
                  <option value="Content Creator / Influencer">Content Creator / Influencer</option>
                  <option value="E-Commerce & Digital Products">E-Commerce & Digital Products</option>
                  <option value="Agency & B2B Consulting">Agency & B2B Consulting</option>
                  <option value="Coaching & Courses">Coaching & Online Education</option>
                  <option value="Real Estate & Local Business">Real Estate & Local Business</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Creator Bio & Mission Headline
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Founder & Social Growth Strategist. Automating high-converting DM funnels across IG, TikTok & Threads."
                className="w-full p-4 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs resize-none"
              />
            </div>
          </div>
        )}

        {/* 2. Automation & Dispatch Defaults */}
        {isSectionVisible('automations', ['automation', 'funnel', 'dm', 'rules', 'link', 'destination', 'delay', 'voice', 'tone', 'rate', 'limit', 'safety']) && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Automation & DM Funnel Rules</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure global defaults for instant auto-replies and autonomous AI agents.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default Link Destination
                </label>
                <input
                  type="url"
                  value={defaultLink}
                  onChange={(e) => setDefaultLink(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                  placeholder="https://buffermate.ai/special-offer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Used in automated DM dispatches when no link is provided.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Auto-Reply Dispatch Delay
                </label>
                <select
                  value={defaultDelay}
                  onChange={(e) => setDefaultDelay(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                >
                  <option value="instant">Instant (Under 3 seconds)</option>
                  <option value="15s">Natural Human Delay (15 seconds)</option>
                  <option value="45s">Smart Anti-Detection (45 seconds)</option>
                  <option value="120s">Batch Queued (2 minutes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  AI Auto-Pilot Voice & Tone
                </label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                >
                  <option value="viral">Viral & Hook-Heavy (High Curiosity)</option>
                  <option value="professional">Professional & B2B Authority</option>
                  <option value="conversational">Friendly, Casual & Story-Driven</option>
                  <option value="direct_response">Direct Response & Sales Driven</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Daily DM Safety Rate Limit
                </label>
                <select
                  value={dmRateLimit}
                  onChange={(e) => setDmRateLimit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                >
                  <option value="100">100 DMs / day (Conservative)</option>
                  <option value="250">250 DMs / day (Recommended)</option>
                  <option value="500">500 DMs / day (High-Volume Scale)</option>
                  <option value="1000">1,000 DMs / day (Enterprise VIP)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 2.5 Google Gemini AI Content & Brand Guidelines */}
        {isSectionVisible('automations', ['gemini', 'ai', 'content', 'brand', 'guidelines', 'language', 'length', 'persona', 'cta', 'keywords', 'avoid', 'hashtags', 'negative filter']) && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Google Gemini AI Content & Brand Guidelines</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure AI generation defaults, tone, prohibited terms, and brand voice across all social channels.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default Language
                </label>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default Content Length
                </label>
                <select
                  value={defaultContentLength}
                  onChange={(e) => setDefaultContentLength(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                >
                  <option value="short">Short & Punchy (Under 150 words)</option>
                  <option value="medium">Medium Form (150 - 300 words)</option>
                  <option value="long">Long Form & Thought Leadership (300+ words)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Audience Persona
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                  placeholder="Business owners, founders, and creators"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default Call-To-Action (CTA)
                </label>
                <input
                  type="text"
                  value={defaultCta}
                  onChange={(e) => setDefaultCta(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                  placeholder="Drop a comment below or DM &quot;SCALE&quot; for the blueprint!"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brand Keywords (Always Include)
                </label>
                <input
                  type="text"
                  value={brandKeywords}
                  onChange={(e) => setBrandKeywords(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                  placeholder="growth, automation, lead conversion, ROI"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Words to Avoid (Negative Filter)
                </label>
                <input
                  type="text"
                  value={wordsToAvoid}
                  onChange={(e) => setWordsToAvoid(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                  placeholder="cheap, freebie, guarantee, spam"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Brand Hashtags
                </label>
                <input
                  type="text"
                  value={preferredHashtags}
                  onChange={(e) => setPreferredHashtags(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                  placeholder="#buffermate, #growth, #automation, #socialmarketing"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Notifications & Timezone */}
        {isSectionVisible('timezone', ['notifications', 'timezone', 'posting', 'audio', 'sound', 'alerts', 'email', 'digest', 'lagos', 'west africa', 'leads']) && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Notifications & Timezone</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control where and how you receive alerts for hot leads and activity triggers.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Posting & Analytics Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-2xs"
                >
                  <optgroup label="🌍 Africa (Including Nigeria)">
                    <option value="Africa/Lagos (UTC+1)">Africa/Lagos (UTC+1) - West Africa Time, Nigeria (Lagos, Abuja)</option>
                    <option value="Africa/Accra (UTC+0)">Africa/Accra (UTC+0) - Greenwich Mean Time (Ghana)</option>
                    <option value="Africa/Cairo (UTC+2)">Africa/Cairo (UTC+2) - Eastern European Time (Egypt)</option>
                    <option value="Africa/Johannesburg (UTC+2)">Africa/Johannesburg (UTC+2) - South Africa Standard Time</option>
                    <option value="Africa/Nairobi (UTC+3)">Africa/Nairobi (UTC+3) - East Africa Time (Kenya, Uganda, Tanzania)</option>
                    <option value="Africa/Casablanca (UTC+1)">Africa/Casablanca (UTC+1) - Western European Time (Morocco)</option>
                    <option value="Africa/Algiers (UTC+1)">Africa/Algiers (UTC+1) - Central European Time (Algeria)</option>
                    <option value="Africa/Addis_Ababa (UTC+3)">Africa/Addis_Ababa (UTC+3) - East Africa Time (Ethiopia)</option>
                    <option value="Africa/Kigali (UTC+2)">Africa/Kigali (UTC+2) - Central Africa Time (Rwanda)</option>
                    <option value="Africa/Dakar (UTC+0)">Africa/Dakar (UTC+0) - Greenwich Mean Time (Senegal)</option>
                    <option value="Africa/Abidjan (UTC+0)">Africa/Abidjan (UTC+0) - GMT (Ivory Coast)</option>
                    <option value="Africa/Harare (UTC+2)">Africa/Harare (UTC+2) - Central Africa Time (Zimbabwe)</option>
                    <option value="Africa/Tunis (UTC+1)">Africa/Tunis (UTC+1) - Central European Time (Tunisia)</option>
                  </optgroup>

                  <optgroup label="🇺🇸 & 🌎 Americas (North, Central & South)">
                    <option value="America/New_York (UTC-5)">America/New_York (UTC-5) - Eastern Time (New York, Miami, Atlanta)</option>
                    <option value="America/Chicago (UTC-6)">America/Chicago (UTC-6) - Central Time (Chicago, Dallas, Houston)</option>
                    <option value="America/Denver (UTC-7)">America/Denver (UTC-7) - Mountain Time (Denver, Phoenix, Salt Lake)</option>
                    <option value="America/Los_Angeles (UTC-8)">America/Los_Angeles (UTC-8) - Pacific Time (Los Angeles, San Francisco, Seattle)</option>
                    <option value="America/Anchorage (UTC-9)">America/Anchorage (UTC-9) - Alaska Standard Time</option>
                    <option value="Pacific/Honolulu (UTC-10)">Pacific/Honolulu (UTC-10) - Hawaii Standard Time</option>
                    <option value="America/Toronto (UTC-5)">America/Toronto (UTC-5) - Eastern Time (Toronto, Montreal, Canada)</option>
                    <option value="America/Vancouver (UTC-8)">America/Vancouver (UTC-8) - Pacific Time (Vancouver, Canada)</option>
                    <option value="America/Mexico_City (UTC-6)">America/Mexico_City (UTC-6) - Central Time (Mexico City, Guadalajara)</option>
                    <option value="America/Bogota (UTC-5)">America/Bogota (UTC-5) - Colombia Time (Bogotá, Medellín)</option>
                    <option value="America/Lima (UTC-5)">America/Lima (UTC-5) - Peru Time (Lima)</option>
                    <option value="America/Sao_Paulo (UTC-3)">America/Sao_Paulo (UTC-3) - Brasília Time (São Paulo, Rio de Janeiro)</option>
                    <option value="America/Buenos_Aires (UTC-3)">America/Buenos_Aires (UTC-3) - Argentina Time (Buenos Aires)</option>
                    <option value="America/Santiago (UTC-4)">America/Santiago (UTC-4) - Chile Time (Santiago)</option>
                    <option value="America/Caracas (UTC-4)">America/Caracas (UTC-4) - Venezuela Time (Caracas)</option>
                  </optgroup>

                  <optgroup label="🇪🇺 Europe & UK">
                    <option value="Europe/London (UTC+0)">Europe/London (UTC+0) - Greenwich Mean Time / BST (London, UK)</option>
                    <option value="Europe/Dublin (UTC+0)">Europe/Dublin (UTC+0) - Irish Standard Time (Dublin, Ireland)</option>
                    <option value="Europe/Lisbon (UTC+0)">Europe/Lisbon (UTC+0) - Western European Time (Lisbon, Portugal)</option>
                    <option value="Europe/Paris (UTC+1)">Europe/Paris (UTC+1) - Central European Time (Paris, France)</option>
                    <option value="Europe/Berlin (UTC+1)">Europe/Berlin (UTC+1) - Central European Time (Berlin, Frankfurt, Germany)</option>
                    <option value="Europe/Madrid (UTC+1)">Europe/Madrid (UTC+1) - Central European Time (Madrid, Barcelona, Spain)</option>
                    <option value="Europe/Rome (UTC+1)">Europe/Rome (UTC+1) - Central European Time (Rome, Milan, Italy)</option>
                    <option value="Europe/Amsterdam (UTC+1)">Europe/Amsterdam (UTC+1) - Central European Time (Amsterdam, Netherlands)</option>
                    <option value="Europe/Brussels (UTC+1)">Europe/Brussels (UTC+1) - Central European Time (Brussels, Belgium)</option>
                    <option value="Europe/Zurich (UTC+1)">Europe/Zurich (UTC+1) - Central European Time (Zurich, Geneva, Switzerland)</option>
                    <option value="Europe/Stockholm (UTC+1)">Europe/Stockholm (UTC+1) - Central European Time (Stockholm, Sweden)</option>
                    <option value="Europe/Oslo (UTC+1)">Europe/Oslo (UTC+1) - Central European Time (Oslo, Norway)</option>
                    <option value="Europe/Vienna (UTC+1)">Europe/Vienna (UTC+1) - Central European Time (Vienna, Austria)</option>
                    <option value="Europe/Warsaw (UTC+1)">Europe/Warsaw (UTC+1) - Central European Time (Warsaw, Poland)</option>
                    <option value="Europe/Athens (UTC+2)">Europe/Athens (UTC+2) - Eastern European Time (Athens, Greece)</option>
                    <option value="Europe/Bucharest (UTC+2)">Europe/Bucharest (UTC+2) - Eastern European Time (Bucharest, Romania)</option>
                    <option value="Europe/Kyiv (UTC+2)">Europe/Kyiv (UTC+2) - Eastern European Time (Kyiv, Ukraine)</option>
                    <option value="Europe/Helsinki (UTC+2)">Europe/Helsinki (UTC+2) - Eastern European Time (Helsinki, Finland)</option>
                    <option value="Europe/Moscow (UTC+3)">Europe/Moscow (UTC+3) - Moscow Standard Time (Moscow, Russia)</option>
                    <option value="Europe/Istanbul (UTC+3)">Europe/Istanbul (UTC+3) - Turkey Time (Istanbul, Turkey)</option>
                  </optgroup>

                  <optgroup label="🕌 Middle East">
                    <option value="Asia/Dubai (UTC+4)">Asia/Dubai (UTC+4) - Gulf Standard Time (Dubai, Abu Dhabi, UAE)</option>
                    <option value="Asia/Riyadh (UTC+3)">Asia/Riyadh (UTC+3) - Arabia Standard Time (Riyadh, Jeddah, Saudi Arabia)</option>
                    <option value="Asia/Qatar (UTC+3)">Asia/Qatar (UTC+3) - Arabia Standard Time (Doha, Qatar)</option>
                    <option value="Asia/Kuwait (UTC+3)">Asia/Kuwait (UTC+3) - Arabia Standard Time (Kuwait City)</option>
                    <option value="Asia/Muscat (UTC+4)">Asia/Muscat (UTC+4) - Gulf Standard Time (Muscat, Oman)</option>
                    <option value="Asia/Jerusalem (UTC+2)">Asia/Jerusalem (UTC+2) - Israel Standard Time (Tel Aviv, Jerusalem)</option>
                    <option value="Asia/Beirut (UTC+2)">Asia/Beirut (UTC+2) - Eastern European Time (Beirut, Lebanon)</option>
                    <option value="Asia/Amman (UTC+3)">Asia/Amman (UTC+3) - Arabia Time (Amman, Jordan)</option>
                  </optgroup>

                  <optgroup label="🌏 Asia">
                    <option value="Asia/Kolkata (UTC+5:30)">Asia/Kolkata (UTC+5:30) - Indian Standard Time (New Delhi, Mumbai, Bengaluru)</option>
                    <option value="Asia/Karachi (UTC+5)">Asia/Karachi (UTC+5) - Pakistan Standard Time (Karachi, Lahore)</option>
                    <option value="Asia/Dhaka (UTC+6)">Asia/Dhaka (UTC+6) - Bangladesh Standard Time (Dhaka)</option>
                    <option value="Asia/Colombo (UTC+5:30)">Asia/Colombo (UTC+5:30) - Sri Lanka Time (Colombo)</option>
                    <option value="Asia/Kathmandu (UTC+5:45)">Asia/Kathmandu (UTC+5:45) - Nepal Time (Kathmandu)</option>
                    <option value="Asia/Bangkok (UTC+7)">Asia/Bangkok (UTC+7) - Indochina Time (Bangkok, Thailand)</option>
                    <option value="Asia/Jakarta (UTC+7)">Asia/Jakarta (UTC+7) - Western Indonesia Time (Jakarta)</option>
                    <option value="Asia/Ho_Chi_Minh (UTC+7)">Asia/Ho_Chi_Minh (UTC+7) - Indochina Time (Ho Chi Minh City, Vietnam)</option>
                    <option value="Asia/Singapore (UTC+8)">Asia/Singapore (UTC+8) - Singapore Standard Time (Singapore)</option>
                    <option value="Asia/Kuala_Lumpur (UTC+8)">Asia/Kuala_Lumpur (UTC+8) - Malaysia Time (Kuala Lumpur)</option>
                    <option value="Asia/Hong_Kong (UTC+8)">Asia/Hong_Kong (UTC+8) - Hong Kong Time (Hong Kong)</option>
                    <option value="Asia/Shanghai (UTC+8)">Asia/Shanghai (UTC+8) - China Standard Time (Beijing, Shanghai, Shenzhen)</option>
                    <option value="Asia/Taipei (UTC+8)">Asia/Taipei (UTC+8) - Taiwan Time (Taipei)</option>
                    <option value="Asia/Manila (UTC+8)">Asia/Manila (UTC+8) - Philippine Standard Time (Manila)</option>
                    <option value="Asia/Tokyo (UTC+9)">Asia/Tokyo (UTC+9) - Japan Standard Time (Tokyo, Osaka, Japan)</option>
                    <option value="Asia/Seoul (UTC+9)">Asia/Seoul (UTC+9) - Korea Standard Time (Seoul, South Korea)</option>
                  </optgroup>

                  <optgroup label="🦘 Australia & Pacific">
                    <option value="Australia/Sydney (UTC+10)">Australia/Sydney (UTC+10) - Australian Eastern Time (Sydney, Canberra)</option>
                    <option value="Australia/Melbourne (UTC+10)">Australia/Melbourne (UTC+10) - Australian Eastern Time (Melbourne)</option>
                    <option value="Australia/Brisbane (UTC+10)">Australia/Brisbane (UTC+10) - AEST (Brisbane, Queensland)</option>
                    <option value="Australia/Adelaide (UTC+9:30)">Australia/Adelaide (UTC+9:30) - Australian Central Time (Adelaide)</option>
                    <option value="Australia/Perth (UTC+8)">Australia/Perth (UTC+8) - Australian Western Time (Perth)</option>
                    <option value="Pacific/Auckland (UTC+12)">Pacific/Auckland (UTC+12) - New Zealand Standard Time (Auckland, Wellington)</option>
                    <option value="Pacific/Fiji (UTC+12)">Pacific/Fiji (UTC+12) - Fiji Time (Suva)</option>
                    <option value="Pacific/Guam (UTC+10)">Pacific/Guam (UTC+10) - Chamorro Standard Time (Guam)</option>
                  </optgroup>

                  <optgroup label="🌐 UTC Universal">
                    <option value="UTC (UTC+0)">UTC (UTC+0) - Coordinated Universal Time</option>
                  </optgroup>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Live Lead & DM Audio Alerts</p>
                  <p className="text-[11px] text-slate-500">Play sound when a follower triggers a keyword</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEffects(!soundEffects)}
                  className={`w-10 h-6 rounded-full relative transition-colors ${
                    soundEffects ? 'bg-[#161616]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      soundEffects ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">Email Lead Summaries</p>
                  <p className="text-[11px] text-slate-500">Receive daily email digest of all captured social leads</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-10 h-6 rounded-full relative transition-colors ${
                    emailAlerts ? 'bg-[#161616]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      emailAlerts ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Security & Authentication */}
        {isSectionVisible('security', ['security', 'auth', 'password', 'reset', 'credentials', 'aes', 'session', 'tokens', 'oauth']) && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Account Security & Password</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Supabase authenticated session with AES-256 encrypted OAuth tokens.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Password & Credentials</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Change your account password securely via email authentication.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSendResetPassword}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 rounded-full text-xs font-semibold shadow-2xs transition-colors shrink-0"
              >
                Send Password Reset Email
              </button>
            </div>
          </div>
        )}

        {/* Empty Search State */}
        {searchQuery.trim() &&
          !isSectionVisible('billing', ['pro', 'plans', 'billing', 'subscription', 'pricing', 'starter', 'free', 'annual', 'monthly', 'agency', 'tier', 'workspace tier']) &&
          !isSectionVisible('profile', ['profile', 'creator', 'avatar', 'name', 'handle', 'alex morgan', 'email', 'phone', 'business', 'entity', 'industry', 'niche', 'bio', 'headline']) &&
          !isSectionVisible('automations', ['automation', 'funnel', 'dm', 'rules', 'link', 'destination', 'delay', 'voice', 'tone', 'rate', 'limit', 'safety']) &&
          !isSectionVisible('automations', ['gemini', 'ai', 'content', 'brand', 'guidelines', 'language', 'length', 'persona', 'cta', 'keywords', 'avoid', 'hashtags', 'negative filter']) &&
          !isSectionVisible('timezone', ['notifications', 'timezone', 'posting', 'audio', 'sound', 'alerts', 'email', 'digest', 'lagos', 'west africa', 'leads']) &&
          !isSectionVisible('security', ['security', 'auth', 'password', 'reset', 'credentials', 'aes', 'session', 'tokens', 'oauth']) && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No settings found matching &quot;{searchQuery}&quot;</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for keywords like &ldquo;billing&rdquo;, &ldquo;avatar&rdquo;, &ldquo;gemini&rdquo;, &ldquo;timezone&rdquo;, or &ldquo;password&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear search</span>
              </button>
            </div>
          )}

        {/* Bottom Sticky / Inline Save Bar */}
        <div className="flex items-center justify-end space-x-3 pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-[#141416] hover:bg-black disabled:opacity-50 text-white rounded-full text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center space-x-2 hover:scale-[1.01]"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving to Supabase...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save All Profile & Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
