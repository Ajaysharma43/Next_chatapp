"use client";

import socket from "@/app/SocketConnection/SocketConnection";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { SendHorizonal, ArrowLeft } from "lucide-react";
import { MdDelete } from "react-icons/md";
import DeleteMessageDialog from "./Dialogs/DeleteMessageDialog";
import GroupDetails from "./GroupDetails";
import { useEffect, useRef, useState } from "react";

const ChatArea = ({ id, onBack }) => {
  const [userid, setUserId] = useState(null);
  const [username, setusername] = useState("")
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setShowGroupDetails(false)
  }, [id])

  useEffect(() => {
    const token = Cookies.get("AccessToken");
    const decode = jwtDecode(token);
    setusername(decode.username)
    setUserId(decode.id);
  }, []);

  useEffect(() => {
    if (!id) return;
    setMessages([]);
    socket.emit("PreviousGroupChats", id);

    const handlePrevMessages = (messages) => {
      setMessages(messages);
    };

    const handleNewMessage = (message) => {
      const msgs = Array.isArray(message) ? message : [message];
      const filteredMsgs = msgs.filter((msg) => msg.group_id === id);
      if (filteredMsgs.length > 0) {
        setMessages((prev) => [...prev, ...filteredMsgs]);
      }
    };

    const handleTyping = ({ id: typingUserId, username, groupId }) => {
      if (typingUserId !== userid && id == groupId) {
        setTypingUsers((prev) => {
          const exists = prev.find((u) => u.id === typingUserId);
          if (!exists) {
            return [...prev, { id: typingUserId, username }];
          }
          return prev;
        });

        setTimeout(() => {
          setTypingUsers((prev) =>
            prev.filter((u) => u.id !== typingUserId)
          );
        }, 2000);
      }
    };

    const HandleNotification = (Notification) => {
      setMessages((prev) => [...prev, ...Notification])
    }

    socket.on("GetPreviosGroupChats", handlePrevMessages);
    socket.on("RecieveMessages", handleNewMessage);
    socket.on("StartGroupTyping", handleTyping);
    socket.on('UpdateNotification', HandleNotification)

    return () => {
      socket.off("GetPreviosGroupChats", handlePrevMessages);
      socket.off("RecieveMessages", handleNewMessage);
      socket.off("StartGroupTyping", handleTyping);
    };
  }, [id, userid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formik = useFormik({
    initialValues: { message: "" },
    onSubmit: (values, { resetForm }) => {
      if (!values.message.trim()) return;
      socket.emit("SendGroupMessages", values.message, id, userid);
      resetForm();
    },
  });

  const handleOpenDeleteDialog = (message) => {
    setMessageToDelete(message);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setMessageToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleUserTyping = () => {
    const token = Cookies.get("AccessToken");
    const decoded = jwtDecode(token);
    socket.emit("GroupUserTyping", {
      id: decoded.id,
      username: decoded.username,
      groupId: id
    });
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-2 border-b bg-white shadow-sm">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center text-amber-600 hover:text-amber-800 font-semibold"
            >
              <ArrowLeft className="mr-1" size={18} />
              Back
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setShowGroupDetails(false)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${!showGroupDetails
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Chat
            </button>
            <button
              onClick={() => setShowGroupDetails(true)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${showGroupDetails
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Group Info
            </button>
          </div>
        </div>

        {/* Main Area Switch */}
        {showGroupDetails ? (
          <div className="flex-1 overflow-y-auto p-4">
            <GroupDetails id={id} userid={userid} username={username} />
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100 rounded-lg">
              {messages.length === 0 ? (
                <p className="text-center text-gray-400">No messages found</p>
              ) : (
                <div className="flex flex-col space-y-2">
                  {messages.map((item) => (
                    <div
                      key={item?.id}
                      className={`flex ${item?.sender_id === userid
                        ? "justify-end"
                        : "justify-start"
                        }`}
                    >
                      {
                        item.notifications == true ?
                          (
                            <div className="w-full flex justify-center">
                              <div className="bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">
                                {item.content}
                              </div>
                            </div>
                          )
                          :
                          (
                            <div
                              onClick={() =>
                                setSelectedMessageId((prev) =>
                                  prev === item?.id ? null : item?.id
                                )
                              }
                              className={`relative max-w-xs md:max-w-md break-words px-4 py-2 rounded-2xl text-white shadow-md cursor-pointer transition-transform active:scale-[.98] ${item?.sender_id === userid
                                ? "bg-green-500"
                                : "bg-blue-500"
                                }`}
                            >
                              <h1 className="font-semibold text-sm mb-1">
                                {item?.sender_id === userid ? "You" : item?.name}
                              </h1>
                              <p className="text-sm">{item?.content}</p>

                              {item?.sender_id === userid &&
                                selectedMessageId === item?.id && (
                                  <button
                                    className="absolute top-1 right-1 text-white hover:text-red-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenDeleteDialog(item);
                                    }}
                                    title="Delete"
                                  >
                                    <MdDelete size={18} />
                                  </button>
                                )}
                            </div>
                          )
                      }

                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
              {typingUsers.length > 0 && (
                <div className="mt-2 text-sm italic text-gray-600 px-2">
                  {typingUsers.map((u) => u.username).join(", ")}{" "}
                  {typingUsers.length === 1 ? "is" : "are"} typing...
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-4 p-2 flex items-center border-t bg-white rounded-b-lg">
                <input
                  type="text"
                  name="message"
                  value={formik.values.message}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleUserTyping();
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="ml-2 p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
                >
                  <SendHorizonal size={20} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteMessageDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        message={messageToDelete}
      />
    </>
  );
};

export default ChatArea;
