import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  setSelectedChicken,
  navigate,
}: any) {
  if (!selectedChicken) return <div style={{ padding: 20 }}>Loading...</div>;

  const [showHealthForm, setShowHealthForm] = useState(false);
  const [viewLog, setViewLog] = useState<any>(null);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
  });

  const healthLogs = selectedChicken.healthLogs || [];

  // ================= HELPERS =================
  const updateChicken = (updated: any) => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString() : "-";

  const getColor = (s: string) =>
    s === "Sick" ? "#ef4444" : s === "Recovering" ? "#eab308" : "#22c55e";

  // ================= HEALTH =================
  const addHealthLog = () => {
    if (!healthForm.date) return alert("Date required");

    const newLog = { id: Date.now(), ...healthForm, resolved: false };

    updateChicken({
      ...selectedChicken,
      healthLogs: [...healthLogs, newLog],
    });

    setHealthForm({ date: "", status: "Healthy", symptoms: "" });
    setShowHealthForm(false);
  };

  const toggleResolved = (id: number) => {
    updateChicken({
      ...selectedChicken,
      healthLogs: healthLogs.map((l: any) =>
        l.id === id ? { ...l, resolved: !l.resolved } : l
      ),
    });
  };

  const deleteLog = (id: number) => {
    updateChicken({
      ...selectedChicken,
      healthLogs: healthLogs.filter((l: any) => l.id !== id),
    });
    setViewLog(null);
  };

  // ================= STYLES =================
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
    fontWeight: 600,
  };

  const primary = {
    ...btn,
    background: "#3b82f6",
    color: "#fff",
  };

  const success = {
    ...btn,
    background: "#22c55e",
    color: "#fff",
  };

  const danger = {
    ...btn,
    background: "#ef4444",
    color: "#fff",
  };

  const input = {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "100%",
  };

  return (
    <div style={{ padding: 20, maxWidth: 1000 }}>

      {/* BACK */}
      <button onClick={() => navigate("registry")} style={primary}>
        ← Back
      </button>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          <img
            src={selectedChicken.image}
            style={{
              width: 140,
              height: 140,
              borderRadius: 12,
              objectFit: "cover",
            }}
          />

          <div>
            <h2>{selectedChicken.name}</h2>
            <div><b>ID Tag:</b> {selectedChicken.idTag}</div>
            <div><b>Breed:</b> {selectedChicken.breed}</div>
          </div>
        </div>
      </div>

      {/* ================= HEALTH ================= */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>🩺 Health Logs</h3>

          <button
            onClick={() => setShowHealthForm(!showHealthForm)}
            style={success}
          >
            + Add Health Log
          </button>
        </div>

        {/* FORM */}
        {showHealthForm && (
          <div style={{ display: "grid", gap: 10 }}>
            <input
              type="date"
              style={input}
              value={healthForm.date}
              onChange={(e) =>
                setHealthForm({ ...healthForm, date: e.target.value })
              }
            />

            <select
              style={input}
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
              style={input}
              value={healthForm.symptoms}
              onChange={(e) =>
                setHealthForm({ ...healthForm, symptoms: e.target.value })
              }
            />

            <button onClick={addHealthLog} style={success}>
              Save Log
            </button>
          </div>
        )}

        {/* LIST */}
        {healthLogs.map((log: any) => (
          <div
            key={log.id}
            style={{
              borderBottom: "1px solid #eee",
              padding: "12px 0",
            }}
          >
            {/* ROW 1 */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: getColor(log.status),
                  }}
                />
                <b>{log.status}</b>
                <span style={{ fontSize: 12, color: "#666" }}>
                  {formatDate(log.date)}
                </span>
              </div>

              <button
                style={primary}
                onClick={() => setViewLog(log)}
              >
                View
              </button>
            </div>

            {/* ROW 2 */}
            <div style={{ marginTop: 5, fontSize: 13 }}>
              {log.symptoms}
            </div>

            {/* ROW 3 */}
            <div style={{ marginTop: 5 }}>
              <label style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={log.resolved}
                  onChange={() => toggleResolved(log.id)}
                />{" "}
                Health Issue Solved
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* ================= VIEW PANEL ================= */}
      {viewLog && (
        <div style={card}>
          <h3>📋 Health Log Details</h3>

          <p><b>Date:</b> {formatDate(viewLog.date)}</p>
          <p><b>Status:</b> {viewLog.status}</p>
          <p><b>Symptoms:</b> {viewLog.symptoms}</p>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button style={primary}>Edit</button>

            <button
              style={danger}
              onClick={() => deleteLog(viewLog.id)}
            >
              Delete
            </button>

            <button onClick={() => setViewLog(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}