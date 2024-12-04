import { createSlice } from "@reduxjs/toolkit";

export const welcomeBonusSlice = createSlice({
  name: "welcomeBonus",
  initialState: {
    welcomeBonus: false,
  },
  reducers: {
    welcomeBonus: (state, action) => {
      state.welcomeBonus = action.payload;
    },
  },
});

export const { welcomeBonus } = welcomeBonusSlice.actions;
export default welcomeBonusSlice.reducer;


