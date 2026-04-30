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

    setHealthForm({ date: "", status: "Healthy", symptoms: "" });
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
      alert("Fill all fields");
      return;
    }

    const newNote = { id: Date.now(), ...noteForm };

    updateChicken({
      ...selectedChicken,
      notes: [...notes, newNote],
    });

    setNoteForm({ date: "", type: "General", description: "" });
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

  return (
    <div style={{ padding: 20, maxWidth: 1000 }}>

      {/* BACK */}
      <button
        onClick={() => navigate("registry")}
        style={{ ...btn, background: "#3b82f6", color: "#fff", marginBottom: 20 }}
      >
        ← Back
      </button>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>

          {/* IMAGE */}
          <img
            src={selectedChicken.image}
            style={{
              width: 140,
              height: 140,
              borderRadius: 12,
              objectFit: "cover",
            }}
          />

          {/* DETAILS */}
          <div>
            <h2>{selectedChicken.name}</h2>

            <div><b>ID Tag:</b> {selectedChicken.idTag}</div>
            <div><b>Breed:</b> {selectedChicken.breed}</div>
            <div><b>Sex:</b> {selectedChicken.sex}</div>
            <div><b>Age:</b> {selectedChicken.ageGroup}</div>
            <div><b>Added:</b> {formatDate(selectedChicken.hatchDate)}</div>
          </div>
        </div>
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
            <input
              type="date"
              style={input}
              value={healthForm.date}
              onChange={(e) =>
                setHealthForm({ ...healthForm, date: e.target.value })
              }
            />

            <select
              style={input}
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

            <button onClick={addHealthLog}>Save</button>
          </div>
        )}

        {/* LIST */}
        {healthLogs.map((log: any) => (
          <div
            key={log.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #eee",
              padding: "10px 0",
            }}
          >
            {/* LEFT */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: log.resolved ? "#22c55e" : getColor(log.status),
                  }}
                />
                <b>{log.status}</b>
              </div>

              <div style={{ fontSize: 12, marginLeft: 20 }}>
                {log.symptoms}
              </div>

              <label style={{ fontSize: 12, marginLeft: 20 }}>
                <input
                  type="checkbox"
                  checked={log.resolved}
                  onChange={() => toggleResolved(log.id)}
                />{" "}
                Health Issue Solved
              </label>
            </div>

            {/* RIGHT */}
            <button
              onClick={() => deleteHealthLog(log.id)}
              style={{ ...btn, background: "#ef4444", color: "#fff" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ================= NOTES ================= */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>📝 Notes</h3>
          <button onClick={() => setShowNoteForm(!showNoteForm)}>
            {showNoteForm ? "Cancel" : "+ Add Note"}
          </button>
        </div>

        {showNoteForm && (
          <div style={{ display: "grid", gap: 10 }}>
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
              style={input}
              placeholder="Description"
              value={noteForm.description}
              onChange={(e) =>
                setNoteForm({ ...noteForm, description: e.target.value })
              }
            />

            <button onClick={addNote}>Save Note</button>
          </div>
        )}

        {notes.map((n: any) => (
          <div key={n.id}>
            <b>{n.type}</b> - {formatDate(n.date)}
            <div>{n.description}</div>
            <button onClick={() => deleteNote(n.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}