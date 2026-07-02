'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';

interface BookingFormProps {
    eventId: string;
}

const BookingForm = ({ eventId }: BookingFormProps) => {
    const { data: session, isPending } = useSession();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        if (session?.user?.email) {
            setEmail(session.user.email);
        }
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eventId, email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Successfully registered!');
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error booking event:', error);
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    if (isPending) {
        return (
            <div id="book-event" className="flex items-center justify-center p-6 bg-dark-100 border border-border-dark rounded-[10px]">
                <p className="text-light-200 text-sm">Checking authentication...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div id="book-event" className="p-6 bg-dark-100 border border-border-dark rounded-[10px] space-y-4 text-center">
                <h3>Book this Event</h3>
                <p className="text-sm text-light-200">You must have an account to register for this event.</p>
                <Link 
                    href={`/login?redirect=${encodeURIComponent(currentPath)}`}
                    className="inline-block bg-primary hover:bg-primary/95 text-black font-semibold px-6 py-2.5 rounded-[6px] transition-all duration-200 text-sm"
                >
                    Sign in to Book Event
                </Link>
            </div>
        );
    }

    return (
        <div id="book-event">
            <h3>Book this Event</h3>
            
            {status === 'success' ? (
                <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 rounded-[6px] text-emerald-400 text-center">
                    <p className="text-sm font-semibold">{message}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-light-200">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email to book"
                            value={email}
                            readOnly
                            required
                            disabled
                            className="cursor-not-allowed opacity-70 bg-dark-200"
                        />
                    </div>
                    
                    {status === 'error' && (
                        <p className="text-rose-500 text-sm font-semibold">{message}</p>
                    )}

                    <button type="submit" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Registering...' : 'Register Now'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default BookingForm;

