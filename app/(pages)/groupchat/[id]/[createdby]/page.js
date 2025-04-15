"use client"
import socket from "@/app/SocketConnection/SocketConnection";
import ChatArea from "@/Components/ChatGroupsComponents/ChatArea";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const GroupChat = () => {

    const { id } = useParams();
    const [userid, setuserid] = useState(null)

    useEffect(() => {
        const JoinGroupChat = () => {
            try {
                const token = Cookies.get('AccessToken')
                const decode = jwtDecode(token)
                socket.emit('JoinFriendsGroup', id)
            } catch (error) {
                console.log(error)
            }
        }
        JoinGroupChat()

        return () => {
            socket.emit('LeaveFriendsGroup', (id))
        }

    }, [])
    return (
        <>

            <div>
                <section>

                </section>
                <section>
                    <ChatArea />
                </section>
            </div>
        </>
    )
}

export default GroupChat;