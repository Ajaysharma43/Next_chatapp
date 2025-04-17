import axios from "axios";

export const NotificationInstance = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_SERVER_URL}/GroupChat`
})

