import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  navigate,
}: any) {
  if (!selectedChicken) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  const [viewLog, setViewLog] = useState<any>(null);

  const [form, setForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const healthLogs = selectedChicken?.healthLogs || [];

  // ================= UPDATE CHICKEN =================
  const updateChicken = (updated: any) => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? updated : c))
    );
  };

  // ================= ADD LOG =================
  const addLog = () => {
    if (!form.date) {
      alert("Date is required");
      return;
    }

    const newLog = {
      id: Date.now(),
      ...form,
    };

    const updated = {
      ...selectedChicken,
      healthLogs: [...healthLogs, newLog],
    };

    updateChicken(updated);

    setForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });
  };

  // ================= DELETE LOG =================
  const deleteLog = (id: number) => {
    const updated = {
      ...selectedChicken,
      healthLogs: healthLogs.filter((l: any) => l.id !== id),
    };

    updateChicken(updated);
  };

  // ================= STYLES =================
  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const input = {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "100%",
  };

  const btn = {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const getColor = (status: string) => {
    if (status === "Sick") return "#ef4444";
    if (status === "Recovering") return "#eab308";
    return "#22c55e";
  };

  return (
    <div style={{ padding: 20, maxWidth: 1000 }}>

      {/* 🔙 BACK */}
      <button
        onClick={() => navigate("registry")}
        style={{
          padding: "10px 18px",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "#fff",
          borderRadius: 12,
          border: "none",
          marginBottom: 20,
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      {/* ================= HEALTH FORM ================= */}
      <div style={card}>
        <h3>➕ Add Health Log</h3>

        <div style={{ display: "grid", gap: 10 }}>
          <input
            type="date"
            style={input}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <select
            style={input}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Healthy</option>
            <option>Sick</option>
            <option>Recovering</option>
          </select>

          <input
            placeholder="Symptoms"
            style={input}
            value={form.symptoms}
            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
          />

          <input
            placeholder="Treatment"
            style={input}
            value={form.treatment}
            onChange={(e) => setForm({ ...form, treatment: e.target.value })}
          />

          <textarea
            placeholder="Notes (optional)"
            style={input}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button
            onClick={addLog}
            style={{
              ...btn,
              background: "#22c55e",
              color: "#fff",
            }}
          >
            Save Log
          </button>
        </div>
      </div>

      {/* ================= HEALTH LIST ================= */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        {healthLogs.length === 0 && <p>No logs yet</p>}

        {healthLogs.map((log: any) => (
          <div
            key={log.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #eee",
              padding: "10px 0",
            }}
          >
            {/* LEFT SIDE */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              
              {/* DOT */}
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: getColor(log.status),
                }}
              />

              <div>
                <b>{log.status}</b>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {log.symptoms || "No symptoms"}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: 6 }}>
              <button
                style={{ ...btn, background: "#3b82f6", color: "#fff" }}
                onClick={() => setViewLog(log)}
              >
                View
              </button>

              <button
                style={{ ...btn, background: "#ef4444", color: "#fff" }}
                onClick={() => deleteLog(log.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= VIEW ================= */}
      {viewLog && (
        <div style={card}>
          <h3>📋 Health Details</h3>
          <p><b>Date:</b> {viewLog.date}</p>
          <p><b>Status:</b> {viewLog.status}</p>
          <p><b>Symptoms:</b> {viewLog.symptoms}</p>
          <p><b>Treatment:</b> {viewLog.treatment}</p>
          <p><b>Notes:</b> {viewLog.notes || "-"}</p>

          <button
            style={{ ...btn, background: "#6b7280", color: "#fff" }}
            onClick={() => setViewLog(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}