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
  const pathname = usePathname(); // 👈 Get current pathname
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("AccessToken");

    if (pathname !== "/login") {
      const decoded = jwtDecode(token);
      const id = decoded?.id;
      setUserId(id);

      socket.connect();
      socket.on("connect", () => {
        console.log("🟢 Connected:", socket.id);
        socket.emit("user-online", id);
        socket.emit("IsUserOnline", { id });
      });

      socket.on("update-online-status", (users) => {
        console.log("📡 Updated online users:", users);
        dispatch(UpdateOnlineUsers(users));
      });

      socket.on("UserOnlineStatus", ({ id, isOnline }) => {
        console.log(`User ${id} is ${isOnline ? "🟢 online" : "🔴 offline"}`);
      });

      socket.on("disconnect", () => {
        console.log("🔴 Disconnected");
      });

      // Clean-up function
      return () => {
        if (pathname === "/login") {
          socket.disconnect();
          console.log(`⚠️ Disconnected socket for user ${id} on login page`);
        }
      };
    }
  }, [dispatch, pathname]); // 👈 Add pathname as a dependency

  return <div></div>;
};

export default Friends;
