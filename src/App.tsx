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
  const [loaded, setLoaded] = useState(false);

  // 🔹 LOAD DATA
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
    setLoaded(true);
  }, []);

  // 🔹 SAVE DATA
  useEffect(() => {
    if (!loaded) return;

    const data = {
      chickens,
      feed,
    };

    localStorage.setItem("coopData", JSON.stringify(data));
  }, [chickens, feed, loaded]);

  // 🔹 ADD CHICKEN
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

  // 🔹 ADD EGG TO SPECIFIC CHICKEN
  const addEggToChicken = (id: number) => {
    const updated = chickens.map((c) =>
      c.id === id ? { ...c, eggs: c.eggs + 1 } : c
    );
    setChickens(updated);
  };

  // 🔹 ADD FEED
  const addFeed = () => {
    setFeed(feed + 10);
  };

  // 🔹 RESET
  const reset = () => {
    setChickens([]);
    setFeed(0);
    localStorage.removeItem("coopData");
  };

  // 🔹 CALCULATIONS
  const totalEggs = chickens.reduce((sum, c) => sum + c.eggs, 0);
  const revenue = totalEggs * 0.5;
  const profit = revenue - feed;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🐔 Coop Keeper</h1>

      <p style={{ color: "orange" }}>
        ⚠️ Not logged in (app still usable)
      </p>

      {/* ADD CHICKEN */}
      <div>
        <input
          placeholder="Chicken name"
          value={newChicken}
          onChange={(e) => setNewChicken(e.target.value)}
        />
        <button onClick={addChicken}>Add Chicken</button>
      </div>

      <br />

      {/* FEED */}
      <button onClick={addFeed}>🌽 Add Feed</button>

      <hr />

      {/* TODAY */}
      <h2>📅 Today</h2>
      <p>Eggs: {totalEggs}</p>
      <p>Feed: {feed.toFixed(2)}</p>
      <p>Revenue: {revenue.toFixed(2)}</p>
      <p>
        <b>Profit: {profit.toFixed(2)}</b>
      </p>

      <hr />

      {/* CHICKENS */}
      <h3>🐔 Chickens</h3>
      {chickens.length === 0 && <p>No chickens yet</p>}

      {chickens.map((c) => (
        <div key={c.id} style={{ marginBottom: "10px" }}>
          🐔 {c.name} — Eggs: {c.eggs}
          <button
            onClick={() => addEggToChicken(c.id)}
            style={{ marginLeft: "10px" }}
          >
            🥚 + Egg
          </button>
        </div>
      ))}

      <br />

      {/* RESET */}
      <button onClick={reset}>Reset</button>
    </div>
  );
}