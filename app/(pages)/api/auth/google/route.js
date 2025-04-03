import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    const { token } = await req.json();

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Verified User:", payload);

    // Generate a refresh token (JWT)
    const refreshToken = jwt.sign(
      { email: payload.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Expires in 7 days
    );

    return NextResponse.json({
      message: "Google login successful",
      user: payload,
      refreshToken,
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ error: "Invalid Google Token" }, { status: 401 });
  }
}
