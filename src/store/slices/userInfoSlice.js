import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiURL from "../../apiConfig";

// Define the async thunk for fetching permission list
export const fetchPermissionList = createAsyncThunk(
  "userInfo/fetchPermissionList",
  async (_) => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${apiURL}/api/user-permissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
);

// Define the initial state
const initialState = {
  permissions: [],
  permissionListStatus: "idle",
  error: null,
};

// Create the slice
export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reducers for fetchPermissionList thunk
      .addCase(fetchPermissionList.pending, (state) => {
        state.permissionListStatus = "loading";
      })
      .addCase(fetchPermissionList.fulfilled, (state, action) => {
        state.permissionListStatus = "succeeded";
        state.permissions = action.payload;
      })
      .addCase(fetchPermissionList.rejected, (state, action) => {
        state.permissionListStatus = "failed";
        state.error = action?.error?.message;
      });
  },
});

// Export the async thunks and selectors
export const selectUserInfo = (state) => state.userInfo;
export default userInfoSlice.reducer;
