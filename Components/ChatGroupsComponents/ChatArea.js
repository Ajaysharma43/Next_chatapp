"use client";

import socket from "@/app/SocketConnection/SocketConnection";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { SendHorizonal } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ChatArea = () => {
  const { id, createdby } = useParams();
  const [userid, setuserid] = useState(null);
  const [messages, setmessages] = useState([]);

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: (values, { resetForm }) => {
      let message = values.message;
      socket.emit("SendGroupMessages", message, id, userid);
      resetForm();
    },
  });

  useEffect(() => {
    socket.emit("PreviousGroupChats", id);

    socket.on("GetPreviosGroupChats", (messages) => {
      setmessages(messages);
    });

    const Getuserid = () => {
      const token = Cookies.get("AccessToken");
      const decode = jwtDecode(token);
      setuserid(decode.id);
    };

    Getuserid();

    socket.on("RecieveMessages", (message) => {
      setmessages((prev) => [...prev, ...message]);
    });

    return () => {
      socket.off("GetPreviosGroupChats");
      socket.off("RecieveMessages");
    };
  }, [id]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100 rounded-lg min-h-[80vh]">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages found</p>
        ) : (
          <div className="flex flex-col space-y-2">
            {messages.map((item) => (
              <div
                key={item?.id}
                className={`flex ${
                  item?.sender_id == userid ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md break-words px-4 py-2 rounded-2xl text-white shadow-md ${
                    item?.sender_id == userid
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                >
                    <h1>{item?.sender_id == userid? "You" : (<><h1>{item.sender_id}</h1></>)}</h1>
                  <p className="text-sm">{item?.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Field */}
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
  );
};

export default ChatArea;
