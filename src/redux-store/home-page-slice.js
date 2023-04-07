import { createSlice } from "@reduxjs/toolkit";

export const homePageSlice = createSlice({
  name: "homePage",
  initialState: {
    homePage: {},
  },
  reducers: {
    homePage: (state, action) => {
      state.homePage = action.payload;
    },
  },
});

export const { homePage } = homePageSlice.actions;
export default homePageSlice.reducer;
