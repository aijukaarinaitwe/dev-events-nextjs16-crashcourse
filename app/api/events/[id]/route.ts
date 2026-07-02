import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import connectDB from "@/database/mongodb";
import Event from "@/database/event.model";
import Booking from "@/database/booking.model";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

interface RouteParams {
    params: Promise<{ id: string }>;
}

function parseArray(value: string | string[] | undefined): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
        return value.split(",").map((s) => s.trim()).filter(Boolean);
    }
}

interface EventDataInput {
    title?: string;
    description?: string;
    overview?: string;
    image?: string;
    venue?: string;
    location?: string;
    date?: string;
    time?: string;
    mode?: string;
    audience?: string;
    organizer?: string;
    tags?: string | string[];
    agenda?: string | string[];
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();
        const { id } = await params;

        // Ensure user is authenticated and has the admin role
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 401 });
        }

        const contentType = req.headers.get("content-type") || "";
        let eventData: EventDataInput = {};

        if (contentType.includes("application/json")) {
            eventData = await req.json();
        } else if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
            const formData = await req.formData();
            eventData = Object.fromEntries(formData.entries()) as EventDataInput;

            const file = formData.get('image');
            if (file && file instanceof File && file.size > 0) {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                        if (error) return reject(error);
                        resolve(results);
                    }).end(buffer);
                });

                eventData.image = (uploadResult as { secure_url: string }).secure_url;
            }
        } else {
            return NextResponse.json({ message: "Unsupported Content-Type" }, { status: 415 });
        }

        // Process fields to match event schema formats
        const updatePayload: any = { ...eventData };
        if (eventData.tags !== undefined) updatePayload.tags = parseArray(eventData.tags);
        if (eventData.agenda !== undefined) updatePayload.agenda = parseArray(eventData.agenda);

        // Fetch old event to auto-generate overview if not provided but description changed
        const existingEvent = await Event.findById(id);
        if (!existingEvent) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        if (!updatePayload.overview && updatePayload.description) {
            updatePayload.overview = updatePayload.description.slice(0, 150) + '...';
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, updatePayload, { new: true });

        return NextResponse.json({ message: "Event updated successfully", event: updatedEvent }, { status: 200 });
    } catch (e) {
        console.error("PUT /api/events/[id] error:", e);
        return NextResponse.json({ message: "Failed to update event", error: e instanceof Error ? e.message : "Unknown" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();
        const { id } = await params;

        // Ensure user is authenticated and has the admin role
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 401 });
        }

        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        // Delete associated bookings
        await Booking.deleteMany({ eventId: id });

        return NextResponse.json({ message: "Event and associated bookings deleted successfully" }, { status: 200 });
    } catch (e) {
        console.error("DELETE /api/events/[id] error:", e);
        return NextResponse.json({ message: "Failed to delete event", error: e instanceof Error ? e.message : "Unknown" }, { status: 500 });
    }
}
