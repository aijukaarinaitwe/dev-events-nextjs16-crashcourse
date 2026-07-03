import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import connectDB from '@/database/mongodb';
import Booking from '@/database/booking.model';
import '@/database/event.model'; // Ensure Event model is registered for populate

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const email = session.user.email;

        // Fetch bookings for the current user and populate event details
        const bookings = await Booking.find({ email })
            .populate('eventId')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, bookings });
    } catch (error: any) {
        console.error('Failed to fetch user bookings:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}
