import { UserProfileInstance } from "@/Interseptors/UserProfileInterseptors"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"

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

export const GetComments = createAsyncThunk('GetComments', async ({ imageid }) => {
    try {
        const res = await UserProfileInstance.get(`/GetComments?imageid=${imageid}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const AddComment = createAsyncThunk('AddComment', async ({ values, userid, imageid }) => {
    try {
        const res = await UserProfileInstance.post('/Comment', { comment: values.comment, imageid, userid })
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const DeleteComment = createAsyncThunk('DeleteComment', async ({ commentid, imageid }) => {
    try {
        const res = await UserProfileInstance.delete(`/DeleteComment?commentid=${commentid}&imageid=${imageid}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
})

export const PostUpload = createAsyncThunk('PostUpload', async ({ formdata }) => {
    try {
        const res = await UserProfileInstance.post('/UploadImage', (formdata))
        return res.data
    } catch (error) {
        console.error(error)
    }
})


export const GetFriendsPosts = createAsyncThunk('GetFriendsPosts', async ({ userid }) => {
    try {
        const res = await UserProfileInstance.get(`/GetFriendsPosts?userid=${userid}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
})

const initialState = {
    UserDetails: [],
    UserFollowerData: [],
    UserFollowingData: [],
    UserImagesUploadData: [],
    ImageComments: [],
    FriendsPosts: [],
    PostUploadStatus: "",
    PostUploadLoading: false,
}

const UserProfileSlice = createSlice({
    initialState: initialState,
    name: 'UserProfileSlice',
    reducers: {
        UpdateUploadStatus: (state, action) => {
            state.PostUploadStatus = ""
        }
    },
    extraReducers: (builder) => {
        builder.addCase(GetUserProfileData.fulfilled, (state, action) => {
            state.UserDetails = action.payload.UserDetails
            state.UserFollowerData = action.payload.UserFollowerData
            state.UserFollowingData = action.payload.UserFollowingData
            state.UserImagesUploadData = action.payload.UserImagesUploadData
        })

        builder.addCase(UpdateProfilePic.fulfilled, (state, action) => {
            state.UserDetails[0].profilepic = action.payload.Userdata[0]?.profilepic;
            Cookies.set('AccessToken', action.payload.AccessToken)
            Cookies.set('RefreshToken', action.payload.RefreshToken)
        });

        builder.addCase(GetComments.fulfilled, (state, action) => {
            state.ImageComments = action.payload.Comments
        })

        builder.addCase(AddComment.fulfilled, (state, action) => {
            state.ImageComments = [...state.ImageComments, action.payload.Comment[0]];
            const ImageComments = state.UserImagesUploadData.find((item) => item.image_id === action.payload.Comment[0].image_id)
            ImageComments.comment_count = Number(ImageComments.comment_count) + 1;
        })

        builder.addCase(DeleteComment.fulfilled, (state, action) => {
            // Remove the comment from the ImageComments array
            state.ImageComments = state.ImageComments.filter(
                (comment) => comment.id !== parseInt(action.payload.id)
            );

            // Find the corresponding image and update the comment count
            const ImageComments = state.UserImagesUploadData.find(
                (item) => item.image_id === parseInt(action.payload.imageid)
            );

            if (ImageComments) {
                ImageComments.comment_count = Number(ImageComments.comment_count) - 1;
            }
        })

        builder.addCase(PostUpload.pending, (state, action) => {
            state.PostUploadLoading = true
            state.PostUploadStatus = "Uploading of post is started"
        })

        builder.addCase(PostUpload.fulfilled, (state, action) => {
            state.PostUploadLoading = false
            state.PostUploadStatus = "success"
        })

        builder.addCase(PostUpload.rejected, (state, action) => {
            state.PostUploadLoading = false
            state.PostUploadStatus = "failed to upload post"
        })

        builder.addCase(GetFriendsPosts.fulfilled , (state , action) => {
            state.FriendsPosts = action.payload.FriendsPosts
        })

    }
})

export const { UpdateUploadStatus } = UserProfileSlice.actions
export default UserProfileSlice.reducer