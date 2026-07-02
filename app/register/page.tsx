'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signUp } from '@/lib/auth-client';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (!success) return;
        if (countdown <= 0) {
            window.location.href = '/login';
            return;
        }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [success, countdown]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setLoading(true);
        setError('');

        await signUp.email(
            {
                name,
                email,
                password,
                callbackURL: `${window.location.origin}/login`,
            },
            {
                onSuccess: () => {
                    setSuccess(true);
                },
                onError: (ctx) => {
                    setError(ctx.error.message || 'Failed to register account. Please check details.');
                    setLoading(false);
                },
            }
        );

        setLoading(false);
    };

    if (success) {
        return (
            <section className="max-w-md mx-auto py-12 px-4 w-full">
                <div className="bg-dark-100 border border-border-dark card-shadow rounded-[10px] p-8 md:p-10">
                    <div id="register-success" className="flex flex-col items-center gap-6 text-center">
                        {/* Animated checkmark */}
                        <div className="relative flex items-center justify-center w-24 h-24">
                            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '1.5s' }} />
                            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/15 border-2 border-primary/40">
                                <svg className="w-11 h-11 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl text-gradient">Account Created!</h1>
                            <p className="text-light-100 font-medium">Welcome to DevEvent, <span className="text-primary">{name}</span>!</p>
                            <p className="text-light-200 text-sm mt-1">
                                Your account has been created successfully. Sign in to start booking events.
                            </p>
                        </div>

                        {/* Email confirmation notice */}
                        <div className="w-full bg-dark-200/60 border border-border-dark rounded-[6px] px-4 py-3 text-sm text-light-200 flex items-start gap-2.5">
                            <span className="text-primary mt-0.5">✉</span>
                            <span>Registered as <span className="text-light-100 font-medium">{email}</span></span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full space-y-1.5">
                            <div className="w-full bg-dark-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all ease-linear"
                                    style={{ width: `${((3 - countdown) / 3) * 100}%`, transitionDuration: '1s' }}
                                />
                            </div>
                            <p className="text-light-200 text-xs text-center">
                                Redirecting to sign-in in <span className="text-primary font-semibold">{countdown}s</span>…
                            </p>
                        </div>

                        <button
                            onClick={() => { window.location.href = '/login'; }}
                            className="bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-3 rounded-[6px] w-full transition-all duration-200"
                        >
                            Sign In Now →
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-md mx-auto py-12 px-4 w-full">
            <div className="text-center mb-8">
                <h1 className="text-4xl text-gradient">Join DevEvent</h1>
                <p className="text-light-200 mt-2">Create an account to book events and connect with developers.</p>
            </div>

            <div className="bg-dark-100 border border-border-dark card-shadow rounded-[10px] p-6 md:p-8 space-y-6">
                <form className="space-y-5" onSubmit={handleRegister}>
                    {error && (
                        <div className="p-4 bg-rose-950/30 border border-rose-500/20 text-rose-400 rounded-md text-sm font-semibold">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label htmlFor="register-name" className="text-sm font-medium text-light-200">
                            Full Name
                        </label>
                        <input
                            id="register-name"
                            type="text"
                            required
                            placeholder="John Doe"
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="register-email" className="text-sm font-medium text-light-200">
                            Email Address
                        </label>
                        <input
                            id="register-email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="register-password" className="text-sm font-medium text-light-200">
                            Password
                        </label>
                        <input
                            id="register-password"
                            type="password"
                            required
                            placeholder="Minimum 8 characters"
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="register-confirm-password" className="text-sm font-medium text-light-200">
                            Confirm Password
                        </label>
                        <input
                            id="register-confirm-password"
                            type="password"
                            required
                            placeholder="Repeat your password"
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        id="register-submit"
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/95 text-black w-full font-semibold py-3 rounded-[6px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Creating Account…' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center text-sm text-light-200 mt-4">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline font-semibold">
                        Sign in here
                    </Link>
                </div>
            </div>
        </section>
    );
}
