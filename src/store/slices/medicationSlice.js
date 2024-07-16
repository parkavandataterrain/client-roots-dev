import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { protectedApi } from "../../services/api";

const initialState = {
  data: [],
  error: null,
  loading: false,
};

export const fetchMedicationInfoAsync = createAsyncThunk(
  "medication/fetchMedication",
  async ({clientId}) => {
    const response = await protectedApi.get(`/clientmedication-api/${clientId}`);

    return response.data;
  }
);

const Medication = createSlice({
  name: "medication",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicationInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedicationInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchMedicationInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default Medication.reducer;
