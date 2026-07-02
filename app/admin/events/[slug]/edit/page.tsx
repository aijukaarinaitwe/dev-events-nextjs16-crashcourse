import { notFound } from "next/navigation";
import connectDB from "@/database/mongodb";
import Event from "@/database/event.model";
import EditEventForm from "./EditEventForm";

export const dynamic = 'force-dynamic';

interface PageParams {
    params: Promise<{ slug: string }>;
}

export default async function EditEventPage({ params }: PageParams) {
    const { slug } = await params;
    await connectDB();

    const event = await Event.findOne({ slug });
    if (!event) {
        notFound();
    }

    // Convert Mongoose document to plain object for client component safety
    const plainEvent = JSON.parse(JSON.stringify(event));

    return (
        <section className="max-w-2xl mx-auto space-y-8 py-6 w-full px-4">
            <div className="text-center">
                <h1 className="text-4xl text-gradient">Edit Event</h1>
                <p className="text-light-200 mt-2">Modify the details of your event.</p>
            </div>
            <EditEventForm event={plainEvent} />
        </section>
    );
}
