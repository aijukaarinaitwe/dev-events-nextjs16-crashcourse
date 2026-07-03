import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import connectDB from '@/database/mongodb';
import Booking from '@/database/booking.model';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'You must be signed in to book an event' },
                { status: 401 }
            );
        }

        const { eventId } = await req.json();
        const email = session.user.email;

        if (!eventId || typeof eventId !== 'string') {
            return NextResponse.json(
                { success: false, message: 'Valid Event ID is required' },
                { status: 400 }
            );
        }

        // Create booking
        const booking = await Booking.create({ eventId, email });

        return NextResponse.json(
            { success: true, message: 'Successfully registered for this event!', booking },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Booking registration failed:', error);

        // Handle duplicate key error (already registered)
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: 'You have already registered for this event!' },
                { status: 400 }
            );
        }

        // Handle validation errors (e.g. invalid email format)
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
