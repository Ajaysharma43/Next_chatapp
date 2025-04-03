"use client";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const GetData = async (credentialResponse) => {
  try {
    const res = await axios.post("/api/auth/google", {
      token: credentialResponse.credential,
    });

    console.log("Server Response:", res.data);

    // Store tokens securely
    Cookies.set("AccessToken", credentialResponse.credential, {
      secure: true,
      sameSite: "Strict",
    });

    Cookies.set("RefreshToken", res.data.refreshToken, {
      secure: true,
      sameSite: "Strict",
    });
  } catch (error) {
    console.error("Error Fetching Data:", error);
  }
};

export default function LoginWithGoogle() {
  const router = useRouter();

  return (
    <div>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const decode = jwtDecode(credentialResponse.credential);
            console.log("Decoded Google Token:", decode);
            console.log("Token Expiration:", new Date(decode.exp * 1000));

            Cookies.set("AccessToken", credentialResponse.credential, {
              secure: true,
              sameSite: "Strict",
            });

            if (decode.email_verified) {
              await GetData(credentialResponse);
              router.push("/dashboard"); // Redirect after login
            }
          } catch (error) {
            console.error("Google Login Error:", error);
          }
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
}
