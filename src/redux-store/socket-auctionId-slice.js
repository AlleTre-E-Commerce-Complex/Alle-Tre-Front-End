import { createSlice } from "@reduxjs/toolkit";

export const socketAuctionIdSlice = createSlice({
  name: "socketAuctionId",
  initialState: {
    socketAuctionId: {},
  },
  reducers: {
    socketAuctionId: (state, action) => {
      state.socketAuctionId = action.payload;
    },
  },
});

export const { socketAuctionId } = socketAuctionIdSlice.actions;
export default socketAuctionIdSlice.reducer;
