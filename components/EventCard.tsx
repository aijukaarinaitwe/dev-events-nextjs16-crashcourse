import Link from "next/link";
import Image from "next/image";

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
        <Link href={`/events/${slug}`} id="event-card">
            <div className="relative w-full h-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
            <div className="flex flex-row-gap-2">
                <Image src="/icons/pin.svg" alt="location" width={14} height={14} style={{ width: 'auto', height: 'auto' }} />
                <p>{location}</p>
            </div>

            <p className="title">{title}</p>

            <div className="datetime">
                <div>
                    <Image src="/icons/calendar.svg" alt="calendar" width={14} height={14} style={{ width: 'auto', height: 'auto' }} />
                    <p>{date}</p>
                </div>
                <div>
                    <Image src="/icons/clock.svg" alt="time" width={14} height={14} style={{ width: 'auto', height: 'auto' }} />
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}
export default EventCard
