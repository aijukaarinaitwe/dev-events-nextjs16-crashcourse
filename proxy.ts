import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const sessionCookie = request.cookies.get("better-auth.session_token");

    // Guard admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
        if (!sessionCookie) {
            return NextResponse.redirect(
                new URL("/login?redirect=" + encodeURIComponent(request.nextUrl.pathname), request.url)
            );
        }

        try {
            const baseUrl = request.nextUrl.origin;
            // Fetch session securely using the local API handler
            const res = await fetch(`${baseUrl}/api/auth/get-session`, {
                headers: {
                    cookie: request.headers.get("cookie") || ""
                }
            });

            if (!res.ok) {
                return NextResponse.redirect(new URL("/login/", request.url));
            }

            const sessionData = await res.json();
            
            if (!sessionData || !sessionData.user || sessionData.user.role !== "admin") {
                // Non-admins are redirected back to the public events list page
                return NextResponse.redirect(new URL("/events/", request.url));
            }
        } catch (e) {
            console.error("Admin middleware verification failed:", e);
            return NextResponse.redirect(new URL("/login/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
