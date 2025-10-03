import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { environment } from "../../../env";

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
                `${environment.baseUrl}auth/login`,
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            return response.data;
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
                `${environment.baseUrl}auth/logout`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Logout failed");
        }
    }
);
export const registerUser = createAsyncThunk(
    "user/register",
    async ({ title, firstName, lastName, email, password, phone, registerType = "normal" }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${environment.baseUrl}customer-users/register`,
                { title, firstName, lastName, email, password, phone, registerType },
                { headers: { "Content-type": "application/json" } }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Registration failed");

        }
    }
);
export const forgetUserPassword = createAsyncThunk(
    "user/forgetPassword",
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${environment.baseUrl}customer-users/forgot-password`,
                { email },
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Forget user password failed");
        }
    }
);
export const resetUserPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ token, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${environment.baseUrl}customer-users/reset-password`,
                { token, password },
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Reset password failed");
        }
    }
);

export const deleteUser = createAsyncThunk(
    "user/deleteUser",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                `${environment.baseUrl}customer-users/delete`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Account deletion failed");
        }
    }
);
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

                state.roleIs = action.payload.data.user.role;
                state.loggedUserDetails = action.payload.data.user;
                state.userDetails = action.payload.data;

                localStorage.setItem("token", action.payload.data.token);
                localStorage.setItem("role", action.payload.data.user.role);
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
                state.userDetails = action.payload.data;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(forgetUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgetUserPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || "Password reset email sent successfully";
            })
            .addCase(forgetUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.loading = action.payload;
            })
            .addCase(resetUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetUserPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || "Password reset successfully";
            })
            .addCase(resetUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                return initialState;
            })
            .addCase(deleteUser.rejected, (state, action) => {
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
