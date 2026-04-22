import { useEffect, useState } from "react";

type Chicken = {
  id: number;
  name: string;
  eggs: number;
};

export default function App() {
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [newChicken, setNewChicken] = useState("");
  const [feed, setFeed] = useState(0);
  const [loaded, setLoaded] = useState(false); // 🔥 important fix

  // 🔹 LOAD DATA (runs once)
  useEffect(() => {
    const saved = localStorage.getItem("coopData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChickens(parsed.chickens || []);
        setFeed(parsed.feed || 0);
      } catch {
        localStorage.removeItem("coopData");
      }
    }
    setLoaded(true); // ✅ allow saving AFTER load
  }, []);

  // 🔹 SAVE DATA (only after load)
  useEffect(() => {
    if (!loaded) return; // 🚫 prevents overwrite

    const data = {
      chickens,
      feed,
    };

    console.log("SAVING:", data);
    localStorage.setItem("coopData", JSON.stringify(data));
  }, [chickens, feed, loaded]);

  // 🔹 Add Chicken
  const addChicken = () => {
    if (!newChicken.trim()) return;

    const newEntry: Chicken = {
      id: Date.now(),
      name: newChicken,
      eggs: 0,
    };

    setChickens([...chickens, newEntry]);
    setNewChicken("");
  };

  // 🔹 Add Egg
  const addEgg = () => {
    if (chickens.length === 0) return;

    const updated = [...chickens];
    updated[0].eggs += 1; // simple: first chicken
    setChickens(updated);
  };

  // 🔹 Add Feed
  const addFeed = () => {
    setFeed(feed + 10);
  };

  // 🔹 Reset
  const reset = () => {
    setChickens([]);
    setFeed(0);
    localStorage.removeItem("coopData");
  };

  // 🔹 Calculations
  const totalEggs = chickens.reduce((sum, c) => sum + c.eggs, 0);
  const revenue = totalEggs * 0.5;
  const profit = revenue - feed;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🐔 Coop Keeper</h1>

      <p style={{ color: "orange" }}>
        ⚠️ Not logged in (app still usable)
      </p>

      {/* Add Chicken */}
      <div>
        <input
          placeholder="Chicken name"
          value={newChicken}
          onChange={(e) => setNewChicken(e.target.value)}
        />
        <button onClick={addChicken}>Add Chicken</button>
      </div>

      <br />

      {/* Actions */}
      <button onClick={addEgg}>🥚 Add Egg</button>
      <button onClick={addFeed}>🌽 Add Feed</button>

      <hr />

      {/* Today */}
      <h2>📅 Today</h2>
      <p>Eggs: {totalEggs}</p>
      <p>Feed: {feed.toFixed(2)}</p>
      <p>Revenue: {revenue.toFixed(2)}</p>
      <p><b>Profit: {profit.toFixed(2)}</b></p>

      {/* Chickens */}
      <h3>🐔 Chickens</h3>
      {chickens.map((c) => (
        <div key={c.id}>
          {c.name} — Eggs: {c.eggs}
        </div>
      ))}

      <br />

      {/* Reset */}
      <button onClick={reset}>Reset</button>
    </div>
  );
}