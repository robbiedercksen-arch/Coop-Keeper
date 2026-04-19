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

export default function App() {
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [eggs, setEggs] = useState<EggEntry[]>([]);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [eggCount, setEggCount] = useState("");
  const [page, setPage] = useState<"dashboard" | "chickens" | "eggs">("dashboard");

  // LOAD
  useEffect(() => {
    const savedChickens = localStorage.getItem("chickens");
    const savedEggs = localStorage.getItem("eggs");

    if (savedChickens) setChickens(JSON.parse(savedChickens));
    if (savedEggs) setEggs(JSON.parse(savedEggs));
  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  useEffect(() => {
    localStorage.setItem("eggs", JSON.stringify(eggs));
  }, [eggs]);

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

    const newEntry = {
      date: today,
      count: parseInt(eggCount)
    };

    setEggs([...eggs, newEntry]);
    setEggCount("");
  };

  const today = new Date().toISOString().split("T")[0];

  const eggsToday =
    eggs.find((e) => e.date === today)?.count || 0;

  const totalEggs = eggs.reduce((sum, e) => sum + e.count, 0);

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

        <p onClick={() => setPage("dashboard")} style={{ cursor: "pointer" }}>Dashboard</p>
        <p onClick={() => setPage("chickens")} style={{ cursor: "pointer" }}>Chickens</p>
        <p onClick={() => setPage("eggs")} style={{ cursor: "pointer" }}>Eggs</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "30px", background: "#f9fafb" }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>

            <div style={{ display: "flex", gap: "20px" }}>
              <div style={cardStyle}>
                <h3>Chickens</h3>
                <p>{chickens.length}</p>
              </div>

              <div style={cardStyle}>
                <h3>Eggs Today</h3>
                <p>{eggsToday}</p>
              </div>

              <div style={cardStyle}>
                <h3>Total Eggs</h3>
                <p>{totalEggs}</p>
              </div>
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
              <div key={i} style={cardStyle}>
                {c.name} - {c.breed} - {c.age}
                <br />
                <button onClick={() => startEdit(i)}>Edit</button>
                <button onClick={() => deleteChicken(i)}>Delete</button>
              </div>
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
              <div key={i} style={cardStyle}>
                {e.date} - {e.count} eggs
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

// Simple card style
const cardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};