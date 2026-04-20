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
  const getChickenStats = () => {
    const stats: any = {};

    eggsData.forEach((e) => {
      if (!e.chicken_id) return;
      if (!stats[e.chicken_id]) stats[e.chicken_id] = 0;
      stats[e.chicken_id] += e.count;
    });

    return stats;
  };

  const chickenStats = getChickenStats();

  let topChicken: any = null;
  let worstChicken: any = null;

  Object.entries(chickenStats).forEach(([id, count]: any) => {
    if (!topChicken || count > topChicken.count) {
      topChicken = { id, count };
    }
    if (!worstChicken || count < worstChicken.count) {
      worstChicken = { id, count };
    }
  });

  const getEggsPerChicken = () => {
    return Object.entries(chickenStats).map(([id, count]: any) => {
      const chicken = chickens.find((c) => c.id === id);
      return {
        name: chicken ? chicken.name : "Unknown",
        eggs: count
      };
    });
  };

  // ===== PROFIT =====
  const totalEggs = eggsData.reduce((sum, e) => sum + e.count, 0);
  const totalFeed = feedData.reduce((sum, f) => sum + f.amount, 0);

  const revenue = totalEggs * Number(eggPrice || 0);
  const feedExpense = totalFeed * Number(feedCost || 0);
  const profit = revenue - feedExpense;

  const getProfitPerChicken = () => {
    const stats = getChickenStats();

    const chickenCount = chickens.length || 1;
    const totalFeedCost = totalFeed * Number(feedCost || 0);
    const feedPerChicken = totalFeedCost / chickenCount;

    return chickens.map((c) => {
      const eggs = stats[c.id] || 0;
      const income = eggs * Number(eggPrice || 0);
      const profit = income - feedPerChicken;

      return {
        name: c.name,
        eggs,
        income,
        cost: feedPerChicken,
        profit
      };
    });
  };

  const getRecommendation = (profit: number) => {
    if (profit > 0) return "🟢 KEEP";
    if (profit === 0) return "🟡 BREAK EVEN";
    return "🔴 SELL";
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
            <h2>📊 Eggs vs Feed</h2>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getEggsPerChicken()}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="eggs" />
              </LineChart>
            </ResponsiveContainer>

            <h2>📊 Eggs per Chicken</h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getEggsPerChicken()}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="eggs" />
              </BarChart>
            </ResponsiveContainer>

            <h2>🏆 Performance</h2>

            <p>
              Top Chicken:{" "}
              {topChicken
                ? chickens.find((c) => c.id === topChicken.id)?.name +
                  " (" +
                  topChicken.count +
                  " eggs)"
                : "N/A"}
            </p>

            <p>
              Worst Chicken:{" "}
              {worstChicken
                ? chickens.find((c) => c.id === worstChicken.id)?.name +
                  " (" +
                  worstChicken.count +
                  " eggs)"
                : "N/A"}
            </p>

            <h2>💰 Farm Profit</h2>

            <input
              placeholder="Egg price"
              value={eggPrice}
              onChange={(e) => {
                const val = e.target.value;
                setEggPrice(val);
                saveSettings(val, feedCost);
              }}
            />

            <input
              placeholder="Feed cost"
              value={feedCost}
              onChange={(e) => {
                const val = e.target.value;
                setFeedCost(val);
                saveSettings(eggPrice, val);
              }}
            />

            <h3>Total Profit: {profit.toFixed(2)}</h3>

            <h2>🐔 Chicken Profit Analysis</h2>

            {getProfitPerChicken().map((c, i) => (
              <div key={i} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                <strong>{c.name}</strong><br />
                Eggs: {c.eggs}<br />
                Income: {c.income.toFixed(2)}<br />
                Feed Cost: {c.cost.toFixed(2)}<br />
                Profit: {c.profit.toFixed(2)}<br />
                Decision: {getRecommendation(c.profit)}
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

            {eggsData.map((e, i) => {
              const chicken = chickens.find(c => c.id === e.chicken_id);
              return <div key={i}>{e.date} - {chicken ? chicken.name : "Unknown"} - {e.count}</div>;
            })}
          </>
        )}

        {page === "feed" && (
          <>
            <h2>Feed</h2>
            <input type="date" value={feedDate} onChange={(e) => setFeedDate(e.target.value)} />
            <input type="number" value={feedAmount} onChange={(e) => setFeedAmount(e.target.value)} />
            <button onClick={addFeed}>Add Feed</button>

            {feedData.map((f, i) => (
              <div key={i}>{f.date} - {f.amount} kg</div>
            ))}
          </>
        )}

        {page === "chickens" && (
          <>
            <h2>Chickens</h2>

            <input placeholder="Name" value={chickenName} onChange={(e) => setChickenName(e.target.value)} />
            <input placeholder="Breed" value={chickenBreed} onChange={(e) => setChickenBreed(e.target.value)} />

            <select value={chickenSex} onChange={(e) => setChickenSex(e.target.value)}>
              <option value="">Sex</option>
              <option>Hen</option>
              <option>Rooster</option>
            </select>

            <select value={chickenStatus} onChange={(e) => setChickenStatus(e.target.value)}>
              <option value="">Status</option>
              <option>Alive</option>
              <option>Sold</option>
            </select>

            <button onClick={addChicken}>Add Chicken</button>

            {chickens.map((c, i) => (
              <div key={i}>{c.name} | {c.breed} | {c.sex} | {c.status}</div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}