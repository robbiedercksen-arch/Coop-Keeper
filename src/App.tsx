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

  // EGGS
  const addEggs = () => {
    if (!eggCount) return;

    const today = new Date().toISOString().split("T")[0];

    setEggs([
      ...eggs,
      { date: today, count: parseInt(eggCount) }
    ]);

    setEggCount("");
  };

  // FEED
  const addFeed = () => {
    if (!feedAmount) return;

    const today = new Date().toISOString().split("T")[0];

    setFeed([
      ...feed,
      { date: today, amount: parseFloat(feedAmount) }
    ]);

    setFeedAmount("");
  };

  const today = new Date().toISOString().split("T")[0];

  const eggsToday = eggs.find(e => e.date === today)?.count || 0;
  const totalEggs = eggs.reduce((sum, e) => sum + e.count, 0);

  const feedToday = feed.find(f => f.date === today)?.amount || 0;
  const totalFeed = feed.reduce((sum, f) => sum + f.amount, 0);

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

        <p onClick={() => setPage("dashboard")}>Dashboard</p>
        <p onClick={() => setPage("chickens")}>Chickens</p>
        <p onClick={() => setPage("eggs")}>Eggs</p>
        <p onClick={() => setPage("feed")}>Feed</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "30px", background: "#f9fafb" }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
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

            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Breed" />
            <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />

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

        {/* EGGS */}
        {page === "eggs" && (
          <>
            <h1>Egg Tracking</h1>

            <input
              value={eggCount}
              onChange={(e) => setEggCount(e.target.value)}
              placeholder="Egg count"
            />
            <button onClick={addEggs}>Add Eggs</button>

            {eggs.map((e, i) => (
              <Card key={i}>
                {e.date} - {e.count} eggs
              </Card>
            ))}
          </>
        )}

        {/* FEED */}
        {page === "feed" && (
          <>
            <h1>Feed Tracking</h1>

            <input
              value={feedAmount}
              onChange={(e) => setFeedAmount(e.target.value)}
              placeholder="Feed amount (kg)"
            />
            <button onClick={addFeed}>Add Feed</button>

            {feed.map((f, i) => (
              <Card key={i}>
                {f.date} - {f.amount} kg
              </Card>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

// Reusable card
function Card({ title, value, children }: any) {
  return (
    <div style={{
      background: "white",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      minWidth: "180px"
    }}>
      {title && <h3>{title}</h3>}
      {value !== undefined && <p>{value}</p>}
      {children}
    </div>
  );
}