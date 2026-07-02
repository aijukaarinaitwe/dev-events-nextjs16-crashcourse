'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/auth-client';

function LoginFormContent() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (!success) return;
        if (countdown <= 0) {
            window.location.href = redirectUrl;
            return;
        }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [success, countdown, redirectUrl]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error: signInErr } = await signIn.email({ email, password });

            if (signInErr) {
                setError(signInErr.message || 'Invalid credentials. Please try again.');
            } else {
                setSuccess(true);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('A network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div id="login-success" className="flex flex-col items-center gap-6 py-6 text-center">
                {/* Animated checkmark */}
                <div className="relative flex items-center justify-center w-20 h-20">
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '1.5s' }} />
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/40">
                        <svg className="w-9 h-9 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold text-gradient">Welcome back!</h2>
                    <p className="text-light-200 text-sm">You&apos;ve signed in successfully.</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-dark-200 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all ease-linear"
                        style={{ width: `${((3 - countdown) / 3) * 100}%`, transitionDuration: '1s' }}
                    />
                </div>
                <p className="text-light-200 text-xs">
                    Redirecting in <span className="text-primary font-semibold">{countdown}s</span>…
                </p>

                <button
                    onClick={() => { window.location.href = redirectUrl; }}
                    className="bg-primary hover:bg-primary/90 text-black font-semibold px-6 py-2.5 rounded-[6px] text-sm transition-all duration-200"
                >
                    Continue now →
                </button>
            </div>
        );
    }

    return (
        <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
                <div className="p-4 bg-rose-950/30 border border-rose-500/20 text-rose-400 rounded-md text-sm font-semibold">
                    ⚠️ {error}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label htmlFor="login-email" className="text-sm font-medium text-light-200">
                    Email Address
                </label>
                <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="login-password" className="text-sm font-medium text-light-200">
                    Password
                </label>
                <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button
                type="submit"
                id="login-submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/95 text-black w-full font-semibold py-3 rounded-[6px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
                {loading ? 'Signing In…' : 'Sign In'}
            </button>
        </form>
    );
}

export default function LoginPage() {
    return (
        <section className="max-w-md mx-auto py-12 px-4 w-full">
            <div className="text-center mb-8">
                <h1 className="text-4xl text-gradient">Welcome Back</h1>
                <p className="text-light-200 mt-2">Sign in to book events and manage registrations.</p>
            </div>

            <div className="bg-dark-100 border border-border-dark card-shadow rounded-[10px] p-6 md:p-8 space-y-6">
                <Suspense fallback={<div className="text-center text-light-200">Loading…</div>}>
                    <LoginFormContent />
                </Suspense>

                <div className="text-center text-sm text-light-200 mt-4">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-primary hover:underline font-semibold">
                        Sign up here
                    </Link>
                </div>
            </div>
        </section>
    );
}
