import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/mongodb";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        let eventData;
        const contentType = req.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            try {
                eventData = await req.json();
            } catch (jsonErr) {
                return NextResponse.json(
                    { message: 'Invalid JSON body', error: jsonErr instanceof Error ? jsonErr.message : 'Parsing failed' },
                    { status: 400 }
                );
            }
        } else
        {
            try {
                const formData = await req.formData();
                eventData = Object.fromEntries(formData.entries());
            } catch (formErr) {
                return NextResponse.json(
                    { message: 'Invalid form data', error: formErr instanceof Error ? formErr.message : 'Parsing failed' },
                    { status: 400 }
                );
            }
        }

        // Process fields like agenda and tags if they are comma-separated strings, but the schema expects arrays
        if (typeof eventData.agenda === "string") {
            try {
                eventData.agenda = JSON.parse(eventData.agenda);
            } catch {
                eventData.agenda = eventData.agenda.split(",").map((s: string) => s.trim()).filter(Boolean);
            }
        }
        if (typeof eventData.tags === "string") {
            try {
                eventData.tags = JSON.parse(eventData.tags);
            } catch {
                eventData.tags = eventData.tags.split(",").map((s: string) => s.trim()).filter(Boolean);
            }
        }

        const createdEvent = await Event.create(eventData);

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error("POST /api/events error:", e);
        
        // Return 400 for Mongoose validation or casting errors
        if (e instanceof Error && (e.name === 'ValidationError' || e.name === 'CastError')) {
            return NextResponse.json(
                { message: 'Validation Failed', error: e.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Internal Server Error', error: e instanceof Error ? e.message : 'Unknown' },
            { status: 500 }
        );
    }
}