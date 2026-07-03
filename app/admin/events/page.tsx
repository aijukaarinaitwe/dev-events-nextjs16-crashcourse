import Link from "next/link";
import connectDB from "@/database/mongodb";
import Event from "@/database/event.model";
import Booking from "@/database/booking.model";
import DeleteEventButton from "@/components/DeleteEventButton";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    await connectDB();

    const events = await Event.find().sort({ date: -1 });

    // Join total bookings count for each event
    const eventsWithBookings = await Promise.all(
        events.map(async (event) => {
            const count = await Booking.countDocuments({ eventId: event._id });
            return {
                ...JSON.parse(JSON.stringify(event)),
                bookingsCount: count,
            };
        })
    );

    // Calculate KPI Stats
    const totalEvents = events.length;
    const totalBookings = eventsWithBookings.reduce((sum, e) => sum + e.bookingsCount, 0);
    const virtualEvents = events.filter((e) => e.mode === 'online').length;
    const inPersonEvents = events.filter((e) => e.mode === 'offline').length;

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-row justify-between items-center max-sm:flex-col max-sm:items-start gap-4">
                <div>
                    <h1 className="text-4xl text-gradient font-bold">Admin Events Dashboard</h1>
                    <p className="text-light-200 mt-1">Monitor event statistics, bookings, and manage event schedules.</p>
                </div>
                <Link 
                    href="/admin/events/create/" 
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 py-2.5 rounded-[6px] transition-all duration-200 text-sm"
                >
                    + Create Event
                </Link>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-dark-100 border border-border-dark/60 rounded-[10px] p-5 card-shadow">
                    <p className="text-xs font-semibold text-light-200/60 uppercase tracking-wider">Total Events</p>
                    <h3 className="text-3xl font-bold mt-2 text-light-100">{totalEvents}</h3>
                </div>
                <div className="bg-dark-100 border border-border-dark/60 rounded-[10px] p-5 card-shadow">
                    <p className="text-xs font-semibold text-light-200/60 uppercase tracking-wider">Total Registrations</p>
                    <h3 className="text-3xl font-bold mt-2 text-primary">{totalBookings}</h3>
                </div>
                <div className="bg-dark-100 border border-border-dark/60 rounded-[10px] p-5 card-shadow">
                    <p className="text-xs font-semibold text-light-200/60 uppercase tracking-wider">Virtual Events</p>
                    <h3 className="text-3xl font-bold mt-2 text-sky-400">{virtualEvents}</h3>
                </div>
                <div className="bg-dark-100 border border-border-dark/60 rounded-[10px] p-5 card-shadow">
                    <p className="text-xs font-semibold text-light-200/60 uppercase tracking-wider">In-Person/Hybrid</p>
                    <h3 className="text-3xl font-bold mt-2 text-emerald-400">{inPersonEvents}</h3>
                </div>
            </div>

            {/* Events Management Table */}
            <div className="bg-dark-100 border border-border-dark card-shadow rounded-[10px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-200 border-b border-border-dark text-xs font-bold text-light-200 uppercase">
                                <th className="px-6 py-4">Event Info</th>
                                <th className="px-6 py-4">Mode</th>
                                <th className="px-6 py-4">Venue & Location</th>
                                <th className="px-6 py-4 text-center">Registrations</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark/30">
                            {eventsWithBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-light-200">
                                        No events found. Start by creating a new one!
                                    </td>
                                </tr>
                            ) : (
                                eventsWithBookings.map((event) => {
                                    const eventDate = new Date(event.date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    });

                                    return (
                                        <tr key={event._id} className="hover:bg-dark-200/30 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-light-100 text-sm hover:text-primary transition-colors">
                                                    <Link href={`/events/${event.slug}/`}>{event.title}</Link>
                                                </div>
                                                <div className="text-xs text-light-200/65 mt-0.5">{eventDate} • {event.time}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-[4px] text-xs font-bold uppercase tracking-wide ${
                                                    event.mode === 'online' 
                                                        ? 'bg-sky-500/10 text-sky-400' 
                                                        : event.mode === 'hybrid' 
                                                            ? 'bg-purple-500/10 text-purple-400' 
                                                            : 'bg-emerald-500/10 text-emerald-400'
                                                }`}>
                                                    {event.mode}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-light-200">
                                                <div>{event.venue}</div>
                                                <div className="text-xs text-light-200/50 mt-0.5">{event.location}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block bg-primary/10 text-primary font-bold text-xs px-2.5 py-1 rounded-full border border-primary/20">
                                                    {event.bookingsCount}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex flex-row justify-end items-center gap-2">
                                                    <Link 
                                                        href={`/events/${event.slug}/`}
                                                        target="_blank"
                                                        className="bg-secondary border border-border-dark/60 hover:opacity-90 text-secondary-foreground px-3 py-1.5 rounded-[4px] font-semibold text-xs transition-all duration-200"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link 
                                                        href={`/admin/events/${event.slug}/edit/`}
                                                        className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground px-3 py-1.5 rounded-[4px] font-semibold text-xs transition-all duration-200"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <DeleteEventButton id={event._id} title={event.title} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
