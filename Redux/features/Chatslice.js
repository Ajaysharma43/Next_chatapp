const { createSlice } = require("@reduxjs/toolkit")

const initialState  = {
    OnlineUsers : [],
    Loading : false,
    error : ''
}

const Chatreducer = createSlice({
    initialState,
    name : "chatreducer",
    reducers : {
        UpdateOnlineUsers : (state , action) => {
            console.log(action.payload)
            state.OnlineUsers = action.payload
        }
    }
})

export const {UpdateOnlineUsers} = Chatreducer.actions
export default Chatreducer.reducer