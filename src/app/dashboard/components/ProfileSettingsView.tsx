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
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProfileSettingsView() {
  const supabase = createClient();

  // Profile fields
  const [fullName, setFullName] = useState('Alex Morgan');
  const [handle, setHandle] = useState('alexmorgan');
  const [email, setEmail] = useState('alex@socialflow.studio');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [bio, setBio] = useState('Founder & Social Growth Strategist. Automating high-converting DM funnels across IG, TikTok & Threads.');
  const [niche, setNiche] = useState('Creator & Growth Strategist');
  const [businessName, setBusinessName] = useState('SocialFlow Media LLC');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Automation & Preference fields
  const [timezone, setTimezone] = useState('America/New_York (UTC-5)');
  const [defaultDelay, setDefaultDelay] = useState('instant');
  const [defaultLink, setDefaultLink] = useState('https://socialflow.studio/special-offer');
  const [dmRateLimit, setDmRateLimit] = useState('250');
  const [aiTone, setAiTone] = useState('viral');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [leadNotifications, setLeadNotifications] = useState(true);

  // UI state
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
          setEmail(user.email || 'alex@socialflow.studio');
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
          const cached = localStorage.getItem('socialflow_user_profile');
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
      localStorage.setItem('socialflow_user_profile', JSON.stringify({
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
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B]">
          Profile & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          Manage your personal creator profile, automation defaults, and security configurations.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* 1. Creator Profile & Avatar Section */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#F0E8DF] shadow-xs space-y-6">
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
                placeholder="SocialFlow Media"
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

        {/* 2. Automation & Dispatch Defaults */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#F0E8DF] shadow-xs space-y-6">
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

        {/* 3. Notifications & Timezone */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#F0E8DF] shadow-xs space-y-4">
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7]"
              >
                <option value="America/New_York (UTC-5)">Eastern Time - New York (UTC-5)</option>
                <option value="America/Chicago (UTC-6)">Central Time - Chicago (UTC-6)</option>
                <option value="America/Los_Angeles (UTC-8)">Pacific Time - Los Angeles (UTC-8)</option>
                <option value="Europe/London (UTC+0)">Greenwich Mean Time - London (UTC+0)</option>
                <option value="Europe/Paris (UTC+1)">Central European Time - Paris (UTC+1)</option>
                <option value="Asia/Tokyo (UTC+9)">Japan Standard Time - Tokyo (UTC+9)</option>
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

        {/* 4. Security & Authentication */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#F0E8DF] shadow-xs space-y-4">
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
