import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isBlocked: false,
};

const blockedUserSlice = createSlice({
  name: "blockedUser",
  initialState,
  reducers: {
    setBlockedUser: (state, action) => {
      state.isBlocked = action.payload;
    },
  },
});

export const { setBlockedUser } = blockedUserSlice.actions;
export default blockedUserSlice.reducer;
