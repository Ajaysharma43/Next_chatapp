"use client";

import { GetNotifications } from "@/Redux/features/NotificationsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const NotificationComponent = ({ userid, username }) => {
  const Notifications = useSelector(
    (state) => state.NotificationReducer.Notifications
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (userid) {
      dispatch(GetNotifications({ userid }));
    }
  }, [userid]);

  return (
    <div className="p-4 space-y-4">
      {Notifications.length === 0 ? (
        <div className="text-center text-gray-500">
          <h1>No notifications available</h1>
        </div>
      ) : (
        <div className="space-y-3">
          {Notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border p-4 rounded-lg shadow-md ${
                notification.notificationstatus
                  ? "bg-white"
                  : "bg-blue-50 border-blue-400"
              }`}
            >
              <p className="text-sm text-gray-700">{notification.notification}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.sent_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
