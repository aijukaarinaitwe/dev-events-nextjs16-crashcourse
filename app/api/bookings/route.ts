import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/database/mongodb';
import Booking from '@/database/booking.model';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { eventId, email } = await req.json();

        if (!eventId || !email) {
            return NextResponse.json(
                { success: false, message: 'Event ID and email are required' },
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
