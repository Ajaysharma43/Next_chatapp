"use client"
import NotificationComponent from "@/Components/NotificationsComponents/Notifications";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Notifications = () => {
    const [userid, setuserid] = useState(null)
    const [username, setusername] = useState(null)
    useEffect(() => {
        const GetUserDetails = () => {
            const token = Cookies.get('AccessToken')
            const decode = jwtDecode(token)
            setuserid(decode.id)
            setusername(decode.username)
        }
        GetUserDetails()
    }, [])
    return (
        <>
            <div>
                <NotificationComponent userid={userid} username={username} />
            </div>
        </>
    )
}

export default Notifications;