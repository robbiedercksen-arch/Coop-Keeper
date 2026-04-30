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

  const [editingId, setEditingId] = useState<number | null>(null);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
  });

  const getPriority = (log: any) => {
    if (log.resolved) return 99;
    if (log.status === "Sick") return 1;
    if (log.status === "Recovering") return 2;
    return 3;
  };

  const healthLogs = (chicken.healthLogs || []).sort((a: any, b: any) => {
    const priorityDiff = getPriority(a) - getPriority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return b.id - a.id;
  });

  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

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
    setViewLog(null);
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
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #e5e7eb",
  };

  // ✅ FIXED NOTES COMPONENT
  const NotesSection = () => {
    const [showForm, setShowForm] = useState(false);
    const [noteForm, setNoteForm] = useState({
      date: "",
      type: "General",
      description: "",
    });
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

    const notes = chicken.notes || [];

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
        ...chicken,
        notes: updatedNotes,
      });

      setNoteForm({ date: "", type: "General", description: "" });
      setEditingNoteId(null);
      setShowForm(false);
    };

    return (
      <div style={card}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>
          📝 Notes & Observations
        </div>

        <button
          style={{ ...btn, background: "#6366f1", color: "#fff", marginBottom: 10 }}
          onClick={() => {
            setShowForm(!showForm);
            setEditingNoteId(null);
          }}
        >
          + Add Note
        </button>

        {showForm && (
          <>
            <input type="date" style={input}
              value={noteForm.date}
              onChange={(e)=>setNoteForm({...noteForm,date:e.target.value})}
            />

            <select style={input}
              value={noteForm.type}
              onChange={(e)=>setNoteForm({...noteForm,type:e.target.value})}
            >
              <option>General</option>
              <option>Concern</option>
              <option>Planning</option>
            </select>

            <input style={input}
              placeholder="Description"
              value={noteForm.description}
              onChange={(e)=>setNoteForm({...noteForm,description:e.target.value})}
            />

            <button
              style={{ ...btn, background: "#22c55e", color: "#fff" }}
              onClick={saveNote}
            >
              Save Note
            </button>
          </>
        )}

        {notes.map((note: any) => (
          <div key={note.id} style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 12,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              
              <div>
                <b>{note.type}</b> — {note.description}
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {note.date}
                </div>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => {
                    setNoteForm(note);
                    setEditingNoteId(note.id);
                    setShowForm(true);
                  }}
                  style={{
                    background: "#f59e0b",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 6px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  ✏
                </button>

                <button
                  onClick={() => {
                    updateChicken({
                      ...chicken,
                      notes: notes.filter((n: any) => n.id !== note.id),
                    });
                  }}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 6px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  🗑
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

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

      <NotesSection />

    </div>
  );
}