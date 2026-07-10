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

        const { eventId, email: submittedEmail } = await req.json();

        // Signed-in users book with their account email; anonymous visitors
        // can register by simply providing an email address.
        const email = session?.user?.email || submittedEmail;

        if (!eventId || typeof eventId !== 'string') {
            return NextResponse.json(
                { success: false, message: 'Valid Event ID is required' },
                { status: 400 }
            );
        }

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { success: false, message: 'A valid email address is required' },
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
