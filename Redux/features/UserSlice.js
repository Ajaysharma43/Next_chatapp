import { UsersInstance } from "@/Interseptors/UsersInterseptors"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const GetSearchUsers = createAsyncThunk('GetSearchUsers', async ({ query }) => {
    try {
        const res = await UsersInstance.post('/SearchUsers', { user: query })
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const GetSingleUser = createAsyncThunk('GetSingleUser', async ({ id, currentUserId }) => {
    try {
        const res = await UsersInstance.get(`/GetSingleUser?userid=${id}&currentUserId=${currentUserId}`)
        console.log(res.data)
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const AddFriends = createAsyncThunk('AddFriends', async ({ data }) => {
    try {
        const res = await UsersInstance.post('/SendRequest', { data })
        return res.data
    } catch (error) {
        console.error(error)
    }
})

const initialState = {
    SearchData: [],
    SingleUser: {},
    IsSearchLoading: false,
    IsUserSearchLoading: false,
    AddFriendsLoading: false,
    IsUserFriends: false,
    UsersRelation: "",
    senderid: null
}

const UserReducer = createSlice({
    initialState,
    name: "UserReducer",
    extraReducers: (builder) => {
        builder.addCase(GetSearchUsers.pending, (state, action) => {
            state.IsSearchLoading = true
        })
        builder.addCase(GetSearchUsers.fulfilled, (state, action) => {
            state.SearchData = action.payload.UserData
            state.IsSearchLoading = false
        })

        builder.addCase(GetSingleUser.pending, (state, action) => {
            state.IsUserSearchLoading = true
        })
        builder.addCase(GetSingleUser.fulfilled, (state, action) => {
            state.SingleUser = action.payload.user
            state.IsUserFriends = action.payload.relation
            state.UsersRelation = action.payload.relationshipStatus
            state.senderid = action.payload?.sender?.sender_id
            state.IsUserSearchLoading = false
        })

        builder.addCase(AddFriends.pending, (state, action) => {
            state.AddFriendsLoading = true
        })
        builder.addCase(AddFriends.fulfilled, (state, action) => {
            state.IsUserFriends = action.payload.success
            state.UsersRelation = action.payload.relationshipStatus
        })
    }
})

export default UserReducer.reducer