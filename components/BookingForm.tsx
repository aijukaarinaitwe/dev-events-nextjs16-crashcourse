'use client';

import { useState } from 'react';

interface BookingFormProps {
    eventId: string;
}

const BookingForm = ({ eventId }: BookingFormProps) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

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
                setEmail('');
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
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={status === 'loading'}
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
