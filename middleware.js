import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { refreshAccessToken } from "./MiddlewareFunctions/GenerateToken";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
    const accessToken = request.cookies.get("AccessToken")?.value;
    const refreshToken = request.cookies.get("RefreshToken")?.value;

    if (!refreshToken) {
        console.log("RefreshToken is missing");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!accessToken) {
        console.log("AccessToken is missing, trying to refresh...");
        return refreshAccessToken(request, refreshToken);
    }

    try {
        await jwtVerify(accessToken, JWT_SECRET);
        console.log("AccessToken is valid");
        return NextResponse.next();
    } catch (err) {
        console.error("AccessToken is invalid or expired:", err.message);
        return await refreshAccessToken(request, refreshToken);
    }
}


export const config = {
    matcher: ["/"],
};
