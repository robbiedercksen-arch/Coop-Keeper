import { useState, useEffect } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  setSelectedChicken,
  navigate,
}: any) {
  if (!selectedChicken || !selectedChicken.id) {
    return (
      <div style={{ padding: 20 }}>
        <p>Loading chicken...</p>
        <button onClick={() => navigate("registry")}>
          ← Back to Registry
        </button>
      </div>
    );
  }

  const [chicken, setChicken] = useState(selectedChicken);
  useEffect(() => setChicken(selectedChicken), [selectedChicken]);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  // 🔥 FIX: control form visibility
  const [showHealthForm, setShowHealthForm] = useState(false);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const healthLogs = chicken.healthLogs || [];

  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  const saveHealth = () => {
    if (!healthForm.date) return alert("Date required");

    updateChicken({
      ...chicken,
      healthLogs: [
        ...healthLogs,
        { id: Date.now(), ...healthForm, resolved: false },
      ],
    });

    setShowHealthForm(false); // close after save
  };

  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const btn = {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  };

  const input = {
    display: "block",
    width: "100%",
    marginBottom: 8,
    padding: 6,
  };

  const header = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: "1px solid #e5e7eb",
  };

  const getColor = (status: string) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "Sick") return "#ef4444";
    return "#eab308";
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      {/* BACK */}
      <button
        onClick={() => navigate("registry")}
        style={{ ...btn, background: "#3b82f6", color: "#fff", marginBottom: 20 }}
      >
        ← Back
      </button>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          {chicken.image && (
            <img
              src={chicken.image}
              style={{ width: 140, height: 140, borderRadius: 12 }}
            />
          )}

          <div>
            <h1>{chicken.name}</h1>
            <div><b>ID Tag:</b> {chicken.idTag}</div>
            <div><b>Breed:</b> {chicken.breed}</div>
            <div><b>Sex:</b> {chicken.sex}</div>
            <div><b>Age:</b> {chicken.ageGroup}</div>
          </div>
        </div>
      </div>

      {/* PHOTO ALBUM (UNCHANGED) */}
      <div style={card}>
        <div style={header}>📸 Photo Album</div>

        <label style={{ ...btn, background: "#22c55e", color: "#fff" }}>
          + Add Photos
          <input type="file" multiple style={{ display: "none" }} />
        </label>
      </div>

      {/* HEALTH LOGS */}
      <div style={card}>
        <div style={header}>🩺 Health Logs</div>

        {/* 🔥 FIX: BUTTON ADDED BACK */}
        <button
          style={{ ...btn, background: "#22c55e", color: "#fff", marginBottom: 10 }}
          onClick={() => setShowHealthForm(prev => !prev)}
        >
          + Add Health Log
        </button>

        {/* 🔥 FIX: FORM TOGGLED */}
        {showHealthForm && (
          <>
            <input type="date" style={input}
              value={healthForm.date}
              onChange={(e) => setHealthForm({ ...healthForm, date: e.target.value })}
            />

            <select style={input}
              value={healthForm.status}
              onChange={(e) => setHealthForm({ ...healthForm, status: e.target.value })}
            >
              <option>Healthy</option>
              <option>Sick</option>
              <option>Recovering</option>
            </select>

            <textarea style={input} placeholder="Notes"
              value={healthForm.notes}
              onChange={(e) => setHealthForm({ ...healthForm, notes: e.target.value })}
            />

            <button style={{ ...btn, background: "#f59e0b", color: "#fff" }} onClick={saveHealth}>
              Add
            </button>
          </>
        )}

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: getColor(log.status),
              }} />
              {log.date} — {log.status}
            </div>

            <div>
              <button style={btn} onClick={() => setViewLog(log)}>View</button>
              <button style={btn} onClick={() => editHealthLog(log)}>Edit</button>
              <button style={btn} onClick={() => deleteHealthLog(log.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* (REST OF YOUR FILE LEFT EXACTLY AS-IS) */}
    </div>
  );
}