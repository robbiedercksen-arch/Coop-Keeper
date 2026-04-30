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

  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [editingLog, setEditingLog] = useState<any>(null);
  const [editingNote, setEditingNote] = useState<any>(null);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
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
  const saveHealthLog = () => {
    if (!healthForm.date) return alert("Date required");

    if (editingLog) {
      const updated = healthLogs.map((l: any) =>
        l.id === editingLog.id ? { ...l, ...healthForm } : l
      );
      updateChicken({ ...selectedChicken, healthLogs: updated });
      setEditingLog(null);
    } else {
      const newLog = {
        id: Date.now(),
        ...healthForm,
        resolved: false,
      };
      updateChicken({
        ...selectedChicken,
        healthLogs: [...healthLogs, newLog],
      });
    }

    setHealthForm({ date: "", status: "Healthy", symptoms: "" });
    setShowHealthForm(false);
  };

  const editHealthLog = (log: any) => {
    setHealthForm(log);
    setEditingLog(log);
    setShowHealthForm(true);
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
  const saveNote = () => {
    if (!noteForm.date || !noteForm.description) {
      alert("Fill all fields");
      return;
    }

    if (editingNote) {
      const updated = notes.map((n: any) =>
        n.id === editingNote.id ? { ...n, ...noteForm } : n
      );
      updateChicken({ ...selectedChicken, notes: updated });
      setEditingNote(null);
    } else {
      const newNote = { id: Date.now(), ...noteForm };
      updateChicken({
        ...selectedChicken,
        notes: [...notes, newNote],
      });
    }

    setNoteForm({ date: "", type: "General", description: "" });
    setShowNoteForm(false);
  };

  const editNote = (note: any) => {
    setNoteForm(note);
    setEditingNote(note);
    setShowNoteForm(true);
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
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const premiumBtn = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
  };

  const input = {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "100%",
  };

  return (
    <div style={{ padding: 20, maxWidth: 1000 }}>

      <button onClick={() => navigate("registry")}>← Back</button>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          <img
            src={selectedChicken.image}
            style={{ width: 140, height: 140, borderRadius: 12 }}
          />

          <div>
            <h2>{selectedChicken.name}</h2>
            <div><b>ID Tag:</b> {selectedChicken.idTag}</div>
            <div><b>Breed:</b> {selectedChicken.breed}</div>
          </div>
        </div>
      </div>

      {/* HEALTH */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>🩺 Health Logs</h3>
          <button onClick={() => setShowHealthForm(!showHealthForm)} style={premiumBtn}>
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

            <input
              placeholder="Symptoms"
              style={input}
              value={healthForm.symptoms}
              onChange={(e) => setHealthForm({ ...healthForm, symptoms: e.target.value })}
            />

            <button onClick={saveHealthLog} style={premiumBtn}>
              Save Log
            </button>
          </div>
        )}

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <b>{log.status}</b> - {log.symptoms}
              <br />
              <input
                type="checkbox"
                checked={log.resolved}
                onChange={() => toggleResolved(log.id)}
              /> Solved
            </div>

            <div style={{ display: "flex", gap: 5 }}>
              <button style={{ ...btn, background: "#3b82f6", color: "#fff" }}>
                View
              </button>

              <button
                onClick={() => editHealthLog(log)}
                style={{ ...btn, background: "#6366f1", color: "#fff" }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteHealthLog(log.id)}
                style={{ ...btn, background: "#ef4444", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* NOTES */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>📝 Notes</h3>
          <button onClick={() => setShowNoteForm(!showNoteForm)} style={premiumBtn}>
            {showNoteForm ? "Cancel" : "+ Add Note"}
          </button>
        </div>

        {showNoteForm && (
          <div style={{ display: "grid", gap: 10 }}>
            <input type="date" style={input}
              value={noteForm.date}
              onChange={(e) => setNoteForm({ ...noteForm, date: e.target.value })}
            />

            <select style={input}
              value={noteForm.type}
              onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
            >
              <option>General</option>
              <option>Concerns</option>
              <option>Planning</option>
            </select>

            <textarea
              style={input}
              value={noteForm.description}
              onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
            />

            <button onClick={saveNote} style={premiumBtn}>
              Save Note
            </button>
          </div>
        )}

        {notes.map((n: any) => (
          <div key={n.id} style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <b>{n.type}</b> - {n.description}
            </div>

            <div style={{ display: "flex", gap: 5 }}>
              <button
                onClick={() => editNote(n)}
                style={{ ...btn, background: "#6366f1", color: "#fff" }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteNote(n.id)}
                style={{ ...btn, background: "#ef4444", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}