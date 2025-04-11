"use client";
import socket from "@/app/SocketConnection/SocketConnection.js";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheckDouble, FaCheck } from "react-icons/fa6";
import { FaSmile } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { MdDelete } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

const PersonalChat = () => {
  const { id, username, friendsid } = useParams();
  const decodedUsername = decodeURIComponent(username);

  const [userid, setuserid] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setmessage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [typing, settyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
        if (Chats?.length > 0) setMessages(Chats);
      });

      socket.on("RecieveMessages", (Messages, isRecieveronline) => {
        console.log("reviceve messages is called")
        setMessages((prev) => [...prev, ...Messages]);
        setmessage("");
        if (isRecieveronline) {
          socket.emit("MarkAsRead", parseInt(id), userid);
        }
      });

      socket.on("UpdateMessagesStatus", (MarkasRead) => {
        setMessages(MarkasRead);
      });

      socket.on("UpdateMessages", (updateddata) => {
        setMessages(updateddata);
      });

      socket.on("UpdatedDeletedMessages", (UpdatedMessages) => {
        setMessages(UpdatedMessages);
      });

      socket.on("isTyping", (id) => {
        if (parseInt(id) === userid) {
          settyping(true);
          setTimeout(() => settyping(false), 2000);
        }
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
  }, [messages, typing]);

  const SendMessage = () => {
    if (!message.trim() || !userid) return;
    socket.emit("SendMessage", message, id, userid , friendsid);
  };

  const handleTyping = (e) => {
    setmessage(e.target.value);
    socket.emit("typing", id);
  };

  const handleEmojiClick = (emojiData) => {
    setmessage((prev) => prev + emojiData.emoji);
  };

  const handleToggleDelete = (index) => {
    setSelectedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const DeleteMessage = (messageId) => {
    socket.emit("DeleteMessage", messageId, userid, parseInt(id));
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    setSelectedIndex(null);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-white border rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-3 flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-t-lg shadow-inner">
        <span
          className={`w-2 h-2 rounded-full ${onlineUsers.includes(parseInt(id)) ? "bg-green-500" : "bg-red-500"}`}
        ></span>
        <span>{onlineUsers.includes(parseInt(id)) ? "Online" : "Offline"}</span>
        <span className="mx-2 text-gray-400">•</span>
        <span className="text-base font-semibold text-gray-800">{decodedUsername}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        <AnimatePresence initial={false}>
          {messages.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              className={`flex ${userid === item.sender ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.8,
                x: userid === item.sender ? 50 : -50,
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl shadow flex gap-3 items-center ${userid === item.sender
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                onClick={() => handleToggleDelete(index)}
              >
                <motion.p
                  className="break-words"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
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
                      {item?.messagestatus == true ? (
                        <FaCheckDouble className="text-black" />
                      ) : (
                        <FaCheck className="text-white" />
                      )}
                    </motion.span>

                    <AnimatePresence>
                      {selectedIndex === index && (
                        <motion.button
                          className="text-red-200 hover:text-red-400"
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

          {/* Typing Animation */}
          {typing && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-300 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none shadow text-sm flex items-center gap-2">
                <motion.span
                  className="inline-block w-1 h-1 bg-gray-800 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="inline-block w-1 h-1 bg-gray-800 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  className="inline-block w-1 h-1 bg-gray-800 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef}></div>
      </div>

      {/* Input Area */}
      <div className="p-4 flex flex-col gap-2 border-t relative">
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
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalChat;
