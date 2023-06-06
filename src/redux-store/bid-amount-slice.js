import { createSlice } from "@reduxjs/toolkit";

export const bidAmountSlice = createSlice({
  name: "bidAmount",
  initialState: {
    bidAmount: {},
    bidAmountPathName: {},
  },
  reducers: {
    bidAmount: (state, action) => {
      state.bidAmount = action.payload;
    },
    bidAmountPathName: (state, action) => {
      state.bidAmountPathName = action.payload;
    },
  },
});

export const { bidAmount, bidAmountPathName } = bidAmountSlice.actions;
export default bidAmountSlice.reducer;
