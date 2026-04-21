import { useEffect, useState } from "react";

type DailyData = {
  eggs: number;
  feed: number;
};

export default function App() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [dailyData, setDailyData] = useState<Record<string, DailyData>>({});
  const [loaded, setLoaded] = useState(false);

  const eggPrice = 0.5;
  const today = new Date().toISOString().split("T")[0];

  // 🔥 LOAD DATA
  useEffect(() => {
    try {
      const saved = localStorage.getItem("coopDaily");
      if (saved) {
        const data = JSON.parse(saved);
        setDailyData(data.dailyData || {});
      }
    } catch (err) {
      console.error("Load error:", err);
    }

    setLoaded(true);
  }, []);

  // 🔥 SAVE DATA
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        "coopDaily",
        JSON.stringify({ dailyData })
      );
    } catch (err) {
      console.error("Save error:", err);
    }
  }, [dailyData, loaded]);

  // 🌐 ONLINE STATUS
  useEffect(() => {
    const updateStatus = () => setOffline(!navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  // 🥚 ADD EGG
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

  // 🌽 ADD FEED
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
    setDailyData({});
    localStorage.removeItem("coopDaily");
  };

  const todayStats = dailyData[today] || { eggs: 0, feed: 0 };
  const revenue = todayStats.eggs * eggPrice;
  const profit = revenue - todayStats.feed;

  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper</h1>

      {offline && (
        <p style={{ color: "orange" }}>
          ⚠️ Offline Mode
        </p>
      )}

      {/* ACTIONS */}
      <div style={{ marginTop: 20 }}>
        <button onClick={addEgg}>🥚 Add Egg</button>
        <button onClick={addFeed} style={{ marginLeft: 10 }}>
          🌽 Add Feed
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