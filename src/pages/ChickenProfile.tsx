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
  const [viewLog, setViewLog] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
  });

  const [editingChicken, setEditingChicken] = useState(false);

  const [editForm, setEditForm] = useState({
    name: chicken.name || "",
    idTag: chicken.idTag || "",
    breed: chicken.breed || "",
    sex: chicken.sex || "Hen",
    ageGroup: chicken.ageGroup || "",
  });

  const getPriority = (log: any) => {
    if (log.resolved) return 99;
    if (log.status === "Sick") return 1;
    if (log.status === "Recovering") return 2;
    return 3;
  };

  const healthLogs = (chicken.healthLogs || []).sort((a: any, b: any) => {
    const diff = getPriority(a) - getPriority(b);
    return diff !== 0 ? diff : b.id - a.id;
  });

  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  const saveChickenInfo = () => {
    updateChicken({ ...chicken, ...editForm });
    setEditingChicken(false);
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
    setEditingId(null);
    setViewLog(null);
    setShowHealthForm(false);
  };

  const getColor = (status: string) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "Sick") return "#ef4444";
    return "#eab308";
  };

  const card = {
    background: "rgba(255,255,255,0.75)",
    padding: 16,
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    marginBottom: 16,
  };

  const btn = {
    width: "100%",
    minHeight: 44,
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const input = {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  };

  const sectionTitle = {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
  };

  // 📝 NOTES
  const NotesSection = () => {
    const [showForm, setShowForm] = useState(false);
    const [viewNote, setViewNote] = useState<any>(null);

    const [noteForm, setNoteForm] = useState({
      date: "",
      type: "General",
      description: "",
    });

    const notes = chicken.notes || [];

    const saveNote = () => {
      if (!noteForm.description) return;

      updateChicken({
        ...chicken,
        notes: [...notes, { id: Date.now(), ...noteForm }],
      });

      setShowForm(false);
      setNoteForm({ date: "", type: "General", description: "" });
    };

    return (
      <div style={card}>
        <div style={sectionTitle}>📝 Notes</div>

        <button
          style={{ ...btn, background: "#6366f1", color: "#fff" }}
          onClick={() => setShowForm(!showForm)}
        >
          + Add Note
        </button>

        {showForm && (
          <>
            <input
              style={input}
              placeholder="Description"
              value={noteForm.description}
              onChange={(e) =>
                setNoteForm({ ...noteForm, description: e.target.value })
              }
            />

            <button
              style={{ ...btn, background: "#22c55e", color: "#fff" }}
              onClick={saveNote}
            >
              Save
            </button>
          </>
        )}

        {notes.map((note: any) => (
          <div key={note.id} style={{ marginTop: 10 }}>
            {note.description}
            <button onClick={() => setViewNote(note)}>View</button>
          </div>
        ))}

        {/* NOTE MODAL */}
        {viewNote && (
          <div
            onClick={() => setViewNote(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", padding: 20, borderRadius: 12 }}
            >
              <p>{viewNote.description}</p>

              <button onClick={() => setViewNote(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: 16 }}>

      <button onClick={() => navigate("registry")}>← Back</button>

      {/* PROFILE */}
      <div style={card}>
        <h2>{chicken.name}</h2>
      </div>

      <NotesSection />

      {/* PHOTO */}
      <div style={card}>
        <div style={sectionTitle}>📸 Photos</div>

        <input
          type="file"
          multiple
          onChange={(e: any) => {
            const files = Array.from(e.target.files);

            Promise.all(
              files.map(
                (file: any) =>
                  new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                  })
              )
            ).then((images: any) => {
              updateChicken({
                ...chicken,
                album: [...(chicken.album || []), ...images],
              });
            });
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {(chicken.album || []).map((img: any, i: number) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveImage(img)}
              style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
            />
          ))}
        </div>
      </div>

      {/* IMAGE MODAL */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={activeImage} style={{ maxWidth: "90%" }} />
        </div>
      )}

    </div>
  );
}