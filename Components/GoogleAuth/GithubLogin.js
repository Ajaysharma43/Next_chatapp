"use client"

import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const GithubLogin = () => {
    const router = useRouter()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get("AccessToken")
        const refreshToken = urlParams.get("RefreshToken")
        const status = urlParams.get("status")

        if (accessToken && refreshToken && status == 'authenticated') {
            // Save tokens in cookies (or localStorage if preferred)
            Cookies.set("AccessToken", accessToken)
            Cookies.set("RefreshToken", refreshToken)

            // Redirect to homepage
            router.push("/")
        }
    }, [router])

    const HandleLogin = async () => {
        router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/github`)
    }

    return (
        <button
            onClick={HandleLogin}
            className="w-full flex items-center justify-center bg-gray-900 text-white rounded-lg px-6 py-2 mt-2 hover:bg-gray-800 transition duration-200"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 mr-3"
            >
                <path
                    fillRule="evenodd"
                    d="M12 0C5.373 0 0 5.373 0 12c0 5.262 3.438 9.682 8.207 11.295.6.11.82-.26.82-.577v-2.292c-3.338.727-4.037-1.604-4.037-1.604-.545-1.379-1.333-1.744-1.333-1.744-1.09-.744.083-.729.083-.729 1.205.085 1.838 1.234 1.838 1.234 1.07 1.834 2.807 1.304 3.49.997.108-.774.42-1.304.762-1.604-2.666-.303-5.466-1.333-5.466-5.92 0-1.308.467-2.383 1.236-3.219-.124-.303-.535-1.524.117-3.173 0 0 1.006-.32 3.296 1.243 1.156-.34 2.403-.51 3.646-.516 1.243.006 2.49.176 3.646.516 2.29-1.564 3.295-1.243 3.295-1.243.652 1.649.24 2.87.118 3.173.769.836 1.236 1.911 1.236 3.219 0 4.594-2.8 5.617-5.472 5.92.432.372.828 1.103.828 2.224v3.293c0 .318.218.693.825.577C20.563 21.682 24 17.262 24 12c0-6.627-5.373-12-12-12z"
                    clipRule="evenodd"
                />
            </svg>
            Sign in with GitHub
        </button>
    )
}
