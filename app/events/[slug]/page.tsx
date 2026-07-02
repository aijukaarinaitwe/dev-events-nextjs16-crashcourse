import Image from 'next/image';
import { notFound } from 'next/navigation';
import connectDB from '@/database/mongodb';
import Event from '@/database/event.model';
import { events } from '@/lib/constants';
import BookingForm from '@/components/BookingForm';

export const dynamic = 'force-dynamic';

function formatDisplayTime(time: string): string {
    if (!time) return '';
    if (/AM|PM/i.test(time)) return time;
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return time;
    const hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
}

interface CustomPageProps {
    params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: CustomPageProps) {
    const { slug } = await params;

    await connectDB();

    // 1. Fetch event from database by slug
    let event = await Event.findOne({ slug });

    // 2. Fallback / Auto-seeding: If event is not in database, check if it is in static constants
    // If it is, seed it to the database so that database functionality (like booking) works properly!
    if (!event) {
        const staticEvent = events.find((e) => e.slug === slug);
        if (staticEvent) {
            try {
                event = await Event.create({
                    title: staticEvent.title,
                    slug: staticEvent.slug,
                    image: staticEvent.image,
                    location: staticEvent.location,
                    date: staticEvent.date,
                    time: staticEvent.time,
                    description: `Join us for ${staticEvent.title}, a premier event happening in ${staticEvent.location}. Network with industry peers, learn from experts, and explore the latest trends in development.`,
                    overview: `A deep dive into ${staticEvent.title} with workshops, speaker sessions, and networking opportunities.`,
                    venue: staticEvent.location === 'Online' ? 'Virtual Platform' : `${staticEvent.location} Center`,
                    mode: staticEvent.location === 'Online' ? 'online' : 'offline',
                    audience: 'Developers, engineers, creators, and technology leaders.',
                    agenda: [
                        '09:00 AM - Opening Keynote',
                        '10:30 AM - Technical Sessions',
                        '12:00 PM - Lunch & Networking Break',
                        '01:30 PM - Panel Discussions & Workshops',
                        '04:30 PM - Wrap-up and Q&A'
                    ],
                    organizer: 'Tech Events Association',
                    tags: ['developer', 'engineering', staticEvent.slug.split('-')[0]]
                });
            } catch (err) {
                console.error('Failed to auto-seed event:', err);
            }
        }
    }

    if (!event) {
        notFound();
    }

    // Format date nicely (e.g. "Friday, October 25, 2026")
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // Keep date exact to what is in database
    });

    return (
        <section id="event">
            <div className="header">
                <span className="pill">{event.mode.toUpperCase()}</span>
                <h1>{event.title}</h1>
                <p className="subheading">{event.description}</p>
            </div>

            <div className="details">
                <div className="content">
                    {/* Render banner image using standard img tag to safely support all remote domains (e.g. unsplash) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={event.image}
                        alt={event.title}
                        className="banner"
                    />

                    <div className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{event.overview}</p>
                    </div>

                    <div className="agenda">
                        <h2>Agenda</h2>
                        <ul>
                            {event.agenda.map((item: string, index: number) => (
                                <li key={index}>{item.replace(/^"(.*)"$/, '$1')}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <div className="flex-row-gap-2">
                            <Image src="/icons/pin.svg" alt="location" width={14} height={14} style={{ width: 'auto', height: 'auto' }} />
                            <p>{event.venue}, {event.location}</p>
                        </div>
                        <div className="flex-row-gap-2">
                            <Image src="/icons/calendar.svg" alt="calendar" width={14} height={14} style={{ width: 'auto', height: 'auto' }} />
                            <p>{eventDate}</p>
                        </div>
                        <div className="flex-row-gap-2">
                            <Image src="/icons/clock.svg" alt="time" width={14} height={14} style={{ width: 'auto', height: 'auto' }} />
                            <p>{formatDisplayTime(event.time)}</p>
                        </div>
                    </div>

                    <div className="flex-col-gap-2">
                        <h2>Organizer</h2>
                        <p>{event.organizer}</p>
                    </div>

                    <div className="flex flex-row flex-wrap gap-2">
                        {event.tags.map((tag: string, index: number) => (
                            <span key={index} className="pill">#{tag.replace(/^"(.*)"$/, '$1')}</span>
                        ))}
                    </div>
                </div>

                <div className="booking">
                    <div className="signup-card">
                        <BookingForm eventId={event._id.toString()} />
                    </div>
                </div>
            </div>
        </section>
    );
}
