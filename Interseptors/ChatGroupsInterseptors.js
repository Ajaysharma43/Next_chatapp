import axios from 'axios'

export const ChatGroupInstance = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_SERVER_URL}/GroupChat`
})