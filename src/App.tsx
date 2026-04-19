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

  // CHICKENS
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

  // FEED (SMART MERGE)
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

  return (
    <div style={layout.container}>

      {/* Sidebar */}
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

      {/* Main */}
      <div style={layout.main}>

        {/* FEED PAGE */}
        {page === "feed" && (
          <>
            <h1 style={{ marginBottom: "20px" }}>Feed</h1>

            {/* FIXED FORM ROW */}
            <div style={layout.formRow}>
              <input
                style={styles.input}
                value={feedAmount}
                onChange={(e) => setFeedAmount(e.target.value)}
                placeholder="Feed (kg)"
              />

              <button style={styles.primaryBtn} onClick={addFeed}>
                Add
              </button>
            </div>

            {/* LIST */}
            {feed.map((f, i) => (
              <Card key={i}>
                {f.date} • {f.amount} kg
              </Card>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

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
  formRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px"
  }
};

const styles = {
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "200px"
  },
  primaryBtn: {
    padding: "10px 16px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  menuItem: {
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "5px"
  }
};

function Card({ children }: any) {
  return (
    <div style={{
      background: "white",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      marginBottom: "10px"
    }}>
      {children}
    </div>
  );
}