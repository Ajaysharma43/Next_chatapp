import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { refreshAccessToken } from "./MiddlewareFunctions/GenerateToken";
import { headers } from "next/headers";
import { DashboardAccess } from "./MiddlewareFunctions/DashBoardAccess";
import { jwtDecode } from "jwt-decode";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
    const accessToken = request.cookies.get("AccessToken")?.value;
    const refreshToken = request.cookies.get("RefreshToken")?.value;
    const pathname = request.nextUrl.pathname;

    // 1. If no accessToken, try refresh or allow access to login
    if (!accessToken) {
        console.log("AccessToken is missing, trying to refresh...");
        if (pathname.startsWith("/login")) {
            return NextResponse.next(); // Let them stay on login
        }
        return refreshAccessToken(request, refreshToken);
    }

    try {
        await jwtVerify(accessToken, JWT_SECRET);
        console.log("AccessToken is valid");

        // 2. If user is authenticated and on login, redirect to home
        if (pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // 3. Check dashboard access
        if (pathname.startsWith('/dashboard')) {
            const decode = jwtDecode(accessToken);
            return DashboardAccess(decode.role, request);
        }

    } catch (err) {
        console.error("AccessToken is invalid or expired:", err.message);
        if (pathname.startsWith("/login")) {
            return NextResponse.next(); // Allow login for invalid tokens
        }
        return await refreshAccessToken(request, refreshToken);
    }

    return NextResponse.next();
}



export const config = {
    matcher: ["/", "/Findusers", "/friends", "/Requests" , "/groups", "/dashboard", "/dashboard/profile" , "/login"],
};
