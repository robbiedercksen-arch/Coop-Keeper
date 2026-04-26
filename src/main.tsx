import "./index.css";   // MUST BE FIRST
import "./globals.css"; // MUST BE SECOND

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
);