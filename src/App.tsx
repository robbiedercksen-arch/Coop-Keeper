import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const supabase = createClient(
  "https://gzoxsnsbzjbmatdxwyhh.supabase.co",
  "sb_publishable_EYpEiEJ_Q4ElsyvyI1ZDtw_q9lOgU_A"
);

export default function App() {
  const [page, setPage] = useState("dashboard");

  const [eggsData, setEggsData] = useState<any[]>([]);
  const [eggDate, setEggDate] = useState("");
  const [eggCount, setEggCount] = useState("");
  const [selectedChicken, setSelectedChicken] = useState("");

  const [feedData, setFeedData] = useState<any[]>([]);
  const [feedDate, setFeedDate] = useState("");
  const [feedAmount, setFeedAmount] = useState("");

  const [chickens, setChickens] = useState<any[]>([]);
  const [chickenName, setChickenName] = useState("");
  const [chickenBreed, setChickenBreed] = useState("");
  const [chickenSex, setChickenSex] = useState("");
  const [chickenStatus, setChickenStatus] = useState("");

  const [eggPrice, setEggPrice] = useState("");
  const [feedCost, setFeedCost] = useState("");

  useEffect(() => {
    fetchEggs();
    fetchFeed();
    fetchChickens();
    loadSettings();
  }, []);

  const fetchEggs = async () => {
    const { data } = await supabase.from("eggs").select("*");
    if (data) setEggsData(data);
  };

  const fetchFeed = async () => {
    const { data } = await supabase.from("feed").select("*");
    if (data) setFeedData(data);
  };

  const fetchChickens = async () => {
    const { data } = await supabase.from("chickens").select("*");
    if (data) setChickens(data);
  };

  const loadSettings = async () => {
    const { data } = await supabase.from("settings").select("*").limit(1);
    if (data && data.length > 0) {
      setEggPrice(data[0].egg_price?.toString() || "");
      setFeedCost(data[0].feed_cost?.toString() || "");
    }
  };

  const saveSettings = async (newEggPrice: any, newFeedCost: any) => {
    await supabase.from("settings").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    await supabase.from("settings").insert([
      {
        egg_price: Number(newEggPrice || 0),
        feed_cost: Number(newFeedCost || 0)
      }
    ]);
  };

  const addEggs = async () => {
    if (!eggDate || !eggCount || !selectedChicken) {
      alert("Select chicken + date + eggs");
      return;
    }

    await supabase.from("eggs").insert([
      {
        date: eggDate,
        count: Number(eggCount),
        chicken_id: selectedChicken
      }
    ]);

    setEggDate("");
    setEggCount("");
    setSelectedChicken("");
    fetchEggs();
  };

  const addFeed = async () => {
    if (!feedDate || !feedAmount) return;

    await supabase.from("feed").insert([
      { date: feedDate, amount: Number(feedAmount) }
    ]);

    setFeedDate("");
    setFeedAmount("");
    fetchFeed();
  };

  const addChicken = async () => {
    if (!chickenName || !chickenBreed || !chickenSex || !chickenStatus) return;

    await supabase.from("chickens").insert([
      {
        name: chickenName,
        breed: chickenBreed,
        sex: chickenSex,
        status: chickenStatus
      }
    ]);

    setChickenName("");
    setChickenBreed("");
    setChickenSex("");
    setChickenStatus("");
    fetchChickens();
  };

  // ===== STATS =====
  const totalEggs = eggsData.reduce((sum, e) => sum + e.count, 0);
  const totalFeed = feedData.reduce((sum, f) => sum + f.amount, 0);

  const revenue = totalEggs * Number(eggPrice || 0);
  const feedExpense = totalFeed * Number(feedCost || 0);
  const profit = revenue - feedExpense;

  const getChickenStats = () => {
    const stats: any = {};
    eggsData.forEach((e) => {
      if (!e.chicken_id) return;
      if (!stats[e.chicken_id]) stats[e.chicken_id] = 0;
      stats[e.chicken_id] += e.count;
    });
    return stats;
  };

  const getProfitPerChicken = () => {
    const stats = getChickenStats();
    const chickenCount = chickens.length || 1;
    const feedPerChicken = (totalFeed * Number(feedCost || 0)) / chickenCount;

    return chickens.map((c) => {
      const eggs = stats[c.id] || 0;
      const income = eggs * Number(eggPrice || 0);
      const profit = income - feedPerChicken;

      return { name: c.name, eggs, profit };
    });
  };

  // ===== ALERTS =====
  const getAlerts = () => {
    const alerts: string[] = [];

    if (profit < 0) {
      alerts.push("⚠️ You are losing money!");
    }

    const chickenProfit = getProfitPerChicken();

    chickenProfit.forEach((c) => {
      if (c.eggs === 0) {
        alerts.push(`🐔 ${c.name} is not laying eggs`);
      }
      if (c.profit < 0) {
        alerts.push(`💸 ${c.name} is costing you money`);
      }
    });

    if (totalEggs > 0 && totalFeed / totalEggs > 0.5) {
      alerts.push("⚠️ Feed usage is too high per egg");
    }

    return alerts;
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      <div style={{ width: "220px", background: "#111827", color: "white", padding: "20px" }}>
        <h2>🐔 Coop Keeper</h2>
        <p onClick={() => setPage("dashboard")}>dashboard</p>
        <p onClick={() => setPage("eggs")}>eggs</p>
        <p onClick={() => setPage("feed")}>feed</p>
        <p onClick={() => setPage("chickens")}>chickens</p>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        {page === "dashboard" && (
          <>
            <h2>🚨 Alerts</h2>

            {getAlerts().length === 0 ? (
              <p>✅ Everything looks good</p>
            ) : (
              getAlerts().map((a, i) => (
                <div key={i} style={{ color: "red" }}>{a}</div>
              ))
            )}

            <h2>💰 Profit</h2>
            <h3>{profit.toFixed(2)}</h3>

            <h2>🐔 Chicken Analysis</h2>

            {getProfitPerChicken().map((c, i) => (
              <div key={i}>
                {c.name} - Eggs: {c.eggs} - Profit: {c.profit.toFixed(2)}
              </div>
            ))}
          </>
        )}

        {page === "eggs" && (
          <>
            <h2>Eggs</h2>

            <select value={selectedChicken} onChange={(e) => setSelectedChicken(e.target.value)}>
              <option value="">Select Chicken</option>
              {chickens.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <input type="date" value={eggDate} onChange={(e) => setEggDate(e.target.value)} />
            <input type="number" value={eggCount} onChange={(e) => setEggCount(e.target.value)} />

            <button onClick={addEggs}>Add Eggs</button>
          </>
        )}

        {page === "feed" && (
          <>
            <h2>Feed</h2>
            <input type="date" value={feedDate} onChange={(e) => setFeedDate(e.target.value)} />
            <input type="number" value={feedAmount} onChange={(e) => setFeedAmount(e.target.value)} />
            <button onClick={addFeed}>Add Feed</button>
          </>
        )}

        {page === "chickens" && (
          <>
            <h2>Chickens</h2>
            <input placeholder="Name" value={chickenName} onChange={(e) => setChickenName(e.target.value)} />
            <button onClick={addChicken}>Add Chicken</button>
          </>
        )}
      </div>
    </div>
  );
}