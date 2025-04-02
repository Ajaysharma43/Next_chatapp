import { DashboardInstance } from "@/Interseptors/DashboardInterseptors"
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"

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
    IsSearched: false,
    Limit: 2,
    CurrentPage: 1,
    SearchLoading: false
}

const DashboardReducer = createSlice({
    initialState,
    name: "DashboardReducer",
    reducers: {
        Next: (state, action) => {
            if (state.CurrentPage == state.Totalpages) {
                state.CurrentPage = state.Totalpages
            }
            else {
                state.CurrentPage += 1
            }
        },
        Prev: (state, action) => {
            if (state.CurrentPage == 1) {
                state.CurrentPage = 1
            }
            else {
                state.CurrentPage -= 1
            }
        },
        Toggle: (state, action) => {
            console.log(action.payload)
            state.CurrentPage = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(GetUserData.fulfilled, (state, action) => {
            state.UserData = action.payload.Data,
                state.Totalpages = action.payload.TotalPages
        }),

            builder.addCase(SortUserData.fulfilled, (state, action) => {
                state.UserData = action.payload.Data
                state.Totalpages = action.payload.TotalPages
            })

        builder.addCase(GetSearchData.pending, (state, action) => {
            state.SearchLoading = true
        })
        builder.addCase(GetSearchData.fulfilled, (state, action) => {
            state.UserData = action.payload.Data
            state.Totalpages = action.payload.TotalPages
            state.IsSearched = action.payload.Success
            state.SearchLoading = false
        })
        builder.addCase(GetSearchData.rejected , (state , action) => {
            state.SearchLoading = false
        })
    }
})


export const { Next, Prev, Toggle } = DashboardReducer.actions;
export default DashboardReducer.reducer