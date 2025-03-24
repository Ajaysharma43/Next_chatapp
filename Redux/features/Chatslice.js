const { createSlice } = require("@reduxjs/toolkit")

const initialState  = {
    Chat : [],
    Loading : false,
    error : ''
}

const Chatreducer = createSlice({
    initialState,
    name : "chatreducer",

})

export default Chatreducer.reducer