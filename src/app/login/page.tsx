'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Zap,
  ArrowRight,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  Key,
} from 'lucide-react';
import { signInWithMagicLink } from '@/lib/magic-link';

type AuthMethod = 'password' | 'magic-link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('demo@buffermate.app');
    setPassword('Demo@12345');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans antialiased text-[#1E293B] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Background ambient gradient blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FED7AA]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFE4D6]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Glass/Dashed Card Container */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-[2.5rem] border-2 border-dashed border-[#CBD5E1] shadow-xl p-6 sm:p-9 space-y-6 relative z-10">
        
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E05A2B] to-[#F97316] text-white flex items-center justify-center font-black shadow-md shadow-orange-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black tracking-tight text-[#1E293B]">BufferMate</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E05A2B]" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1E293B] mt-1.5">
              Welcome back
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        {/* Auth Method Segmented Pill Control */}
        <div className="inline-flex w-full bg-[#F1E9DF] p-1.5 rounded-2xl border border-[#E8DFC9]">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center ${
              authMethod === 'password'
                ? 'bg-white text-[#E05A2B] shadow-xs'
                : 'text-[#64748B] hover:text-[#1E293B]'
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
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center ${
              authMethod === 'magic-link'
                ? 'bg-white text-[#E05A2B] shadow-xs'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Demo Quick-Fill Pill Banner */}
        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-3 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-[#E05A2B] flex items-center space-x-1 text-[11px]">
              <Key className="w-3 h-3" />
              <span>Demo Credentials</span>
            </span>
            <p className="text-[10px] text-[#475569] font-mono">
              demo@buffermate.app • Demo@12345
            </p>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="px-3 py-1.5 bg-[#E05A2B] hover:bg-[#C8491E] text-white rounded-xl text-[11px] font-bold shadow-xs transition-all cursor-pointer"
          >
            1-Click Fill
          </button>
        </div>

        {/* Form */}
        {!magicLinkSent ? (
          <form onSubmit={authMethod === 'password' ? handlePasswordLogin : handleMagicLink} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#334155] uppercase tracking-wider block">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@buffermate.app"
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7] focus:ring-2 focus:ring-[#E05A2B] focus:bg-white focus:outline-hidden transition-all text-[#1E293B]"
                />
              </div>
            </div>

            {/* Password Input (If Password Method) */}
            {authMethod === 'password' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="text-[11px] font-bold text-[#E05A2B] hover:underline flex items-center space-x-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>Fill Demo</span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required={authMethod === 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-[#E2D9CF] text-xs sm:text-sm bg-[#FCFAF7] focus:ring-2 focus:ring-[#E05A2B] focus:bg-white focus:outline-hidden transition-all text-[#1E293B]"
                  />
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-fade-in flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#E05A2B] hover:bg-[#C8491E] disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{authMethod === 'password' ? 'Sign In' : 'Send Magic Link'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Magic Link Sent State */
          <div className="bg-[#FFF0E6] border border-[#FED7AA] rounded-2xl p-5 text-center space-y-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#1E293B]">Magic Link Dispatched</h4>
            <p className="text-xs text-[#64748B]">
              Check your email for the sign-in link sent to <span className="font-bold text-[#1E293B]">{email}</span>.
            </p>
            <button
              type="button"
              onClick={() => {
                setMagicLinkSent(false);
                setError(null);
              }}
              className="text-xs text-[#E05A2B] font-bold hover:underline"
            >
              ← Back to login
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E2D9CF]"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className="flex items-center justify-center py-2.5 px-3 bg-white border border-[#E2D9CF] hover:bg-[#FAF6F0] rounded-2xl text-xs font-bold text-[#334155] transition-all disabled:opacity-50 shadow-xs space-x-2 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn('github')}
            disabled={loading}
            className="flex items-center justify-center py-2.5 px-3 bg-white border border-[#E2D9CF] hover:bg-[#FAF6F0] rounded-2xl text-xs font-bold text-[#334155] transition-all disabled:opacity-50 shadow-xs space-x-2 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current shrink-0 text-[#1E293B]" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Footer Terms & Signup link */}
        <div className="space-y-2.5 pt-3 border-t border-[#F5EFE8] text-center">
          <p className="text-xs text-[#64748B]">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="font-bold text-[#E05A2B] hover:underline">
              Create Account
            </Link>
          </p>

          <p className="text-[11px] text-[#94A3B8]">
            By clicking continue, you agree to our{' '}
            <Link href="#" className="underline hover:text-[#1E293B]">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" className="underline hover:text-[#1E293B]">Privacy Policy</Link>.
          </p>
        </div>

      </div>
    </div>
  );
}
