import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { protectedApi } from "../../services/api";

const initialState = {
  data: [],
  error: null,
  loading: false,
};

export const fetchDiagnosesInfoAsync = createAsyncThunk(
  "diagnoses/fetchMedication",
  async ({clientId}) => {
    const response = await protectedApi.get(`/clientdiagnoses-api/${clientId}`);

    return response.data;
  }
);

const Diagnoses = createSlice({
  name: "diagnoses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiagnosesInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiagnosesInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchDiagnosesInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default Diagnoses.reducer;
