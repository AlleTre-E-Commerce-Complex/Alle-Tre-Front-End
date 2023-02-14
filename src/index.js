import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { LanguageProvider } from "./context/language-context";
import { AuthProvider } from "./context/auth-context";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
