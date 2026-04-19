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

  // 📊 CHART DATA
  const getLast7Days = () => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();

  const eggData = last7Days.map(date => {
    const total = eggs
      .filter(e => e.date === date)
      .reduce((sum, e) => sum + e.count, 0);
    return { date, value: total };
  });

  const feedData = last7Days.map(date => {
    const total = feed
      .filter(f => f.date === date)
      .reduce((sum, f) => sum + f.amount, 0);
    return { date, value: total };
  });

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

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>

            <h3>Egg Production (Last 7 Days)</h3>
            <Chart data={eggData} color="#f59e0b" />

            <h3 style={{ marginTop: "30px" }}>Feed Usage (Last 7 Days)</h3>
            <Chart data={feedData} color="#10b981" />
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

/* 🔥 IMPROVED CHART */
function Chart({ data, color }: any) {
  const max = Math.max(...data.map((d: any) => d.value), 1);

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      alignItems: "flex-end",
      height: "180px",
      marginTop: "10px",
      padding: "10px",
      background: "white",
      borderRadius: "10px"
    }}>
      {data.map((d: any, i: number) => {
        let height = (d.value / max) * 100;

        // ✅ make small values visible
        if (d.value > 0 && height < 8) height = 8;

        return (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            
            {/* VALUE */}
            <div style={{ fontSize: "12px", marginBottom: "5px" }}>
              {d.value}
            </div>

            {/* BAR */}
            <div
              style={{
                height: `${height}%`,
                background: d.value === 0 ? "#e5e7eb" : color,
                borderRadius: "6px",
                transition: "0.3s"
              }}
            />

            {/* DATE */}
            <div style={{ fontSize: "10px", marginTop: "5px" }}>
              {d.date.slice(5)}
            </div>

          </div>
        );
      })}
    </div>
  );
}
    </div>
  );
}

/* STYLES */

const layout = {
  container: { display: "flex", height: "100vh", fontFamily: "Arial" },
  sidebar: { width: "220px", background: "#111827", color: "white", padding: "20px" },
  main: { flex: 1, padding: "30px", background: "#f3f4f6" },
  formRow: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }
};

const styles = {
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  primaryBtn: { padding: "10px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  menuItem: { padding: "10px", borderRadius: "6px", cursor: "pointer", marginTop: "5px" }
};

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