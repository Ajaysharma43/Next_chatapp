import { DashboardInstance } from "@/Interseptors/DashboardInterseptors"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const GetUserData = createAsyncThunk('GetUserData' , async({limit}) => {
    try {
        const res = await DashboardInstance.get(`GetData?Limit=${limit}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
})
const initialState = {
    UserData : []
}

const DashboardReducer = createSlice({
    initialState,
    name : "DashboardReducer",
    extraReducers : (builder) => {
        builder.addCase(GetUserData.fulfilled , (state , action) => {
            state.UserData = action.payload.Data
        })
    }
})

export default DashboardReducer.reducer