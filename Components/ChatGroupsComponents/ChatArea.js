"use client";

import socket from "@/app/SocketConnection/SocketConnection";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { SendHorizonal, ArrowLeft } from "lucide-react";
import { MdDelete } from "react-icons/md";
import DeleteMessageDialog from "./Dialogs/DeleteMessageDialog";
import { useEffect, useRef, useState } from "react";

const ChatArea = ({ id, onBack }) => {
  const [userid, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get("AccessToken");
    const decode = jwtDecode(token);
    setUserId(decode.id);
  }, []);

  useEffect(() => {
    if (!id) return;

    setMessages([]);
    socket.emit("PreviousGroupChats", id);

    const handlePrevMessages = (messages) => setMessages(messages);
    const handleNewMessage = (message) => {
      const msgs = Array.isArray(message) ? message : [message];
      const filteredMsgs = msgs.filter((msg) => msg.group_id === id);
      if (filteredMsgs.length > 0) {
        setMessages((prev) => [...prev, ...filteredMsgs]);
      }
    };

    socket.on("GetPreviosGroupChats", handlePrevMessages);
    socket.on("RecieveMessages", handleNewMessage);

    return () => {
      socket.off("GetPreviosGroupChats", handlePrevMessages);
      socket.off("RecieveMessages", handleNewMessage);
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formik = useFormik({
    initialValues: {
      message: "",
    },
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

  return (
    <>
      <div className="flex flex-col h-full">
        {onBack && (
          <div className="lg:hidden p-2">
            <button
              onClick={onBack}
              className="flex items-center text-amber-600 hover:text-amber-800 font-semibold"
            >
              <ArrowLeft className="mr-1" size={18} />
              Back to Groups
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100 rounded-lg">
          {messages.length === 0 ? (
            <p className="text-center text-gray-400">No messages found</p>
          ) : (
            <div className="flex flex-col space-y-2">
              {messages.map((item) => (
                <div
                  key={item?.id}
                  className={`flex ${item?.sender_id === userid ? "justify-end" : "justify-start"}`}
                >
                  <div
                    onClick={() =>
                      setSelectedMessageId((prev) =>
                        prev === item?.id ? null : item?.id
                      )
                    }
                    className={`relative max-w-xs md:max-w-md break-words px-4 py-2 rounded-2xl text-white shadow-md cursor-pointer transition-transform active:scale-[.98] ${
                      item?.sender_id === userid ? "bg-green-500" : "bg-blue-500"
                    }`}
                  >
                    <h1 className="font-semibold text-sm mb-1">
                      {item?.sender_id === userid ? "You" : item.name}
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
                </div>
              ))}
              <div ref={messagesEndRef} />
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
              onChange={formik.handleChange}
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
