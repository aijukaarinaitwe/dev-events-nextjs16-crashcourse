import Link from 'next/link';
import connectDB from '@/database/mongodb';
import Event from '@/database/event.model';
import EventCard from '@/components/EventCard';
import FilterBar from '@/components/FilterBar';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{
        search?: string;
        mode?: string;
        location?: string;
        date?: string;
    }>;
}

export default async function EventsListPage({ searchParams }: Props) {
    await connectDB();
    
    const params = await searchParams;
    const { search, mode, location, date } = params;

    // Build filter object
    const filter: any = {};
    
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }
    
    if (mode && mode !== 'all') {
        filter.mode = mode;
    }
    
    if (location) {
        filter.location = { $regex: location, $options: 'i' };
    }

    if (date) {
        filter.date = date;
    }

    // Fetch filtered events from the database sorted by date (ascending)
    const dbEvents = await Event.find(filter).sort({ date: 1 });

    const eventsList = dbEvents.map((event) => ({
        title: event.title,
        image: event.image,
        slug: event.slug,
        location: event.location,
        date: event.date,
        time: event.time,
    }));

    return (
        <section className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border-dark pb-6 gap-4">
                <div>
                    <h1 className="text-4xl text-gradient">All Developer Events</h1>
                    <p className="text-light-200 mt-2">Discover meetups, hackathons, and conferences around the globe.</p>
                </div>
                <Link
                    href="/events/create/"
                    className="bg-primary hover:bg-primary/95 text-primary-foreground px-6 py-3 rounded-[6px] font-semibold transition-all duration-200 shadow-lg hover:shadow-primary/20 hover:scale-[1.02] text-center max-md:w-full"
                >
                    Add Event
                </Link>
            </div>

            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-dark-100/50 p-6 rounded-xl border border-border-dark animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 bg-dark-200 rounded-[6px]" />
                    ))}
                </div>
            }>
                <FilterBar />
            </Suspense>

            {eventsList.length === 0 ? (
                <div className="text-center py-20 bg-dark-100/50 border border-border-dark rounded-lg">
                    <p className="text-light-200 text-lg">No events found in the database.</p>
                </div>
            ) : (
                <ul className="events grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none">
                    {eventsList.map((event) => (
                        <li key={event.slug} className="list-none">
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
