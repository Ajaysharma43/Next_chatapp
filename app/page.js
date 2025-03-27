"use client";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState("");
  const socketRef = useRef();
  const [visibleDelete, setVisibleDelete] = useState({});
  const [typing, setTyping] = useState(false);
  const [TypingUser, setTypingUser] = useState(false)
  const typingTimeoutRef = useRef(null);
  const UserTypingTimeoutRef = useRef(null)

  useEffect(() => {
    const token = Cookies.get("AccessToken");
    if (token) {
      const decode = jwtDecode(token);
      setUser(decode.id);
    }

    socketRef.current = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`);

    socketRef.current.on("GetPrevChats", (data) => {
      setMessages(data.chats);
    });

    socketRef.current.on('GetUpdatedChats', (data) => {
      setVisibleDelete(false)
      setMessages(data.UpdatedData)
    })

    socketRef.current.on('userTyping', (user) => {
      console.log(`${user}  is typing`)
      setTypingUser(user)

      if (UserTypingTimeoutRef.current) {
        clearTimeout(UserTypingTimeoutRef.current);
      }

      UserTypingTimeoutRef.current = setTimeout(() => {
        setTypingUser(null);
      }, 2000);
    })

    socketRef.current.on("response", (message) => {
      console.log(message.message)
      setMessages(message.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!user || !newMessage.trim()) return;
    socketRef.current.emit("message", { user, text: newMessage });
    setNewMessage("");
  };

  const DeleteMessage = (id) => {
    socketRef.current.emit('deleteMessage', (id))
  }

  const toggleDelete = (index) => {
    setVisibleDelete((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const HandleTyping = () => {
    setTyping(true);

    socketRef.current.emit('typing', (user))
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {

      setTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 text-center text-xl font-semibold bg-gray-800 shadow-md">
        ChatApp
      </header>

      <motion.div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`flex w-full mb-2 ${msg.sender_id === user ? "justify-end" : "justify-start"
              }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {msg.sender_id === user && visibleDelete[index] && (
              <button className="mr-2 text-red-400 hover:text-red-600" onClick={() => DeleteMessage(msg.id)}>
                <MdDelete size={20} />
              </button>
            )}

            <div
              className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${msg.sender_id === user
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white"
                }`}
              onClick={() => toggleDelete(index)}
            >
              <span className="block font-semibold">
                {msg.sender_id === user ? "You" : msg.sender_id}:
              </span>
              {msg.message}
            </div>
          </motion.div>
        ))}
        {
          typing && TypingUser != user ? (<h1>{TypingUser} is typing</h1>) : ""
        }
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
  );
}
