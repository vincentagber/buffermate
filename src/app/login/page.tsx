'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, ArrowRight, Mail, Lock, Loader2, Github } from 'lucide-react';
import { signInWithMagicLink } from '@/lib/magic-link';
import { OAUTH_PROVIDERS, getOAuthConfig } from '@/lib/oauth-config';

type AuthMethod = 'password' | 'magic-link' | 'oauth';

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

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
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

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Side - Brand/Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 via-black to-black z-10"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1644426358812-879f02d1d867?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] opacity-20 z-20"></div>

                <div className="relative z-30 flex flex-col justify-between p-12 h-full text-white">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-tight">Buffermate</span>
                    </div>



                    <div className="text-sm text-white/40">
                        © 2025 Buffermate AI. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="font-heading text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={authMethod === 'password' ? handlePasswordLogin : handleMagicLink}>
                        {!magicLinkSent ? (
                            <>
                                <div className="flex space-x-2 p-1 bg-muted rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setAuthMethod('password')}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                                            authMethod === 'password'
                                                ? 'bg-background text-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAuthMethod('magic-link')}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                                            authMethod === 'magic-link'
                                                ? 'bg-background text-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Magic Link
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    {authMethod === 'password' && (
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                required={authMethod === 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium animate-[fade-in_0.3s_ease-out]">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            Sign In {authMethod === 'magic-link' ? 'with Magic Link' : ''}
                                            {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <div className="space-y-4 text-center">
                                <div className="p-4 rounded-lg bg-primary/10 text-primary">
                                    <p className="font-medium">✓ Magic link sent!</p>
                                    <p className="text-sm mt-1">Check your email for the sign-in link.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMagicLinkSent(false);
                                        setEmail('');
                                        setError(null);
                                    }}
                                    className="text-sm text-primary hover:text-primary/80 font-medium"
                                >
                                    Back to login
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-input"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleOAuthSignIn('google')}
                            disabled={loading}
                            className="flex items-center justify-center py-3 px-4 border border-input rounded-lg hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Google
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleOAuthSignIn('github')}
                            disabled={loading}
                            className="flex items-center justify-center py-3 px-4 border border-input rounded-lg hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <Github className="w-5 h-5 mr-2" />
                                    GitHub
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{' '}
                        <Link href="#" className="font-medium text-primary hover:text-primary/80">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="#" className="font-medium text-primary hover:text-primary/80">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div >
            </div >
        </div >
    );
}
