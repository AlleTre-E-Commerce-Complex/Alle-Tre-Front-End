import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "./auth-model-slice";

export const store = configureStore({
  reducer: {
    toggle: toggleReducer,
  },
});
