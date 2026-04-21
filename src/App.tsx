import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [offline, setOffline] = useState(!navigator.onLine);

  const [eggs, setEggs] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);

  // 🔥 LOAD FROM LOCAL STORAGE (ONCE)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("coopData");

      if (saved) {
        const data = JSON.parse(saved);
        setEggs(data.eggs || 0);
        setRevenue(data.revenue || 0);
      }
    } catch (err) {
      console.error("Failed to load local data", err);
    }
  }, []);

  // 🔥 SAVE TO LOCAL STORAGE (EVERY CHANGE)
  useEffect(() => {
    try {
      const data = {
        eggs,
        revenue,
      };

      localStorage.setItem("coopData", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to save local data", err);
    }
  }, [eggs, revenue]);

  // 🌐 ONLINE/OFFLINE + USER
  useEffect(() => {
    const updateStatus = () => setOffline(!navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

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

  // ➕ ADD EGG
  const addEgg = () => {
    setEggs((prev) => prev + 1);
    setRevenue((prev) => prev + 0.5);
  };

  // 🔁 RESET
  const reset = () => {
    setEggs(0);
    setRevenue(0);
    localStorage.removeItem("coopData");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper</h1>

      {offline && (
        <p style={{ color: "orange" }}>
          ⚠️ Offline Mode (data saved locally)
        </p>
      )}

      {!user && !offline && (
        <p style={{ color: "orange" }}>
          ⚠️ Not logged in (app still usable)
        </p>
      )}

      {user && <p>Welcome back 👋</p>}

      {/* TODAY */}
      <div style={{ marginTop: 20 }}>
        <h2>📅 Today</h2>
        <p>Eggs: {eggs}</p>
        <p>Revenue: {revenue.toFixed(2)}</p>
      </div>

      {/* ACTIONS */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={addEgg}
          style={{
            padding: "10px 20px",
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          ➕ Add Egg
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button
          onClick={reset}
          style={{
            padding: "8px 16px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}