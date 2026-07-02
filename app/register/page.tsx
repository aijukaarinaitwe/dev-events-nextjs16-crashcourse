'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth-client';

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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

        try {
            const { error: signUpErr } = await signUp.email({
                name,
                email,
                password,
            });

            if (signUpErr) {
                setError(signUpErr.message || 'Failed to register account. Please check details.');
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login/');
                }, 2000);
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('A network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-md mx-auto py-12 px-4 w-full">
            <div className="text-center mb-8">
                <h1 className="text-4xl text-gradient">Join DevEvent</h1>
                <p className="text-light-200 mt-2">Create an account to book events and connect with developers.</p>
            </div>

            <div className="bg-dark-100 border border-border-dark card-shadow rounded-[10px] p-6 md:p-8 space-y-6">
                {success ? (
                    <div className="text-center py-6 space-y-3">
                        <div className="text-4xl">🎉</div>
                        <h3 className="text-xl font-bold text-gradient">Registration Successful!</h3>
                        <p className="text-light-200 text-sm">Redirecting you to the sign-in page...</p>
                    </div>
                ) : (
                    <form className="space-y-5" onSubmit={handleRegister}>
                        {error && (
                            <div className="p-4 bg-rose-950/30 border border-rose-500/20 text-rose-400 rounded-md text-sm font-semibold">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-sm font-medium text-light-200">
                                Full Name
                            </label>
                            <input 
                                id="name"
                                type="text" 
                                required
                                placeholder="John Doe" 
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-light-200">
                                Email Address
                            </label>
                            <input 
                                id="email"
                                type="email" 
                                required
                                placeholder="you@example.com" 
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-medium text-light-200">
                                Password
                            </label>
                            <input 
                                id="password"
                                type="password" 
                                required
                                placeholder="Minimum 8 characters" 
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-light-200">
                                Confirm Password
                            </label>
                            <input 
                                id="confirmPassword"
                                type="password" 
                                required
                                placeholder="Repeat your password" 
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 w-full focus:outline-none focus:border-primary/50"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/95 text-black w-full font-semibold py-3 rounded-[6px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                )}

                {!success && (
                    <div className="text-center text-sm text-light-200 mt-4">
                        Already have an account?{' '}
                        <Link href="/login/" className="text-primary hover:underline font-semibold">
                            Sign in here
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
