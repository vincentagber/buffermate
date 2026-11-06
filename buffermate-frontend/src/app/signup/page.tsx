'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] font-sans antialiased text-[#1A202C] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="max-w-md w-full bg-white rounded-[28px] p-8 md:p-10 border border-[#E2E0D5] shadow-xl text-center space-y-4">
          <div className="w-14 h-14 bg-[#6F9C3E]/10 text-[#6F9C3E] rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1A202C]">Check your email</h2>
          <p className="text-xs sm:text-sm text-[#6B6B60] leading-relaxed">
            We sent a verification link to <span className="font-bold text-[#1A202C]">{email}</span>. Click the link to activate your Buffermate workspace.
          </p>
          <Link
            href="/login"
            className="w-full inline-flex justify-center py-3.5 px-4 bg-[#1A202C] hover:bg-[#2D3748] text-white rounded-full text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] font-sans antialiased text-[#1A202C] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#6F9C3E]/20 selection:text-[#6F9C3E]">
      {/* Kobble Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#6F9C3E]/12 to-transparent blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#FF882A]/8 to-transparent blur-[130px]" />
      </div>

      {/* Centered Kobble-Style Card */}
      <div className="w-full max-w-md bg-white rounded-[28px] border border-[#E2E0D5] shadow-xl p-7 sm:p-9 space-y-6 relative z-10">
        {/* Brand Logo & Header matching Kobble */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-[#6F9C3E] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-transparent" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-[19px] text-[#1A202C] tracking-tight leading-tight">
                Buffermate
              </span>
              <span className="text-[10px] text-[#6B6B60] font-semibold tracking-tight">
                social media · automated
              </span>
            </div>
          </Link>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1A202C] mt-2">
              Start Free Workspace
            </h1>
            <p className="text-xs text-[#6B6B60] mt-1 font-medium">
              Connect up to 3 channels for free. No credit card required.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1A202C]">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E0D5] bg-[#F5F4F0]/40 text-xs sm:text-sm text-[#1A202C] font-medium focus:outline-none focus:border-[#6F9C3E] focus:ring-2 focus:ring-[#6F9C3E]/20 transition-all placeholder:text-[#A0AEC0]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1A202C]">
              Choose Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E0D5] bg-[#F5F4F0]/40 text-xs sm:text-sm text-[#1A202C] font-medium focus:outline-none focus:border-[#6F9C3E] focus:ring-2 focus:ring-[#6F9C3E]/20 transition-all placeholder:text-[#A0AEC0]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0] hover:text-[#1A202C]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F4] rounded-xl border border-[#E2E0D5] text-[11px] text-[#6B6B60] space-y-1">
            <div className="flex items-center gap-1.5 text-[#1A202C] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6F9C3E]" />
              <span>What is included for free:</span>
            </div>
            <div>• 3 Social channels (Instagram, TikTok, Threads, FB, X)</div>
            <div>• 10 posts per channel scheduled in advance</div>
            <div>• Zero credit card required</div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#6F9C3E] hover:bg-[#5f8734] text-white rounded-full text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Workspace...</span>
              </>
            ) : (
              <>
                <span>Create Free Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="pt-4 border-t border-[#EFECE5] text-center text-xs font-medium text-[#6B6B60]">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#1A202C] hover:text-[#6F9C3E] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
