"use client"
import { configureStore } from "@reduxjs/toolkit"
import chatreducer from "@/Redux/features/Chatslice"
import DashboardReducer from '@/Redux/features/DashboardSlice'

const store = configureStore({
    reducer : {
        chatreducer : chatreducer,
        DashboardReducer : DashboardReducer
    }
})

export default store