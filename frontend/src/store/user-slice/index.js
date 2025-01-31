import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../axiosInstance";

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/all-users", {
        withCredentials: true,
      });
      console.log(response.data);

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
      const response = await axiosInstance.post(
        "/account/add-balance",
        amount,
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
  "account/add_balance",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/account/add-balance",
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
      const response = await axiosInstance.post(
        "/account/transfer-funds",
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
      const response = await axiosInstance.get(
        "/account/check-transactions",
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      
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
