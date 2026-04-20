import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔑 PUT YOUR KEY HERE
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

type Egg = {
  id?: string;
  date: string;
  count: number;
};

export default function App() {
  const [page, setPage] = useState("chickens");

  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [eggs, setEggs] = useState<Egg[]>([]);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [status, setStatus] = useState("");

  const [eggDate, setEggDate] = useState("");
  const [eggCount, setEggCount] = useState("");

  // 🚀 LOAD DATA
  useEffect(() => {
    fetchChickens();
    fetchEggs();
  }, []);

  const fetchChickens = async () => {
    const { data, error } = await supabase.from("chickens").select("*");
    if (error) {
      console.log("Chicken load error:", error);
      alert(error.message);
    }
    if (data) setChickens(data);
  };

  const fetchEggs = async () => {
    const { data, error } = await supabase
      .from("eggs")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.log("Egg load error:", error);
      alert(error.message);
    }

    if (data) setEggs(data);
  };

  // ➕ ADD CHICKEN
  const addChicken = async () => {
    if (!name || !breed || !sex || !status) return;

    const { error } = await supabase.from("chickens").insert([
      { name, breed, sex, status }
    ]);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setName("");
    setBreed("");
    setSex("");
    setStatus("");
    fetchChickens();
  };

  // ❌ DELETE CHICKEN
  const deleteChicken = async (id: string) => {
    const { error } = await supabase.from("chickens").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchChickens();
  };

  // 🥚 ADD EGGS (FIXED)
  const addEggs = async () => {
    if (!eggDate || !eggCount) {
      alert("Please enter date and count");
      return;
    }

    const { data, error } = await supabase.from("eggs").insert([
      {
        date: eggDate,
        count: Number(eggCount)
      }
    ]);

    console.log("Egg insert:", data, error);

    if (error) {
      alert("Egg error: " + error.message);
      return;
    }

    setEggDate("");
    setEggCount("");
    fetchEggs();
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

        <p onClick={() => setPage("dashboard")} style={{ cursor: "pointer" }}>dashboard</p>
        <p onClick={() => setPage("chickens")} style={{ cursor: "pointer" }}>chickens</p>
        <p onClick={() => setPage("eggs")} style={{ cursor: "pointer" }}>eggs</p>
        <p onClick={() => setPage("feed")} style={{ cursor: "pointer" }}>feed</p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "30px" }}>

        {/* 🐔 CHICKENS */}
        {page === "chickens" && (
          <>
            <h1>Chickens</h1>

            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
            <input placeholder="Sex" value={sex} onChange={(e) => setSex(e.target.value)} />
            <input placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />

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

        {/* 🥚 EGGS */}
        {page === "eggs" && (
          <>
            <h1>Eggs</h1>

            <input
              type="date"
              value={eggDate}
              onChange={(e) => setEggDate(e.target.value)}
            />

            <input
              type="number"
              placeholder="Egg count"
              value={eggCount}
              onChange={(e) => setEggCount(e.target.value)}
            />

            <br /><br />

            <button onClick={addEggs}>Add Eggs</button>

            <div>
              {eggs.map((e) => (
                <div key={e.id}>
                  {e.date} — {e.count} eggs
                </div>
              ))}
            </div>
          </>
        )}

        {/* PLACEHOLDERS */}
        {page === "dashboard" && <h1>Dashboard coming next 🔥</h1>}
        {page === "feed" && <h1>Feed next</h1>}

      </div>
    </div>
  );
}