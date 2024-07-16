import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

const ACCES_TOKEN = localStorage.getItem("access_token");
const REFRESH_TOKEN = localStorage.getItem("refresh_token");

const initialState = {
  isLoggedIn: ACCES_TOKEN && REFRESH_TOKEN ? true : false,
  status: 'idle',
  error: null,
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/token/", userCredentials, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      return data;
    } catch (error) {
      if (error.response) {
        // Handle HTTP errors
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        // Handle network errors
        return rejectWithValue("Network error occurred. Please try again.");
      } else {
        // Handle other errors
        return rejectWithValue(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  }
);

// export const loginAsync = createAsyncThunk(
//   "auth/login",
//   async ({ userCredentials }) => {
//     try {
//       const { data } = await api.post(
//         "/token/",
//         userCredentials,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       localStorage.setItem("access_token", data.access);
//       localStorage.setItem("refresh_token", data.refresh);

//       return data;
//     } catch (error) {
//       console.error("Login error:", error);
//     }
//   }
// );

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("StaySignedIn");
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
        state.isLoggedIn = true; // Update isLoggedIn state upon successful login
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.status = 'idle';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
