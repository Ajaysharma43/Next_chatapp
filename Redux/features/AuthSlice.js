const { AuthInstance } = require("@/Interseptors/AuthInterseptors")
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")



const initialState = {
    OTP : null,
    Success : false,
    Loading : false,
}

const AuthReducer = createSlice({
    initialState , 
    name : "AuthReducer",
    extraReducers : (builder) => {

    }
})