import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  setSelectedChicken,
  navigate,
}: any) {
  if (!selectedChicken) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const healthLogs = selectedChicken?.healthLogs || [];

  // ================= UPDATE =================
  const updateChicken = (updated: any) => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  // ================= ADD =================
  const addLog = () => {
    const newLog = {
      id: Date.now(),
      ...form,
      resolved: false, // ✅ NEW
    };

    updateChicken({
      ...selectedChicken,
      healthLogs: [...healthLogs, newLog],
    });

    setForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });

    setShowForm(false);
  };

  // ================= TOGGLE RESOLVED =================
  const toggleResolved = (id: number) => {
    const updatedLogs = healthLogs.map((log: any) =>
      log.id === id ? { ...log, resolved: !log.resolved } : log
    );

    updateChicken({
      ...selectedChicken,
      healthLogs: updatedLogs,
    });
  };

  // ================= DELETE =================
  const deleteLog = (id: number) => {
    updateChicken({
      ...selectedChicken,
      healthLogs: healthLogs.filter((l: any) => l.id !== id),
    });
  };

  const getColor = (status: string) => {
    if (status === "Sick") return "#ef4444";
    if (status === "Recovering") return "#eab308";
    return "#22c55e";
  };

  // ================= UI =================
  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
  };

  const btn = {
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: 20 }}>

      <button onClick={() => navigate("registry")}>← Back</button>

      {/* ================= HEALTH ================= */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Health Logs</h3>

          <button onClick={() => setShowForm(!showForm)}>
            + Add Log
          </button>
        </div>

        {showForm && (
          <div style={{ display: "grid", gap: 10 }}>
            <input type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Healthy</option>
              <option>Sick</option>
              <option>Recovering</option>
            </select>

            <input placeholder="Symptoms"
              value={form.symptoms}
              onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
            />

            <button onClick={addLog}>Save</button>
          </div>
        )}

        {/* ================= LOG LIST ================= */}
        {healthLogs.map((log: any) => (
          <div key={log.id} style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
            borderBottom: "1px solid #eee",
          }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: log.resolved ? "#22c55e" : getColor(log.status),
              }} />

              <div>
                <b>{log.status}</b>
                <div>{log.symptoms}</div>

                {/* ✅ RESOLVE CHECKBOX */}
                <label style={{ fontSize: 12 }}>
                  <input
                    type="checkbox"
                    checked={log.resolved}
                    onChange={() => toggleResolved(log.id)}
                  />
                  {" "}Health Issue Solved
                </label>
              </div>
            </div>

            <button onClick={() => deleteLog(log.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}