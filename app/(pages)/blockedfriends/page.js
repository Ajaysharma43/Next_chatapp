"use client";

import { BlockedFriends, UpdateBlockedUsers } from "@/Redux/features/UserSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UnBlockDialog from "./Dialogs/UnBlockDialog"; // make sure it's the default export
import socket from "@/app/SocketConnection/SocketConnection";

const BlockedUsers = () => {
  const dispatch = useDispatch();
  const [userid, setUserId] = useState();
  const [username , setusername] = useState()
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const Blocked = useSelector((state) => state.UserReducer.BlockedUser);

  useEffect(() => {
    const GetBlocked = async () => {
      try {
        const token = Cookies.get("AccessToken");
        const decode = jwtDecode(token);
        setUserId(decode.id);
        setusername(decode.username)
        dispatch(BlockedFriends({ userid: decode.id }));
      } catch (error) {
        console.error(error);
      }
    };
    GetBlocked();
  }, [Blocked.length]);

  useEffect(() => {
    socket.on('UpdateBlockedList' , (Unblock) => {
        dispatch(UpdateBlockedUsers(Unblock))
    })
  },[])

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleUnblock = async () => {
    socket.emit('UnBlockFriend' , selectedUser , username)
    console.log("Unblocking user:", selectedUser);
    setOpenDialog(false);
    setSelectedUser(null);
  };

  return (
    <>
      <UnBlockDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onUnblock={handleUnblock}
      />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Blocked Users
        </h1>

        {Blocked.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No users found
          </div>
        ) : (
          <div className="space-y-4">
            {Blocked.map((item) => (
              <div
                key={item?.blocked_id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-white flex items-center justify-center font-semibold">
                    {item?.blockerusername?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-medium text-gray-800 dark:text-white">
                      {item?.blockerusername}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Blocked ID: {item?.blocked_id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenDialog(item)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BlockedUsers;
