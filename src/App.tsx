import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Chicken = {
  name: string;
};

type DailyData = {
  eggs: number;
  feed: number;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [offline, setOffline] = useState(!navigator.onLine);

  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [newChicken, setNewChicken] = useState("");

  const [dailyData, setDailyData] = useState<Record<string, DailyData>>({});
  const [loaded, setLoaded] = useState(false);

  const eggPrice = 0.5;

  const today = new Date().toISOString().split("T")[0];

  // 🔥 LOAD
  useEffect(() => {
    const saved = localStorage.getItem("coopDaily");

    if (saved) {
      const data = JSON.parse(saved);
      setChickens(data.chickens || []);
      setDailyData(data.dailyData || {});
    }

    setLoaded(true);
  }, []);

  // 🔥 SAVE
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      "coopDaily",
      JSON.stringify({ chickens, dailyData })
    );
  }, [chickens, dailyData, loaded]);

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

    setChickens([...chickens, { name: newChicken.trim() }]);
    setNewChicken("");
  };

  // 🥚 ADD EGG (TODAY)
  const addEgg = () => {
    const todayData = dailyData[today] || { eggs: 0, feed: 0 };

    setDailyData({
      ...dailyData,
      [today]: {
        ...todayData,
        eggs: todayData.eggs + 1
      }
    });
  };

  // 🌽 ADD FEED (TODAY)
  const addFeed = () => {
    const amount = prompt("Enter feed cost:");
    if (!amount) return;

    const todayData = dailyData[today] || { eggs: 0, feed: 0 };

    setDailyData({
      ...dailyData,
      [today]: {
        ...todayData,
        feed: todayData.feed + parseFloat(amount)
      }
    });
  };

  // 🔁 RESET
  const reset = () => {
    setChickens([]);
    setDailyData({});
    localStorage.removeItem("coopDaily");
  };

  const todayStats = dailyData[today] || { eggs: 0, feed: 0 };
  const revenue = todayStats.eggs * eggPrice;
  const profit = revenue - todayStats.feed;

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

      {/* ACTIONS */}
      <div style={{ marginTop: 20 }}>
        <button onClick={addEgg}>🥚 Add Egg (Today)</button>
        <button onClick={addFeed} style={{ marginLeft: 10 }}>
          🌽 Add Feed (Today)
        </button>
      </div>

      {/* TODAY */}
      <div style={{ marginTop: 20 }}>
        <h2>📅 Today</h2>
        <p>Eggs: {todayStats.eggs}</p>
        <p>Feed: {todayStats.feed.toFixed(2)}</p>
        <p>Revenue: {revenue.toFixed(2)}</p>
        <p><b>Profit: {profit.toFixed(2)}</b></p>
      </div>

      {/* HISTORY */}
      <div style={{ marginTop: 20 }}>
        <h2>📜 History</h2>

        {Object.entries(dailyData).map(([date, data]) => (
          <div key={date}>
            <b>{date}</b> — Eggs: {data.eggs}, Feed: {data.feed}
          </div>
        ))}
      </div>

      {/* RESET */}
      <div style={{ marginTop: 20 }}>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}