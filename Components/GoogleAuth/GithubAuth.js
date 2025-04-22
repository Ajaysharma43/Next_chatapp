// "use client";

// import { AuthInstance } from "@/Interseptors/AuthInterseptors";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { Github } from "lucide-react"; // using lucide-react icon

// export default function GitHubLogin() {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     const GetData = async () => {
//       if (status === "authenticated" && session?.accessToken) {
//         try {
//           const res = await axios.get(`${process.env.NEXT_PUBLIC_GITHUB_API}`, {
//             headers: {
//               Authorization: `Bearer ${session.accessToken}`
//             },
//           });

//           const token = {
//             id: res.data.id,
//             name: res.data.name,
//             profile: res.data.avatar_url,
//           };

//           const GithubAuth = await AuthInstance.post("/GithubAuth", { token });
//           if (GithubAuth.data.success === true) {
//             Cookies.set("AccessToken", GithubAuth.data.AccessToken, {
//               secure: true,
//               sameSite: "Strict",
//             });

//             Cookies.set("RefreshToken", GithubAuth.data.RefreshToken, {
//               secure: true,
//               sameSite: "Strict",
//             });

//             router.push("/");
//           }
//         } catch (error) {
//           console.error("Error fetching GitHub data:", error);
//         }
//       }
//     };

//     GetData();
//   }, [status, session]);

//   return (
//     <div className="flex justify-center m-1">
//       <button
//         onClick={() => signIn("github")}
//         className="w-full flex justify-center items-center gap-3 px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-200"
//       >
//         <Github className="w-5 h-5"/>
//         Sign in with GitHub
//       </button>
//     </div>
//   );
// }
