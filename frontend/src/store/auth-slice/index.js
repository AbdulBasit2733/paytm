// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    console.log("Check Auth");

    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/user/auth/check-auth",
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
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
        "http://localhost:3001/api/v1/user/signin",
        formData,
        {
          withCredentials: true,
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

export const signup = createAsyncThunk("auth/signup", async (formData) => {
  const response = await axios.post(
    "http://localhost:3001/api/v1/user/signup",
    formData,
    {
      withCredentials: true,
    }
  );
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    isLoading: false,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
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
        state.user = null;
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
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
