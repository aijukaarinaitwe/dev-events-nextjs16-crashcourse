'use client';

import Link from "next/link";
import Explorebtn from "@/components/Explorebtn";
import EventCard from "@/components/EventCard";
import {events} from "@/lib/constants";
import { motion } from "framer-motion";

const Page = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <section className="container mx-auto px-5 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center space-y-6"
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    The Hub for Every Dev <br /> 
                    <span className="text-gradient">Event You Can&apos;t Miss!</span>
                </h1>
                
                <p className="text-light-200 text-lg md:text-xl max-w-2xl mx-auto">
                    Hackathons, Meetups, and Conferences. <br className="hidden md:block" />
                    Discover and join the world&apos;s best developer communities.
                </p>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Explorebtn />
                    <Link
                        href="/events/create/"
                        id="create-event-btn"
                        className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-8 py-3.5 rounded-full transition-all duration-200 max-sm:w-full text-center"
                    >
                        Create Event
                    </Link>
                </div>
            </motion.div>

            <motion.div 
                id="events" 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="mt-32 space-y-12"
            >
                <div className="flex items-center justify-between border-b border-border-dark pb-6">
                    <h3 className="text-3xl font-bold">Featured Events</h3>
                    <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <a href="/events" className="text-primary font-medium hover:underline text-sm">View all events →</a>
                    </motion.div>
                </div>

                <motion.ul 
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none"
                >
                    {events.slice(0, 3).map((event) => (
                        <motion.li key={event.slug || event.title} variants={item} className="list-none">
                            <EventCard {...event} />
                        </motion.li>
                    ))}
                </motion.ul>
            </motion.div>
        </section>
    );
};

export default Page;