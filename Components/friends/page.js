"use client";
import { useEffect, useState } from "react";
import socket from "@/app/SocketConnection/SocketConnection.js";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { UpdateOnlineUsers } from "@/Redux/features/Chatslice";
import { usePathname } from "next/navigation";

const Friends = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("AccessToken");

    if (pathname !== "/login") {
      const decoded = jwtDecode(token);
      const id = decoded?.id;
      setUserId(id);

      socket.connect();
      socket.emit("user-online", id);
      socket.emit("IsUserOnline", { id });

      socket.on("update-online-status", (users) => {
        dispatch(UpdateOnlineUsers(users));
      });

      // Clean-up function
      return () => {
        if (pathname === "/login") {
          socket.disconnect();
        }
      };
    }
  }, [dispatch, pathname]);

  return <div></div>;
};

export default Friends;
