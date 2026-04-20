import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LineChart,
  Line,
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

  // Eggs
  const [eggsData, setEggsData] = useState<any[]>([]);
  const [eggDate, setEggDate] = useState("");
  const [eggCount, setEggCount] = useState("");

  // Feed
  const [feedData, setFeedData] = useState<any[]>([]);
  const [feedDate, setFeedDate] = useState("");
  const [feedAmount, setFeedAmount] = useState("");

  // Chickens
  const [chickens, setChickens] = useState<any[]>([]);
  const [chickenName, setChickenName] = useState("");
  const [chickenBreed, setChickenBreed] = useState("");
  const [chickenSex, setChickenSex] = useState("");
  const [chickenStatus, setChickenStatus] = useState("");

  // ✅ SETTINGS (NOW PERSISTENT)
  const [eggPrice, setEggPrice] = useState("");
  const [feedCost, setFeedCost] = useState("");

  useEffect(() => {
    fetchEggs();
    fetchFeed();
    fetchChickens();
    loadSettings(); // 🔥 important
  }, []);

  // ================= FETCH =================
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

  // ================= SETTINGS =================
  const loadSettings = async () => {
    const { data } = await supabase.from("settings").select("*").limit(1);

    if (data && data.length > 0) {
      setEggPrice(data[0].egg_price?.toString() || "");
      setFeedCost(data[0].feed_cost?.toString() || "");
    }
  };

  const saveSettings = async (newEggPrice: any, newFeedCost: any) => {
    // clear existing
    await supabase.from("settings").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // insert new
    await supabase.from("settings").insert([{
      egg_price: Number(newEggPrice),
      feed_cost: Number(newFeedCost)
    }]);
  };

  // ================= ADD =================
  const addEggs = async () => {
    if (!eggDate || !eggCount) return;

    await supabase.from("eggs").insert([
      { date: eggDate, count: Number(eggCount) }
    ]);

    setEggDate("");
    setEggCount("");
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

    await supabase.from("chickens").insert([{
      name: chickenName,
      breed: chickenBreed,
      sex: chickenSex,
      status: chickenStatus
    }]);

    setChickenName("");
    setChickenBreed("");
    setChickenSex("");
    setChickenStatus("");
    fetchChickens();
  };

  // ================= DASHBOARD =================
  const getCombinedData = () => {
    const days: any = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];

      days[key] = { date: key.slice(5), eggs: 0, feed: 0 };
    }

    eggsData.forEach((e) => {
      if (days[e.date]) days[e.date].eggs += e.count;
    });

    feedData.forEach((f) => {
      if (days[f.date]) days[f.date].feed += f.amount;
    });

    return Object.values(days);
  };

  const totalEggs = eggsData.reduce((sum, e) => sum + e.count, 0);
  const totalFeed = feedData.reduce((sum, f) => sum + f.amount, 0);
  const efficiency = totalEggs ? (totalFeed / totalEggs).toFixed(2) : 0;

  const revenue = totalEggs * Number(eggPrice || 0);
  const feedExpense = totalFeed * Number(feedCost || 0);
  const profit = revenue - feedExpense;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#111827", color: "white", padding: "20px" }}>
        <h2>🐔 Coop Keeper</h2>
        <p onClick={() => setPage("dashboard")}>dashboard</p>
        <p onClick={() => setPage("eggs")}>eggs</p>
        <p onClick={() => setPage("feed")}>feed</p>
        <p onClick={() => setPage("chickens")}>chickens</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px", background: "#f9fafb" }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h2>Performance</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getCombinedData()}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="eggs" />
                <Line dataKey="feed" />
              </LineChart>
            </ResponsiveContainer>

            <h3>Total Chickens: {chickens.length}</h3>
            <h3>Total Eggs: {totalEggs}</h3>
            <h3>Total Feed: {totalFeed} kg</h3>
            <h3>Feed per Egg: {efficiency} kg</h3>

            <hr />

            <h2>💰 Profit</h2>

            <input
              placeholder="Egg price"
              value={eggPrice}
              onChange={(e) => {
                setEggPrice(e.target.value);
                saveSettings(e.target.value, feedCost);
              }}
            />

            <input
              placeholder="Feed cost"
              value={feedCost}
              onChange={(e) => {
                setFeedCost(e.target.value);
                saveSettings(eggPrice, e.target.value);
              }}
            />

            <h3>Revenue: {revenue.toFixed(2)}</h3>
            <h3>Feed Cost: {feedExpense.toFixed(2)}</h3>
            <h2>Profit: {profit.toFixed(2)}</h2>
          </>
        )}

        {/* CHICKENS */}
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
              <div key={i}>
                {c.name} | {c.breed} | {c.sex} | {c.status}
              </div>
            ))}
          </>
        )}

        {/* EGGS */}
        {page === "eggs" && (
          <>
            <h2>Eggs</h2>
            <input type="date" value={eggDate} onChange={(e) => setEggDate(e.target.value)} />
            <input type="number" value={eggCount} onChange={(e) => setEggCount(e.target.value)} />
            <button onClick={addEggs}>Add Eggs</button>

            {eggsData.map((e, i) => (
              <div key={i}>{e.date} - {e.count}</div>
            ))}
          </>
        )}

        {/* FEED */}
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

      </div>
    </div>
  );
}