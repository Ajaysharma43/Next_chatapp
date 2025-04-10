"use client";

import socket from "@/app/SocketConnection/SocketConnection";
import { CheckFriends } from "@/Redux/features/UserSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Friends = () => {
  const [userId, setUserId] = useState(null);
  const [unreadMap, setUnreadMap] = useState({});
  const dispatch = useDispatch();

  const onlineUsers = useSelector((state) => state.chatreducer.OnlineUsers);
  const friends = useSelector((state) => state.UserReducer.Friends);

  useEffect(() => {
    const token = Cookies.get("AccessToken");
    if (!token) return;

    const decoded = jwtDecode(token);
    const id = decoded.id;
    setUserId(id);

    if (!socket.connected) {
      socket.connect();
    }

    dispatch(CheckFriends({ id, data: onlineUsers }));
    socket.emit("user-online", id);

    return () => {
      socket.off("online-users-update");
      socket.off("online-friends-list");
    };
  }, [dispatch, onlineUsers.length]);

  useEffect(() => {
    if (!userId || friends.length === 0) return;

    const handleUnreadMessages = (UnreadMessages) => {
      const unreadData = UnreadMessages[0];
      if (!unreadData) return;

      const otherFriendId =
        userId === unreadData.sender ? unreadData.receiver : unreadData.sender;

      setUnreadMap((prev) => ({
        ...prev,
        [otherFriendId]: unreadData,
      }));
    };

    socket.on("UpdateUnreadMessages", handleUnreadMessages);

    friends.forEach((friend) => {
      const sender = friend.sender_id;
      const receiver = friend.receiver_id;
      socket.emit("GetUnreadMessages", sender, receiver);
    });

    return () => {
      socket.off("UpdateUnreadMessages", handleUnreadMessages);
    };
  }, [userId, friends]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Friends</h1>

      {friends?.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        friends.map((friend) => {
          const isSender = userId === friend.sender_id;
          const otherFriendId = isSender
            ? friend.receiver_id
            : friend.sender_id;
          const otherFriendName = isSender
            ? friend.receiver_name
            : friend.sender_name;

          const isOnline = onlineUsers.includes(otherFriendId);
          const unreadCount = unreadMap[otherFriendId];

          return (
            <div
              key={friend.id}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-2 shadow-sm"
            >
              <Link
                href={`/personalchat/${otherFriendId}`}
                className="flex justify-between w-full items-center"
              >
                <div className="flex flex-col">
                  <h2 className="font-medium text-gray-800">
                    {otherFriendName}
                  </h2>
                  <span
                    className={`text-sm font-semibold ${
                      isOnline ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>

                {unreadCount?.count > 0 && (
                  <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full flex items-center justify-center min-w-[40px] text-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={unreadCount.count}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.3 }}
                      >
                        {unreadCount.count}
                      </motion.span>
                    </AnimatePresence>{" "}
                    new
                  </div>
                )}
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Friends;
