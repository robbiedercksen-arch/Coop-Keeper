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

  // ================= STATE =================
  const [viewLog, setViewLog] = useState<any>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const [noteForm, setNoteForm] = useState({
    date: "",
    type: "General",
    description: "",
  });

  const healthLogs = selectedChicken?.healthLogs || [];
  const notes = selectedChicken?.notes || [];

  // ================= HELPERS =================
  const updateChicken = (updated: any) => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? updated : c))
    );
    setSelectedChicken(updated);
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

  // ================= HEALTH =================
  const addHealthLog = () => {
    if (!healthForm.date) return alert("Date required");

    const newLog = {
      id: Date.now(),
      ...healthForm,
      resolved: false,
    };

    updateChicken({
      ...selectedChicken,
      healthLogs: [...healthLogs, newLog],
    });

    setHealthForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });

    setShowHealthForm(false);
  };

  const toggleResolved = (id: number) => {
    const updated = healthLogs.map((l: any) =>
      l.id === id ? { ...l, resolved: !l.resolved } : l
    );

    updateChicken({ ...selectedChicken, healthLogs: updated });
  };

  const deleteHealthLog = (id: number) => {
    updateChicken({
      ...selectedChicken,
      healthLogs: healthLogs.filter((l: any) => l.id !== id),
    });
  };

  // ================= NOTES =================
  const addNote = () => {
    if (!noteForm.date || !noteForm.description) {
      alert("Date and description required");
      return;
    }

    const newNote = {
      id: Date.now(),
      ...noteForm,
    };

    updateChicken({
      ...selectedChicken,
      notes: [...notes, newNote],
    });

    setNoteForm({
      date: "",
      type: "General",
      description: "",
    });

    setShowNoteForm(false);
  };

  const deleteNote = (id: number) => {
    updateChicken({
      ...selectedChicken,
      notes: notes.filter((n: any) => n.id !== id),
    });
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

  const value = { marginBottom: 8 };

  return (
    <div style={{ padding: 20, maxWidth: 1000 }}>

      {/* BACK */}
      <button onClick={() => navigate("registry")}>
        ← Back to Registry
      </button>

      {/* PROFILE */}
      <div style={card}>
        <h2>{selectedChicken.name}</h2>
        <div style={value}><b>ID Tag:</b> {selectedChicken.idTag}</div>
        <div style={value}><b>Breed:</b> {selectedChicken.breed}</div>
        <div style={value}><b>Sex:</b> {selectedChicken.sex}</div>
        <div style={value}><b>Age:</b> {selectedChicken.ageGroup}</div>
        <div style={value}><b>Added:</b> {formatDate(selectedChicken.hatchDate)}</div>
      </div>

      {/* ================= HEALTH ================= */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>🩺 Health Logs</h3>
          <button onClick={() => setShowHealthForm(!showHealthForm)}>
            {showHealthForm ? "Cancel" : "+ Add Health Log"}
          </button>
        </div>

        {showHealthForm && (
          <div style={{ display: "grid", gap: 10 }}>
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

            <input placeholder="Symptoms" style={input}
              value={healthForm.symptoms}
              onChange={(e) => setHealthForm({ ...healthForm, symptoms: e.target.value })}
            />

            <button onClick={addHealthLog}>Save Log</button>
          </div>
        )}

        {healthLogs.map((log: any) => (
          <div key={log.id}>
            <span style={{ color: getColor(log.status) }}>●</span>
            {log.status} - {log.symptoms}
            <input
              type="checkbox"
              checked={log.resolved}
              onChange={() => toggleResolved(log.id)}
            />
            <button onClick={() => deleteHealthLog(log.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* ================= NOTES ================= */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>📝 Notes & Observations</h3>

          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            style={{ ...btn, background: "#3b82f6", color: "#fff" }}
          >
            {showNoteForm ? "Cancel" : "+ Add Note"}
          </button>
        </div>

        {/* FORM */}
        {showNoteForm && (
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            <input
              type="date"
              style={input}
              value={noteForm.date}
              onChange={(e) =>
                setNoteForm({ ...noteForm, date: e.target.value })
              }
            />

            <select
              style={input}
              value={noteForm.type}
              onChange={(e) =>
                setNoteForm({ ...noteForm, type: e.target.value })
              }
            >
              <option>General</option>
              <option>Concerns</option>
              <option>Planning</option>
            </select>

            <textarea
              placeholder="Description"
              style={input}
              value={noteForm.description}
              onChange={(e) =>
                setNoteForm({ ...noteForm, description: e.target.value })
              }
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={addNote}
                style={{ ...btn, background: "#16a34a", color: "#fff" }}
              >
                Save Note
              </button>

              <button
                onClick={() => setShowNoteForm(false)}
                style={{ ...btn, background: "#6b7280", color: "#fff" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* LIST */}
        {notes.length === 0 && <p>No notes yet</p>}

        {notes.map((n: any) => (
          <div
            key={n.id}
            style={{
              borderBottom: "1px solid #eee",
              padding: "8px 0",
            }}
          >
            <b>{n.type}</b> — {formatDate(n.date)}
            <div style={{ fontSize: 13 }}>{n.description}</div>

            <button
              onClick={() => deleteNote(n.id)}
              style={{ ...btn, background: "#ef4444", color: "#fff", marginTop: 5 }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}