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
  const [menuOpen, setMenuOpen] = useState(false);

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

  // EGGS (SMART MERGE)
  const addEggs = () => {
    if (!eggCount) return;

    const existing = eggs.find(e => e.date === today);

    if (existing) {
      const updated = eggs.map(e =>
        e.date === today
          ? { ...e, count: e.count + parseInt(eggCount) }
          : e
      );
      setEggs(updated);
    } else {
      setEggs([...eggs, { date: today, count: parseInt(eggCount) }]);
    }

    setEggCount("");
  };

  // FEED (SMART MERGE)
  const addFeed = () => {
    if (!feedAmount) return;

    const existing = feed.find(f => f.date === today);

    if (existing) {
      const updated = feed.map(f =>
        f.date === today
          ? { ...f, amount: f.amount + parseFloat(feedAmount) }
          : f
      );
      setFeed(updated);
    } else {
      setFeed([...feed, { date: today, amount: parseFloat(feedAmount) }]);
    }

    setFeedAmount("");
  };

  const eggsToday = eggs.find(e => e.date === today)?.count || 0;
  const totalEggs = eggs.reduce((sum, e) => sum + e.count, 0);

  const feedToday = feed.find(f => f.date === today)?.amount || 0;
  const totalFeed = feed.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      {(menuOpen || window.innerWidth > 768) && (
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
              onClick={() => {
                setPage(p);
                setMenuOpen(false);
              }}
              style={{
                padding: "10px",
                cursor: "pointer",
                background: page === p ? "#374151" : "transparent"
              }}
            >
              {p}
            </div>
          ))}
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, padding: "20px", background: "#f3f4f6" }}>

        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <Card title="Chickens" value={chickens.length} />
              <Card title="Eggs Today" value={eggsToday} />
              <Card title="Total Eggs" value={totalEggs} />
              <Card title="Feed Today" value={feedToday} />
              <Card title="Total Feed" value={totalFeed} />
            </div>
          </>
        )}

        {page === "chickens" && (
          <>
            <h1>Chickens</h1>

            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <input value={breed} onChange={e => setBreed(e.target.value)} placeholder="Breed" />
            <input value={age} onChange={e => setAge(e.target.value)} placeholder="Age" />

            <button onClick={handleSubmit}>
              {editIndex !== null ? "Update" : "Add"}
            </button>

            {chickens.map((c, i) => (
              <Card key={i}>
                {c.name} - {c.breed} - {c.age}
                <br />
                <button onClick={() => startEdit(i)}>Edit</button>
                <button onClick={() => deleteChicken(i)}>Delete</button>
              </Card>
            ))}
          </>
        )}

        {page === "eggs" && (
          <>
            <h1>Eggs</h1>
            <input value={eggCount} onChange={e => setEggCount(e.target.value)} placeholder="Egg count" />
            <button onClick={addEggs}>Add</button>

            {eggs.map((e, i) => (
              <Card key={i}>{e.date} - {e.count}</Card>
            ))}
          </>
        )}

        {page === "feed" && (
          <>
            <h1>Feed</h1>
            <input value={feedAmount} onChange={e => setFeedAmount(e.target.value)} placeholder="Feed (kg)" />
            <button onClick={addFeed}>Add</button>

            {feed.map((f, i) => (
              <Card key={i}>{f.date} - {f.amount} kg</Card>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

function Card({ title, value, children }: any) {
  return (
    <div style={{
      background: "white",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      minWidth: "150px",
      marginBottom: "10px"
    }}>
      {title && <h3>{title}</h3>}
      {value !== undefined && <p>{value}</p>}
      {children}
    </div>
  );
}