import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  navigate,
}: any) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...selectedChicken });

  const healthLogs = selectedChicken?.healthLogs || [];
  const notes = selectedChicken?.notes || [];

  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [viewLog, setViewLog] = useState<any | null>(null);

  const [viewNote, setViewNote] = useState<any | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

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

  if (!selectedChicken) return <div>No chicken selected</div>;

  const updateChicken = (updated: any) => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? updated : c))
    );
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

  // ================= CHICKEN =================
  const saveChicken = () => {
    updateChicken({ ...form, healthLogs, notes });
    setEditing(false);
  };

  const deleteChicken = () => {
    setChickens((prev: any[]) =>
      prev.filter((c) => c.id !== selectedChicken.id)
    );
    navigate("registry");
  };

  // ================= HEALTH =================
  const saveHealth = () => {
    if (!healthForm.date) return;

    let updatedLogs;

    if (editingLogId) {
      updatedLogs = healthLogs.map((log: any) =>
        log.id === editingLogId ? { ...log, ...healthForm } : log
      );
    } else {
      updatedLogs = [
        ...healthLogs,
        { id: Date.now(), ...healthForm },
      ];
    }

    updateChicken({
      ...selectedChicken,
      healthLogs: updatedLogs,
    });

    setHealthForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });

    setEditingLogId(null);
  };

  const editHealthLog = (log: any) => {
    setHealthForm(log);
    setEditingLogId(log.id);
  };

  const deleteHealthLog = (id: number) => {
    updateChicken({
      ...selectedChicken,
      healthLogs: healthLogs.filter((l: any) => l.id !== id),
    });
  };

  // ================= NOTES =================
  const saveNote = () => {
    if (!noteForm.date || !noteForm.description) return;

    let updatedNotes;

    if (editingNoteId) {
      updatedNotes = notes.map((n: any) =>
        n.id === editingNoteId ? { ...n, ...noteForm } : n
      );
    } else {
      updatedNotes = [
        ...notes,
        { id: Date.now(), ...noteForm },
      ];
    }

    updateChicken({
      ...selectedChicken,
      notes: updatedNotes,
    });

    setNoteForm({
      date: "",
      type: "General",
      description: "",
    });

    setEditingNoteId(null);
  };

  const editNote = (note: any) => {
    setNoteForm(note);
    setEditingNoteId(note.id);
  };

  const deleteNote = (id: number) => {
    updateChicken({
      ...selectedChicken,
      notes: notes.filter((n: any) => n.id !== id),
    });
  };

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <button onClick={() => navigate("registry")}>← Back</button>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          <img src={form.image} style={{ width: 150, borderRadius: 12 }} />

          <div style={{ flex: 1 }}>
            <h2>{form.name}</h2>
            <p><b>ID:</b> {form.idTag}</p>
            <p><b>Status:</b> {form.status}</p>

            <button
              style={{ ...btn, background: "#3b82f6", color: "#fff" }}
              onClick={() => setEditing(true)}
            >
              Edit
            </button>

            <button
              style={{ ...btn, background: "#ef4444", color: "#fff", marginLeft: 10 }}
              onClick={deleteChicken}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* HEALTH */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

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

        <textarea style={input} placeholder="Notes"
          value={healthForm.notes}
          onChange={(e) => setHealthForm({ ...healthForm, notes: e.target.value })}
        />

        <button style={{ ...btn, background: "#f59e0b", color: "#fff" }} onClick={saveHealth}>
          {editingLogId ? "Update" : "Add"}
        </button>

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
            {log.date} — {log.status}

            <div>
              <button style={btn} onClick={() => setViewLog(log)}>View</button>
              <button style={btn} onClick={() => editHealthLog(log)}>Edit</button>
              <button style={btn} onClick={() => deleteHealthLog(log.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* NOTES */}
      <div style={card}>
        <h3>📝 Notes & Observations</h3>

        <input type="date" style={input}
          value={noteForm.date}
          onChange={(e) => setNoteForm({ ...noteForm, date: e.target.value })}
        />

        <select style={input}
          value={noteForm.type}
          onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
        >
          <option>General</option>
          <option>Concern</option>
          <option>Plan</option>
        </select>

        <textarea style={input} placeholder="Description"
          value={noteForm.description}
          onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
        />

        <button style={{ ...btn, background: "#6366f1", color: "#fff" }} onClick={saveNote}>
          {editingNoteId ? "Update Note" : "Add Note"}
        </button>

        {notes.map((note: any) => (
          <div key={note.id} style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
            {note.date} — {note.type}

            <div>
              <button style={btn} onClick={() => setViewNote(note)}>View</button>
              <button style={btn} onClick={() => editNote(note)}>Edit</button>
              <button style={btn} onClick={() => deleteNote(note.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW NOTE */}
      {viewNote && (
        <div style={card}>
          <h3>📋 Note Details</h3>
          <p><b>Date:</b> {viewNote.date}</p>
          <p><b>Type:</b> {viewNote.type}</p>
          <p><b>Description:</b> {viewNote.description}</p>

          <button style={btn} onClick={() => setViewNote(null)}>Close</button>
        </div>
      )}

      {/* VIEW HEALTH */}
      {viewLog && (
        <div style={card}>
          <h3>📋 Health Details</h3>
          <p><b>Date:</b> {viewLog.date}</p>
          <p><b>Status:</b> {viewLog.status}</p>
          <p><b>Notes:</b> {viewLog.notes}</p>

          <button style={btn} onClick={() => setViewLog(null)}>Close</button>
        </div>
      )}
    </div>
  );
}