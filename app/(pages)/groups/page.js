"use client"

import socket from "@/app/SocketConnection/SocketConnection"
import CreateChatGroup from "@/Components/ChatGroupsComponents/CreateChatGroups"
import GroupsData from "@/Components/ChatGroupsComponents/Groups"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { useEffect, useRef, useState } from "react"

const Groups = () => {
    const [userid, setUserId] = useState(null)
    const userRef = useRef(null)

    useEffect(() => {
        const GetUserid = () => {
            try {
                const token = Cookies.get('AccessToken')
                const decode = jwtDecode(token)
                let id = decode.id
                setUserId(id)
                userRef.current = id // Store in ref
                socket.emit('JoinGroups', id)
            } catch (error) {
                console.log(error)
            }
        }
        GetUserid()

        return () => {
            console.log("Leaving group with user ID:", userRef.current)
            socket.emit("LeaveGroups", userRef.current)
        }
    }, [])

    return (
        <>
        <div>
            <CreateChatGroup />
        </div>
        <div>
            <GroupsData/>
        </div>
        </>
    )
}

export default Groups
