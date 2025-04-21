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

export const SearchSortedData = createAsyncThunk('SearchSortedData', async ({ SearchUserData, data, limit, page }) => {
    try {
        const res = await DashboardInstance.post('/SearchSortData', { SearchUserData, data, limit, page })
        return res.data;
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

const UpdateCurrentPage = (state, action) => {
    if (state.CurrentPage > action.payload.TotalPages) {
        return action.payload.TotalPages
    }
    else {
        return state.CurrentPage
    }
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
            state.CurrentPage = action.payload
        },
        UpdatePage: (state, action) => {
            state.CurrentPage = 1
        }
    },
    extraReducers: (builder) => {
        // GetUserData reducers
        builder.addCase(GetUserData.fulfilled, (state, action) => {
            state.UserData = action.payload.Data,
            state.Totalpages = action.payload.TotalPages
            state.CurrentPage = UpdateCurrentPage(state, action)
            state.IsSearched = false
        })

        // SortUserData reducers
        builder.addCase(SortUserData.fulfilled, (state, action) => {
            state.UserData = action.payload.Data
            state.Totalpages = action.payload.TotalPages
            state.CurrentPage = UpdateCurrentPage(state, action)
        })

        // GetSearchData reducers
        builder.addCase(GetSearchData.pending, (state, action) => {
            state.SearchLoading = true
        })
        builder.addCase(GetSearchData.fulfilled, (state, action) => {
            state.UserData = action.payload.Data
            state.Totalpages = action.payload.TotalPages
            state.IsSearched = action.payload.Success
            state.CurrentPage = UpdateCurrentPage(state, action)
            state.SearchLoading = false
        })
        builder.addCase(GetSearchData.rejected, (state, action) => {
            state.SearchLoading = false
        })

        // GetSearchSortedData reducers
        builder.addCase(SearchSortedData.pending, (state, action) => {
            state.SearchLoading = true
        })

        builder.addCase(SearchSortedData.fulfilled, (state, action) => {
            state.UserData = action.payload.UserData
            state.Totalpages = action.payload.TotalPages
            state.IsSearched = action.payload.Success
            state.CurrentPage = UpdateCurrentPage(state, action)
            state.SearchLoading = false
        })
    }
})


export const { Next, Prev, Toggle, UpdatePage } = DashboardReducer.actions;
export default DashboardReducer.reducer