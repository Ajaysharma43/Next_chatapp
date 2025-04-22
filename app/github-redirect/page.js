"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

const GithubRedirect = () => {
    const router = useRouter()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get("AccessToken")
        const refreshToken = urlParams.get("RefreshToken")

        if (accessToken && refreshToken) {
            // Save tokens in cookies (or localStorage if preferred)
            Cookies.set("AccessToken", accessToken)
            Cookies.set("RefreshToken", refreshToken) 

            // Redirect to homepage
            router.push("/")
        } else {
            // Redirect to login or show error
            router.push("/login")
        }
    }, [router])

    return <p>Redirecting...</p>
}

export default GithubRedirect
