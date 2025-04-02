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

export const SortUserData = createAsyncThunk('GetSortData', async ({ data, limit, page }) => {
    try {
        const res = await DashboardInstance.post(`/SortData`, { data, limit, page })
        return res.data
    } catch (error) {
        console.error(error)
    }

})

export const GetSearchData = createAsyncThunk('GetSearchData', async ({ SearchUserData, limit, page }) => {
    try {
        const res = await DashboardInstance.post('/Search', { SearchUserData, limit, page })
        return res.data
    } catch (error) {
        console.error(error)
    }

})
const initialState = {
    UserData: [],
    Totalpages: null,
    IsSearched: false
}

const DashboardReducer = createSlice({
    initialState,
    name: "DashboardReducer",
    extraReducers: (builder) => {
        builder.addCase(GetUserData.fulfilled, (state, action) => {
            state.UserData = action.payload.Data,
                state.Totalpages = action.payload.TotalPages
        }),

            builder.addCase(SortUserData.fulfilled, (state, action) => {
                state.UserData = action.payload.Data
                state.Totalpages = action.payload.TotalPages
            })

        builder.addCase(GetSearchData.fulfilled, (state, action) => {
            state.UserData = action.payload.Data
            state.Totalpages = action.payload.TotalPages
            state.IsSearched = action.payload.Success
        })
    }
})

export default DashboardReducer.reducer