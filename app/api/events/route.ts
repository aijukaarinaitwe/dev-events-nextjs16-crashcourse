import connectDB from "@/database/mongodb";
import Event from "@/database/event.model";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

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

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const contentType = req.headers.get("content-type") || "";
        let eventData: EventDataInput = {};

        if (contentType.includes("application/json")) {
            // --- JSON body ---
            try {
                eventData = await req.json();
            } catch (jsonErr) {
                return NextResponse.json(
                    { message: 'Invalid JSON body', error: jsonErr instanceof Error ? jsonErr.message : 'Parsing failed' },
                    { status: 400 }
                );
            }
        } else if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
            // --- FormData body ---
            try {
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
                } else if (!eventData.image) {
                    return NextResponse.json({ message: 'Image file or URL is required' }, { status: 400 });
                }
            } catch (formErr) {
                return NextResponse.json(
                    { message: 'Invalid form data', error: formErr instanceof Error ? formErr.message : 'Parsing failed' },
                    { status: 400 }
                );
            }
        } else {
            // --- Unknown content type: try JSON first, then FormData ---
            try {
                eventData = await req.clone().json();
            } catch {
                try {
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
                } catch {
                    return NextResponse.json(
                        { message: 'Unsupported or missing Content-Type header. Use application/json or multipart/form-data.' },
                        { status: 415 }
                    );
                }
            }
        }

        const createdEvent = await Event.create({
            ...eventData,
            tags: parseArray(eventData.tags),
            agenda: parseArray(eventData.agenda),
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error("POST /api/events error:", e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
    }
}