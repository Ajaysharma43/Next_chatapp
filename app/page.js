"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    
    socketRef.current = io("http://localhost:4000");

    socketRef.current.on("connect", () => {
      setUser(`${Date.now()}-user`);
    });


    socketRef.current.on("response", (message) => {
      console.log(message);
      setMessages((prevMessages) => [...prevMessages, message.message]);
    });

  
    socketRef.current.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!user) {
      console.error("User not set. Cannot send message.");
      return;
    }
    if (newMessage.trim()) {
      socketRef.current.emit("message", { user, text: newMessage });
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ChatApp</h1>
      <div className="border rounded-lg p-4 h-64 overflow-y-scroll bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.user == user? "text-end" : "text-start"}`}>
            <strong>{msg.user == user ? "You" : msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}