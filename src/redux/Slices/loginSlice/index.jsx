import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogged: false,
    roleIs: undefined,
    loggedUserDetails: {},
    registerFormDetails: {},
    userDetails: {}
}
const loginSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoggedUser: (state, action) => {
            state.isLogged = action.payload
        },
        setRoleIs: (state, action) => {
            state.roleIs = action.payload
        },
        setLoggedUserDetails: (state, action) => {
            state.loggedUserDetails = action.payload
        },
        setRegisterFormDetails: (state, action) => {
            state.registerFormDetails = action.payload
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload
        }
    }
})

export const { setLoggedUser, setRoleIs, setLoggedUserDetails, setRegisterFormDetails, setUserDetails } = loginSlice.actions

export default loginSlice.reducer
