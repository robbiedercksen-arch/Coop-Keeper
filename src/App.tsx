import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

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

  const saveSettings = async (ep: any, fc: any) => {
    await supabase.from("settings").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("settings").insert([{ egg_price: Number(ep || 0), feed_cost: Number(fc || 0) }]);
  };

  const addEggs = async () => {
    if (!eggDate || !eggCount || !selectedChicken) return;

    await supabase.from("eggs").insert([
      { date: eggDate, count: Number(eggCount), chicken_id: selectedChicken }
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
    if (!chickenName) return;

    await supabase.from("chickens").insert([{ name: chickenName }]);

    setChickenName("");
    fetchChickens();
  };

  const totalEggs = eggsData.reduce((sum, e) => sum + e.count, 0);
  const totalFeed = feedData.reduce((sum, f) => sum + f.amount, 0);

  const profit =
    totalEggs * Number(eggPrice || 0) -
    totalFeed * Number(feedCost || 0);

  const getAlerts = () => {
    const alerts: string[] = [];
    if (profit < 0) alerts.push("⚠️ You are losing money!");
    return alerts;
  };

  const card = {
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  };

  const button = {
    padding: "10px",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    border: "none",
    marginTop: "10px",
    width: "100%"
  };

  const input = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    marginBottom: "10px"
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "10px", fontFamily: "Arial" }}>
      
      {/* NAV */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <button onClick={() => setPage("dashboard")}>🏠</button>
        <button onClick={() => setPage("eggs")}>🥚</button>
        <button onClick={() => setPage("feed")}>🌾</button>
        <button onClick={() => setPage("chickens")}>🐔</button>
      </div>

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <>
          <div style={card}>
            <h3>🚨 Alerts</h3>
            {getAlerts().length === 0 ? "✅ All good" : getAlerts().map((a,i)=><div key={i}>{a}</div>)}
          </div>

          <div style={card}>
            <h3>📊 Overview</h3>
            <p>Eggs: {totalEggs}</p>
            <p>Feed: {totalFeed} kg</p>
          </div>

          <div style={card}>
            <h3>💰 Profit</h3>
            <input style={input} placeholder="Egg price" value={eggPrice}
              onChange={(e)=>{setEggPrice(e.target.value); saveSettings(e.target.value, feedCost);}}/>
            <input style={input} placeholder="Feed cost" value={feedCost}
              onChange={(e)=>{setFeedCost(e.target.value); saveSettings(eggPrice, e.target.value);}}/>
            <h2>{profit.toFixed(2)}</h2>
          </div>
        </>
      )}

      {/* EGGS */}
      {page === "eggs" && (
        <div style={card}>
          <h3>🥚 Add Eggs</h3>

          <select style={input} value={selectedChicken} onChange={(e)=>setSelectedChicken(e.target.value)}>
            <option value="">Select Chicken</option>
            {chickens.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <input style={input} type="date" value={eggDate} onChange={(e)=>setEggDate(e.target.value)}/>
          <input style={input} type="number" value={eggCount} onChange={(e)=>setEggCount(e.target.value)}/>

          <button style={button} onClick={addEggs}>Add Eggs</button>
        </div>
      )}

      {/* FEED */}
      {page === "feed" && (
        <div style={card}>
          <h3>🌾 Add Feed</h3>

          <input style={input} type="date" value={feedDate} onChange={(e)=>setFeedDate(e.target.value)}/>
          <input style={input} type="number" value={feedAmount} onChange={(e)=>setFeedAmount(e.target.value)}/>

          <button style={button} onClick={addFeed}>Add Feed</button>
        </div>
      )}

      {/* CHICKENS */}
      {page === "chickens" && (
        <div style={card}>
          <h3>🐔 Chickens</h3>

          <input style={input} placeholder="Name" value={chickenName} onChange={(e)=>setChickenName(e.target.value)}/>
          <button style={button} onClick={addChicken}>Add Chicken</button>

          {chickens.map((c,i)=><div key={i}>{c.name}</div>)}
        </div>
      )}
    </div>
  );
}