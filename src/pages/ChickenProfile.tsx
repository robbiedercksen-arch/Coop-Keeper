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
  const addHealthLog = () => {
    if (!healthForm.date) return alert("Date required");

    const newLog = { id: Date.now(), ...healthForm, resolved: false };

    updateChicken({
      ...selectedChicken,
      healthLogs: [...healthLogs, newLog],
    });

    setHealthForm({ date: "", status: "Healthy", symptoms: "" });
    setShowHealthForm(false);
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
  const addNote = () => {
    if (!noteForm.date || !noteForm.description)
      return alert("Fill all fields");

    updateChicken({
      ...selectedChicken,
      notes: [...notes, { id: Date.now(), ...noteForm }],
    });

    setNoteForm({ date: "", type: "General", description: "" });
    setShowNoteForm(false);
  };

  // ================= STYLES =================
  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const btn = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const primaryBtn = {
    ...btn,
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    color: "#fff",
  };

  const successBtn = {
    ...btn,
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
  };

  const input = {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "100%",
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      {/* 🔙 BACK */}
      <button onClick={() => navigate("registry")} style={primaryBtn}>
        ← Back to Registry
      </button>

      {/* ================= HEADER ================= */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <img
            src={selectedChicken.image}
            style={{
              width: 160,
              height: 160,
              borderRadius: 16,
              objectFit: "cover",
            }}
          />

          <div style={{ flex: 1 }}>
            <h2>{selectedChicken.name}</h2>
            <div><b>ID:</b> {selectedChicken.idTag}</div>
            <div><b>Breed:</b> {selectedChicken.breed}</div>
            <div><b>Sex:</b> {selectedChicken.sex}</div>
            <div><b>Age:</b> {selectedChicken.ageGroup}</div>
          </div>
        </div>
      </div>

      {/* ================= PHOTO ALBUM ================= */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>📸 Photo Album</h3>
          <input type="file" onChange={handleAddPhoto} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 120px)",
            gap: 10,
            marginTop: 10,
          }}
        >
          {album.map((img: any, i: number) => (
            <img
              key={i}
              src={img}
              style={{
                width: 120,
                height: 120,
                borderRadius: 10,
                objectFit: "cover",
              }}
            />
          ))}
        </div>
      </div>

      {/* ================= HEALTH ================= */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>🩺 Health Logs</h3>
          <button
            onClick={() => setShowHealthForm(!showHealthForm)}
            style={successBtn}
          >
            + Add Health Log
          </button>
        </div>

        {showHealthForm && (
          <div style={{ display: "grid", gap: 10 }}>
            <input type="date" style={input}
              value={healthForm.date}
              onChange={(e) =>
                setHealthForm({ ...healthForm, date: e.target.value })
              }
            />

            <select style={input}
              value={healthForm.status}
              onChange={(e) =>
                setHealthForm({ ...healthForm, status: e.target.value })
              }
            >
              <option>Healthy</option>
              <option>Sick</option>
              <option>Recovering</option>
            </select>

            <input
              placeholder="Symptoms"
              style={input}
              value={healthForm.symptoms}
              onChange={(e) =>
                setHealthForm({ ...healthForm, symptoms: e.target.value })
              }
            />

            <button onClick={addHealthLog} style={successBtn}>
              Save Log
            </button>
          </div>
        )}

        {healthLogs.map((l: any) => (
          <div key={l.id} style={{ marginTop: 10 }}>
            <span style={{ color: getColor(l.status) }}>●</span>{" "}
            {l.status} — {l.symptoms}

            <input
              type="checkbox"
              checked={l.resolved}
              onChange={() => toggleResolved(l.id)}
            /> Solved
          </div>
        ))}
      </div>

      {/* ================= NOTES ================= */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>📝 Notes</h3>
          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            style={primaryBtn}
          >
            + Add Note
          </button>
        </div>

        {showNoteForm && (
          <div style={{ display: "grid", gap: 10 }}>
            <input type="date" style={input}
              value={noteForm.date}
              onChange={(e) =>
                setNoteForm({ ...noteForm, date: e.target.value })
              }
            />

            <select style={input}
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
              style={input}
              placeholder="Description"
              value={noteForm.description}
              onChange={(e) =>
                setNoteForm({ ...noteForm, description: e.target.value })
              }
            />

            <button onClick={addNote} style={successBtn}>
              Save Note
            </button>
          </div>
        )}

        {notes.map((n: any) => (
          <div key={n.id}>
            <b>{n.type}</b> — {formatDate(n.date)}
            <div>{n.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}