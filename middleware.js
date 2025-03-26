import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
    const RefreshToken = request.cookies.get("RefreshToken");
    const AccessToken = request.cookies.get("AccessToken");

    if (!AccessToken) {
        console.log("AccessToken is missing");

        if (RefreshToken) {
            const refreshTokenValue = RefreshToken?.value;
            if (!refreshTokenValue) {
                console.log("RefreshToken is missing or invalid");
                return NextResponse.redirect(new URL("/login", request.url));
            }

            try {
                const { payload } = await jwtVerify(refreshTokenValue, JWT_SECRET);
                console.log("RefreshToken is valid");

                const userId = payload.id;
                console.log("Extracted userId from RefreshToken:", userId);

                const newAccessToken = await new SignJWT({ userId })
                    .setProtectedHeader({ alg: "HS256" })
                    .setExpirationTime("2h")
                    .sign(JWT_SECRET);

                const response = NextResponse.next();
                response.cookies.set("AccessToken", newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    sameSite: "strict",
                });

                return response;
            } catch (refreshErr) {
                console.error("RefreshToken is invalid or expired:", refreshErr.message);
                return NextResponse.redirect(new URL("/login", request.url));
            }
        } else {
            console.log("RefreshToken is missing");
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }


    try {
        await jwtVerify(AccessToken.value, JWT_SECRET);
        console.log("AccessToken is valid");
        if (RefreshToken.value) {
            const refreshTokenValue = RefreshToken?.value;
            if (!refreshTokenValue) {
                console.log("RefreshToken is missing or invalid");
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }
        return NextResponse.next();
    } catch (err) {
        console.error("AccessToken is invalid or expired:", err.message);

        if (RefreshToken) {
            const refreshTokenValue = RefreshToken?.value;
            if (!refreshTokenValue) {
                console.log("RefreshToken is missing or invalid");
                return NextResponse.redirect(new URL("/login", request.url));
            }

            try {
                const { payload } = await jwtVerify(refreshTokenValue, JWT_SECRET);
                console.log("RefreshToken is valid");

                const userId = payload.id;
                console.log("Extracted userId from RefreshToken:", userId);

                const newAccessToken = await new SignJWT({ userId })
                    .setProtectedHeader({ alg: "HS256" })
                    .setExpirationTime("2h")
                    .sign(JWT_SECRET);

                const response = NextResponse.next();
                response.cookies.set("AccessToken", newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    path: "/",
                    sameSite: "strict",
                });

                return response;
            } catch (refreshErr) {
                console.error("RefreshToken is invalid or expired:", refreshErr.message);
                return NextResponse.redirect(new URL("/login", request.url));
            }
        } else {
            console.log("RefreshToken is missing");
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
}

export const config = {
    matcher: ["/"],
};