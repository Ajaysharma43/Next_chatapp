"use client"
import { configureStore } from "@reduxjs/toolkit"
import chatreducer from "@/Redux/features/Chatslice"
import DashboardReducer from '@/Redux/features/DashboardSlice'
import UserReducer from '@/Redux/features/UserSlice'
import ChatGroupsReducer from "@/Redux/features/ChatGroupsSlice"
import NotificationReducer from '@/Redux/features/NotificationsSlice'
import UserProfileSlice from '@/Redux/features/UserProfileSlice'

const store = configureStore({
    reducer: {
        chatreducer: chatreducer,
        DashboardReducer: DashboardReducer,
        UserReducer: UserReducer,
        ChatGroupsReducer: ChatGroupsReducer,
        NotificationReducer: NotificationReducer,
        UserProfileSlice : UserProfileSlice
    }
})

export default store