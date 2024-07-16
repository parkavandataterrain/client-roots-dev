import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { protectedApi } from "../../services/api";

const programs = ["ECM", "Diabetes", "STOMP"];

const dates = [
  "2024-03-15",
  "2024-03-16",
  "2024-03-17",
  "2024-03-18",
  "2024-03-19",
  "2024-03-20",
  "2024-03-21",
  "2024-03-22",
  "2024-03-23",
  "2024-03-24",
];

function getRandomDate(dates) {
  const randomIndex = Math.floor(Math.random() * dates.length);
  return dates[randomIndex];
}

function getRandomProgram(programs) {
  const randomIndex = Math.floor(Math.random() * programs.length);
  return programs[randomIndex];
}

const initialState = {
  data: [],
  error: null,
  loading: false,
};

export const fetchClientsInfoAsync = createAsyncThunk(
  "clientsInfo/fetchClients",
  async () => {
    const response = await protectedApi.get("/clientinfo-api/");

    return response.data.map((client) => ({
      date_assigned: getRandomDate(dates),
      program: getRandomProgram(programs),
      ...client,
    }));
  }
);

const clientsInfoSlice = createSlice({
  name: "clientsInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientsInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClientsInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchClientsInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const getClientInfoById = (state, clientId) => state.clientInfo.data.find((client) => client.id === clientId);
export default clientsInfoSlice.reducer;
