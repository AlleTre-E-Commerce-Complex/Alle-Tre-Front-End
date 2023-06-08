import { createSlice } from "@reduxjs/toolkit";

export const loginDateSlice = createSlice({
  name: "loginDate",
  initialState: {
    loginDate: {},
  },
  reducers: {
    loginDate: (state, action) => {
      state.loginDate = action.payload;
    },
  },
});

export const { loginDate } = loginDateSlice.actions;
export default loginDateSlice.reducer;
