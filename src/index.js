import React from "react";

import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { LanguageProvider } from "./context/language-context";
import { AuthProvider } from "./context/auth-context";

import { Provider } from "react-redux";
import { store } from "./redux-store/store";

import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
