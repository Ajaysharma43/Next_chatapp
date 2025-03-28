import axios from "axios";

export const DashboardInstance = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_SERVER_URL}/Dashboard`
})