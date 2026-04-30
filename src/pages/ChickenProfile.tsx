import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  setSelectedChicken,
  navigate,
}: any) {
  if (!selectedChicken) return <div style={{ padding: 20 }}>Loading...</div>;

  // ================= STATE =================
  const [viewLog, setViewLog] = useState<any>(null);
  const [viewNote, setViewNote] = useState<any>(null);

  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

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
    const files = Array.from(e.target.files);

    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateChicken({
          ...selectedChicken,
          album: [...album, reader.result],
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // ================= HEALTH =================
  const toggleResolved = (id: number) => {
    updateChicken({
      ...selectedChicken,
      healthLogs: healthLogs.map((l: any) =>
        l.id === id ? { ...l, resolved: !l.resolved } : l
      ),
    });
  };

  // ================= NOTES =================
  const deleteNote = (id: number) => {
    updateChicken({
      ...selectedChicken,
      notes: notes.filter((n: any) => n.id !== id),
    });
    setViewNote(null);
  };

  // ================= STYLES =================
  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const sectionTitle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10,
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

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      {/* BACK */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("registry")} style={primary}>
          ← Back to Registry
        </button>
      </div>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          <img
            src={selectedChicken.image}
            style={{
              width: 150,
              height: 150,
              borderRadius: 12,
              objectFit: "cover",
            }}
          />

          <div>
            <h1 style={{ margin: 0 }}>{selectedChicken.name}</h1>

            <div style={{ marginTop: 10 }}>
              <div><b>ID Tag:</b> {selectedChicken.idTag}</div>
              <div><b>Breed:</b> {selectedChicken.breed}</div>
              <div><b>Sex:</b> {selectedChicken.sex}</div>
              <div><b>Age:</b> {selectedChicken.ageGroup}</div>
            </div>
          </div>
        </div>
      </div>

      {/* PHOTO ALBUM */}
      <div style={card}>
        <div style={sectionTitle}>📸 Photo Album</div>

        <label style={success}>
          + Add Photos
          <input
            type="file"
            multiple
            onChange={handleAddPhoto}
            style={{ display: "none" }}
          />
        </label>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {album.map((img: any, i: number) => (
            <img key={i} src={img} style={{ width: 100, borderRadius: 8 }} />
          ))}
        </div>
      </div>

      {/* HEALTH */}
      <div style={card}>
        <div style={sectionTitle}>🩺 Health Logs</div>

        <button style={success}>+ Add Health Log</button>

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginTop: 10 }}>
            <b>{log.status}</b> — {log.symptoms}

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={log.resolved}
                  onChange={() => toggleResolved(log.id)}
                />{" "}
                ✔ Resolved
              </label>
            </div>

            <button onClick={() => setViewLog(log)}>View</button>
          </div>
        ))}
      </div>

      {/* NOTES */}
      <div style={card}>
        <div style={sectionTitle}>📝 Notes & Observations</div>

        <button style={primary}>+ Add Note</button>

        {notes.map((n: any) => (
          <div key={n.id} style={{ marginTop: 10 }}>
            {n.description}

            <div>
              <button onClick={() => setViewNote(n)}>View</button>
            </div>
          </div>
        ))}
      </div>

      {/* NOTE VIEW */}
      {viewNote && (
        <div style={card}>
          <h3>Note Details</h3>
          <p>{viewNote.description}</p>

          <button style={primary}>Edit</button>
          <button style={danger} onClick={() => deleteNote(viewNote.id)}>
            Delete
          </button>
          <button onClick={() => setViewNote(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}