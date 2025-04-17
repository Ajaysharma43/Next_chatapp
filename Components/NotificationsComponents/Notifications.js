"use client"

import { GetNotifications } from "@/Redux/features/NotificationsSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const NotificationComponent = ({userid , username}) => {
    const Notifications = useSelector((state) => state.NotificationReducer.Notifications)
    const dispatch = useDispatch()
    useEffect(() => {
        console.log(userid)
        if (userid) {
          dispatch(GetNotifications({ userid }));
          console.log(Notifications)
        }
      }, [Notifications.length]);
      
    return(
        <>
        <div>
            <h1>this is the userid component</h1>
        </div>
        </>
    )
}

export default NotificationComponent