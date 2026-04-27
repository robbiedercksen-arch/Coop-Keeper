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

  // ---------------- BUTTON STYLE ----------------
  const btn = {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  // ---------------- SAVE CHICKEN ----------------
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

  // ---------------- HEALTH ----------------
  const addHealthLog = () => {
    if (!healthForm.date) return alert("Date required");

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

  // ---------------- NOTES ----------------
  const addNote = () => {
    if (!noteForm.date || !noteForm.description)
      return alert("Fill required fields");

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

      {/* ================= PROFILE CARD ================= */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          <img
            src={form.image}
            style={{ width: 150, borderRadius: 12 }}
          />

          <div>
            <h2>{form.name}</h2>
            <p><b>ID:</b> {form.idTag}</p>
            <p><b>Status:</b> {form.status}</p>

            {!editing ? (
              <>
                <button
                  style={{ ...btn, background: "#3b82f6", color: "#fff", marginRight: 10 }}
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>

                <button
                  style={{ ...btn, background: "#ef4444", color: "#fff" }}
                  onClick={deleteChicken}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option>Active</option>
                  <option>Sold</option>
                  <option>Culled</option>
                </select>

                <br /><br />

                <button
                  style={{ ...btn, background: "green", color: "#fff" }}
                  onClick={saveChicken}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= HEALTH ================= */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        <div style={grid}>
          <input
            type="date"
            value={healthForm.date}
            onChange={(e) =>
              setHealthForm({ ...healthForm, date: e.target.value })
            }
          />

          <select
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
            value={healthForm.symptoms}
            onChange={(e) =>
              setHealthForm({ ...healthForm, symptoms: e.target.value })
            }
          />

          <input
            placeholder="Treatment"
            value={healthForm.treatment}
            onChange={(e) =>
              setHealthForm({ ...healthForm, treatment: e.target.value })
            }
          />
        </div>

        <textarea
          placeholder="Notes"
          value={healthForm.notes}
          onChange={(e) =>
            setHealthForm({ ...healthForm, notes: e.target.value })
          }
          style={{ width: "100%", marginTop: 10 }}
        />

        <button
          style={{ ...btn, background: "#f59e0b", color: "#fff", marginTop: 10 }}
          onClick={addHealthLog}
        >
          Add Health Record
        </button>

        <hr />

        {healthLogs.map((log: any) => (
          <div key={log.id} style={listItem}>
            {log.date} - {log.status}
          </div>
        ))}
      </div>

      {/* ================= NOTES ================= */}
      <div style={card}>
        <h3>📝 Notes & Observations</h3>

        <div style={grid}>
          <input
            type="date"
            value={noteForm.date}
            onChange={(e) =>
              setNoteForm({ ...noteForm, date: e.target.value })
            }
          />

          <select
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
          placeholder="Description"
          value={noteForm.description}
          onChange={(e) =>
            setNoteForm({ ...noteForm, description: e.target.value })
          }
          style={{ width: "100%", marginTop: 10 }}
        />

        <button
          style={{ ...btn, background: "#6366f1", color: "#fff", marginTop: 10 }}
          onClick={addNote}
        >
          Add Note
        </button>

        <hr />

        {notes.map((note: any) => (
          <div key={note.id} style={listItem}>
            {note.date} - {note.type}
          </div>
        ))}
      </div>
    </div>
  );
}

// ================= STYLES =================
const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 10,
};

const listItem = {
  padding: 10,
  borderBottom: "1px solid #eee",
};