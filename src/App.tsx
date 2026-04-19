import { useState, useEffect } from "react";

/* ================= TYPES ================= */
type Chicken = { name: string; breed: string; age: string };
type Egg = { date: string; count: number };
type Feed = { date: string; amount: number };

/* ================= DATA LAYER ================= */
const loadData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/* ================= UI COMPONENTS ================= */
const Input = (props: any) => (
  <input {...props} style={{
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginRight: "10px",
    marginBottom: "10px"
  }} />
);

const Button = ({ children, onClick, color = "#2563eb" }: any) => (
  <button onClick={onClick} style={{
    padding: "10px 15px",
    background: color,
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
    marginBottom: "10px"
  }}>
    {children}
  </button>
);

const Card = ({ title, value }: any) => (
  <div style={{
    flex: 1,
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  }}>
    <div style={{ fontSize: "14px", color: "#6b7280" }}>{title}</div>
    <div style={{ fontSize: "24px" }}>{value}</div>
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

  /* ================= LOAD ================= */
  useEffect(() => {
    setChickens(loadData("chickens"));
    setEggs(loadData("eggs"));
    setFeed(loadData("feed"));
  }, []);

  /* ================= SAVE ================= */
  useEffect(() => saveData("chickens", chickens), [chickens]);
  useEffect(() => saveData("eggs", eggs), [eggs]);
  useEffect(() => saveData("feed", feed), [feed]);

  /* ================= ACTIONS ================= */
  const addChicken = () => {
    if (!name || !breed || !age) return;
    setChickens([...chickens, { name, breed, age }]);
    setName(""); setBreed(""); setAge("");
  };

  const addEggs = () => {
    if (!eggCount) return;
    setEggs([...eggs, {
      date: new Date().toISOString().slice(0, 10),
      count: Number(eggCount)
    }]);
    setEggCount("");
  };

  const addFeed = () => {
    if (!feedAmount) return;
    setFeed([...feed, {
      date: new Date().toISOString().slice(0, 10),
      amount: Number(feedAmount)
    }]);
    setFeedAmount("");
  };

  /* ================= EXPORT ================= */
  const exportCSV = () => {
    let csv = "Type,Date,Value\n";

    eggs.forEach(e => csv += `Eggs,${e.date},${e.count}\n`);
    feed.forEach(f => csv += `Feed,${f.date},${f.amount}\n`);
    chickens.forEach(c => csv += `Chicken,${c.name},${c.breed}-${c.age}\n`);

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "coop_keeper_data.csv";
    a.click();
  };

  /* ================= STATS ================= */
  const totalEggs = eggs.reduce((s, e) => s + e.count, 0);
  const totalFeed = feed.reduce((s, f) => s + f.amount, 0);

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
          <div key={p}
            onClick={() => setPage(p)}
            style={{
              marginTop: "15px",
              padding: "10px",
              cursor: "pointer",
              borderRadius: "6px",
              background: page === p ? "#374151" : "transparent"
            }}>
            {p}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "20px", background: "#f3f4f6" }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <Card title="Chickens" value={chickens.length} />
              <Card title="Total Eggs" value={totalEggs} />
              <Card title="Total Feed (kg)" value={totalFeed} />
            </div>

            <h3 style={{ marginTop: "20px" }}>Backup</h3>
            <Button onClick={exportCSV} color="#16a34a">
              Download CSV
            </Button>
          </>
        )}

        {/* CHICKENS */}
        {page === "chickens" && (
          <>
            <h1>Chickens</h1>
            <Input placeholder="Name" value={name} onChange={(e:any)=>setName(e.target.value)} />
            <Input placeholder="Breed" value={breed} onChange={(e:any)=>setBreed(e.target.value)} />
            <Input placeholder="Age" value={age} onChange={(e:any)=>setAge(e.target.value)} />
            <Button onClick={addChicken}>Add</Button>

            {chickens.map((c,i)=>(
              <div key={i}>{c.name} - {c.breed} - {c.age}</div>
            ))}
          </>
        )}

        {/* EGGS */}
        {page === "eggs" && (
          <>
            <h1>Eggs</h1>
            <Input placeholder="Egg count" value={eggCount} onChange={(e:any)=>setEggCount(e.target.value)} />
            <Button onClick={addEggs}>Add</Button>

            {eggs.map((e,i)=>(
              <div key={i}>{e.date} - {e.count}</div>
            ))}
          </>
        )}

        {/* FEED */}
        {page === "feed" && (
          <>
            <h1>Feed</h1>
            <Input placeholder="Feed (kg)" value={feedAmount} onChange={(e:any)=>setFeedAmount(e.target.value)} />
            <Button onClick={addFeed}>Add</Button>

            {feed.map((f,i)=>(
              <div key={i}>{f.date} - {f.amount} kg</div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}