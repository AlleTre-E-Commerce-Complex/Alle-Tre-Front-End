import React from "react";

import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./redux-store/store";

import App from "./App";

import { LanguageProvider } from "./context/language-context";
import { AuthProvider } from "./context/auth-context";
import { SocketProvider } from "context/socket-context";

import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <LanguageProvider>
            <Provider store={store}>
              <App />
            </Provider>
          </LanguageProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
