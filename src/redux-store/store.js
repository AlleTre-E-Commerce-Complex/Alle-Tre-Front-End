import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "./auth-model-slice";
import productDetailsSlice from "./product-details-Slice";
import auctionDetailsSlice from "./auction-details-slice";
import pofileDataSlice from "./pofile-data-slice";
import bidAmountSlice from "./bid-amount-slice";
import completePaymentSlice from "./complete-payment-slice";
import socketAuctionIdSlice from "./socket-auctionId-slice";
import walletBalanceSlice from "./wallet-balance-slice";
import welcomeBonusSlice from "./welcom-bonus-slice";

export const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    productDetails: productDetailsSlice,
    auctionDetails: auctionDetailsSlice,
    profileData: pofileDataSlice,
    bidAmount: bidAmountSlice,
    completePayment: completePaymentSlice,
    socketAuctionId: socketAuctionIdSlice,
    walletBalance:walletBalanceSlice,
    welcomeBonus:welcomeBonusSlice,
  },
});
