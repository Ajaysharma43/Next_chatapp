import { DashboardInstance } from "@/Interseptors/DashboardInterseptors"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const GetUserData = createAsyncThunk('GetUserData', async ({ limit, page }) => {
    try {
        const res = await DashboardInstance.get(`GetData?Limit=${limit}&page=${page}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
})
const initialState = {
    UserData: [],
    Totalpages: null
}

const DashboardReducer = createSlice({
    initialState,
    name: "DashboardReducer",
    extraReducers: (builder) => {
        builder.addCase(GetUserData.fulfilled, (state, action) => {
            state.UserData = action.payload.Data,
                state.Totalpages = action.payload.TotalPages
        })
    }
})

export default DashboardReducer.reducer