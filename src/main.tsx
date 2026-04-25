import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ✅ CLEAN RENDER (NO STRICT MODE → prevents double mounting)
ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
);