import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.improved.jsx";
import { InquiryCartProvider } from "./contexts/InquiryCartContext.improved.jsx";
import "./theme.improved.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <InquiryCartProvider>
        <App />
      </InquiryCartProvider>
    </AuthProvider>
  </BrowserRouter>
);
