import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/globals.css";
import "./styles/variables.css";
import "./styles/shared.css";
import "./styles/responsive.css";

import AuthProvider from "./context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
