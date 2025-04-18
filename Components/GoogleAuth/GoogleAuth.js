"use client";
import { AuthInstance } from "@/Interseptors/AuthInterseptors";
import { GoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const GetData = async (credentialResponse ,userid , router) => {
  try {
    const res = await AuthInstance.post("/SocialAuth", {
      token: credentialResponse.credential,
      userid : userid
    });

    if(res.data.success == true)
    {
        console.log("Server Response:", res.data);

        // Store tokens securely
        Cookies.set("AccessToken", res.data.AccessToken, {
          secure: true,
          sameSite: "Strict",
        });
    
        Cookies.set("RefreshToken", res.data.RefreshToken, {
          secure: true,
          sameSite: "Strict",
        });

        router.push("/");
    }
    else
    {
        alert("error while login")
    }
    
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
            const userid = credentialResponse.clientId
            const decode = jwtDecode(credentialResponse.credential);
            console.log(decode)
            if (decode.email_verified) {
              await GetData(credentialResponse , userid , router);
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
