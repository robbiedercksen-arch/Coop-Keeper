import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  navigate,
}: any) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...selectedChicken });

  // HEALTH
  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const [editingLogId, setEditingLogId] = useState<number | null>(null);

  // NOTES
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

  // -------------------
  // EDIT CHICKEN
  // -------------------
  const saveChicken = () => {
    updateChicken(form);
    setEditing(false);
  };

  const deleteChicken = () => {
    setChickens((prev: any[]) =>
      prev.filter((c) => c.id !== selectedChicken.id)
    );
    navigate("registry");
  };

  // -------------------
  // HEALTH LOGS
  // -------------------
  const saveHealthLog = () => {
    if (!healthForm.date) return alert("Date required");

    let updatedLogs;

    if (editingLogId) {
      updatedLogs = selectedChicken.healthLogs.map((log: any) =>
        log.id === editingLogId ? { ...log, ...healthForm } : log
      );
    } else {
      updatedLogs = [
        ...(selectedChicken.healthLogs || []),
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
    setHealthForm(log);
    setEditingLogId(log.id);
  };

  const toggleResolved = (id: number) => {
    const updatedLogs = selectedChicken.healthLogs.map((log: any) =>
      log.id === id ? { ...log, resolved: !log.resolved } : log
    );

    updateChicken({
      ...selectedChicken,
      healthLogs: updatedLogs,
    });
  };

  // -------------------
  // NOTES
  // -------------------
  const saveNote = () => {
    if (!noteForm.date || !noteForm.description)
      return alert("Fill all required fields");

    const newNote = {
      id: Date.now(),
      ...noteForm,
    };

    updateChicken({
      ...selectedChicken,
      notes: [...(selectedChicken.notes || []), newNote],
    });

    setNoteForm({
      date: "",
      type: "General",
      description: "",
    });
  };

  const deleteNote = (id: number) => {
    updateChicken({
      ...selectedChicken,
      notes: selectedChicken.notes.filter((n: any) => n.id !== id),
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate("registry")}>← Back</button>

      <h2>{editing ? "Edit Chicken" : selectedChicken.name}</h2>

      <img
        src={form.image}
        style={{ width: 150, borderRadius: 10 }}
      />

      {/* ========================= */}
      {/* EDIT / VIEW */}
      {/* ========================= */}
      {editing ? (
        <div style={{ display: "grid", gap: 10, maxWidth: 400 }}>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Active</option>
            <option>Sold</option>
            <option>Culled</option>
          </select>

          <button onClick={saveChicken} style={{ background: "green", color: "#fff" }}>
            Save
          </button>
        </div>
      ) : (
        <>
          <p><b>ID:</b> {selectedChicken.idTag}</p>
          <p><b>Status:</b> {selectedChicken.status}</p>

          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={deleteChicken} style={{ marginLeft: 10 }}>
            Delete
          </button>
        </>
      )}

      {/* ========================= */}
      {/* HEALTH */}
      {/* ========================= */}
      <h3 style={{ marginTop: 30 }}>🩺 Health Logs</h3>

      <div style={{ display: "grid", gap: 10, maxWidth: 400 }}>
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

        <button onClick={saveHealthLog}>
          {editingLogId ? "Update Log" : "Add Log"}
        </button>
      </div>

      {(selectedChicken.healthLogs || []).map((log: any) => (
        <div key={log.id} style={{ background: "#fff", marginTop: 10, padding: 10 }}>
          <b>{log.date}</b> - {log.status}

          <label>
            <input
              type="checkbox"
              checked={log.resolved || false}
              onChange={() => toggleResolved(log.id)}
            /> Resolved
          </label>

          <button onClick={() => editHealthLog(log)}>Edit</button>
        </div>
      ))}

      {/* ========================= */}
      {/* NOTES */}
      {/* ========================= */}
      <h3 style={{ marginTop: 30 }}>📝 Notes & Observations</h3>

      <div style={{ display: "grid", gap: 10, maxWidth: 400 }}>
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

        <textarea
          placeholder="Description"
          value={noteForm.description}
          onChange={(e) =>
            setNoteForm({ ...noteForm, description: e.target.value })
          }
        />

        <button onClick={saveNote}>Save Note</button>
      </div>

      {(selectedChicken.notes || []).map((note: any) => (
        <div key={note.id} style={{ background: "#fff", marginTop: 10, padding: 10 }}>
          <b>{note.date}</b> - {note.type}
          <p>{note.description}</p>

          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}