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

  const btnPrimary = {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#22c55e",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  };

  const btnSecondary = {
    ...btnPrimary,
    background: "#3b82f6",
  };

  const btnDanger = {
    ...btnPrimary,
    background: "#ef4444",
  };

  const grid2 = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  };

  // ================= ACTIONS =================
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

  const addHealth = () => {
    if (!healthForm.date) return;

    updateChicken({
      ...selectedChicken,
      healthLogs: [
        ...healthLogs,
        { id: Date.now(), ...healthForm, resolved: false },
      ],
    });

    setHealthForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });
  };

  const addNote = () => {
    if (!noteForm.date || !noteForm.description) return;

    updateChicken({
      ...selectedChicken,
      notes: [...notes, { id: Date.now(), ...noteForm }],
    });

    setNoteForm({
      date: "",
      type: "General",
      description: "",
    });
  };

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <button onClick={() => navigate("registry")}>← Back</button>

      {/* ================= PROFILE ================= */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          <img
            src={form.image}
            style={{ width: 150, borderRadius: 12 }}
          />

          <div style={{ flex: 1 }}>
            {!editing ? (
              <>
                <h2>{form.name}</h2>
                <p><b>ID:</b> {form.idTag}</p>
                <p><b>Status:</b> {form.status}</p>

                <button
                  style={btnSecondary}
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>

                <button
                  style={{ ...btnDanger, marginLeft: 10 }}
                  onClick={deleteChicken}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <input
                  style={input}
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />

                <select
                  style={{ ...input, marginTop: 10 }}
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option>Active</option>
                  <option>Sold</option>
                  <option>Culled</option>
                </select>

                <button
                  style={{ ...btnPrimary, marginTop: 10 }}
                  onClick={saveChicken}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= HEALTH ================= */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        <div style={grid2}>
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
            style={input}
            placeholder="Symptoms"
            value={healthForm.symptoms}
            onChange={(e) =>
              setHealthForm({ ...healthForm, symptoms: e.target.value })
            }
          />

          <input
            style={input}
            placeholder="Treatment"
            value={healthForm.treatment}
            onChange={(e) =>
              setHealthForm({ ...healthForm, treatment: e.target.value })
            }
          />
        </div>

        <textarea
          style={{ ...input, marginTop: 10 }}
          placeholder="Notes"
          value={healthForm.notes}
          onChange={(e) =>
            setHealthForm({ ...healthForm, notes: e.target.value })
          }
        />

        <button
          style={{ ...btnPrimary, marginTop: 10 }}
          onClick={addHealth}
        >
          Add Health Record
        </button>

        <hr />

        {healthLogs.map((log: any) => (
          <div key={log.id} style={listItem}>
            {log.date} — {log.status}
          </div>
        ))}
      </div>

      {/* ================= NOTES ================= */}
      <div style={card}>
        <h3>📝 Notes & Observations</h3>

        <div style={grid2}>
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
            <option>Concern</option>
            <option>Plan</option>
          </select>
        </div>

        <textarea
          style={{ ...input, marginTop: 10 }}
          placeholder="Description"
          value={noteForm.description}
          onChange={(e) =>
            setNoteForm({ ...noteForm, description: e.target.value })
          }
        />

        <button
          style={{ ...btnSecondary, marginTop: 10 }}
          onClick={addNote}
        >
          Add Note
        </button>

        <hr />

        {notes.map((note: any) => (
          <div key={note.id} style={listItem}>
            {note.date} — {note.type}
          </div>
        ))}
      </div>
    </div>
  );
}

// LIST ITEM STYLE
const listItem = {
  padding: 10,
  borderBottom: "1px solid #eee",
};