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

  // 🔥 FIX STATE
  const [editingLogId, setEditingLogId] = useState<number | null>(null);

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

  // 🔥 FIXED SAVE FUNCTION
  const addHealth = () => {
    if (!healthForm.date) return alert("Date required");

    let updatedLogs;

    if (editingLogId !== null) {
      updatedLogs = healthLogs.map((log: any) =>
        log.id === editingLogId
          ? { ...log, ...healthForm }
          : log
      );
    } else {
      updatedLogs = [
        ...healthLogs,
        { id: Date.now(), ...healthForm, resolved: false },
      ];
    }

    updateChicken({
      ...chicken,
      healthLogs: updatedLogs,
    });

    setEditingLogId(null);
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
              style={{ width: 140, height: 140, borderRadius: 12, objectFit: "cover" }}
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

        <label style={{ ...btn, background: "#22c55e", color: "#fff" }}>
          + Add Photos
          <input type="file" multiple style={{ display: "none" }} />
        </label>
      </div>

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

            <button
              onClick={() => setViewLog(log)}
              style={{ marginLeft: 10 }}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 FIXED POPUP */}
      {viewLog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
            <h3>{viewLog.status}</h3>
            <p>{viewLog.symptoms}</p>

            <div style={{ display: "flex", gap: 8 }}>
              {/* ✅ FIXED EDIT BUTTON */}
              <button
                style={{ ...btn, background: "#3b82f6", color: "#fff" }}
                onClick={() => {
                  setEditingLogId(viewLog.id);

                  setHealthForm({
                    date: viewLog.date || "",
                    status: viewLog.status,
                    symptoms: viewLog.symptoms,
                    treatment: viewLog.treatment || "",
                    notes: viewLog.notes || "",
                  });

                  setViewLog(null);
                  setShowHealthForm(true);
                }}
              >
                Edit
              </button>

              <button onClick={() => setViewLog(null)}>Cancel</button>

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