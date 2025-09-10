import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLogged: false,
    roleIs: null,
    loggedUserDetails: {},
    registerFormDetails: {},
    userDetails: {},
    loading: false,
    error: null
}

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);
export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Logout failed");
        }
    }
);
export const registerUser = createAsyncThunk(
    "user/register",
    async ({ title, firstName, lastName, email, password, mobileNo }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/customer-users/register`,
                { title, firstName, lastName, email, password, mobileNo },
                { headers: { "Content-type": "application/json" } }
            );
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Registration failed");

        }
    }
)
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isLogged = true;

                // action.payload = { token, user }
                state.roleIs = action.payload.user.role;
                state.loggedUserDetails = action.payload.user;
                state.userDetails = action.payload;

                // Save in localStorage
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("role", action.payload.user.role);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");

                return initialState;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetails = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const {
    setLoggedUser,
    setRoleIs,
    setLoggedUserDetails,
    setRegisterFormDetails,
    setUserDetails
} = loginSlice.actions;

export default loginSlice.reducer;
