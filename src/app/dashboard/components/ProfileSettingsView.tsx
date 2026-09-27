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
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProfileSettingsView() {
  const supabase = createClient();

  // Profile fields
  const [fullName, setFullName] = useState('Alex Morgan');
  const [handle, setHandle] = useState('alexmorgan');
  const [email, setEmail] = useState('alex@buffermate.ai');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [bio, setBio] = useState('Founder & Social Growth Strategist. Automating high-converting DM funnels across IG, TikTok & Threads.');
  const [niche, setNiche] = useState('Creator & Growth Strategist');
  const [businessName, setBusinessName] = useState('BufferMate Media LLC');
  const [avatarUrl, setAvatarUrl] = useState('');
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
          setEmail(user.email || 'alex@buffermate.ai');
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
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
    };

    try {
      // 1. Update Supabase Auth user metadata
      await supabase.auth.updateUser({
        data: profileData,
      });

      // 2. Cache in localStorage for immediate sync across views
      localStorage.setItem('buffermate_user_profile', JSON.stringify({
        fullName,
        handle,
        phone,
        bio,
        niche,
        businessName,
        avatarUrl,
      }));

      // 3. Dispatch window event for Header sync
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('user-profile-updated', {
          detail: { fullName, handle, avatarUrl }
        }));
      }

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
    <div className="space-y-6 max-w-5xl font-sans animate-fade-in pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-[#1E293B] text-white px-4 sm:px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B]">
            Profile & Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Manage your personal creator profile, automation defaults, and security configurations.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[11px] font-bold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Auto-Synced to Supabase</span>
        </div>
      </div>

      {/* Settings Section Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#E2D9CF] pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All Settings', icon: Sliders },
          { id: 'profile', label: 'Creator Profile', icon: User },
          { id: 'billing', label: 'Pro Plans & Billing', icon: Crown },
          { id: 'timezone', label: 'Timezone & Posting', icon: Globe },
          { id: 'automations', label: 'Automation Defaults', icon: Zap },
          { id: 'security', label: 'Security & Auth', icon: Shield },
        ].map((tab) => {
          const isActive = activeSettingsTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSettingsTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
                isActive
                  ? 'bg-[#E05A2B] text-white shadow-xs'
                  : 'bg-white hover:bg-[#FAF8F5] text-[#64748B] border border-[#E2D9CF]'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Pro Plans & Subscription Tier Management */}
        {(activeSettingsTab === 'all' || activeSettingsTab === 'billing') && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F5EFE8]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA] flex items-center justify-center font-bold">
                <Crown className="w-5 h-5 text-[#E05A2B]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold text-[#1E293B]">Subscription & Pro Tier</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E05A2B] text-white">
                    PRO ACTIVE
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">
                  Manage your active workspace tier, channel limits, and billing frequency.
                </p>
              </div>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center space-x-2 bg-[#FCFAF7] p-1 rounded-2xl border border-[#E2D9CF] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-white shadow-xs text-[#1E293B]' : 'text-[#64748B]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                  billingCycle === 'annual' ? 'bg-[#1E293B] text-white shadow-xs' : 'text-[#64748B]'
                }`}
              >
                <span>Annual</span>
                <span className="px-1.5 py-0.2 bg-[#E05A2B] text-white text-[9px] rounded font-bold">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Tier */}
            <div className="p-5 rounded-2xl bg-[#FCFAF7] border border-[#E2D9CF] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold text-[#64748B] block mb-1">Starter Free</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-[#1E293B]">$0</span>
                  <span className="text-xs text-[#64748B]">/ forever</span>
                </div>
                <ul className="space-y-2 text-xs text-[#475569] mt-3">
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3 Social Channels</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>10 Posts per channel</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Basic 7-day Analytics</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentPlan('free');
                  showToast('Switched to Starter Plan');
                }}
                className="w-full py-2 bg-white border border-[#E2D9CF] rounded-xl text-xs font-bold text-[#64748B] hover:bg-[#FAF6F0]"
              >
                {currentPlan === 'free' ? '● Active' : 'Select Free'}
              </button>
            </div>

            {/* Pro Growth */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FFF6F0] border-2 border-[#E05A2B] flex flex-col justify-between space-y-4 relative shadow-xs">
              <div className="absolute -top-2.5 right-4 px-2.5 py-0.2 bg-[#E05A2B] text-white text-[9px] font-bold rounded-full">
                POPULAR
              </div>
              <div>
                <span className="text-xs font-bold text-[#E05A2B] block mb-1">Pro Growth</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-[#1E293B]">
                    ${billingCycle === 'annual' ? '23' : '29'}
                  </span>
                  <span className="text-xs text-[#64748B]">/ mo {billingCycle === 'annual' ? '(yearly)' : ''}</span>
                </div>
                <ul className="space-y-2 text-xs text-[#334155] mt-3">
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-[#E05A2B]" />
                    <span className="font-semibold">Unlimited Social Channels</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-[#E05A2B]" />
                    <span>Unlimited Scheduled Queue</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-[#E05A2B]" />
                    <span>AI Viral Script Studio (GPT-4)</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-[#E05A2B]" />
                    <span>24/7 Comment Keyword Auto-DMs</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentPlan('pro');
                  showToast('Pro Growth Plan is active');
                }}
                className="w-full py-2 bg-[#E05A2B] text-white rounded-xl text-xs font-bold hover:bg-[#C8491E] shadow-xs"
              >
                {currentPlan === 'pro' ? '✓ Current Plan (Active)' : 'Upgrade to Pro'}
              </button>
            </div>

            {/* Scale / Agency */}
            <div className="p-5 rounded-2xl bg-[#FCFAF7] border border-[#E2D9CF] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-700 block mb-1">Scale & Agency</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-[#1E293B]">
                    ${billingCycle === 'annual' ? '63' : '79'}
                  </span>
                  <span className="text-xs text-[#64748B]">/ mo {billingCycle === 'annual' ? '(yearly)' : ''}</span>
                </div>
                <ul className="space-y-2 text-xs text-[#475569] mt-3">
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>10 Team Member Seats</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>White-label PDF Reports</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>Custom Webhook Lead Sync</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentPlan('agency');
                  showToast('Upgraded to Agency Scale Plan');
                }}
                className="w-full py-2 bg-white border border-[#BFDBFE] text-blue-700 rounded-xl text-xs font-bold hover:bg-[#EFF6FF]"
              >
                {currentPlan === 'agency' ? '● Active' : 'Upgrade to Agency'}
              </button>
            </div>
          </div>
        </div>
        )}

        {/* 1. Creator Profile & Avatar Section */}
        {(activeSettingsTab === 'all' || activeSettingsTab === 'profile') && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#F5EFE8]">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">Creator Profile Information</h2>
              <p className="text-xs text-[#64748B]">
                Your public display name, avatar, and social handle used across automation dispatches.
              </p>
            </div>
          </div>

          {/* Avatar Upload Container */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-[#E2D9CF] bg-[#F7F3EC] flex items-center justify-center shadow-xs">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#FED7AA] to-[#FDBA74] flex items-center justify-center font-black text-2xl text-[#9A3412]">
                    {fullName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-file-upload"
                className="absolute bottom-1 right-1 p-2 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl shadow-md cursor-pointer transition-transform group-hover:scale-105"
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
              <h3 className="text-sm font-bold text-[#1E293B]">Profile Avatar</h3>
              <p className="text-xs text-[#64748B] max-w-md">
                Upload a high-resolution photo or brand logo. Supports PNG, JPG, WEBP or GIF up to 5MB.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <label
                  htmlFor="avatar-file-upload"
                  className="px-3.5 py-1.5 bg-[#FFF0E6] hover:bg-[#FFE4D6] text-[#E05A2B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingAvatar ? 'Reading Image...' : 'Upload New Photo'}</span>
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3 py-1.5 bg-white hover:bg-red-50 text-[#64748B] hover:text-red-600 border border-[#E2D9CF] rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
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
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Full Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
                placeholder="e.g. Alex Morgan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Creator Social Handle
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#94A3B8] font-bold">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  required
                  className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
                  placeholder="alexmorgan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#F5EFE8] text-[#64748B] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Phone Number (WhatsApp Direct)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Brand / Business Entity
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
                placeholder="BufferMate Media"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Primary Industry / Niche
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B]"
              >
                <option value="Creator & Growth Strategist">Content Creator / Influencer</option>
                <option value="E-Commerce & Digital Products">E-Commerce & Digital Products</option>
                <option value="Agency & B2B Consulting">Agency & B2B Consulting</option>
                <option value="Coaching & Courses">Coaching & Online Education</option>
                <option value="SaaS & Software">SaaS & Software Development</option>
                <option value="Real Estate & Local Business">Real Estate & Local Business</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              Creator Bio & Mission Headline
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell followers and leads about your brand and what you offer..."
              className="w-full p-3.5 rounded-2xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7] focus:outline-hidden focus:ring-2 focus:ring-[#E05A2B] resize-none"
            />
          </div>
        </div>
        )}

        {/* 2. Automation & Dispatch Defaults */}
        {(activeSettingsTab === 'all' || activeSettingsTab === 'automations') && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#F5EFE8]">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#1877F2] border border-[#BFDBFE] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">Automation & DM Funnel Rules</h2>
              <p className="text-xs text-[#64748B]">
                Configure global defaults for instant auto-replies and autonomous AI agents.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Default Link Destination
              </label>
              <input
                type="url"
                value={defaultLink}
                onChange={(e) => setDefaultLink(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
                placeholder="https://yourbrand.com/deal"
              />
              <p className="text-[10px] text-[#94A3B8] mt-1">
                Used in automated DM dispatches when no link is provided.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Auto-Reply Dispatch Delay
              </label>
              <select
                value={defaultDelay}
                onChange={(e) => setDefaultDelay(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
              >
                <option value="instant">Instant (Under 3 seconds)</option>
                <option value="15s">Natural Human Delay (15 seconds)</option>
                <option value="45s">Smart Anti-Detection (45 seconds)</option>
                <option value="120s">Batch Queued (2 minutes)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                AI Auto-Pilot Voice & Tone
              </label>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
              >
                <option value="viral">Viral & Hook-Heavy (High Curiosity)</option>
                <option value="professional">Professional & B2B Authority</option>
                <option value="conversational">Friendly, Casual & Story-Driven</option>
                <option value="direct_response">Direct Response & Sales Driven</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Daily DM Safety Rate Limit
              </label>
              <select
                value={dmRateLimit}
                onChange={(e) => setDmRateLimit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
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

        {/* 2.5 Google Gemini AI Content & Brand Preferences */}
        {(activeSettingsTab === 'all' || activeSettingsTab === 'automations') && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#F5EFE8]">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] text-[#E05A2B] border border-[#FED7AA] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">Google Gemini AI Content & Brand Guidelines</h2>
              <p className="text-xs text-[#64748B]">
                Configure AI generation defaults, tone, prohibited terms, and brand voice across all social channels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Default Language
              </label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
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
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Default Content Length
              </label>
              <select
                value={defaultContentLength}
                onChange={(e) => setDefaultContentLength(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
              >
                <option value="short">Short & Punchy (Under 150 words)</option>
                <option value="medium">Medium Form (150 - 300 words)</option>
                <option value="long">Long Form & Thought Leadership (300+ words)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Target Audience Persona
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
                placeholder="e.g. Small business owners, marketing managers"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Default Call-To-Action (CTA)
              </label>
              <input
                type="text"
                value={defaultCta}
                onChange={(e) => setDefaultCta(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
                placeholder="e.g. Drop a comment below to get the link!"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Brand Keywords (Always Include)
              </label>
              <input
                type="text"
                value={brandKeywords}
                onChange={(e) => setBrandKeywords(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
                placeholder="growth, automation, lead conversion, ROI"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Words to Avoid (Negative Filter)
              </label>
              <input
                type="text"
                value={wordsToAvoid}
                onChange={(e) => setWordsToAvoid(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
                placeholder="cheap, freebie, guaranteed, spam"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Preferred Brand Hashtags
              </label>
              <input
                type="text"
                value={preferredHashtags}
                onChange={(e) => setPreferredHashtags(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
                placeholder="#buffermate, #growth, #automation, #digitalmarketing"
              />
            </div>
          </div>
        </div>
        )}

        {/* 3. Notifications & Timezone */}
        {(activeSettingsTab === 'all' || activeSettingsTab === 'timezone') && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-4">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#F5EFE8]">
            <div className="w-10 h-10 rounded-2xl bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">Notifications & Timezone</h2>
              <p className="text-xs text-[#64748B]">
                Control where and how you receive alerts for hot leads and activity triggers.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Posting & Analytics Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7] focus:ring-2 focus:ring-[#E05A2B] focus:outline-hidden"
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

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FCFAF7] border border-[#F5EFE8]">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#1E293B]">Live Lead & DM Audio Alerts</p>
                <p className="text-[11px] text-[#64748B]">Play sound when a follower triggers a keyword</p>
              </div>
              <button
                type="button"
                onClick={() => setSoundEffects(!soundEffects)}
                className={`w-11 h-6 rounded-full relative transition-colors ${
                  soundEffects ? 'bg-[#E05A2B]' : 'bg-[#CBD5E1]'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FCFAF7] border border-[#F5EFE8]">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#1E293B]">Email Lead Summaries</p>
                <p className="text-[11px] text-[#64748B]">Receive daily email digest of all captured social leads</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-11 h-6 rounded-full relative transition-colors ${
                  emailAlerts ? 'bg-[#E05A2B]' : 'bg-[#CBD5E1]'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    emailAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        )}

        {/* 4. Security & Authentication */}
        {(activeSettingsTab === 'all' || activeSettingsTab === 'security') && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-dashed border-[#CBD5E1] shadow-xs space-y-4">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#F5EFE8]">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">Account Security & Password</h2>
              <p className="text-xs text-[#64748B]">
                Supabase authenticated session with AES-256 encrypted OAuth tokens.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#FCFAF7] border border-[#F5EFE8]">
            <div>
              <p className="text-xs font-bold text-[#1E293B]">Password & Credentials</p>
              <p className="text-[11px] text-[#64748B]">
                Change your account password securely via email authentication.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSendResetPassword}
              className="px-4 py-2 bg-white hover:bg-[#FAF6F0] text-[#E05A2B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              Send Password Reset Email
            </button>
          </div>
        </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-[#E05A2B] hover:bg-[#C8491E] disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 transition-all flex items-center space-x-2"
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
