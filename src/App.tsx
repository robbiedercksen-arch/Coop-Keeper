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
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [eggCount, setEggCount] = useState("");
  const [feedAmount, setFeedAmount] = useState("");

  const [page, setPage] = useState<
    "dashboard" | "chickens" | "eggs" | "feed"
  >("dashboard");

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

  const today = new Date().toISOString().split("T")[0];

  const eggsToday = eggs.find(e => e.date === today)?.count || 0;
  const totalEggs = eggs.reduce((sum, e) => sum + e.count, 0);

  const feedToday = feed.find(f => f.date === today)?.amount || 0;
  const totalFeed = feed.reduce((sum, f) => sum + f.amount, 0);

  // ACTIONS
  const handleSubmit = () => {
    if (!name || !breed || !age) return;

    if (editIndex !== null) {
      const updated = [...chickens];
      updated[editIndex] = { name, breed, age };
      setChickens(updated);
      setEditIndex(null);
    } else {
      setChickens([...chickens, { name, breed, age }]);
    }

    setName("");
    setBreed("");
    setAge("");
  };

  const deleteChicken = (index: number) => {
    setChickens(chickens.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    const c = chickens[index];
    setName(c.name);
    setBreed(c.breed);
    setAge(c.age);
    setEditIndex(index);
    setPage("chickens");
  };

  const addEggs = () => {
    if (!eggCount) return;
    setEggs([...eggs, { date: today, count: parseInt(eggCount) }]);
    setEggCount("");
  };

  const addFeed = () => {
    if (!feedAmount) return;
    setFeed([...feed, { date: today, amount: parseFloat(feedAmount) }]);
    setFeedAmount("");
  };

  return (
    <div style={layout.container}>
      
      {/* Sidebar */}
      <div style={layout.sidebar}>
        <h2 style={{ marginBottom: "20px" }}>🐔 Coop Keeper</h2>

        {["dashboard", "chickens", "eggs", "feed"].map(p => (
          <div
            key={p}
            onClick={() => setPage(p as any)}
            style={{
              ...styles.menuItem,
              background: page === p ? "#374151" : "transparent"
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={layout.main}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>

            <div style={layout.grid}>
              <Card title="Chickens" value={chickens.length} />
              <Card title="Eggs Today" value={eggsToday} />
              <Card title="Total Eggs" value={totalEggs} />
              <Card title="Feed Today (kg)" value={feedToday} />
              <Card title="Total Feed (kg)" value={totalFeed} />
            </div>
          </>
        )}

        {/* CHICKENS */}
        {page === "chickens" && (
          <>
            <h1>Chickens</h1>

            <div style={layout.formRow}>
              <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
              <input style={styles.input} value={breed} onChange={e => setBreed(e.target.value)} placeholder="Breed" />
              <input style={styles.input} value={age} onChange={e => setAge(e.target.value)} placeholder="Age" />
              <button style={styles.primaryBtn} onClick={handleSubmit}>
                {editIndex !== null ? "Update" : "Add"}
              </button>
            </div>

            {chickens.map((c, i) => (
              <Card key={i}>
                <b>{c.name}</b><br />
                {c.breed} • {c.age}
                <div style={{ marginTop: "10px" }}>
                  <button style={styles.warnBtn} onClick={() => startEdit(i)}>Edit</button>
                  <button style={styles.dangerBtn} onClick={() => deleteChicken(i)}>Delete</button>
                </div>
              </Card>
            ))}
          </>
        )}

        {/* EGGS */}
        {page === "eggs" && (
          <>
            <h1>Egg Tracking</h1>

            <div style={layout.formRow}>
              <input style={styles.input} value={eggCount} onChange={e => setEggCount(e.target.value)} placeholder="Egg count" />
              <button style={styles.primaryBtn} onClick={addEggs}>Add</button>
            </div>

            {eggs.map((e, i) => (
              <Card key={i}>{e.date} • {e.count} eggs</Card>
            ))}
          </>
        )}

        {/* FEED */}
        {page === "feed" && (
          <>
            <h1>Feed Tracking</h1>

            <div style={layout.formRow}>
              <input style={styles.input} value={feedAmount} onChange={e => setFeedAmount(e.target.value)} placeholder="Feed (kg)" />
              <button style={styles.primaryBtn} onClick={addFeed}>Add</button>
            </div>

            {feed.map((f, i) => (
              <Card key={i}>{f.date} • {f.amount} kg</Card>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

/* ---------- UI STYLES ---------- */

const layout = {
  container: { display: "flex", height: "100vh", fontFamily: "Arial" },
  sidebar: {
    width: "220px",
    background: "#111827",
    color: "white",
    padding: "20px"
  },
  main: {
    flex: 1,
    padding: "30px",
    background: "#f3f4f6"
  },
  grid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  },
  formRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  }
};

const styles = {
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  primaryBtn: {
    padding: "10px 15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  warnBtn: {
    padding: "6px 10px",
    background: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginRight: "8px"
  },
  dangerBtn: {
    padding: "6px 10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "5px"
  },
  menuItem: {
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "5px"
  }
};

function Card({ title, value, children }: any) {
  return (
    <div style={{
      background: "white",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      minWidth: "180px",
      marginBottom: "10px"
    }}>
      {title && <h3>{title}</h3>}
      {value !== undefined && <p style={{ fontSize: "22px", fontWeight: "bold" }}>{value}</p>}
      {children}
    </div>
  );
}