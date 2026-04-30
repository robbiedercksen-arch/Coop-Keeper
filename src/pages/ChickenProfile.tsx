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
  useEffect(() => {
    setChicken(selectedChicken);
  }, [selectedChicken]);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  const [showHealthForm, setShowHealthForm] = useState(false);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    idTag: "",
    breed: "",
    sex: "",
    ageGroup: "",
  });

  useEffect(() => {
    setProfileForm({
      name: chicken.name || "",
      idTag: chicken.idTag || "",
      breed: chicken.breed || "",
      sex: chicken.sex || "",
      ageGroup: chicken.ageGroup || "",
    });
  }, [chicken]);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteForm, setNoteForm] = useState({
    date: "",
    type: "General",
    description: "",
  });

  const healthLogs = chicken.healthLogs || [];
  const notes = chicken.notes || [];

  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  const saveProfile = () => {
    updateChicken({
      ...chicken,
      ...profileForm,
    });
    setEditingProfile(false);
  };

  const addNote = () => {
    if (!noteForm.description) return;

    updateChicken({
      ...chicken,
      notes: [...notes, { id: Date.now(), ...noteForm }],
    });

    setShowNoteForm(false);
    setNoteForm({ date: "", type: "General", description: "" });
  };

  const deleteNote = (id: number) => {
    updateChicken({
      ...chicken,
      notes: notes.filter((n: any) => n.id !== id),
    });
  };

  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const sectionTitle = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10,
  };

  const primary = {
    background: "#3b82f6",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
  };

  const success = {
    background: "#22c55e",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    width: "100%",
    marginBottom: 8,
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      {/* HEADER */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <button onClick={() => navigate("registry")} style={primary}>
          ← Back
        </button>

        <button onClick={() => setEditingProfile(!editingProfile)} style={primary}>
          ✏️ Edit Profile
        </button>
      </div>

      {/* PROFILE */}
      <div style={card}>
        {editingProfile ? (
          <>
            <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} style={inputStyle} />
            <input value={profileForm.idTag} onChange={(e) => setProfileForm({ ...profileForm, idTag: e.target.value })} style={inputStyle} />
            <input value={profileForm.breed} onChange={(e) => setProfileForm({ ...profileForm, breed: e.target.value })} style={inputStyle} />
            <input value={profileForm.sex} onChange={(e) => setProfileForm({ ...profileForm, sex: e.target.value })} style={inputStyle} />
            <input value={profileForm.ageGroup} onChange={(e) => setProfileForm({ ...profileForm, ageGroup: e.target.value })} style={inputStyle} />

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveProfile} style={success}>Save</button>
              <button onClick={() => setEditingProfile(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h1>{chicken.name}</h1>
            <div><b>ID Tag:</b> {chicken.idTag}</div>
            <div><b>Breed:</b> {chicken.breed}</div>
            <div><b>Sex:</b> {chicken.sex}</div>
            <div><b>Age:</b> {chicken.ageGroup}</div>
          </>
        )}
      </div>

      {/* NOTES & OBSERVATIONS (RESTORED) */}
      <div style={card}>
        <div style={sectionTitle}>📝 Notes & Observations</div>

        <button style={primary} onClick={() => setShowNoteForm(!showNoteForm)}>
          + Add Note
        </button>

        {showNoteForm && (
          <div style={{ marginTop: 10 }}>
            <input type="date" onChange={(e) => setNoteForm({ ...noteForm, date: e.target.value })} style={inputStyle} />

            <select onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })} style={inputStyle}>
              <option>General</option>
              <option>Concerns</option>
              <option>Planning</option>
            </select>

            <textarea placeholder="Description" onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })} style={inputStyle} />

            <button onClick={addNote} style={success}>Save Note</button>
          </div>
        )}

        {notes.map((note: any) => (
          <div key={note.id} style={{ marginTop: 10 }}>
            <b>{note.type}</b> — {note.description}

            <button
              onClick={() => deleteNote(note.id)}
              style={{
                marginLeft: 10,
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 6,
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}