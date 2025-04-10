"use client";
import socket from "@/app/SocketConnection/SocketConnection.js";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheckDouble } from "react-icons/fa6";

const PersonalChat = () => {
  const { id } = useParams(); // `id` is the receiver's ID
  const [userid, setuserid] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setmessage] = useState("");
  const onlineUsers = useSelector((state) => state.chatreducer.OnlineUsers);
  const bottomRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get("AccessToken");
    const decode = jwtDecode(token);
    setuserid(decode.id);
  }, [onlineUsers.length]);

  useEffect(() => {
    if (userid) {
      socket.emit("join-room", id, userid);
      socket.emit("PreviosChats", id, userid);

      socket.on("Messages", (Chats) => {
        if (Chats && Chats.length > 0) {
          setMessages(Chats);
        }
      });

      socket.on("RecieveMessages", (Messages, isRecieveronline) => {
        setMessages((prev) => [...prev, ...Messages]);
        setmessage("");
        if (isRecieveronline === true) {
          socket.emit("MarkAsRead", parseInt(id), userid);
        }
      });

      socket.on("UpdateMessagesStatus", (MarkasRead) => {
        setMessages(MarkasRead);
      });

      socket.on("UpdateMessages", (updateddata) => {
        setMessages(updateddata);
      });
    }

    return () => {
      if (userid) {
        socket.emit("leave-room", userid);
      }
    };
  }, [userid]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const SendMessage = () => {
    if (!message.trim() || !userid) return;
    socket.emit("SendMessage", message, id, userid);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-white border rounded-lg shadow-lg">
      <div>
        {onlineUsers.includes(parseInt(id)) ? (
          <h1 className="text-green-400">online</h1>
        ) : (
          <h1 className="text-red-400">offline</h1>
        )}
      </div>

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
                px-4 py-2 rounded-2xl shadow flex gap-3
                ${userid === item.sender
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"}
              `}
            >
              <p className="break-words">{item.message}</p>
              <h1 className={`${userid === item.sender ? "block" : "hidden"}`}>
                <FaCheckDouble
                  className={`${item.messagestatus === true ? "text-green-500" : "text-white"}`}
                />
              </h1>
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
  );
};

export default PersonalChat;
