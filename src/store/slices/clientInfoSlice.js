import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { protectedApi } from "../../services/api";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

let controller = new AbortController();

export const fetchClientInfoAsync = createAsyncThunk(
  "clientInfo/fetchClients",
  async ({ clientId }, { signal }) => {
    try {
      const response = await protectedApi.get(`/clientinfo-api/${clientId}`, { signal });
      return response.data;
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request aborted');
        return null;
      }
      throw err;
    }
  }
);

// Dispatch action with abort signal
export const fetchClientInfo = (clientId) => async (dispatch) => {
  controller.abort();
  controller = new AbortController();
  try {
    await dispatch(fetchClientInfoAsync({ clientId, signal: controller.signal }));
  } catch (err) {
    console.error('Error fetching client info:', err);
  }
};

const clientInfoSlice = createSlice({
  name: "clientInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClientInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchClientInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default clientInfoSlice.reducer;
