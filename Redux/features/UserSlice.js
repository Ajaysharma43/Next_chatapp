import { UsersInstance } from "@/Interseptors/UsersInterseptors"
import  { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const GetSearchUsers = createAsyncThunk('GetSearchUsers' , async({query}) => {
    try {
        console.log(query)
        const res = await UsersInstance.post('/SearchUsers' , {user : query})
        console.log(res.data)
    } catch (error) {
        console.error(error)
    }
})

const initialState = {
    SearchData : [],
    SingleUser : {}
}

const UserReducer = createSlice({
    initialState ,
    name : "UserReducer",
})

export default UserReducer.reducer