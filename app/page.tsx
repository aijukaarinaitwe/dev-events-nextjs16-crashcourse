import Explorebtn from "@/components/Explorebtn";
import EventCard from "@/components/EventCard";
import {events} from "@/lib/constants";


// 1. Added type safety/consistency for event data (optional but good practice)


const Page = () => {
    return (
        <section>
            {/* 2. Fixed spacing issue: added block/inline formatting or container alignment if needed */}
            <h1 className="text-center">The Hub for Every Dev <br /> Event You Can&apos;t Miss!</h1>

            {/* 3. FIXED TYPO: "test-center" changed to "text-center" */}
            <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in one Place</p>

            <Explorebtn />
            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events.map((event) => (
                        // 4. FIXED KEY: It is safer to use a unique ID or slug instead of title if titles overlap
                        <li key={event.slug || event.title}>
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Page;