import { createSlice } from "@reduxjs/toolkit";

export const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState: {
    productDetails: {},
    addMedia: {},
  },
  reducers: {
    productDetails: (state, action) => {
      state.productDetails = action.payload;
    },
  },
});

export const { productDetails } = productDetailsSlice.actions;
export default productDetailsSlice.reducer;
