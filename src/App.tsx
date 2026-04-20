import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔑 YOUR SUPABASE DETAILS
const supabase = createClient(
  "https://gzoxsnsbzbjmbatdxwyhh.supabase.co",
  "YOUR_PUBLIC_KEY_HERE"
);

type Chicken = {
  id?: string;
  name: string;
  breed: string;
  sex: string;
  status: string;
};

export default function App() {
  const [page, setPage] = useState("chickens");
  const [chickens, setChickens] = useState<Chicken[]>([]);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [status, setStatus] = useState("");

  // 📥 LOAD chickens from Supabase
  useEffect(() => {
    fetchChickens();
  }, []);

  const fetchChickens = async () => {
    const { data, error } = await supabase.from("chickens").select("*");
    if (!error && data) setChickens(data);
  };

  // ➕ ADD chicken
  const addChicken = async () => {
    if (!name || !breed || !sex || !status) return;

    const { error } = await supabase.from("chickens").insert([
      { name, breed, sex, status }
    ]);

    if (!error) {
      setName("");
      setBreed("");
      setSex("");
      setStatus("");
      fetchChickens();
    }
  };

  // ❌ DELETE chicken
  const deleteChicken = async (id: string) => {
    await supabase.from("chickens").delete().eq("id", id);
    fetchChickens();
  };

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

        <p onClick={() => setPage("dashboard")} style={{ cursor: "pointer" }}>dashboard</p>
        <p onClick={() => setPage("chickens")} style={{ cursor: "pointer" }}>chickens</p>
        <p onClick={() => setPage("eggs")} style={{ cursor: "pointer" }}>eggs</p>
        <p onClick={() => setPage("feed")} style={{ cursor: "pointer" }}>feed</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "30px" }}>

        {/* CHICKENS PAGE */}
        {page === "chickens" && (
          <>
            <h1>Chickens</h1>

            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
            <input placeholder="Sex (Hen/Rooster)" value={sex} onChange={(e) => setSex(e.target.value)} />
            <input placeholder="Status (Alive/Sold)" value={status} onChange={(e) => setStatus(e.target.value)} />

            <br /><br />

            <button onClick={addChicken}>Add Chicken</button>

            <div>
              {chickens.map((c) => (
                <div key={c.id}>
                  <strong>{c.name}</strong><br />
                  {c.breed} | {c.sex} | {c.status}
                  <br />
                  <button onClick={() => deleteChicken(c.id!)}>Delete</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* OTHER PAGES */}
        {page === "dashboard" && <h1>Dashboard (next step)</h1>}
        {page === "eggs" && <h1>Eggs (next)</h1>}
        {page === "feed" && <h1>Feed (next)</h1>}

      </div>
    </div>
  );
}