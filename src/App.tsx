import { useEffect, useState } from "react";

type DayData = {
  date: string;
  eggs: number;
  feed: number;
};

type Chicken = {
  id: number;
  name: string;
  history: DayData[];
};

export default function App() {
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [newChicken, setNewChicken] = useState("");
  const [loaded, setLoaded] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // 🔹 LOAD
  useEffect(() => {
    const saved = localStorage.getItem("coopData");
    if (saved) {
      try {
        setChickens(JSON.parse(saved).chickens || []);
      } catch {
        localStorage.removeItem("coopData");
      }
    }
    setLoaded(true);
  }, []);

  // 🔹 SAVE
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      "coopData",
      JSON.stringify({ chickens })
    );
  }, [chickens, loaded]);

  // 🔹 ADD CHICKEN
  const addChicken = () => {
    if (!newChicken.trim()) return;

    const newEntry: Chicken = {
      id: Date.now(),
      name: newChicken,
      history: [],
    };

    setChickens([...chickens, newEntry]);
    setNewChicken("");
  };

  // 🔹 ADD EGG
  const addEgg = (id: number) => {
    setChickens((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const existing = c.history.find((h) => h.date === today);

        if (existing) {
          return {
            ...c,
            history: c.history.map((h) =>
              h.date === today
                ? { ...h, eggs: h.eggs + 1 }
                : h
            ),
          };
        }

        return {
          ...c,
          history: [
            ...c.history,
            { date: today, eggs: 1, feed: 0 },
          ],
        };
      })
    );
  };

  // 🔹 ADD FEED
  const addFeed = (id: number) => {
    setChickens((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const existing = c.history.find((h) => h.date === today);

        if (existing) {
          return {
            ...c,
            history: c.history.map((h) =>
              h.date === today
                ? { ...h, feed: h.feed + 10 }
                : h
            ),
          };
        }

        return {
          ...c,
          history: [
            ...c.history,
            { date: today, eggs: 0, feed: 10 },
          ],
        };
      })
    );
  };

  // 🔹 RESET
  const reset = () => {
    setChickens([]);
    localStorage.removeItem("coopData");
  };

  // 🔹 TOTALS TODAY
  const totalEggs = chickens.reduce((sum, c) => {
    const todayData = c.history.find(
      (h) => h.date === today
    );
    return sum + (todayData?.eggs || 0);
  }, 0);

  const totalFeed = chickens.reduce((sum, c) => {
    const todayData = c.history.find(
      (h) => h.date === today
    );
    return sum + (todayData?.feed || 0);
  }, 0);

  const revenue = totalEggs * 0.5;
  const profit = revenue - totalFeed;

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

      <hr />

      {/* TODAY */}
      <h2>📅 Today ({today})</h2>
      <p>Eggs: {totalEggs}</p>
      <p>Feed: {totalFeed}</p>
      <p>Revenue: {revenue.toFixed(2)}</p>
      <p><b>Profit: {profit.toFixed(2)}</b></p>

      <hr />

      {/* CHICKENS */}
      <h3>🐔 Chickens</h3>

      {chickens.length === 0 && <p>No chickens yet</p>}

      {chickens.map((c) => (
        <div key={c.id} style={{ marginBottom: "15px" }}>
          <strong>{c.name}</strong>

          <div>
            <button onClick={() => addEgg(c.id)}>
              🥚 Add Egg
            </button>

            <button
              onClick={() => addFeed(c.id)}
              style={{ marginLeft: "10px" }}
            >
              🌽 Add Feed
            </button>
          </div>

          {/* HISTORY */}
          {c.history.map((h, i) => (
            <div key={i}>
              {h.date} → Eggs: {h.eggs}, Feed: {h.feed}
            </div>
          ))}
        </div>
      ))}

      <button onClick={reset}>Reset</button>
    </div>
  );
}