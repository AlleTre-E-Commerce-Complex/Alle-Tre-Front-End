import { createSlice } from "@reduxjs/toolkit";

export const pofileDataSlice = createSlice({
  name: "PofileData",
  initialState: {
    PofileData: {},
  },
  reducers: {
    PofileData: (state, action) => {
      state.PofileData = action.payload;
    },
  },
});

export const { PofileData } = pofileDataSlice.actions;
export default pofileDataSlice.reducer;
