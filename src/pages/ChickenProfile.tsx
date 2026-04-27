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
        { id: Date.now(), ...healthForm, resolved: false },
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
    setHealthForm({
      date: log.date || "",
      status: log.status || "Healthy",
      symptoms: log.symptoms || "",
      treatment: log.treatment || "",
      notes: log.notes || "",
    });

    setEditingLogId(log.id);
  };

  const deleteHealthLog = (id: number) => {
    const updated = healthLogs.filter((log: any) => log.id !== id);

    updateChicken({
      ...selectedChicken,
      healthLogs: updated,
    });
  };

  // ================= NOTES =================
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
                  style={{ ...btn, background: "green", color: "#fff", marginTop: 10 }}
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
          style={{ ...btn, background: "#f59e0b", color: "#fff", marginTop: 10 }}
          onClick={saveHealth}
        >
          {editingLogId ? "Update Health Record" : "Add Health Record"}
        </button>

        <hr />

        {healthLogs.map((log: any) => (
          <div
            key={log.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              borderBottom: "1px solid #eee",
            }}
          >
            <span>
              {log.date} — {log.status}
            </span>

            <div>
              <button
                style={{ ...btn, background: "#3b82f6", color: "#fff", marginRight: 5 }}
                onClick={() => editHealthLog(log)}
              >
                Edit
              </button>

              <button
                style={{ ...btn, background: "#ef4444", color: "#fff" }}
                onClick={() => deleteHealthLog(log.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= NOTES ================= */}
      <div style={card}>
        <h3>📝 Notes & Observations</h3>

        <input
          type="date"
          style={input}
          value={noteForm.date}
          onChange={(e) =>
            setNoteForm({ ...noteForm, date: e.target.value })
          }
        />

        <select
          style={{ ...input, marginTop: 10 }}
          value={noteForm.type}
          onChange={(e) =>
            setNoteForm({ ...noteForm, type: e.target.value })
          }
        >
          <option>General</option>
          <option>Concern</option>
          <option>Plan</option>
        </select>

        <textarea
          style={{ ...input, marginTop: 10 }}
          placeholder="Description"
          value={noteForm.description}
          onChange={(e) =>
            setNoteForm({ ...noteForm, description: e.target.value })
          }
        />

        <button
          style={{ ...btn, background: "#6366f1", color: "#fff", marginTop: 10 }}
          onClick={addNote}
        >
          Add Note
        </button>

        <hr />

        {notes.map((note: any) => (
          <div key={note.id} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
            {note.date} — {note.type}
          </div>
        ))}
      </div>
    </div>
  );
}