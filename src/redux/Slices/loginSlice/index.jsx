import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogged: false,
    roleIs: null,
    loggedUserDetails: {},
    registerFormDetails: {},
    userDetails: {},
    loading: false,
    error: null,
    message: null
}

const loginSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Set loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        setMessage: (state, action) => {
            state.message = action.payload;
            state.loading = false;
        },

        clearError: (state) => {
            state.error = null;
            state.message = null;
        },

        // Login success action
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isLogged = true;
            state.error = null;
            state.message = null;

            const { user, token, role } = action.payload;
            state.roleIs = role;
            state.loggedUserDetails = user;
            state.userDetails = action.payload;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
        },

        // Logout action
        logoutSuccess: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");

            return initialState;
        },

        // Registration success action
        registerSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.message = action.payload.message || "Registration successful";
            state.userDetails = action.payload.data;
        },

        // Forgot password success action
        forgotPasswordSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.message = action.payload.message || "Password reset email sent successfully";
        },

        // Reset password success action
        resetPasswordSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.message = action.payload.message || "Password reset successfully";
        },

        // Delete user success action
        deleteUserSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.message = "Account deleted successfully";

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            return initialState;
        },

        setLoggedUser: (state, action) => {
            state.isLogged = action.payload;
        },

        setRoleIs: (state, action) => {
            state.roleIs = action.payload;
        },

        setLoggedUserDetails: (state, action) => {
            state.loggedUserDetails = action.payload;
        },

        setRegisterFormDetails: (state, action) => {
            state.registerFormDetails = action.payload;
        },

        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        }
    }
})

export const {
    setLoading,
    setError,
    setMessage,
    clearError,
    loginSuccess,
    logoutSuccess,
    registerSuccess,
    forgotPasswordSuccess,
    resetPasswordSuccess,
    deleteUserSuccess,
    setLoggedUser,
    setRoleIs,
    setLoggedUserDetails,
    setRegisterFormDetails,
    setUserDetails
} = loginSlice.actions;

export default loginSlice.reducer;