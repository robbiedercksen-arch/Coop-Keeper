import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  setSelectedChicken,
  navigate,
}: any) {
  if (!selectedChicken) return <div style={{ padding: 20 }}>Loading...</div>;

  // ================= STATE =================
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [viewLog, setViewLog] = useState<any>(null);
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

  const healthLogs = selectedChicken.healthLogs || [];
  const notes = selectedChicken.notes || [];
  const album = selectedChicken.album || [];

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

  // ================= PHOTO ALBUM =================
  const handleAddPhoto = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateChicken({
        ...selectedChicken,
        album: [...album, reader.result],
      });
    };
    reader.readAsDataURL(file);
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

  const handleEditLog = (log: any) => {
    setHealthForm(log);
    setEditingLog(log);
    setShowHealthForm(true);
    setViewLog(null);
  };

  const deleteLog = (id: number) => {
    updateChicken({
      ...selectedChicken,
      healthLogs: healthLogs.filter((l: any) => l.id !== id),
    });
    setViewLog(null);
  };

  const toggleResolved = (id: number) => {
    updateChicken({
      ...selectedChicken,
      healthLogs: healthLogs.map((l: any) =>
        l.id === id ? { ...l, resolved: !l.resolved } : l
      ),
    });
  };

  // ================= NOTES =================
  const saveNote = () => {
    if (!noteForm.date || !noteForm.description) return alert("Fill all fields");

    if (editingNote) {
      const updated = notes.map((n: any) =>
        n.id === editingNote.id ? { ...n, ...noteForm } : n
      );
      updateChicken({ ...selectedChicken, notes: updated });
      setEditingNote(null);
    } else {
      updateChicken({
        ...selectedChicken,
        notes: [...notes, { id: Date.now(), ...noteForm }],
      });
    }

    setNoteForm({ date: "", type: "General", description: "" });
    setShowNoteForm(false);
  };

  const handleEditNote = (note: any) => {
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

  // ================= UI STYLES =================
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

  const primary = { ...btn, background: "#3b82f6", color: "#fff" };
  const success = { ...btn, background: "#22c55e", color: "#fff" };
  const danger = { ...btn, background: "#ef4444", color: "#fff" };

  const input = {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "100%",
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      {/* BACK */}
      <button onClick={() => navigate("registry")} style={primary}>
        ← Back
      </button>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          <img
            src={selectedChicken.image}
            style={{ width: 150, height: 150, borderRadius: 12 }}
          />
          <div>
            <h2>{selectedChicken.name}</h2>
            <div><b>ID Tag:</b> {selectedChicken.idTag}</div>
            <div><b>Breed:</b> {selectedChicken.breed}</div>
            <div><b>Sex:</b> {selectedChicken.sex}</div>
            <div><b>Age:</b> {selectedChicken.ageGroup}</div>
          </div>
        </div>
      </div>

      {/* PHOTO ALBUM */}
      <div style={card}>
        <h3>📸 Photo Album</h3>
        <input type="file" onChange={handleAddPhoto} />
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {album.map((img: any, i: number) => (
            <img key={i} src={img} style={{ width: 100, borderRadius: 8 }} />
          ))}
        </div>
      </div>

      {/* HEALTH */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        <button onClick={() => setShowHealthForm(!showHealthForm)} style={success}>
          + Add Health Log
        </button>

        {showHealthForm && (
          <div>
            <input type="date" style={input}
              value={healthForm.date}
              onChange={(e) => setHealthForm({ ...healthForm, date: e.target.value })}
            />
            <input
              placeholder="Symptoms"
              style={input}
              value={healthForm.symptoms}
              onChange={(e) => setHealthForm({ ...healthForm, symptoms: e.target.value })}
            />
            <button onClick={saveHealthLog}>Save</button>
          </div>
        )}

        {healthLogs.map((log: any) => (
          <div key={log.id}>
            {log.status} - {log.symptoms}
            <button onClick={() => setViewLog(log)}>View</button>
          </div>
        ))}
      </div>

      {/* NOTES */}
      <div style={card}>
        <h3>📝 Notes & Observations</h3>

        <button onClick={() => setShowNoteForm(!showNoteForm)} style={primary}>
          + Add Note
        </button>

        {showNoteForm && (
          <div>
            <input type="date" style={input}
              value={noteForm.date}
              onChange={(e) => setNoteForm({ ...noteForm, date: e.target.value })}
            />
            <textarea
              style={input}
              value={noteForm.description}
              onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
            />
            <button onClick={saveNote}>Save</button>
          </div>
        )}

        {notes.map((n: any) => (
          <div key={n.id}>
            {n.description}
            <button onClick={() => handleEditNote(n)}>Edit</button>
            <button onClick={() => deleteNote(n.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}