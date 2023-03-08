import { createSlice } from "@reduxjs/toolkit";

export const auctionDetailsSlice = createSlice({
  name: "auctionDetails",
  initialState: {
    auctionDetails: {},
    type: {},
    duration: {},
    isBuyNow: {},
  },
  reducers: {
    auctionDetails: (state, action) => {
      state.auctionDetails = action.payload;
    },
    type: (state, action) => {
      state.type = action.payload;
    },
    duration: (state, action) => {
      state.duration = action.payload;
    },
    isBuyNow: (state, action) => {
      state.isBuyNow = action.payload;
    },
  },
});

export const { auctionDetails, type, duration, isBuyNow } =
  auctionDetailsSlice.actions;
export default auctionDetailsSlice.reducer;
