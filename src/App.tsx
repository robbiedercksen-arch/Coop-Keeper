import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

/* 🔑 ADD YOUR KEYS */
const supabase = createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_ANON_KEY"
);

type Chicken = {
  id?: string;
  name: string;
  breed: string;
  sex: string;
  status: string;
};

export default function App() {
  const [chickens, setChickens] = useState<Chicken[]>([]);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [status, setStatus] = useState("");

  /* 🔄 LOAD */
  useEffect(() => {
    fetchChickens();
  }, []);

  const fetchChickens = async () => {
    const { data } = await supabase.from("chickens").select("*");
    if (data) setChickens(data);
  };

  /* ➕ ADD */
  const addChicken = async () => {
    if (!name || !breed || !sex || !status) return;

    await supabase.from("chickens").insert([
      { name, breed, sex, status }
    ]);

    setName("");
    setBreed("");
    setSex("");
    setStatus("");

    fetchChickens();
  };

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
        <p>Chickens</p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "30px", background: "#f9fafb" }}>

        <h1>Chickens</h1>

        {/* INPUTS */}
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Breed" value={breed} onChange={e=>setBreed(e.target.value)} />
        <input placeholder="Sex (Hen/Rooster)" value={sex} onChange={e=>setSex(e.target.value)} />
        <input placeholder="Status (Alive/Sold)" value={status} onChange={e=>setStatus(e.target.value)} />

        <br /><br />

        <button onClick={addChicken}>Add Chicken</button>

        {/* LIST */}
        <div style={{ marginTop: "20px" }}>
          {chickens.map((c,i)=>(
            <div key={i} style={{
              background:"white",
              padding:"15px",
              marginBottom:"10px",
              borderRadius:"8px"
            }}>
              <strong>{c.name}</strong><br/>
              Breed: {c.breed}<br/>
              Sex: {c.sex}<br/>
              Status: {c.status}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}