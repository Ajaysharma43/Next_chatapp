"use client"
import socket from "@/app/SocketConnection/SocketConnection.js";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const PersonalChat = () => {
    const { id } = useParams();

    useEffect(() => {
       socket.emit('PreviosChats' , (id))

       socket.on('Messages' , )
    }, [])
    return (
        <>
 <div className="h-screen flex flex-col justify-between bg-white border rounded-lg shadow-lg">


      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
       
      </div>

      {/* Message Input */}
      <div className="p-4 flex gap-2 border-t">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
        </>
    )
}

export default PersonalChat