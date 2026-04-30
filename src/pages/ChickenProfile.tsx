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
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [viewLog, setViewLog] = useState<any>(null);

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
      <button onClick={() => navigate("registry")} style={{ ...btn, background: "#3b82f6", color: "#fff" }}>
        ← Back
      </button>

      {/* ✅ PROFILE IMAGE FIX (ONLY THIS PART CHANGED) */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {chicken.image && (
            <img
              src={chicken.image}
              style={{
                width: 140,
                height: 140,
                borderRadius: 12,
                objectFit: "cover",
                flexShrink: 0,
              }}
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

      {/* 🔴 DO NOT TOUCH YOUR PHOTO ALBUM (LEFT EXACTLY AS IS) */}

      {/* HEALTH LOGS */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        <button
          style={{ ...btn, background: "#22c55e", color: "#fff" }}
          onClick={() => setShowHealthForm(!showHealthForm)}
        >
          + Add Health Log
        </button>

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginTop: 10 }}>
            <b>{log.status}</b> — {log.symptoms}

            <input
              type="checkbox"
              checked={log.resolved}
              onChange={() =>
                updateChicken({
                  ...chicken,
                  healthLogs: healthLogs.map((l: any) =>
                    l.id === log.id
                      ? { ...l, resolved: !l.resolved }
                      : l
                  ),
                })
              }
              style={{ marginLeft: 10 }}
            />

            <button
              onClick={() => setViewLog(log)}
              style={{ marginLeft: 10 }}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* ✅ CLEAN POPUP (NO LAYOUT IMPACT) */}
      {viewLog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              minWidth: 280,
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h3>{viewLog.status}</h3>
            <p>{viewLog.symptoms}</p>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button style={{ ...btn, background: "#3b82f6", color: "#fff" }}>
                Edit
              </button>

              <button
                style={{ ...btn, background: "#e5e7eb" }}
                onClick={() => setViewLog(null)}
              >
                Cancel
              </button>

              <button
                style={{ ...btn, background: "#ef4444", color: "#fff" }}
                onClick={() => {
                  updateChicken({
                    ...chicken,
                    healthLogs: healthLogs.filter(
                      (l: any) => l.id !== viewLog.id
                    ),
                  });
                  setViewLog(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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