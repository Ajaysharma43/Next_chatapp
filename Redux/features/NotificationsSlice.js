import { NotificationInstance } from "@/Interseptors/NotificationInterseptors"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const GetNotifications = createAsyncThunk('GetNotifications' , async({userid}) => {
    try {
        const res = await NotificationInstance.get(`/GetNotification?userid=${userid}`)
        return res.data
    } catch (error) {
        console.log(error)
    }
})

const initialState = {
    Notifications : []
}

const NotificationReducer = createSlice({
    initialState : initialState,
    name : 'NotificationReducer',
    extraReducers : (builder) => {
        builder.addCase(GetNotifications.fulfilled , (state , action) => {
            state.Notifications = action.payload.Notifications
        })
    }
})

export const {} = NotificationReducer.actions
export default NotificationReducer.reducer