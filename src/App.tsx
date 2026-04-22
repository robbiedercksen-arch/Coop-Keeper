import { useState, useEffect } from "react";

type Chicken = {
  name: string;
  eggs: number;
  feed: number;
};

export default function App() {
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [newChicken, setNewChicken] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("coopData");
    if (saved) {
      setChickens(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("coopData", JSON.stringify(chickens));
  }, [chickens]);

  const addChicken = () => {
    if (!newChicken.trim()) return;

    setChickens([
      ...chickens,
      { name: newChicken, eggs: 0, feed: 0 },
    ]);
    setNewChicken("");
  };

  const addEgg = (index: number) => {
    const updated = [...chickens];
    updated[index].eggs += 1;
    setChickens(updated);
  };

  const addFeed = (index: number) => {
    const updated = [...chickens];
    updated[index].feed += 1;
    setChickens(updated);
  };

  const totalEggs = chickens.reduce((sum, c) => sum + c.eggs, 0);
  const totalFeed = chickens.reduce((sum, c) => sum + c.feed, 0);
  const revenue = totalEggs * 0.5;
  const profit = revenue - totalFeed;

  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper</h1>

      <p style={{ color: "orange" }}>
        ⚠ Not logged in (app still usable)
      </p>

      <div style={{ marginBottom: 20 }}>
        <input
          value={newChicken}
          onChange={(e) => setNewChicken(e.target.value)}
          placeholder="Chicken name"
        />
        <button onClick={addChicken}>Add Chicken</button>
      </div>

      {chickens.map((chicken, index) => (
        <div key={index} style={{ marginBottom: 15 }}>
          <strong>{chicken.name}</strong><br />
          Eggs: {chicken.eggs} | Feed: {chicken.feed}
          <br />
          <button onClick={() => addEgg(index)}>🥚 Add Egg</button>
          <button onClick={() => addFeed(index)}>🌽 Add Feed</button>
        </div>
      ))}

      <hr />

      <h2>📅 Today</h2>
      <p>Eggs: {totalEggs}</p>
      <p>Feed: {totalFeed}</p>
      <p>Revenue: {revenue.toFixed(2)}</p>
      <p><strong>Profit: {profit.toFixed(2)}</strong></p>

      <button onClick={() => setChickens([])}>Reset</button>
    </div>
  );
}