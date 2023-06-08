import { createSlice } from "@reduxjs/toolkit";

export const completePaymentSlice = createSlice({
  name: "completePaymentData",
  initialState: {
    completePaymentData: {},
  },
  reducers: {
    completePaymentData: (state, action) => {
      state.completePaymentData = action.payload;
    },
  },
});

export const { completePaymentData } = completePaymentSlice.actions;
export default completePaymentSlice.reducer;
