"use client";

import NotificationComponent from "@/Components/NotificationsComponents/Notifications";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Notifications = () => {
  const [userid, setUserid] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const GetUserDetails = () => {
      const token = Cookies.get("AccessToken");
      if (token) {
        try {
          const decode = jwtDecode(token);
          setUserid(decode.id);
          setUsername(decode.username);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };

    GetUserDetails();
  }, []);


  if (!userid || !username) return <p>Loading user data...</p>;

  return (
    <div>
      <NotificationComponent userid={userid} username={username} />
    </div>
  );
};

export default Notifications;
