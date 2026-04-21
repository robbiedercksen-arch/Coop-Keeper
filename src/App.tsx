import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Detect offline/online
    const updateStatus = () => setOffline(!navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    // Try get user (safe)
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data?.user ?? null);
      });
    }

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper</h1>

      {offline && (
        <p style={{ color: "orange" }}>
          ⚠️ Offline Mode (limited features)
        </p>
      )}

      {!user && !offline && (
        <p style={{ color: "orange" }}>
          ⚠️ Not logged in (app still usable)
        </p>
      )}

      {user && <p>Welcome back 👋</p>}

      {/* REAL CONTENT */}
      <div style={{ marginTop: 20 }}>
        <h2>Today</h2>
        <p>Eggs: 8</p>
        <p>Revenue: 4.00</p>
        <p>Best Chicken: Saartjie</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Overall</h2>
        <p>Total Eggs: 8</p>
        <p>Revenue: 4.00</p>
        <p>Feed Cost: 4.00</p>
        <p><b>Profit: 0.00</b></p>
      </div>
    </div>
  );
}