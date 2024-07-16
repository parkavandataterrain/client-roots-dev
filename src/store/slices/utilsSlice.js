// utilsSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarExpanded: false,
};

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      state.isSidebarExpanded = action.payload;
    },
  },
});

export const { toggleSidebar } = utilsSlice.actions;

export const selectIsSidebarExpanded = (state) => state.utils.isSidebarExpanded;

export default utilsSlice.reducer;
