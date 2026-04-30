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

  // ✅ track editing
  const [editingId, setEditingId] = useState<number | null>(null);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
  });

  const healthLogs = chicken.healthLogs || [];

  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  // ✅ FIXED save (handles edit + new)
  const saveHealth = () => {
    if (!healthForm.date) return;

    if (editingId) {
      updateChicken({
        ...chicken,
        healthLogs: healthLogs.map((l: any) =>
          l.id === editingId ? { ...l, ...healthForm } : l
        ),
      });
    } else {
      updateChicken({
        ...chicken,
        healthLogs: [
          ...healthLogs,
          { id: Date.now(), ...healthForm, resolved: false },
        ],
      });
    }

    setHealthForm({ date: "", status: "Healthy", symptoms: "" });
    setShowHealthForm(false);
    setEditingId(null);
  };

  const getColor = (status: string) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "Sick") return "#ef4444";
    return "#eab308";
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

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      <button
        onClick={() => navigate("registry")}
        style={{ ...btn, background: "#3b82f6", color: "#fff", marginBottom: 20 }}
      >
        ← Back
      </button>

      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          {chicken.image && (
            <img src={chicken.image} style={{ width: 140, height: 140, borderRadius: 12 }} />
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

      {/* PHOTO ALBUM (unchanged) */}
      <div style={card}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>📸 Photo Album</div>
        <label style={{ ...btn, background: "#22c55e", color: "#fff" }}>
          + Add Photos
          <input type="file" multiple style={{ display: "none" }} />
        </label>
      </div>

      {/* HEALTH LOGS */}
      <div style={card}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>🩺 Health Logs</div>

        <button
          style={{ ...btn, background: "#22c55e", color: "#fff", marginBottom: 10 }}
          onClick={() => {
            setShowHealthForm(!showHealthForm);
            setEditingId(null);
          }}
        >
          + Add Health Log
        </button>

        {/* ✅ RESTORED FORM */}
        {showHealthForm && (
          <>
            <input
              type="date"
              style={input}
              value={healthForm.date}
              onChange={(e) => setHealthForm({ ...healthForm, date: e.target.value })}
            />
            <select
              style={input}
              value={healthForm.status}
              onChange={(e) => setHealthForm({ ...healthForm, status: e.target.value })}
            >
              <option>Healthy</option>
              <option>Sick</option>
              <option>Recovering</option>
            </select>
            <input
              style={input}
              placeholder="Symptoms"
              value={healthForm.symptoms}
              onChange={(e) => setHealthForm({ ...healthForm, symptoms: e.target.value })}
            />
            <button onClick={saveHealth}>Save</button>
          </>
        )}

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: getColor(log.status),
                }} />
                <b>{log.status}</b>
                <span>— {log.symptoms}</span>
              </div>

              <button
                style={{ padding: "4px 8px", fontSize: 12, borderRadius: 6, border: "none", background: "#3b82f6", color: "#fff" }}
                onClick={() => setViewLog(log)}
              >
                View
              </button>
            </div>

            <div style={{ marginTop: 8 }}>
              <label style={{ display: "flex", gap: 6 }}>
                Health risk resolved
                <input
                  type="checkbox"
                  checked={log.resolved || false}
                  onChange={() =>
                    updateChicken({
                      ...chicken,
                      healthLogs: healthLogs.map((l: any) =>
                        l.id === log.id ? { ...l, resolved: !l.resolved } : l
                      ),
                    })
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      {viewLog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 12, width: 320 }}>
            <button onClick={() => setViewLog(null)}>X</button>

            <h3>{viewLog.status}</h3>
            <p>{viewLog.symptoms}</p>

            <button
              onClick={() => {
                setHealthForm(viewLog);
                setEditingId(viewLog.id); // ✅ THIS FIXES EDIT
                setShowHealthForm(true);
                setViewLog(null);
              }}
            >
              Edit
            </button>

            <button
              onClick={() => {
                updateChicken({
                  ...chicken,
                  healthLogs: healthLogs.filter((l: any) => l.id !== viewLog.id),
                });
                setViewLog(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

    </div>
  );
}