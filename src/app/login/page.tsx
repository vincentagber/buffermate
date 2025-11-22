'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
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

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            setError('Check your email for the confirmation link.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Side - Brand/Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 via-black to-black z-10"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-20"></div>

                <div className="relative z-30 flex flex-col justify-between p-12 h-full text-white">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-tight">Buffermate</span>
                    </div>

                    <div className="max-w-md">
                        <h2 className="font-heading text-4xl font-bold mb-6 leading-tight">
                            Automate your growth with intelligent scheduling.
                        </h2>
                        <p className="text-white/60 text-lg">
                            Join thousands of creators who trust Buffermate to manage their social presence efficiently.
                        </p>
                    </div>

                    <div className="text-sm text-white/40">
                        © 2024 Buffermate AI. All rights reserved.
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

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium animate-[fade-in_0.3s_ease-out]">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col space-y-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                            </button>

                            <button
                                type="button"
                                onClick={handleSignUp}
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-input rounded-lg shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>

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
                </div>
            </div>
        </div>
    );
}
