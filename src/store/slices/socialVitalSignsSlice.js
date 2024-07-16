import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { protectedApi } from "../../services/api";

const initialState = {
  data: [],
  error: null,
  loading: false,
};

export const fetchSocialVitalSignsAsync = createAsyncThunk(
  "socialVitalSigns/fetchSocialVitalSigns",
  async ({clientId}) => {
    const response = await protectedApi.get(`/clientsvs-api/${clientId}`);

    return response.data;
  }
);

const socialVitalSigns = createSlice({
  name: "socialVitalSigns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialVitalSignsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSocialVitalSignsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchSocialVitalSignsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default socialVitalSigns.reducer;
