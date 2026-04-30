import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  navigate,
}: any) {
  if (!selectedChicken) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  // ================= STATE =================
  const [viewLog, setViewLog] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const healthLogs = selectedChicken?.healthLogs || [];

  // ================= HELPERS =================
  const updateChicken = (updated: any) => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? updated : c))
    );
  };

  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const getColor = (status: string) => {
    if (status === "Sick") return "#ef4444";
    if (status === "Recovering") return "#eab308";
    return "#22c55e";
  };

  // ================= ACTIONS =================
  const addLog = () => {
    if (!form.date) {
      alert("Date Logged is required");
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

    // Reset + close form
    setForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });

    setShowForm(false);
  };

  const deleteLog = (id: number) => {
    const updated = {
      ...selectedChicken,
      healthLogs: healthLogs.filter((l: any) => l.id !== id),
    };
    updateChicken(updated);
  };

  const deleteChicken = () => {
    setChickens((prev: any[]) =>
      prev.filter((c) => c.id !== selectedChicken.id)
    );
    navigate("registry");
  };

  // ================= STYLES =================
  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const btn = {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const input = {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "100%",
  };

  const label = {
    fontWeight: 600,
    color: "#555",
  };

  const value = {
    marginBottom: 8,
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
        ← Back to Registry
      </button>

      {/* ================= PROFILE ================= */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          <img
            src={selectedChicken.image}
            style={{ width: 140, height: 140, borderRadius: 12 }}
          />

          <div>
            <h2>{selectedChicken.name}</h2>

            <div style={value}><span style={label}>ID Tag:</span> {selectedChicken.idTag}</div>
            <div style={value}><span style={label}>Breed:</span> {selectedChicken.breed || "-"}</div>
            <div style={value}><span style={label}>Sex:</span> {selectedChicken.sex}</div>
            <div style={value}><span style={label}>Age:</span> {selectedChicken.ageGroup}</div>
            <div style={value}><span style={label}>Added Date:</span> {formatDate(selectedChicken.hatchDate)}</div>
            <div style={value}><span style={label}>Status:</span> {selectedChicken.status}</div>

            <div style={{ marginTop: 10 }}>
              <button style={{ ...btn, background: "#3b82f6", color: "#fff" }}>Edit</button>
              <button
                style={{ ...btn, background: "#ef4444", color: "#fff", marginLeft: 10 }}
                onClick={deleteChicken}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= HEALTH LOGS ================= */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>🩺 Health Logs</h3>

          <button
            onClick={() => setShowForm(!showForm)}
            style={{ ...btn, background: "#22c55e", color: "#fff" }}
          >
            {showForm ? "Cancel" : "+ Add Health Log"}
          </button>
        </div>

        {/* 🔥 FORM (TOGGLED) */}
        {showForm && (
          <div style={{ marginTop: 15, display: "grid", gap: 10 }}>
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
              style={{ ...btn, background: "#16a34a", color: "#fff" }}
            >
              Save Log
            </button>
          </div>
        )}

        {/* 🔥 LOG LIST ALWAYS VISIBLE */}
        {healthLogs.length === 0 && <p style={{ marginTop: 10 }}>No logs yet</p>}

        {healthLogs.map((log: any) => (
          <div
            key={log.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
          <p><b>Date:</b> {formatDate(viewLog.date)}</p>
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