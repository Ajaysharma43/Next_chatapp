import axios from "axios";

export const UsersInstance = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_SERVER_URL}/Chatapp`
})