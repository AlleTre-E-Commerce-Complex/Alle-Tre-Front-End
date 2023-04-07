import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "./auth-model-slice";
import productDetailsSlice from "./product-details-Slice";
import auctionDetailsSlice from "./auction-details-slice";
import pofileDataSlice from "./pofile-data-slice";
import homePageSlice from "./home-page-slice";

export const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    productDetails: productDetailsSlice,
    auctionDetails: auctionDetailsSlice,
    profileData: pofileDataSlice,
    homePage: homePageSlice,
  },
});
