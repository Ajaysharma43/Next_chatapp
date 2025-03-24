"use client"
const { configureStore } = require("@reduxjs/toolkit");
import chatreducer from "@/Redux/features/Chatslice"

const store = configureStore({
    reducer : {
        chatreducer : chatreducer
    }
})

export default store