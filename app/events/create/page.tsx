import Link from 'next/link';
import CreateEventForm from '@/components/CreateEventForm';

export default function CreateEventPage() {
    return (
        <section className="max-w-2xl mx-auto space-y-8 py-6 w-full px-4">
            <div className="text-center">
                <h1 className="text-4xl text-gradient">Create New Event</h1>
                <p className="text-light-200 mt-2">Share your event with the global developer community.</p>
            </div>

            <CreateEventForm />

            <div className="text-center">
                <Link href="/events/" className="text-primary hover:underline font-medium">
                    ← Back to Events
                </Link>
            </div>
        </section>
    );
}
