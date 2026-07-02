'use client';

import Link from 'next/link';

export default function CreateEventPage() {
    return (
        <section className="max-w-2xl mx-auto space-y-8 py-6 w-full px-4">
            <div className="text-center">
                <h1 className="text-4xl text-gradient">Create New Event</h1>
                <p className="text-light-200 mt-2">Share your event with the global developer community.</p>
            </div>

            <div className="bg-dark-100 border border-border-dark card-shadow rounded-[10px] p-6 md:p-8 space-y-6">
                <div className="space-y-4">
                    <p className="text-amber-400 font-semibold text-center bg-amber-950/20 border border-amber-500/20 p-4 rounded-md text-sm">
                        ⚠️ Note: This is a placeholder page. The interactive event creation workflow is coming soon.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-light-200">Event Title</label>
                        <input 
                            type="text" 
                            disabled 
                            placeholder="e.g. Next.js Conf 2026" 
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 opacity-60 cursor-not-allowed w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-light-200">Date</label>
                            <input 
                                type="date" 
                                disabled 
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 opacity-60 cursor-not-allowed w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-light-200">Time</label>
                            <input 
                                type="text" 
                                disabled 
                                placeholder="e.g. 09:00 AM"
                                className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 opacity-60 cursor-not-allowed w-full"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-light-200">Location / Venue</label>
                        <input 
                            type="text" 
                            disabled 
                            placeholder="e.g. San Francisco, CA" 
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 opacity-60 cursor-not-allowed w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-light-200">Event Mode</label>
                        <select 
                            disabled
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 opacity-60 cursor-not-allowed w-full"
                        >
                            <option>Offline</option>
                            <option>Online</option>
                            <option>Hybrid</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-light-200">Description</label>
                        <textarea 
                            disabled 
                            rows={4}
                            placeholder="Provide a brief description of the event..."
                            className="bg-dark-200 border border-border-dark/50 rounded-[6px] px-5 py-2.5 text-light-200 opacity-60 cursor-not-allowed resize-none w-full"
                        />
                    </div>

                    <button 
                        type="button"
                        className="bg-primary hover:bg-primary/95 text-black w-full font-semibold py-3 rounded-[6px] transition-all duration-200 opacity-50 cursor-not-allowed"
                    >
                        Create Event (Locked)
                    </button>
                </form>
            </div>

            <div className="text-center">
                <Link href="/events/" className="text-primary hover:underline font-medium">
                    ← Back to All Events
                </Link>
            </div>
        </section>
    );
}
