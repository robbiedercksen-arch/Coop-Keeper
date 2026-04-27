import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  navigate,
}: any) {
  // 🩺 HEALTH FORM
  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const [editingLogId, setEditingLogId] = useState<number | null>(null);

  // 📝 NOTES FORM
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

  // -----------------------
  // 🩺 HEALTH LOG FUNCTIONS
  // -----------------------
  const saveHealthLog = () => {
    if (!healthForm.date) {
      alert("Date required");
      return;
    }

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

  const toggleResolved = (logId: number) => {
    const updatedLogs = selectedChicken.healthLogs.map((log: any) =>
      log.id === logId ? { ...log, resolved: !log.resolved } : log
    );

    updateChicken({
      ...selectedChicken,
      healthLogs: updatedLogs,
    });
  };

  // -----------------------
  // 📝 NOTES FUNCTIONS
  // -----------------------
  const saveNote = () => {
    if (!noteForm.date || !noteForm.description) {
      alert("Date and description required");
      return;
    }

    const newNote = {
      id: Date.now(),
      ...noteForm,
    };

    const updatedNotes = [
      ...(selectedChicken.notes || []),
      newNote,
    ];

    updateChicken({
      ...selectedChicken,
      notes: updatedNotes,
    });

    setNoteForm({
      date: "",
      type: "General",
      description: "",
    });
  };

  const deleteNote = (id: number) => {
    const updatedNotes = selectedChicken.notes.filter(
      (n: any) => n.id !== id
    );

    updateChicken({
      ...selectedChicken,
      notes: updatedNotes,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate("registry")}>← Back</button>

      <h2>{selectedChicken.name}</h2>

      {/* BASIC INFO */}
      <img
        src={selectedChicken.image}
        style={{ width: 150, borderRadius: 10 }}
      />

      <p><b>ID:</b> {selectedChicken.idTag}</p>
      <p><b>Breed:</b> {selectedChicken.breed}</p>
      <p><b>Status:</b> {selectedChicken.status}</p>

      {/* ========================= */}
      {/* 🩺 HEALTH SECTION */}
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

        <input
          placeholder="Treatment"
          value={healthForm.treatment}
          onChange={(e) =>
            setHealthForm({ ...healthForm, treatment: e.target.value })
          }
        />

        <textarea
          placeholder="Notes"
          value={healthForm.notes}
          onChange={(e) =>
            setHealthForm({ ...healthForm, notes: e.target.value })
          }
        />

        <button onClick={saveHealthLog} style={{ background: "green", color: "#fff" }}>
          {editingLogId ? "Update Log" : "Add Health Log"}
        </button>
      </div>

      {(selectedChicken.healthLogs || []).map((log: any) => (
        <div key={log.id} style={{ background: "#fff", padding: 10, marginTop: 10 }}>
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
      {/* 📝 NOTES SECTION */}
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

        <button
          onClick={saveNote}
          style={{ background: "#16a34a", color: "#fff" }}
        >
          Save Note
        </button>
      </div>

      {/* NOTES LIST */}
      {(selectedChicken.notes || []).map((note: any) => (
        <div
          key={note.id}
          style={{
            background: "#fff",
            padding: 10,
            marginTop: 10,
            borderRadius: 6,
          }}
        >
          <b>{note.date}</b> - {note.type}
          <p>{note.description}</p>

          <button
            onClick={() => deleteNote(note.id)}
            style={{ background: "red", color: "#fff" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}