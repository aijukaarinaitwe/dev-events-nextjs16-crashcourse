import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const { GET: authGET, POST: authPOST } = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    if (url.pathname.endsWith("/")) {
        url.pathname = url.pathname.slice(0, -1);
        const modifiedRequest = new NextRequest(url, request);
        return authGET(modifiedRequest);
    }
    return authGET(request);
}

export async function POST(request: NextRequest) {
    const url = new URL(request.url);
    if (url.pathname.endsWith("/")) {
        url.pathname = url.pathname.slice(0, -1);
        const modifiedRequest = new NextRequest(url, request);
        return authPOST(modifiedRequest);
    }
    return authPOST(request);
}
