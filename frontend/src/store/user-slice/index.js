import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const allUsers = createAsyncThunk(
  "user/allusers",
  async (_, { rejectWithValue }) => {
    try {
    } catch (error) {}
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: true,
    user: null,
  },
  reducers: () => {},
  extraReducers: (builder) => {},
});

export default userSlice.reducer;
