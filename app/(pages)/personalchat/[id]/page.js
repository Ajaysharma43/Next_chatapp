"use client";
import socket from "@/app/SocketConnection/SocketConnection.js";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PersonalChat = () => {
  const { id } = useParams(); // `id` is the receiver's ID
  const [userid, setuserid] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setmessage] = useState("");
  const bottomRef = useRef(null);

  // Decode user ID from JWT
  useEffect(() => {
    const token = Cookies.get("AccessToken");
    const decode = jwtDecode(token);
    setuserid(decode.id);
  }, []);

  // Join room and fetch previous chats
  useEffect(() => {
    if (userid) {
      // Join your own room
      socket.emit("join-room", userid);

      socket.emit("PreviosChats", id, userid);

      socket.on("Messages", (Chats , onlineUsers) => {
        if (Chats && Chats.length > 0) {
          console.log("Previous Chats:", Chats , onlineUsers);
          setMessages(Chats);
        } else {
          console.log("No chats available");
        }
      });

      socket.on("RecieveMessages", (Messages) => {
        console.log("Received Updated Messages:", Messages);
        setMessages((prev) => [...prev, ...Messages]);
        setmessage("");

      });
    }
  }, [userid]);

  // Scroll to bottom on message update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const SendMessage = () => {
    if (!message.trim()) {
      console.log("Message is empty");
      return;
    }

    if (!userid) {
      console.log("User ID not loaded yet");
      return;
    }

    console.log("Sending:", message, "to", id, "from", userid);
    socket.emit("SendMessage", message, id, userid);
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-between bg-white border rounded-lg shadow-lg">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {messages.map((item, index) => (
            <div
              key={index}
              className={`flex ${userid === item.sender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
          max-w-xs md:max-w-sm lg:max-w-md
          px-4 py-2 rounded-2xl shadow
          ${userid === item.sender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"}
        `}
              >
                <p className="break-words">{item.message}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>


        {/* Message Input */}
        <div className="p-4 flex gap-2 border-t">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && SendMessage()}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={SendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default PersonalChat;
