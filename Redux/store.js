"use client"
import { configureStore } from "@reduxjs/toolkit"
import chatreducer from "@/Redux/features/Chatslice"
import DashboardReducer from '@/Redux/features/DashboardSlice'
import UserReducer from '@/Redux/features/UserSlice'

const store = configureStore({
    reducer: {
        chatreducer: chatreducer,
        DashboardReducer: DashboardReducer,
        UserReducer: UserReducer
    }
})

export default store