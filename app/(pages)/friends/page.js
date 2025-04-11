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
import { TiUserDelete } from "react-icons/ti";

const Friends = () => {
  const [userId, setUserId] = useState(null);
  const [unreadMap, setUnreadMap] = useState({});
  const [friendsList, setFriendsList] = useState([]);
  const [DeleteDialogstate, setDeleteDialogstate] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.chatreducer.OnlineUsers);
  const friends = useSelector((state) => state.UserReducer.Friends);

  useEffect(() => {
    setFriendsList(friends);
  }, [friends]);

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
    socket.emit("join-friends-room", id);

    return () => {
      socket.emit("leave-friends-room", id);
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
    setDeleteDialogstate(true);
  };

  const handleFriendDelete = async (friend) => {
    try {
      await dispatch(DeleteFriend({id : userId ,friend}))
      console.log(friend)
      setDeleteDialogstate(false);
      setSelectedFriend(null);
    } catch (error) {
      console.error("Failed to delete friend:", error);
    }
  };

  return (
    <>
      <DeleteDialog
        open={DeleteDialogstate}
        onclose={() => setDeleteDialogstate(false)}
        friend={selectedFriend}
        onDelete={handleFriendDelete}
      />

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Friends</h1>

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
              const otherFriendId = isSender
                ? friend.receiver_id
                : friend.sender_id;
              const otherFriendName = isSender
                ? friend.receiver_name
                : friend.sender_name;

              const isOnline = onlineUsers.includes(otherFriendId);
              const unreadCount = unreadMap[otherFriendId];

              return (
                <Reorder.Item
                  key={friend.id}
                  value={friend}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="flex justify-between items-center gap-4 bg-white border border-gray-200 shadow-sm rounded-xl p-4 transition-all hover:shadow-md">
                    <Link
                      href={`/personalchat/${otherFriendId}/${otherFriendName}/${friend.id}`}
                      className="flex items-center gap-3 flex-grow"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center font-semibold text-blue-800">
                          {otherFriendName.charAt(0)}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-base font-semibold text-gray-800">
                          {otherFriendName}
                        </h2>
                        <span className="text-xs text-gray-500">
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2">
                      {unreadCount?.count !== 0 && (
                        <AnimatePresence mode="wait">
                          {unreadCount?.count > 0 && (
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
                                : `${unreadCount.count} new message${
                                    unreadCount.count > 1 ? "s" : ""
                                  }`}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                      <button onClick={() => handleDeleteDialog(friend)}>
                        <TiUserDelete className="text-xl text-red-500 hover:text-red-700" />
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
