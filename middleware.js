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
        try {
            if(pathname.startsWith('/dashboard'))
                {
                    console.log('you are on the dashboard')
                    const decode = jwtDecode(accessToken)
                    return DashboardAccess(decode.role , request)
                }
        } catch (error) {
            
        }
    } catch (err) {
        console.error("AccessToken is invalid or expired:", err.message);
        return await refreshAccessToken(request, refreshToken);
    }

   
    
    
}


export const config = {
    matcher: ["/" , "/dashboard" , "/dashboard/profile"],
};
