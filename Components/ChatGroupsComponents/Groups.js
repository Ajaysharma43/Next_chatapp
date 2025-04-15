"use client"

const { default: socket } = require("@/app/SocketConnection/SocketConnection")
const { useEffect } = require("react")

const GroupsData = () => {

    useEffect(() => {
        socket.on('SendGroups' , (GetGroups) => {
            console.log(GetGroups)
        })
    },[])
    return(
        <>
        <div>

        </div>
        </>
    )
}

export default GroupsData;