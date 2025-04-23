import { UsersInstance } from "@/Interseptors/UsersInterseptors"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const GetSearchUsers = createAsyncThunk('GetSearchUsers', async ({ query, id }) => {
    try {
        const res = await UsersInstance.post('/SearchUsers', { user: query, id })
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const GetSingleUser = createAsyncThunk('GetSingleUser', async ({ id, currentUserId }) => {
    try {
        const res = await UsersInstance.get(`/GetSingleUser?userid=${id}&currentUserId=${currentUserId}`)
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

export const AcceptRequest = createAsyncThunk('AcceptRequest', async ({ data }) => {
    try {
        const res = await UsersInstance.post('/AcceptRequest', { data })
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const DeclineRequest = createAsyncThunk('DeclineRequest', async ({ data }) => {
    try {
        const res = await UsersInstance.post('/DeclineRequest', { data })
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const GetRequests = createAsyncThunk('GetRequests', async ({ senderid }) => {
    try {
        const res = await UsersInstance.get(`/GetRequests?senderid=${senderid}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const CheckFriends = createAsyncThunk('CheckFriends', async ({ id, data }) => {
    try {
        const res = await UsersInstance.post('/CheckFriends', { id: id, data: data })
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const DeleteFriend = createAsyncThunk('DeleteFriend', async ({ id, friend }) => {
    try {
        const res = await UsersInstance.post('/DeleteFriend', { id: id, data: { sender: friend.sender_id, receiver: friend.receiver_id } })
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const BlockedFriends = createAsyncThunk('BlockedFriends', async ({ userid }) => {
    try {
        const res = await UsersInstance.get(`/GetBlockedFriends?userid=${userid}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
})

const initialState = {
    SearchData: [],
    SingleUser: {},
    Requests: [],
    Friends: [],
    RecieveRequests: [],
    BlockedUser: [],
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
    reducers: {
        UpdateBlockedUsers: (state, action) => {
            state.BlockedUser = action.payload
        },
        setUsersList: (state, action) => {
            state.SearchData = action.payload
        }
    },
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
            state.SingleUser = action.payload?.user
            state.IsUserFriends = action.payload?.relation
            state.UsersRelation = action.payload?.relationshipStatus
            state.senderid = action.payload?.sender?.sender_id
            state.IsUserSearchLoading = false
        })
        builder.addCase(GetSingleUser.rejected, (state, action) => {
            state.IsUserSearchLoading = false
        })

        builder.addCase(AddFriends.pending, (state, action) => {
            state.AddFriendsLoading = true
        })
        builder.addCase(AddFriends.fulfilled, (state, action) => {
            state.IsUserFriends = action.payload.success
            state.UsersRelation = action.payload.relationshipStatus
            state.senderid = action.payload.data.sender
        })

        builder.addCase(AcceptRequest.fulfilled, (state, action) => {
            state.IsUserFriends = action.payload.success
            state.UsersRelation = action.payload.relationshipStatus
        })

        builder.addCase(DeclineRequest.fulfilled, (state, action) => {
            state.IsUserFriends = false
            state.UsersRelation = action.payload.relationshipStatus
        })

        builder.addCase(GetRequests.fulfilled, (state, action) => {
            state.Requests = action.payload.SendRequests
            state.RecieveRequests = action.payload.ReciveRequests
        })

        builder.addCase(CheckFriends.fulfilled, (state, action) => {
            state.Friends = action.payload.FriendsData
        })

        builder.addCase(DeleteFriend.fulfilled, (state, action) => {
            state.Friends = action.payload.FriendsData
        })

        builder.addCase(BlockedFriends.fulfilled, (state, action) => {
            state.BlockedUser = action.payload.BlockedUsers
        })
    }
})

export const { UpdateBlockedUsers, setUsersList } = UserReducer.actions

export default UserReducer.reducer