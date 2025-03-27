import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

// Ensure JWT_SECRET is set in environment variables
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function generateAccessToken(id) {
    return await new SignJWT({ id })
        .setProtectedHeader({ alg: "HS256" , typ : "JWT" })
        .setIssuedAt()
        .setExpirationTime("2h") 
        .sign(JWT_SECRET);
}

// Function to refresh the Access Token
async function refreshAccessToken(request, refreshToken) {
    try {
        const { payload } = await jwtVerify(refreshToken, JWT_SECRET);
        if (!payload.id) throw new Error("Invalid RefreshToken: Missing user ID");

        console.log("RefreshToken is valid, generating new AccessToken");

        const newAccessToken = await generateAccessToken(payload.id);
        const response = NextResponse.next();

        response.cookies.set("AccessToken", newAccessToken, {
        });

        return response;
    } catch (err) {
        console.error("RefreshToken is invalid or expired:", err.message);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

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
