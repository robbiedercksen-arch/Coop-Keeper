import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Chicken = {
  name: string;
  eggs: number;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [offline, setOffline] = useState(!navigator.onLine);

  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [newChicken, setNewChicken] = useState("");

  const [feedCost, setFeedCost] = useState(0);
  const [eggPrice] = useState(0.5);

  const [loaded, setLoaded] = useState(false);

  // 🔥 LOAD
  useEffect(() => {
    const saved = localStorage.getItem("coopDataFull");

    if (saved) {
      const data = JSON.parse(saved);
      setChickens(data.chickens || []);
      setFeedCost(data.feedCost || 0);
    }

    setLoaded(true);
  }, []);

  // 🔥 SAVE
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      "coopDataFull",
      JSON.stringify({ chickens, feedCost })
    );
  }, [chickens, feedCost, loaded]);

  // 🌐 STATUS
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

  // ➕ ADD CHICKEN
  const addChicken = () => {
    if (!newChicken.trim()) return;

    setChickens([...chickens, { name: newChicken.trim(), eggs: 0 }]);
    setNewChicken("");
  };

  // 🥚 ADD EGG
  const addEgg = (index: number) => {
    const updated = [...chickens];
    updated[index].eggs += 1;
    setChickens(updated);
  };

  // 🌽 ADD FEED COST
  const addFeed = () => {
    const amount = prompt("Enter feed cost:");
    if (!amount) return;

    setFeedCost((prev) => prev + parseFloat(amount));
  };

  // 🔁 RESET
  const reset = () => {
    setChickens([]);
    setFeedCost(0);
    localStorage.removeItem("coopDataFull");
  };

  const totalEggs = chickens.reduce((sum, c) => sum + c.eggs, 0);
  const revenue = totalEggs * eggPrice;
  const profit = revenue - feedCost;

  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper</h1>

      {offline && <p style={{ color: "orange" }}>⚠️ Offline Mode</p>}
      {!user && !offline && (
        <p style={{ color: "orange" }}>
          ⚠️ Not logged in (app still usable)
        </p>
      )}
      {user && <p>Welcome back 👋</p>}

      {/* ADD CHICKEN */}
      <div style={{ marginTop: 20 }}>
        <input
          value={newChicken}
          onChange={(e) => setNewChicken(e.target.value)}
          placeholder="Chicken name"
        />
        <button onClick={addChicken}>Add Chicken</button>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 20 }}>
        <h2>🐔 Chickens</h2>

        {chickens.map((chicken, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <b>{chicken.name}</b> — Eggs: {chicken.eggs}
            <button onClick={() => addEgg(index)} style={{ marginLeft: 10 }}>
              ➕ Egg
            </button>
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div style={{ marginTop: 20 }}>
        <button onClick={addFeed}>🌽 Add Feed Cost</button>
      </div>

      {/* STATS */}
      <div style={{ marginTop: 20 }}>
        <h2>📊 Stats</h2>
        <p>Total Eggs: {totalEggs}</p>
        <p>Revenue: {revenue.toFixed(2)}</p>
        <p>Feed Cost: {feedCost.toFixed(2)}</p>
        <p>
          <b>Profit: {profit.toFixed(2)}</b>
        </p>
      </div>

      {/* RESET */}
      <div style={{ marginTop: 20 }}>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}