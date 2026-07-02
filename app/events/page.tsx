import Link from 'next/link';
import connectDB from '@/database/mongodb';
import Event from '@/database/event.model';
import EventCard from '@/components/EventCard';

export const dynamic = 'force-dynamic';

export default async function EventsListPage() {
    await connectDB();
    
    // Fetch all events from the database sorted by date (ascending)
    const dbEvents = await Event.find({}).sort({ date: 1 });

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
                {/* Dummy Button for Adding an Event */}
                <Link 
                    href="/events/create/" 
                    className="bg-primary hover:bg-primary/95 text-black px-6 py-3 rounded-[6px] font-semibold transition-all duration-200 shadow-lg hover:shadow-primary/20 hover:scale-[1.02] text-center max-md:w-full"
                >
                    Add Event
                </Link>
            </div>

            {eventsList.length === 0 ? (
                <div className="text-center py-20 bg-dark-100/50 border border-border-dark rounded-lg">
                    <p className="text-light-200 text-lg">No events found in the database.</p>
                </div>
            ) : (
                <ul className="events">
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
