import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { backendUrl } from "../../../config/config";

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/user/all-users`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      // console.log(error?.response);
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
        amount,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      // console.log(error?.response);
      return rejectWithValue({
        success: false,
        message: error?.response?.data?.message || "Something Went Wrong",
      });
    }
  }
);
export const requestMoney = createAsyncThunk(
  "account/request-funds",
  async ({requestToId, amount, description }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/account/request-funds`, // Using the backendUrl from config
        { requestToId, amount, description  },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      // console.log(error?.response);
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
      // console.log(error?.response);
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
      // console.log(error?.response);
      return rejectWithValue({
        success: false,
        message: error?.response?.data?.message || "Something Went Wrong",
      });
    }
  }
);
export const checkRequests = createAsyncThunk(
  "account/checkRequest",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/account/all-requests`, // Using the backendUrl from config
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      // console.log(error?.response);
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
    allUsers: [],
  },
  reducers: () => {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload.success ? action.payload.data : [];
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.allUsers = [];
      });
  },
});

export default userSlice.reducer;
