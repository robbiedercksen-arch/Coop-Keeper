import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  navigate,
}: any) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...selectedChicken });

  // SAFE FALLBACKS
  const healthLogs = selectedChicken?.healthLogs || [];
  const notes = selectedChicken?.notes || [];

  // HEALTH FORM
  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const [editingLogId, setEditingLogId] = useState<number | null>(null);

  // NOTE FORM
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
    updateChicken({
      ...form,
      healthLogs,
      notes,
    });
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
    setHealthForm(log);
    setEditingLogId(log.id);
  };

  const toggleResolved = (id: number) => {
    const updatedLogs = healthLogs.map((log: any) =>
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
      return alert("Fill required fields");

    const newNote = {
      id: Date.now(),
      ...noteForm,
    };

    updateChicken({
      ...selectedChicken,
      notes: [...notes, newNote],
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
      notes: notes.filter((n: any) => n.id !== id),
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

      {/* EDIT / VIEW */}
      {editing ? (
        <div style={{ display: "grid", gap: 10, maxWidth: 400 }}>
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

          <button onClick={saveChicken}>Save</button>
        </div>
      ) : (
        <>
          <p><b>ID:</b> {selectedChicken.idTag}</p>
          <p><b>Status:</b> {selectedChicken.status}</p>

          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={deleteChicken}>Delete</button>
        </>
      )}

      {/* HEALTH */}
      <h3>🩺 Health Logs</h3>

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

      <button onClick={saveHealthLog}>
        {editingLogId ? "Update" : "Add"}
      </button>

      {healthLogs.map((log: any) => (
        <div key={log.id}>
          {log.date} - {log.status}

          <input
            type="checkbox"
            checked={log.resolved || false}
            onChange={() => toggleResolved(log.id)}
          />

          <button onClick={() => editHealthLog(log)}>Edit</button>
        </div>
      ))}

      {/* NOTES */}
      <h3>📝 Notes</h3>

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
        value={noteForm.description}
        onChange={(e) =>
          setNoteForm({ ...noteForm, description: e.target.value })
        }
      />

      <button onClick={saveNote}>Add Note</button>

      {notes.map((note: any) => (
        <div key={note.id}>
          {note.date} - {note.type}
          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}