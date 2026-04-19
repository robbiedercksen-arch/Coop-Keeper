import { useState, useEffect } from "react";

/* ================= TYPES ================= */
type Chicken = {
  name: string;
  breed: string;
  age: string;
};

type Egg = {
  date: string;
  count: number;
};

type Feed = {
  date: string;
  amount: number;
};

/* ================= REUSABLE UI ================= */
const Input = (props: any) => (
  <input
    {...props}
    style={{
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      marginRight: "10px",
      marginBottom: "10px",
      width: "150px"
    }}
  />
);

const Button = ({ children, onClick, color = "#2563eb" }: any) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 15px",
      background: color,
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginBottom: "15px"
    }}
  >
    {children}
  </button>
);

const Card = ({ title, value, color }: any) => (
  <div
    style={{
      flex: 1,
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
    }}
  >
    <div style={{ fontSize: "14px", color: "#6b7280" }}>{title}</div>
    <div style={{ fontSize: "26px", color, marginTop: "5px" }}>{value}</div>
  </div>
);

/* ================= APP ================= */
export default function App() {
  const [page, setPage] = useState("dashboard");

  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [feed, setFeed] = useState<Feed[]>([]);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const [eggCount, setEggCount] = useState("");
  const [feedAmount, setFeedAmount] = useState("");

  /* ================= STORAGE ================= */
  useEffect(() => {
    const c = localStorage.getItem("chickens");
    const e = localStorage.getItem("eggs");
    const f = localStorage.getItem("feed");

    if (c) setChickens(JSON.parse(c));
    if (e) setEggs(JSON.parse(e));
    if (f) setFeed(JSON.parse(f));
  }, []);

  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  useEffect(() => {
    localStorage.setItem("eggs", JSON.stringify(eggs));
  }, [eggs]);

  useEffect(() => {
    localStorage.setItem("feed", JSON.stringify(feed));
  }, [feed]);

  /* ================= ACTIONS ================= */
  const addChicken = () => {
    if (!name || !breed || !age) return;
    setChickens([...chickens, { name, breed, age }]);
    setName(""); setBreed(""); setAge("");
  };

  const addEggs = () => {
    if (!eggCount) return;
    setEggs([...eggs, { date: new Date().toISOString().slice(0, 10), count: Number(eggCount) }]);
    setEggCount("");
  };

  const addFeed = () => {
    if (!feedAmount) return;
    setFeed([...feed, { date: new Date().toISOString().slice(0, 10), amount: Number(feedAmount) }]);
    setFeedAmount("");
  };

  /* ================= HELPERS ================= */
  const last7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  };

  const eggChart = last7Days().map(date => ({
    date,
    value: eggs.filter(e => e.date === date).reduce((s, e) => s + e.count, 0)
  }));

  const feedChart = last7Days().map(date => ({
    date,
    value: feed.filter(f => f.date === date).reduce((s, f) => s + f.amount, 0)
  }));

  const totalEggs = eggChart.reduce((s, d) => s + d.value, 0);
  const totalFeed = feedChart.reduce((s, d) => s + d.value, 0);
  const chickensCount = chickens.length || 1;

  const eggsPerChicken = (totalEggs / chickensCount / 7).toFixed(2);

  /* ================= CHART ================= */
  const Chart = ({ data, color }: any) => {
    const max = Math.max(...data.map((d: any) => d.value), 1);

    return (
      <div style={{
        display: "flex",
        gap: "10px",
        alignItems: "flex-end",
        height: "160px",
        background: "white",
        padding: "15px",
        borderRadius: "12px"
      }}>
        {data.map((d: any, i: number) => {
          let height = (d.value / max) * 100;
          if (d.value > 0 && height < 8) height = 8;

          return (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "11px" }}>{d.value}</div>
              <div style={{
                height: `${height}%`,
                background: d.value === 0 ? "#e5e7eb" : color,
                borderRadius: "6px"
              }}/>
              <div style={{ fontSize: "10px" }}>{d.date.slice(5)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  /* ================= UI ================= */
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "220px",
        background: "#111827",
        color: "white",
        padding: "20px"
      }}>
        <h2>🐔 Coop Keeper</h2>

        {["dashboard", "chickens", "eggs", "feed"].map(p => (
          <div
            key={p}
            onClick={() => setPage(p)}
            style={{
              marginTop: "15px",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              background: page === p ? "#374151" : "transparent"
            }}
          >
            {p}
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: "20px", background: "#f3f4f6" }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
              <Card title="Chickens" value={chickens.length} color="#2563eb" />
              <Card title="Eggs (7d)" value={totalEggs} color="#f59e0b" />
              <Card title="Feed (7d kg)" value={totalFeed} color="#3b82f6" />
              <Card title="Eggs/Chicken" value={eggsPerChicken} color="#10b981" />
            </div>

            <h3>Egg Production</h3>
            <Chart data={eggChart} color="#f59e0b" />

            <h3 style={{ marginTop: "20px" }}>Feed Usage</h3>
            <Chart data={feedChart} color="#3b82f6" />
          </>
        )}

        {/* CHICKENS */}
        {page === "chickens" && (
          <>
            <h1>Chickens</h1>

            <div>
              <Input placeholder="Name" value={name} onChange={(e:any)=>setName(e.target.value)} />
              <Input placeholder="Breed" value={breed} onChange={(e:any)=>setBreed(e.target.value)} />
              <Input placeholder="Age" value={age} onChange={(e:any)=>setAge(e.target.value)} />
            </div>

            <Button onClick={addChicken}>Add Chicken</Button>

            {chickens.map((c, i) => (
              <div key={i} style={{
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "10px"
              }}>
                <strong>{c.name}</strong><br/>
                {c.breed} | Age: {c.age}
              </div>
            ))}
          </>
        )}

        {/* EGGS */}
        {page === "eggs" && (
          <>
            <h1>Eggs</h1>

            <Input placeholder="Egg count" value={eggCount} onChange={(e:any)=>setEggCount(e.target.value)} />
            <Button onClick={addEggs}>Add Eggs</Button>

            {eggs.map((e, i) => (
              <div key={i} style={{ background: "white", padding: "10px", borderRadius: "8px", marginBottom: "8px" }}>
                {e.date} - {e.count}
              </div>
            ))}
          </>
        )}

        {/* FEED */}
        {page === "feed" && (
          <>
            <h1>Feed</h1>

            <Input placeholder="Feed (kg)" value={feedAmount} onChange={(e:any)=>setFeedAmount(e.target.value)} />
            <Button onClick={addFeed}>Add Feed</Button>

            {feed.map((f, i) => (
              <div key={i} style={{ background: "white", padding: "10px", borderRadius: "8px", marginBottom: "8px" }}>
                {f.date} - {f.amount} kg
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}