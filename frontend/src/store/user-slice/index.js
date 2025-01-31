import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/user/all-users`, // Added /api/v1/user
        {
          withCredentials: true,
        }
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

export const addBalance = createAsyncThunk(
  "account/add_balance",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/account/add-balance`, // Using the backendUrl from config
        { amount },
        {
          withCredentials: true,
        }
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
export const requestMoney = createAsyncThunk(
  "account/request_money",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/account/request-money`, // Using the backendUrl from config
        { amount },
        {
          withCredentials: true,
        }
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

export const sendMoney = createAsyncThunk(
  "account/sendMoney",
  async ({ amount, recipientId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/account/transfer-funds`, // Using the backendUrl from config
        { amount, recipientId },
        {
          withCredentials: true,
        }
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

export const checkTransactions = createAsyncThunk(
  "account/checkTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/account/check-transactions`, // Using the backendUrl from config
        {
          withCredentials: true,
        }
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

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: true,
    user: null,
    allUsers: null,
  },
  reducers: () => {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload.success ? action.payload.data : null;
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.allUsers = null;
      });
  },
});

export default userSlice.reducer;
