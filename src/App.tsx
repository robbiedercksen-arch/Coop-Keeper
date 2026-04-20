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

  useEffect(() => {
    fetchEggs();
    fetchFeed();
  }, []);

  const fetchEggs = async () => {
    const { data } = await supabase.from("eggs").select("*");
    if (data) setEggsData(data);
  };

  const fetchFeed = async () => {
    const { data } = await supabase.from("feed").select("*");
    if (data) setFeedData(data);
  };

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

  // Combine data for dashboard
  const getCombinedData = () => {
    const days: any = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];

      days[key] = {
        date: key.slice(5),
        eggs: 0,
        feed: 0
      };
    }

    eggsData.forEach((e) => {
      if (days[e.date]) days[e.date].eggs += e.count;
    });

    feedData.forEach((f) => {
      if (days[f.date]) days[f.date].feed += f.amount;
    });

    return Object.values(days);
  };

  // Totals + efficiency
  const totalEggs = eggsData.reduce((sum, e) => sum + e.count, 0);
  const totalFeed = feedData.reduce((sum, f) => sum + f.amount, 0);
  const efficiency = totalEggs ? (totalFeed / totalEggs).toFixed(2) : 0;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#111827",
        color: "white",
        padding: "20px"
      }}>
        <h2>🐔 Coop Keeper</h2>

        <p onClick={() => setPage("dashboard")}>dashboard</p>
        <p onClick={() => setPage("eggs")}>eggs</p>
        <p onClick={() => setPage("feed")}>feed</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px", background: "#f9fafb" }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h2>Performance (Last 7 Days)</h2>

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

            <h3>Total Eggs: {totalEggs}</h3>
            <h3>Total Feed: {totalFeed} kg</h3>
            <h3>Feed per Egg: {efficiency} kg</h3>
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