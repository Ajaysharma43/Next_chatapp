"use client";

import socket from "@/app/SocketConnection/SocketConnection";
import { CheckFriends } from "@/Redux/features/UserSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Friends = () => {
  const [userId, setUserId] = useState(null);
  const onlineUsers = useSelector((state) => state.chatreducer.OnlineUsers);
  const friends = useSelector((state) => state.UserReducer.Friends);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("AccessToken");
    if (!token) return;

    const decoded = jwtDecode(token);
    const id = decoded.id;
    setUserId(id);

    // Only connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Dispatch to fetch friends
    dispatch(CheckFriends({ id, data: onlineUsers }));

    // Emit event to get online friends
    socket.emit("get-online-friends", id);

    // Listen to online friends list
    socket.on("online-friends-list", ({ friends, onlineFriends }) => {
      console.log("✅ All Friends:", friends);
      console.log("🟢 Online Friends:", onlineFriends);
      setOnlineFriends(onlineFriends);
    });

    // Cleanup on unmount
    return () => {
      socket.off("online-friends-list");
    };
  }, [dispatch, onlineUsers.length , onlineFriends.length]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Friends</h1>
      {friends?.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        friends.map((friend) => {
            const isSender = userId === friend.sender_id;
            const otherFriendId = isSender ? friend.receiver_id : friend.sender_id;
            const otherFriendName = isSender ? friend.receiver_name : friend.sender_name;
          
            const isOnline = onlineFriends.includes(otherFriendId);
          
            return (
              <div
                key={friend.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-2 shadow-sm"
              >
                <Link href={`/personalchat/${otherFriendId}`}>
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
                </Link>
              </div>
            );
          })
          
      )}
    </div>
  );
};

export default Friends;
