import { createSlice } from "@reduxjs/toolkit";

export const walletBalanceSlice = createSlice({
  name: "walletBalance",
  initialState: {
    isWalletPayment:false,
    walletBalance: 0,
  },
  reducers: {
    setWalletBalance: (state, action) => {
      state.walletBalance = action.payload.balance;
      state.isWalletPayment = action.payload.isWallet;
    },
  },
});


export const { setWalletBalance } = walletBalanceSlice.actions;
export default walletBalanceSlice.reducer;