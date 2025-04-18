"use client";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import socket from "./SocketConnection/SocketConnection";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState("");;
  const [visibleDelete, setVisibleDelete] = useState({});
  const [typing, setTyping] = useState(false);
  const [TypingUser, setTypingUser] = useState(false)
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get("AccessToken");
    if (token) {
      const decode = jwtDecode(token);
      setUser(decode.id);
    }

    socket.on("GetPrevChats", (data) => {
      setMessages(data.chats);
    });

    socket.on('GetUpdatedChats', (data) => {
      setVisibleDelete(false)
      setMessages(data.UpdatedData)
    })

    socket.on('userTyping', (user) => {
      setTyping(true)
      console.log(`${user}  is typing`)
      setTypingUser(user)
    })

    socket.on('userStoppedTyping', (user) => {


      console.log(`${user} stopped typing`)
      setTyping(false);
      setTypingUser(null);
    })

    socket.on("response", (message) => {
      console.log(message.message)
      setMessages(message.message);
    });

    return () => {
      socket.off('GetPrevChats')
      socket.off('GetUpdatedChats')
      socket.off('userTyping')
      socket.off('response')
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!user || !newMessage.trim()) return;
    socket.emit("message", { user, text: newMessage });
    setNewMessage("");
  };

  const DeleteMessage = (id) => {
    socket.emit('deleteMessage', (id))
  }

  const toggleDelete = (index) => {
    setVisibleDelete((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const HandleTyping = () => {
    socket.emit('typing', (user))
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stoppedtyping', (user))
    }, 1000);
  };

  return (
    <>

      <div className="flex flex-col h-screen bg-gray-900 text-white">
        <header className="p-4 text-center text-xl font-semibold bg-gray-800 shadow-md">
          ChatApp
        </header>

        <motion.div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence>
            {messages.map((msg, index) => {
              // Convert timestamp to Date object
              const createdAt = new Date(msg.created_at);
              const formattedDate = createdAt.toLocaleDateString(); // e.g., "3/27/2025"
              const formattedTime = createdAt.toLocaleTimeString(); // e.g., "10:45 AM"

              return (
                <motion.div
                  key={index}
                  className={`flex w-full mb-2 ${msg.sender_id === user ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg.sender_id === user && visibleDelete[index] && (
                    <motion.button
                      className="mr-2 text-red-400 hover:text-red-600 bg-white h-fit rounded-full"
                      onClick={() => DeleteMessage(msg.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MdDelete size={20} />
                    </motion.button>
                  )}

                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${msg.sender_id === user ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                      }`}
                    onClick={() => toggleDelete(index)}
                  >
                    <span className="block font-semibold">
                      {msg.sender_id === user ? "You" : msg.sender_id}:
                    </span>
                    {msg.message}
                    <div className="mt-1 text-xs text-gray-300">
                      <span>{formattedDate} • {formattedTime}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <AnimatePresence>
            <AnimatePresence>
              {typing && TypingUser !== user && (
                <motion.div
                  key="typing-indicator"
                  className="flex items-center space-x-2 text-gray-400 px-3 py-2 rounded-lg bg-gray-800 w-fit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm font-semibold">{TypingUser} is typing</span>
                  <div className="flex space-x-1">
                    <motion.span
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>;
          </AnimatePresence>
        </motion.div>

        <div className="p-4 bg-gray-800 flex items-center gap-3 shadow-md">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => { setNewMessage(e.target.value); HandleTyping() }}
            className="flex-1 p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
