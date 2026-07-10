import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Password-only sign-in for the admin account. The admin's email is resolved
// server-side from ADMIN_EMAILS so it never needs to be entered (or exposed) client-side.
export async function POST(req: NextRequest) {
    let password: unknown;

    try {
        const body = await req.json();
        password = body?.password;
    } catch {
        return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
        return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);

    for (const email of adminEmails) {
        try {
            const response = await auth.api.signInEmail({
                body: { email, password },
                asResponse: true,
            });

            if (response.ok) {
                return new NextResponse(response.body, {
                    status: response.status,
                    headers: response.headers,
                });
            }
        } catch {
            // Wrong password / lookup failure for this admin email — try the next one.
        }
    }

    return NextResponse.json(
        { success: false, message: 'Invalid admin password' },
        { status: 401 }
    );
}
