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

  // 🔥 THIS CONTROLS THE BUTTON
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

  const addHealth = () => {
    if (!healthForm.date) return alert("Date required");

    updateChicken({
      ...chicken,
      healthLogs: [
        ...healthLogs,
        { id: Date.now(), ...healthForm, resolved: false },
      ],
    });

    setShowHealthForm(false);
    setHealthForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });
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
        <h3>📸 Photo Album</h3>
      </div>

      {/* HEALTH LOGS */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        {/* 🔥 FIXED BUTTON */}
        <button
          style={{ ...btn, background: "#22c55e", color: "#fff" }}
          onClick={() => setShowHealthForm((prev) => !prev)}
        >
          + Add Health Log
        </button>

        {/* 🔥 FORM NOW ACTUALLY SHOWS */}
        {showHealthForm && (
          <div style={{ marginTop: 10 }}>
            <input
              type="date"
              value={healthForm.date}
              onChange={(e) =>
                setHealthForm({ ...healthForm, date: e.target.value })
              }
            />

            <select
              value={healthForm.status}
              onChange={(e) =>
                setHealthForm({ ...healthForm, status: e.target.value })
              }
            >
              <option>Healthy</option>
              <option>Sick</option>
              <option>Recovering</option>
            </select>

            <input
              placeholder="Symptoms"
              value={healthForm.symptoms}
              onChange={(e) =>
                setHealthForm({ ...healthForm, symptoms: e.target.value })
              }
            />

            <button
              onClick={addHealth}
              style={{ ...btn, background: "#22c55e", color: "#fff" }}
            >
              Save Log
            </button>
          </div>
        )}

        {/* EXISTING LOGS */}
        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginTop: 10 }}>
            <b>{log.status}</b> — {log.symptoms}
          </div>
        ))}
      </div>

      {/* IMAGE POPUP */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={activeImage} style={{ maxWidth: "90%" }} />
        </div>
      )}
    </div>
  );
}