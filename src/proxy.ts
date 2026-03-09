import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

    if (isAuthPage) {
        if (token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return null;
    }

    if (!token) {
        let from = req.nextUrl.pathname;
        if (req.nextUrl.search) {
            from += req.nextUrl.search;
        }
        return NextResponse.redirect(
            new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
        );
    }
}

export const config = {
    matcher: ["/checkout/:path*", "/profile/:path*", "/login", "/register"],
};
