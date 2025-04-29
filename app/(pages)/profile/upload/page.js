"use client"

import UploadUserPost from "@/Components/ProfilePageComponents/UploadData"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"

const UploadPost = () => {
    const [userid, setuserid] = useState(null)
    const [username, setusername] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const Token = Cookies.get('AccessToken')
        if (Token) {
            try {
                const decode = jwtDecode(Token)
                setuserid(decode.id)
                setusername(decode.username)
            } catch (error) {
                console.error("Invalid token:", error)
            }
        }
        setLoading(false)
    }, [])

    if (loading || !userid) {
        return null 
    }

    return (
        <>
            <UploadUserPost userid={userid} username={username}/>
        </>
    )
}

export default UploadPost