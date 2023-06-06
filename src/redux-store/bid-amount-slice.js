import { createSlice } from "@reduxjs/toolkit";

export const bidAmountSlice = createSlice({
  name: "bidAmount",
  initialState: {
    bidAmount: {},
  },
  reducers: {
    bidAmount: (state, action) => {
      state.bidAmount = action.payload;
    },
  },
});

export const { bidAmount } = bidAmountSlice.actions;
export default bidAmountSlice.reducer;
