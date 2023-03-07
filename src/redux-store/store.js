import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "./auth-model-slice";
import productDetailsSlice from "./product-details-Slice";

export const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    productDetails: productDetailsSlice,
  },
});
