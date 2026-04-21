import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [offline, setOffline] = useState(!navigator.onLine);

  const [eggs, setEggs] = useState(0);
  const [revenue, setRevenue] = useState(0);

  // Load saved data
  useEffect(() => {
    const savedEggs = localStorage.getItem("eggs");
    const savedRevenue = localStorage.getItem("revenue");

    if (savedEggs) setEggs(parseInt(savedEggs));
    if (savedRevenue) setRevenue(parseFloat(savedRevenue));
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem("eggs", eggs.toString());
    localStorage.setItem("revenue", revenue.toString());
  }, [eggs, revenue]);

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

  const addEgg = () => {
    setEggs((prev) => prev + 1);
    setRevenue((prev) => prev + 0.5); // adjust price later
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

      {/* ACTION */}
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

      {/* RESET (for testing) */}
      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => {
            setEggs(0);
            setRevenue(0);
          }}
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