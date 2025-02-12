import { createSlice } from "@reduxjs/toolkit";

export const listingProductDetailsSlice = createSlice({
  name: "listingProductDetails",
  initialState: {
    listingProductDetails: {},
  },
  reducers: {
    listingProductDetails: (state, action) => {
      state.listingProductDetails = action.payload;
    },
  },
});

export const { listingProductDetails } = listingProductDetailsSlice.actions;
export default listingProductDetailsSlice.reducer;
