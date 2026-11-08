import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    const isAuthPage =
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/verify");

    const isDashboard =
        url.pathname.startsWith("/dashboard");

    const isHome =
        url.pathname === "/";

    // User is logged in
    if (token) {

        // Don't allow logged-in users to access auth pages
        if (isAuthPage) {
            return NextResponse.redirect(
                new URL("/dashboard", request.url)
            );
        }

        // Root → dashboard
        if (isHome) {
            return NextResponse.redirect(
                new URL("/dashboard", request.url)
            );
        }

        if(!token && url.pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('sign-in', request.url));
        }

        return NextResponse.next();
    }

    // User is NOT logged in

    // Protect dashboard
    if (isDashboard) {
        return NextResponse.redirect(
            new URL("/sign-in", request.url)
        );
    }

    // Allow auth pages and other public pages
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/sign-in/:path*",
        "/sign-up/:path*",
        "/verify/:path*",
        "/dashboard/:path*",
    ],
};