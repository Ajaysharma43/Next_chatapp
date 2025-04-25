import axios from "axios";

export const UserProfileInstance = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_SERVER_URL}/Firebase`
})