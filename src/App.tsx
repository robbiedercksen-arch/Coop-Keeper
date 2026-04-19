import { useState, useEffect } from "react";

type Chicken = {
  name: string;
  breed: string;
  age: string;
};

type EggEntry = {
  date: string;
  count: number;
};

type FeedEntry = {
  date: string;
  amount: number;
};

export default function App() {
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [eggs, setEggs] = useState<EggEntry[]>([]);
  const [feed, setFeed] = useState<FeedEntry[]>([]);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const [eggCount, setEggCount] = useState("");
  const [feedAmount, setFeedAmount] = useState("");

  const [page, setPage] = useState("dashboard");

  const today = new Date().toISOString().split("T")[0];

  // LOAD
  useEffect(() => {
    const savedChickens = localStorage.getItem("chickens");
    const savedEggs = localStorage.getItem("eggs");
    const savedFeed = localStorage.getItem("feed");

    if (savedChickens) setChickens(JSON.parse(savedChickens));
    if (savedEggs) setEggs(JSON.parse(savedEggs));
    if (savedFeed) setFeed(JSON.parse(savedFeed));
  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  useEffect(() => {
    localStorage.setItem("eggs", JSON.stringify(eggs));
  }, [eggs]);

  useEffect(() => {
    localStorage.setItem("feed", JSON.stringify(feed));
  }, [feed]);

  // ADD FUNCTIONS
  const addChicken = () => {
    if (!name || !breed || !age) return;
    setChickens([...chickens, { name, breed, age }]);
    setName(""); setBreed(""); setAge("");
  };

  const addEggs = () => {
    if (!eggCount) return;
    setEggs([...eggs, { date: today, count: parseInt(eggCount) }]);
    setEggCount("");
  };

  const addFeed = () => {
    if (!feedAmount) return;

    const existing = feed.find(f => f.date === today);

    if (existing) {
      setFeed(feed.map(f =>
        f.date === today
          ? { ...f, amount: f.amount + parseFloat(feedAmount) }
          : f
      ));
    } else {
      setFeed([...feed, { date: today, amount: parseFloat(feedAmount) }]);
    }

    setFeedAmount("");
  };

  // 📊 CALCULATIONS
  const eggsToday = eggs
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.count, 0);

  const feedToday = feed
    .filter(f => f.date === today)
    .reduce((sum, f) => sum + f.amount, 0);

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const eggsWeek = eggs
    .filter(e => new Date(e.date) >= last7Days)
    .reduce((sum, e) => sum + e.count, 0);

  const feedPerEgg = eggsToday > 0
    ? (feedToday / eggsToday).toFixed(2)
    : "0";

  return (
    <div style={layout.container}>

      {/* SIDEBAR */}
      <div style={layout.sidebar}>
        <h2>🐔 Coop Keeper</h2>

        {["dashboard", "chickens", "eggs", "feed"].map(p => (
          <div
            key={p}
            onClick={() => setPage(p)}
            style={{
              ...styles.menuItem,
              background: page === p ? "#374151" : "transparent"
            }}
          >
            {p}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={layout.main}>

        {/* 🔥 DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>

            <div style={layout.grid}>
              <Card title="🐔 Chickens">{chickens.length}</Card>
              <Card title="🥚 Eggs Today">{eggsToday}</Card>
              <Card title="🥚 Eggs (7 days)">{eggsWeek}</Card>
              <Card title="🌾 Feed Today (kg)">{feedToday}</Card>
              <Card title="⚖️ Feed / Egg">{feedPerEgg}</Card>
            </div>
          </>
        )}

        {/* CHICKENS */}
        {page === "chickens" && (
          <>
            <h1>Chickens</h1>

            <div style={layout.formRow}>
              <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
              <input style={styles.input} value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Breed" />
              <input style={styles.input} value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
              <button style={styles.primaryBtn} onClick={addChicken}>Add</button>
            </div>

            {chickens.map((c, i) => (
              <SimpleCard key={i}>{c.name} • {c.breed} • {c.age}</SimpleCard>
            ))}
          </>
        )}

        {/* EGGS */}
        {page === "eggs" && (
          <>
            <h1>Eggs</h1>

            <div style={layout.formRow}>
              <input style={styles.input} value={eggCount} onChange={(e) => setEggCount(e.target.value)} placeholder="Egg count" />
              <button style={styles.primaryBtn} onClick={addEggs}>Add</button>
            </div>

            {eggs.map((e, i) => (
              <SimpleCard key={i}>{e.date} • {e.count} eggs</SimpleCard>
            ))}
          </>
        )}

        {/* FEED */}
        {page === "feed" && (
          <>
            <h1>Feed</h1>

            <div style={layout.formRow}>
              <input style={styles.input} value={feedAmount} onChange={(e) => setFeedAmount(e.target.value)} placeholder="Feed (kg)" />
              <button style={styles.primaryBtn} onClick={addFeed}>Add</button>
            </div>

            {feed.map((f, i) => (
              <SimpleCard key={i}>{f.date} • {f.amount} kg</SimpleCard>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

/* STYLES */

const layout = {
  container: { display: "flex", height: "100vh", fontFamily: "Arial" },
  sidebar: { width: "220px", background: "#111827", color: "white", padding: "20px" },
  main: { flex: 1, padding: "30px", background: "#f3f4f6" },
  formRow: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px" }
};

const styles = {
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  primaryBtn: { padding: "10px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  menuItem: { padding: "10px", borderRadius: "6px", cursor: "pointer", marginTop: "5px" }
};

function Card({ title, children }: any) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>
      <div style={{ fontSize: "14px", color: "#6b7280" }}>{title}</div>
      <div style={{ fontSize: "22px", fontWeight: "bold" }}>{children}</div>
    </div>
  );
}

function SimpleCard({ children }: any) {
  return (
    <div style={{
      background: "white",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "8px"
    }}>
      {children}
    </div>
  );
}