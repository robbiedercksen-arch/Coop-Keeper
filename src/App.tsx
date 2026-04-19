import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

/* 🔑 ADD YOUR SUPABASE KEYS HERE */
const supabase = createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_SUPABASE_ANON_KEY"
);

/* ================= TYPES ================= */
type Chicken = {
  id?: string;
  name: string;
  breed: string;
  sex: string;
  status: string;
};

/* ================= APP ================= */
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [chickens, setChickens] = useState<Chicken[]>([]);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [status, setStatus] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchChickens();
  }, []);

  const fetchChickens = async () => {
    const { data, error } = await supabase.from("chickens").select("*");

    if (error) {
      console.error("Error fetching chickens:", error);
      return;
    }

    if (data) setChickens(data);
  };

  /* ================= ADD ================= */
  const addChicken = async () => {
    if (!name || !breed || !sex || !status) return;

    const { error } = await supabase.from("chickens").insert([
      { name, breed, sex, status }
    ]);

    if (error) {
      console.error("Error adding chicken:", error);
      return;
    }

    setName("");
    setBreed("");
    setSex("");
    setStatus("");

    fetchChickens();
  };

  /* ================= DELETE ================= */
  const deleteChicken = async (id?: string) => {
    if (!id) return;

    await supabase.from("chickens").delete().eq("id", id);
    fetchChickens();
  };

  /* ================= UI ================= */
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "220px",
        background: "#111827",
        color: "white",
        padding: "20px"
      }}>
        <h2 style={{ marginBottom: "20px" }}>🐔 Coop Keeper</h2>

        {["dashboard", "chickens"].map((p) => (
          <div
            key={p}
            onClick={() => setPage(p)}
            style={{
              marginBottom: "10px",
              padding: "10px",
              cursor: "pointer",
              borderRadius: "6px",
              background: page === p ? "#374151" : "transparent"
            }}
          >
            {p}
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "30px", background: "#f9fafb" }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <p>Total Chickens: {chickens.length}</p>
          </>
        )}

        {/* CHICKENS */}
        {page === "chickens" && (
          <>
            <h1>Chickens</h1>

            {/* INPUTS */}
            <div style={{ marginBottom: "15px" }}>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: "10px", marginRight: "10px" }}
              />
              <input
                placeholder="Breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                style={{ padding: "10px", marginRight: "10px" }}
              />
              <input
                placeholder="Sex (Hen/Rooster)"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                style={{ padding: "10px", marginRight: "10px" }}
              />
              <input
                placeholder="Status (Alive/Sold)"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ padding: "10px", marginRight: "10px" }}
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={addChicken}
              style={{
                padding: "10px 15px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "20px"
              }}
            >
              Add Chicken
            </button>

            {/* LIST */}
            <div>
              {chickens.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: "white",
                    padding: "15px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                  }}
                >
                  <strong>{c.name}</strong><br />
                  Breed: {c.breed}<br />
                  Sex: {c.sex}<br />
                  Status: {c.status}

                  <br /><br />

                  <button
                    onClick={() => deleteChicken(c.id)}
                    style={{
                      padding: "5px 10px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}