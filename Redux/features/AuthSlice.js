const { AuthInstance } = require("@/Interseptors/AuthInterseptors")
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit")

const CheckEmail = createAsyncThunk('CheckEmail' , async({email}) => {
    try {
        const res = await AuthInstance.post('/Checkuser' , {email})
    } catch (error) {
        
    }
})

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