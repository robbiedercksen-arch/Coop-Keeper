import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { supabase } from "./supabaseClient";

// 🔥 THIS HANDLES LOGIN AFTER EMAIL CLICK
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
    console.log("User signed in:", session?.user);
    window.location.reload(); // 🔥 forces app to load logged-in state
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);