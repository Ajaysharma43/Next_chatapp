"use client";
import socket from "@/app/SocketConnection/SocketConnection.js";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaCheckDouble, FaCheck } from "react-icons/fa6";
import { FaSmile } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { MdDelete } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { useTheme } from "next-themes";

const PersonalChat = () => {
  const { id, username, friendsid } = useParams();
  const decodedUsername = decodeURIComponent(username);
  const onlineUsers = useSelector((state) => state.chatreducer.OnlineUsers);
  const { theme } = useTheme();

  const [userid, setuserid] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setmessage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [typing, settyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const bottomRef = useRef(null);
  const isDark = theme === "dark";
  const chatId = parseInt(id);

  // Get User ID from JWT
  useEffect(() => {
    const token = Cookies.get("AccessToken");
    if (token) {
      const decode = jwtDecode(token);
      setuserid(decode.id);
    }
  }, [onlineUsers]);

  // Socket listeners
  useEffect(() => {
    if (!userid) return;

    socket.emit("join-room", id, userid);
    socket.emit("PreviosChats", id, userid);

    const listeners = {
      Messages: (Chats) => Chats?.length > 0 && setMessages(Chats),
      RecieveMessages: (Messages, isReceiverOnline) => {
        setMessages((prev) => [...prev, ...Messages]);
        setmessage("");
        if (isReceiverOnline) {
          socket.emit("MarkAsRead", chatId, userid);
        }
      },
      UpdateMessagesStatus: setMessages,
      UpdateMessages: setMessages,
      UpdatedDeletedMessages: setMessages,
      isTyping: (typingId) => {
        if (parseInt(typingId) === userid) {
          settyping(true);
          setTimeout(() => settyping(false), 2000);
        }
      },
    };

    for (const [event, handler] of Object.entries(listeners)) {
      socket.on(event, handler);
    }

    return () => {
      socket.emit("leave-room", userid);
      for (const event of Object.keys(listeners)) {
        socket.off(event);
      }
    };
  }, [userid]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Handlers
  const SendMessage = useCallback(() => {
    if (!message.trim() || !userid) return;
    socket.emit("SendMessage", message, id, userid, friendsid);
  }, [message, userid, id, friendsid]);

  const handleTyping = (e) => {
    setmessage(e.target.value);
    socket.emit("typing", id, userid);
  };

  const handleEmojiClick = (emojiData) => {
    setmessage((prev) => prev + emojiData.emoji);
  };

  const handleToggleDelete = (index) => {
    setSelectedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const DeleteMessage = (messageId) => {
    socket.emit("DeleteMessage", messageId, userid, chatId);
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    setSelectedIndex(null);
  };

  return (
    <div className={`h-screen flex flex-col justify-between border rounded-lg shadow-lg transition-colors duration-300 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      
      {/* Header */}
      <div className={`p-3 flex items-center gap-2 text-sm font-medium ${isDark ? "text-gray-300 bg-gray-800" : "text-gray-700 bg-gray-100"} rounded-t-lg shadow-inner`}>
        <span className={`w-2 h-2 rounded-full ${onlineUsers.includes(chatId) ? "bg-green-500" : "bg-red-500"}`} />
        <span>{onlineUsers.includes(chatId) ? "Online" : "Offline"}</span>
        <span className="mx-2 text-gray-400">•</span>
        <span className="text-base font-semibold">{decodedUsername}</span>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
        <AnimatePresence initial={false}>
          {messages.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              className={`flex ${userid === item.sender ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: userid === item.sender ? 50 : -50 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl shadow flex gap-3 items-center cursor-pointer transition-colors duration-200
                  ${userid === item.sender
                    ? `${isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"} rounded-br-none`
                    : `${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"} rounded-bl-none`
                  }`}
                onClick={() => handleToggleDelete(index)}
              >
                <motion.p className="break-words" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                  {item.message}
                </motion.p>

                {userid === item.sender && (
                  <>
                    <motion.span
                      key={item.messagestatus}
                      initial={{ opacity: 0, rotateY: 0 }}
                      animate={{ opacity: 1, rotateY: 360 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{ transformPerspective: 1000 }}
                    >
                      {item?.messagestatus ? (
                        <FaCheckDouble className={isDark ? "text-white" : "text-black"} />
                      ) : (
                        <FaCheck className="text-white" />
                      )}
                    </motion.span>

                    <AnimatePresence>
                      {selectedIndex === index && (
                        <motion.button
                          className="text-red-300 hover:text-red-500"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.3 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            DeleteMessage(item.id);
                          }}
                        >
                          <MdDelete size={18} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {typing && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`px-4 py-2 rounded-2xl rounded-bl-none shadow text-sm flex items-center gap-2 ${isDark ? "bg-gray-600 text-gray-200" : "bg-gray-300 text-gray-800"}`}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.span
                    key={i}
                    className="inline-block w-1 h-1 rounded-full bg-current"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef}></div>
      </div>

      {/* Input Field */}
      <div className={`p-4 flex flex-col gap-2 border-t relative ${isDark ? "border-gray-700" : "border-gray-300"}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-xl text-yellow-500 hover:text-yellow-600"
          >
            <FaSmile />
          </button>

          <input
            type="text"
            placeholder="Type your message..."
            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" : "border-gray-300 focus:ring-blue-500"}`}
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && SendMessage()}
          />

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={SendMessage}
          >
            Send
          </button>
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} theme={isDark ? "dark" : "light"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalChat;
