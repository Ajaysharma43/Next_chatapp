import { jwtVerify, SignJWT } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateAccessToken(id , role) {
    return await new SignJWT({ id , role })
        .setProtectedHeader({ alg: "HS256" , typ : "JWT" })
        .setIssuedAt()
        .setExpirationTime("2h") 
        .sign(JWT_SECRET);
}

export async function refreshAccessToken(request, refreshToken) {
    try {
        const { payload } = await jwtVerify(refreshToken, JWT_SECRET);
        if (!payload.id) throw new Error("Invalid RefreshToken: Missing user ID");

        console.log("RefreshToken is valid, generating new AccessToken");

        const newAccessToken = await generateAccessToken(payload.id , payload.role);
        const response = NextResponse.next();

        response.cookies.set("AccessToken", newAccessToken, {
        });

        return response;
    } catch (err) {
        console.error("RefreshToken is invalid or expired:", err.message);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}