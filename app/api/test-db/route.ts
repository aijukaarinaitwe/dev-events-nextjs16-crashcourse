import { NextResponse } from 'next/server';
import connectDB from '@/database/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({ success: true, message: 'Database connected successfully' });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
