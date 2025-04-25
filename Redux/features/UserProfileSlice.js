import { UserProfileInstance } from "@/Interseptors/UserProfileInterseptors"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const GetUserProfileData = createAsyncThunk('GetUserProfileData', async ({ userid }) => {
    try {
        const res = await UserProfileInstance.get(`/GetUserData?userid=${userid}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const UpdateProfilePic = createAsyncThunk('UpdateProfilePic', async ({ formdata }) => {
    try {
        const res = await UserProfileInstance.post('/UpdateProfilePic', (formdata))
        return res.data
    } catch (error) {
        console.error(error)
    }
})

const initialState = {
    UserDetails: [],
    UserFollowerData: [],
    UserFollowingData: [],
    UserImagesUploadData: []
}

const UserProfileSlice = createSlice({
    initialState: initialState,
    name: 'UserProfileSlice',
    extraReducers: (builder) => {
        builder.addCase(GetUserProfileData.fulfilled, (state, action) => {
            state.UserDetails = action.payload.UserDetails
            state.UserFollowerData = action.payload.UserFollowerData
            state.UserFollowingData = action.payload.UserFollowingData
            state.UserImagesUploadData = action.payload.UserImagesUploadData
        })

        builder.addCase(UpdateProfilePic.fulfilled, (state, action) => {
            state.UserDetails[0].profilepic = action.payload.Userdata[0]?.profilepic;
            
        });
        
    }
})

export default UserProfileSlice.reducer