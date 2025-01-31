// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { backendUrl } from "../../../config/config";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await axios.get(
        `${backendUrl}/api/v1/user/auth/check-auth`, // Now correctly concatenating the URL
        {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          withCredentials: true, // Correct place for the `withCredentials` option
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error in checkAuth:", error);
      return rejectWithValue({
        success: false,
        message: error?.response?.data?.message || "Something went wrong.",
      });
    }
  }
);


export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/user/signin`, // Correctly using the backend URL
        formData,
        {
          withCredentials: true, // Correct place for the `withCredentials` option
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error Details:", error?.response?.data);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue({
        success: false,
        message: errorMessage,
      });
    }
  }
);


export const signup = createAsyncThunk("auth/signup", async (formData, { rejectWithValue }) => {
  try {
   
    const response = await axios.post(
      `${backendUrl}/api/v1/user/signup`, // Correctly using the backend URL
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error Details:", error?.response?.data);
    const errorMessage = Array.isArray(error?.response?.data?.message)
      ? error?.response?.data?.message[0]
      : error?.response?.data?.message;
    return rejectWithValue({
      success: false,
      message: errorMessage || "Something Went Wrong",
    });
  }
});

export const logoutFromServer = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/user/logout`, // Correct usage with backend URL
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.log(error?.response);
      return rejectWithValue({
        success: false,
        message: error?.response?.data?.message || "Something Went Wrong",
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle success based on payload structure (success and user)
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        // Optionally, you can add the error message to state for debugging
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.data : null;
        state.isAuthenticated = !action.payload.success ? false : true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(logoutFromServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutFromServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? null : state.user;
        state.isAuthenticated = action.payload.success ? false : true;
      });
  },
});

export default authSlice.reducer;
