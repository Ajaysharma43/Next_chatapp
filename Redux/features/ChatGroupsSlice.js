import { ChatGroupInstance } from "@/Interseptors/ChatGroupsInterseptors"

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

export const GetGroups = createAsyncThunk('GetGroups' , async({userid}) => {
    try {
        console.log(userid)
        const res = await ChatGroupInstance.get(`/GetGroups?userid=${userid}`)
        return res.data
    } catch (error) {
        console.log(error)
    }
})

const initialstate = {
    Groups: [],
}

const ChatGroupsReducer = createSlice({
    initialState: initialstate,
    name: 'ChatGroupsReducer',
    reducers: {
        ChatGroups: (state, action) => {
            console.log(action.payload)
            state.Groups = action.payload;
        }
    },
    extraReducers : (builder) => {
        builder.addCase(GetGroups.fulfilled , (state , action) => {
            state.Groups = action.payload.Groups
        })
    }
})

export const { ChatGroups } = ChatGroupsReducer.actions

export default ChatGroupsReducer.reducer