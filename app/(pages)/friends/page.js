"use client";

import socket from "@/app/SocketConnection/SocketConnection";
import { CheckFriends, DeleteFriend } from "@/Redux/features/UserSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { DeleteDialog } from "./(Dialogs)/DeleteDialog";
import { BlockDialog } from "./(Dialogs)/BlockDialog";
import { TiUserDelete } from "react-icons/ti";
import { ImBlocked } from "react-icons/im";
import { useTheme } from "next-themes";
import Image from "next/image";

const Friends = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [unreadMap, setUnreadMap] = useState({});
  const [friendsList, setFriendsList] = useState([]);
  const [deleteDialogState, setDeleteDialogState] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [blockDialogState, setBlockDialogState] = useState(false);
  const [blockSelectedFriend, setBlockSelectedFriend] = useState(null);
  const [blockFriendId, setBlockFriendId] = useState(null);
  const [typingUser, setTypingUser] = useState(null);

  const { theme } = useTheme();
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.chatreducer.OnlineUsers);
  const friends = useSelector((state) => state.UserReducer.Friends);

  useEffect(() => {
    setFriendsList(friends);
  }, [friends]);

  useEffect(() => {
    const token = Cookies.get("AccessToken");
    const decoded = jwtDecode(token);
    const id = decoded.id;
    setUserId(id);
    setUsername(decoded.username);

    if (!socket.connected) {
      socket.connect();
    }

    dispatch(CheckFriends({ id, data: onlineUsers }));
    socket.emit("user-online", id);
    socket.emit("join-friends-room", id);

    socket.on("typinguser", (userid) => {
      setTypingUser(userid);
      setTimeout(() => {
        setTypingUser(null);
      }, 2000);
    });

    return () => {
      socket.emit("leave-friends-room", id);
      socket.off("typinguser");
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

    const handleUpdateFriends = () => {
      dispatch(CheckFriends({ id: userId, data: onlineUsers }));
    };

    socket.on("UpdateUnreadMessages", handleUnreadMessages);
    socket.on("UpdateFriendsData", handleUpdateFriends);

    friends.forEach((friend) => {
      const sender = friend.sender_id;
      const receiver = friend.receiver_id;
      socket.emit("GetUnreadMessages", sender, receiver);
    });

    return () => {
      socket.off("UpdateUnreadMessages", handleUnreadMessages);
      socket.off("UpdateFriendsData", handleUpdateFriends);
    };
  }, [userId, friends, dispatch, onlineUsers]);

  const handleDeleteDialog = (friend) => {
    setSelectedFriend(friend);
    setDeleteDialogState(true);
  };

  const handleFriendDelete = async (friend) => {
    try {
      await dispatch(DeleteFriend({ id: userId, friend }));
      setDeleteDialogState(false);
      setSelectedFriend(null);
    } catch (error) {
      console.error("Failed to delete friend:", error);
    }
  };

  const handleBlockDialog = (friend, otherFriendId) => {
    setBlockFriendId(otherFriendId);
    setBlockSelectedFriend(friend);
    setBlockDialogState(true);
  };

  const handleBlockFriend = () => {
    socket.emit("BlockUser", blockFriendId, userId, username);
    setBlockDialogState(false);
    setBlockSelectedFriend(null);
  };

  return (
    <>
      <DeleteDialog
        open={deleteDialogState}
        onclose={() => setDeleteDialogState(false)}
        friend={selectedFriend}
        onDelete={handleFriendDelete}
      />

      <BlockDialog
        open={blockDialogState}
        onclose={() => setBlockDialogState(false)}
        friend={blockSelectedFriend}
        onBlock={handleBlockFriend}
      />

      <div className="p-6 max-w-3xl mx-auto">
        <h1
          className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"
            }`}
        >
          My Friends
        </h1>

        {friendsList?.length === 0 ? (
          <p className="text-gray-500 text-center">No friends found.</p>
        ) : (
          <Reorder.Group
            axis="x"
            values={friendsList}
            onReorder={setFriendsList}
            className="space-y-3"
          >
            {friendsList.map((friend) => {
              const isSender = userId === friend.sender_id;
              const otherFriendId = isSender ? friend.receiver_id : friend.sender_id;
              const otherFriendName = isSender ? friend.receiver_name : friend.sender_name;
              const otherFriendProfile = isSender ? friend.receiver_profile : friend.sender_profile;
              const isOnline = onlineUsers.includes(otherFriendId);
              const unreadCount = unreadMap[otherFriendId];

              return (
                <Reorder.Item key={friend.id} value={friend}>
                  <div
                    className={`flex justify-between items-center gap-4 p-4 border shadow-sm rounded-xl hover:shadow-md transition-all ${theme === "dark" ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800"} ${friend.is_blocked ? "hidden" : ""}`}
                  >
                    <Link href={`/personalchat/${otherFriendId}/${otherFriendName}/${friend.id}`} className="flex items-center gap-3 flex-grow">
                      <div className="relative">
                        {otherFriendProfile ? (
                          <Image
                            src={otherFriendProfile}
                            alt="profile"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => (e.currentTarget.src = "/default-profile.png")}
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${theme === "dark"
                              ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                              : "bg-gradient-to-r from-blue-200 to-blue-400 text-blue-800"
                              }`}
                          >
                            {otherFriendName.charAt(0)}
                          </div>
                        )}
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${theme === "dark"
                            ? "border-gray-800"
                            : "border-white"
                            } ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
                        />
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-base font-semibold">{otherFriendName}</h2>
                        <span className="text-xs text-gray-500">{isOnline ? "Online" : "Offline"}</span>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2">
                      {unreadCount?.count > 0 && (
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={unreadCount.count}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.3 }}
                            className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow text-center min-w-[80px]"
                          >
                            {unreadCount.count > 9
                              ? "9+ Messages"
                              : `${unreadCount.count} new message${unreadCount.count > 1 ? "s" : ""}`}
                          </motion.div>
                        </AnimatePresence>
                      )}

                      <AnimatePresence mode="wait">
                        {typingUser === otherFriendId && (
                          <motion.div
                            key="typing-indicator"
                            className="flex justify-start pl-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="px-4 py-2 rounded-2xl text-sm shadow flex gap-1 items-center bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                              {[0, 0.15, 0.3].map((delay, i) => (
                                <motion.span
                                  key={i}
                                  className="inline-block w-2 h-2 rounded-full bg-current"
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                                  transition={{ duration: 0.8, repeat: Infinity, delay, ease: "easeInOut" }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button onClick={() => handleDeleteDialog(friend)}>
                        <TiUserDelete className="text-xl text-red-500 hover:text-red-700" />
                      </button>
                      <button onClick={() => handleBlockDialog(friend, otherFriendId)}>
                        <ImBlocked className="text-xl text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        )}
      </div>
    </>
  );
};

export default Friends;
