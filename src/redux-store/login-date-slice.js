import { createSlice } from "@reduxjs/toolkit";

export const loginDateSlice = createSlice({
  name: "loginDate",
  initialState: {
    loginDate: {},
    hasCompletedProfile: false,
  },
  reducers: {
    loginDate: (state, action) => {
      state.loginDate = action.payload;
    },
    hasCompletedProfile: (state, action) => {
      state.hasCompletedProfile = action.payload;
    },
  },
});

export const { loginDate, hasCompletedProfile } = loginDateSlice.actions;
export default loginDateSlice.reducer;
