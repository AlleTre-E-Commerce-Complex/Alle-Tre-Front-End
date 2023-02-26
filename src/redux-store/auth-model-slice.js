import { createSlice } from "@reduxjs/toolkit";

const initialToggle = {
  enableOpenAuthModel: false,
};

export const AuthModelTggle = createSlice({
  name: "toggleReducer",
  initialState: initialToggle,
  reducers: {
    Open: (state) => {
      const newToggle = { ...state, enableOpenAuthModel: true };
      return newToggle;
    },
    Close: (state) => {
      const newToggle = { ...state, enableOpenAuthModel: false };
      return newToggle;
    },
  },
});
export default AuthModelTggle.reducer;
export const { Open, Close } = AuthModelTggle.actions;
