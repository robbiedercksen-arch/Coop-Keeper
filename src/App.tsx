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

// ✅ YOUR SUPABASE (auto-filled)
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

  // Load eggs
  useEffect(() => {
    fetchEggs();
  }, []);

  const fetchEggs = async () => {
    const { data, error } = await supabase
      .from("eggs")
      .select("*")
      .order("date", { ascending: true });

    if (!error && data) {
      setEggsData(data);
    }
  };

  // Add eggs
  const addEggs = async () => {
    if (!eggDate || !eggCount) return;

    const { error } = await supabase.from("eggs").insert([
      {
        date: eggDate,
        count: Number(eggCount)
      }
    ]);

    if (error) {
      alert("Egg error: " + error.message);
    } else {
      setEggDate("");
      setEggCount("");
      fetchEggs();
    }
  };

  // Prepare chart data
  const getLast7Days = () => {
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

        <p style={{ cursor: "pointer" }} onClick={() => setPage("dashboard")}>
          dashboard
        </p>
        <p style={{ cursor: "pointer" }} onClick={() => setPage("eggs")}>
          eggs
        </p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px", background: "#f9fafb" }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h2>Egg Production (Last 7 Days)</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getLast7Days()}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="eggs" />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}

        {/* EGGS PAGE */}
        {page === "eggs" && (
          <>
            <h2>Eggs</h2>

            <div style={{ marginBottom: "15px" }}>
              <input
                type="date"
                value={eggDate}
                onChange={(e) => setEggDate(e.target.value)}
                style={{ padding: "10px", marginRight: "10px" }}
              />

              <input
                type="number"
                placeholder="Egg count"
                value={eggCount}
                onChange={(e) => setEggCount(e.target.value)}
                style={{ padding: "10px", marginRight: "10px" }}
              />
            </div>

            <button
              onClick={addEggs}
              style={{
                padding: "10px 15px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "20px"
              }}
            >
              Add Eggs
            </button>

            {/* List */}
            {eggsData.map((e, i) => (
              <div key={i} style={{
                background: "white",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px"
              }}>
                {e.date} - {e.count} eggs
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}