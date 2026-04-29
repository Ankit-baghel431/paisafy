import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
    ? { isLoggedIn: true, user }
    : { isLoggedIn: false, user: null };

export const login = createAsyncThunk("auth/login", async ({ username, password }, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + "signin", {
            username,
            password,
        });
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        let message = "An unexpected error occurred during login. Please try again later.";
        
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                message = "Invalid username or password. Please check your credentials and try again.";
            } else if (error.response.data && error.response.data.message) {
                message = error.response.data.message;
            } else if (typeof error.response.data === 'string') {
                message = error.response.data;
            } else if (error.response.data && error.response.data.error) {
                message = error.response.data.error;
            }
        } else if (error.request) {
            message = "Unable to connect to the server. Please check your internet connection.";
        } else {
            message = error.message;
        }
        
        return thunkAPI.rejectWithValue(message);
    }
});

export const logout = createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem("user");
});

export const sendOtp = createAsyncThunk("auth/sendOtp", async ({ username, email }, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + "send-otp", {
            username,
            email,
        });
        return response.data;
    } catch (error) {
        let message = "An unexpected error occurred while sending OTP. Please try again later.";
        if (error.response) {
            if (error.response.data && error.response.data.message) {
                message = error.response.data.message;
            } else if (typeof error.response.data === 'string') {
                message = error.response.data;
            }
        } else if (error.request) {
            message = "Unable to connect to the server. Please check your internet connection.";
        } else {
            message = error.message;
        }
        return thunkAPI.rejectWithValue(message);
    }
});

export const register = createAsyncThunk("auth/register", async ({ username, email, password, otp }, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + "signup", {
            username,
            email,
            password,
            otp,
        });
        return response.data;
    } catch (error) {
        let message = "An unexpected error occurred during registration. Please try again later.";
        
        if (error.response) {
            if (error.response.status === 400) {
                message = error.response.data.message || "Invalid registration details provided. Please check and try again.";
            } else if (error.response.status === 409) {
                message = "An account with this username or email already exists.";
            } else if (error.response.data && error.response.data.message) {
                message = error.response.data.message;
            } else if (typeof error.response.data === 'string') {
                message = error.response.data;
            } else if (error.response.data && error.response.data.error) {
                message = error.response.data.error;
            }
        } else if (error.request) {
            message = "Unable to connect to the server. Please check your internet connection.";
        } else {
            message = error.message;
        }
        
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateProfileDetails = createAsyncThunk("user/updateProfile", async (profileData, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.user?.token;
        if (!token) throw new Error("No auth token found");

        const response = await axios.put("http://localhost:8080/api/user/profile", profileData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data; // This is the updated user object
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem("user", JSON.stringify(state.user));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(updateProfileDetails.fulfilled, (state, action) => {
                // Merge the updated profile data into the user state
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem("user", JSON.stringify(state.user));
            });
    },
});

export const { updateProfile } = authSlice.actions;
const { reducer } = authSlice;
export default reducer;
