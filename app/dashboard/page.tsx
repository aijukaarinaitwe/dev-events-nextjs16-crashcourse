'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ExternalLink, Ticket } from 'lucide-react';

interface Booking {
    _id: string;
    eventId: {
        _id: string;
        title: string;
        image: string;
        slug: string;
        location: string;
        date: string;
        time: string;
    };
    createdAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, isPending: sessionPending } = useSession();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionPending && !session) {
            router.push('/login?redirect=/dashboard');
        }
    }, [session, sessionPending, router]);

    useEffect(() => {
        if (!session) return;
        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/bookings/me');
                const data = await res.json();
                if (data.success) {
                    setBookings(data.bookings);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <section className="container mx-auto px-5 py-10 space-y-10">
            <div>
                <h1 className="text-4xl text-gradient">My Dashboard</h1>
                <p className="text-light-200 mt-2">Manage your event registrations and bookings.</p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border-dark pb-4">
                    <Ticket className="text-primary w-5 h-5" />
                    <h2 className="text-xl font-semibold text-light-100">My Registrations</h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-dark-100/50 border border-border-dark rounded-xl h-[400px] animate-pulse">
                                <div className="h-48 bg-dark-200 rounded-t-xl" />
                                <div className="p-5 space-y-4">
                                    <div className="h-6 bg-dark-200 rounded w-3/4" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-dark-200 rounded w-1/2" />
                                        <div className="h-4 bg-dark-200 rounded w-1/2" />
                                        <div className="h-4 bg-dark-200 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-dark-100/30 border border-dashed border-border-dark rounded-xl space-y-4">
                        <p className="text-light-200">You haven&apos;t registered for any events yet.</p>
                        <Link href="/events" className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-[6px] hover:bg-primary/90 transition-all">
                            Explore Events
                        </Link>
                    </div>
                ) : (
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {bookings.map((booking) => (
                            <motion.div 
                                key={booking._id} 
                                variants={item}
                                className="bg-dark-100 border border-border-dark rounded-xl overflow-hidden hover:border-primary/30 transition-all group flex flex-col"
                            >
                                <div className="relative h-48 w-full">
                                    <Image 
                                        src={booking.eventId.image || '/placeholder-event.jpg'} 
                                        alt={booking.eventId.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                                        REGISTERED
                                    </div>
                                </div>
                                
                                <div className="p-5 space-y-4 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-light-100 line-clamp-1 group-hover:text-primary transition-colors">
                                        {booking.eventId.title}
                                    </h3>
                                    
                                    <div className="space-y-2 text-sm text-light-200 flex-1">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary/70" />
                                            <span>{booking.eventId.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary/70" />
                                            <span>{booking.eventId.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary/70" />
                                            <span>{booking.eventId.time}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border-dark flex items-center justify-between">
                                        <span className="text-[10px] text-light-300 uppercase tracking-wider">
                                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                        </span>
                                        <Link 
                                            href={`/events/${booking.eventId.slug}`}
                                            className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 text-sm font-medium"
                                        >
                                            View Details <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
