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
    <div className="min-h-screen bg-[#E2E0D5] font-sans antialiased text-[#000000] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#00784D]/30 selection:text-[#000000]">
      {/* Ambient Gradient Glow Layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#07B979]/15 to-transparent blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#141416]/10 to-transparent blur-[130px]" />
      </div>

      {/* Centered Auth Card */}
      <div className="w-full max-w-md bg-white rounded-[28px] border border-[#141416]/15 shadow-xl p-7 sm:p-9 space-y-6 relative z-10">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00784D] to-[#07B979] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0 border border-[#00784D]/20">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-transparent" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-[19px] text-[#000000] tracking-tight leading-tight">
                Buffermate
              </span>
              <span className="text-[10px] text-[#141416]/70 font-semibold tracking-tight">
                social media · automated
              </span>
            </div>
          </Link>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#000000] mt-2">
              Welcome back
            </h1>
            <p className="text-xs text-[#141416]/70 mt-1 font-medium">
              Enter your credentials to access your autonomous workspace
            </p>
          </div>
        </div>

        {/* Auth Method Segmented Control */}
        <div className="inline-flex w-full bg-[#E2E0D5]/50 p-1 rounded-2xl border border-[#141416]/10">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
              authMethod === 'password'
                ? 'bg-[#00784D] text-white shadow-2xs'
                : 'text-[#141416]/70 hover:text-[#000000]'
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
                ? 'bg-[#00784D] text-white shadow-2xs'
                : 'text-[#141416]/70 hover:text-[#000000]'
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Demo Quick-Fill Pill Banner */}
        <div className="bg-[#E2E0D5]/30 border border-[#141416]/10 rounded-2xl p-3 flex items-center justify-between text-xs shadow-2xs">
          <div className="space-y-0.5">
            <span className="font-bold text-[#000000] flex items-center space-x-1.5 text-[11px]">
              <Key className="w-3.5 h-3.5 text-[#141416]" />
              <span>Demo Credentials</span>
            </span>
            <p className="text-[11px] text-[#141416]/70 font-mono">
              demo@buffermate.app • Demo@12345
            </p>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#00784D] hover:bg-[#07B979] border border-[#07B979]/40 rounded-lg transition-colors cursor-pointer"
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
            <div className="w-12 h-12 bg-[#00784D]/15 text-[#00784D] border border-[#07B979]/40 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-[#00784D]" />
            </div>
            <h3 className="font-extrabold text-base text-[#000000]">Check your inbox</h3>
            <p className="text-xs text-[#141416]/70 leading-relaxed">
              We sent an instant sign-in link to <span className="font-bold text-[#000000]">{email}</span>. Click the link to access your workspace.
            </p>
            <button
              type="button"
              onClick={() => setMagicLinkSent(false)}
              className="text-xs font-bold text-[#00784D] underline decoration-[#07B979] decoration-2 hover:text-[#000000]"
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
              <label className="text-xs font-bold text-[#000000]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141416]/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#141416]/15 bg-white text-xs sm:text-sm text-[#000000] font-medium focus:outline-none focus:border-[#00784D] focus:ring-2 focus:ring-[#07B979]/40 transition-all placeholder:text-[#141416]/40"
                />
              </div>
            </div>

            {authMethod === 'password' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#000000]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-bold text-[#141416] hover:underline decoration-[#00784D]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141416]/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#141416]/15 bg-white text-xs sm:text-sm text-[#000000] font-medium focus:outline-none focus:border-[#00784D] focus:ring-2 focus:ring-[#07B979]/40 transition-all placeholder:text-[#141416]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#141416]/40 hover:text-[#000000]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#00784D] hover:bg-[#07B979] text-white border border-[#07B979]/30 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="pt-4 border-t border-[#141416]/10 text-center text-xs font-medium text-[#141416]/70">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="font-bold text-[#000000] underline decoration-[#00784D] decoration-2 hover:text-[#141416]">
            Start Free Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
