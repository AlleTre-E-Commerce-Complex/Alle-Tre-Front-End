import { createSlice } from "@reduxjs/toolkit";

export const bidAmountSlice = createSlice({
  name: "bidAmount",
  initialState: {
    bidAmount: {},
    bidAmountPathName: {},
    buyNow: {},
  },
  reducers: {
    bidAmount: (state, action) => {
      state.bidAmount = action.payload;
    },
    bidAmountPathName: (state, action) => {
      state.bidAmountPathName = action.payload;
    },
    buyNow: (state, action) => {
      state.buyNow = action.payload;
    },
  },
});

export const { bidAmount, bidAmountPathName, buyNow } = bidAmountSlice.actions;
export default bidAmountSlice.reducer;
