"use client";

import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

const EventCard = ({ title, image, time, slug, location, date}: Props) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Link href={`/events/${slug}`} id="event-card" className="block group">
                <div className="relative w-full h-[250px] overflow-hidden rounded-lg">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-light-200">
                        <Image src="/icons/pin.svg" alt="location" width={14} height={14} className="opacity-70" style={{ width: 'auto', height: 'auto' }} />
                        <p className="text-xs truncate">{location}</p>
                    </div>

                    <p className="title text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{title}</p>

                    <div className="datetime flex items-center justify-between mt-2 pt-2 border-t border-border-dark/50">
                        <div className="flex items-center gap-1.5 text-xs text-light-300">
                            <Image src="/icons/calendar.svg" alt="calendar" width={12} height={12} className="opacity-60" style={{ width: 'auto', height: 'auto' }} />
                            <p>{date}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-light-300">
                            <Image src="/icons/clock.svg" alt="time" width={12} height={12} className="opacity-60" style={{ width: 'auto', height: 'auto' }} />
                            <p>{time}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
export default EventCard
