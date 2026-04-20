import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
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
    const { data } = await supabase
      .from("eggs")
      .select("*")
      .order("date", { ascending: true });

    if (data) setEggsData(data);
  };

  const fetchFeed = async () => {
    const { data } = await supabase
      .from("feed")
      .select("*")
      .order("date", { ascending: true });

    if (data) setFeedData(data);
  };

  const addEggs = async () => {
    if (!eggDate || !eggCount) return;

    const { error } = await supabase.from("eggs").insert([
      { date: eggDate, count: Number(eggCount) }
    ]);

    if (error) alert(error.message);
    else {
      setEggDate("");
      setEggCount("");
      fetchEggs();
    }
  };

  const addFeed = async () => {
    if (!feedDate || !feedAmount) return;

    const { error } = await supabase.from("feed").insert([
      { date: feedDate, amount: Number(feedAmount) }
    ]);

    if (error) alert(error.message);
    else {
      setFeedDate("");
      setFeedAmount("");
      fetchFeed();
    }
  };

  const getLast7DaysEggs = () => {
    const days: any = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days[key] = 0;
    }

    eggsData.forEach((e) => {
      if (days[e.date] !== undefined) {
        days[e.date] += e.count;
      }
    });

    return Object.keys(days).map((date) => ({
      date: date.slice(5),
      eggs: days[date]
    }));
  };

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
            <h2>Egg Production (Last 7 Days)</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getLast7DaysEggs()}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="eggs" />
              </LineChart>
            </ResponsiveContainer>
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
            <input type="number" placeholder="kg" value={feedAmount} onChange={(e) => setFeedAmount(e.target.value)} />
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