import { jwtVerify, SignJWT } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateAccessToken(id , role , username) {
    return await new SignJWT({ id , role , username})
        .setProtectedHeader({ alg: "HS256" , typ : "JWT" })
        .setIssuedAt()
        .setExpirationTime("2h") 
        .sign(JWT_SECRET);
}

export async function refreshAccessToken(request, refreshToken) {
    try {
        const { payload } = await jwtVerify(refreshToken, JWT_SECRET);
        if (!payload.id) throw new Error("Invalid RefreshToken: Missing user ID");

        const newAccessToken = await generateAccessToken(payload.id , payload.role , payload.username , payload.profile);
        const response = NextResponse.next();

        response.cookies.set("AccessToken", newAccessToken, {
        });

        return response;
    } catch (err) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}