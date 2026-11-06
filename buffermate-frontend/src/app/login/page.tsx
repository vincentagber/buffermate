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
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { signInWithMagicLink } from '@/lib/magic-link';

type AuthMethod = 'password' | 'magic-link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signInWithMagicLink(email);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to send magic link');
    } else {
      setMagicLinkSent(true);
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('demo@buffermate.app');
    setPassword('Demo@12345');
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] font-sans antialiased text-[#1A202C] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#6F9C3E]/20 selection:text-[#6F9C3E]">
      {/* Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#6F9C3E]/12 to-transparent blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#FF882A]/8 to-transparent blur-[130px]" />
      </div>

      {/* Centered Auth Card */}
      <div className="w-full max-w-md bg-white rounded-[28px] border border-[#E2E0D5] shadow-xl p-7 sm:p-9 space-y-6 relative z-10">
        {/* Brand Logo & Header */}
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
              Welcome back
            </h1>
            <p className="text-xs text-[#6B6B60] mt-1 font-medium">
              Enter your credentials to access your autonomous workspace
            </p>
          </div>
        </div>

        {/* Auth Method Segmented Control */}
        <div className="inline-flex w-full bg-[#F5F4F0] p-1 rounded-2xl border border-[#E2E0D5]">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
              authMethod === 'password'
                ? 'bg-white text-[#1A202C] shadow-2xs'
                : 'text-[#6B6B60] hover:text-[#1A202C]'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('magic-link');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
              authMethod === 'magic-link'
                ? 'bg-white text-[#1A202C] shadow-2xs'
                : 'text-[#6B6B60] hover:text-[#1A202C]'
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Demo Quick-Fill Pill Banner */}
        <div className="bg-[#FAF8F4] border border-[#E2E0D5] rounded-2xl p-3 flex items-center justify-between text-xs shadow-2xs">
          <div className="space-y-0.5">
            <span className="font-bold text-[#1A202C] flex items-center space-x-1.5 text-[11px]">
              <Key className="w-3.5 h-3.5 text-[#6F9C3E]" />
              <span>Demo Credentials</span>
            </span>
            <p className="text-[11px] text-[#6B6B60] font-mono">
              demo@buffermate.app • Demo@12345
            </p>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="px-2.5 py-1 text-[11px] font-bold text-[#6F9C3E] bg-[#6F9C3E]/10 hover:bg-[#6F9C3E]/20 rounded-lg transition-colors cursor-pointer"
          >
            Fill In
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Magic Link Success View */}
        {magicLinkSent ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 bg-[#6F9C3E]/10 text-[#6F9C3E] rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#1A202C]">Check your inbox</h3>
            <p className="text-xs text-[#6B6B60] leading-relaxed">
              We sent an instant sign-in link to <span className="font-bold text-[#1A202C]">{email}</span>. Click the link to access your workspace.
            </p>
            <button
              type="button"
              onClick={() => setMagicLinkSent(false)}
              className="text-xs font-bold text-[#6F9C3E] hover:underline"
            >
              Use a different sign-in method
            </button>
          </div>
        ) : (
          /* Form Content */
          <form
            onSubmit={authMethod === 'password' ? handlePasswordLogin : handleMagicLink}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A202C]">
                Email Address
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

            {authMethod === 'password' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1A202C]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-bold text-[#6F9C3E] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
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
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#1A202C] hover:bg-[#2D3748] text-white rounded-full text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>{authMethod === 'password' ? 'Sign In to Workspace' : 'Send Magic Link'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Link to Signup */}
        <div className="pt-4 border-t border-[#EFECE5] text-center text-xs font-medium text-[#6B6B60]">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="font-bold text-[#6F9C3E] hover:underline">
            Start Free Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
