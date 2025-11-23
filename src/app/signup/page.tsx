'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, ArrowRight, Mail, Lock, Loader2, User } from 'lucide-react';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
                    <p className="text-slate-600 mb-8">
                        We've sent a confirmation link to <span className="font-medium text-slate-900">{email}</span>.
                        Please click the link to activate your account.
                    </p>
                    <Link href="/login" className="btn-primary w-full flex justify-center py-3">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Brand/Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 z-10"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1644426358812-879f02d1d867?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] opacity-20 z-20 mix-blend-overlay"></div>

                <div className="relative z-30 flex flex-col justify-between p-12 h-full text-white">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-tight">Buffermate</span>
                    </div>

                    <div className="max-w-md">
                        <h2 className="font-heading text-4xl font-bold mb-6 leading-tight">
                            Start your journey to social media mastery.
                        </h2>
                        <p className="text-blue-100 text-lg">
                            Create, schedule, and analyze your content with the power of AI.
                        </p>
                    </div>

                    <div className="text-sm text-slate-400">
                        © 2025 Buffermate Inc. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900">Create an account</h2>
                        <p className="mt-2 text-slate-600">
                            Get started with your 14-day free trial.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all"
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium animate-fade-in-up">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
