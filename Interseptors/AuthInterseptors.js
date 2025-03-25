import axios from "axios";

export const AuthInstance = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_SERVER_URL}/Auth`
})

