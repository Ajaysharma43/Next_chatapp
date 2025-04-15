const { createSlice } = require("@reduxjs/toolkit")

const initialstate = {
    Groups: [],
}

const ChatGroupsReducer = createSlice({
    initialState: initialstate,
    name: 'ChatGroupsReducer',
    reducers: {
        ChatGroups: (state, action) => {
            state.Groups = action.payload;
        }
    }
})

export const { ChatGroups } = ChatGroupsReducer.actions

export default ChatGroupsReducer.reducer