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
  useEffect(() => setChicken(selectedChicken), [selectedChicken]);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  const [viewNote, setViewNote] = useState<any>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const [showHealthForm, setShowHealthForm] = useState(false);
  const [viewLog, setViewLog] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
  });

  const [editingChicken, setEditingChicken] = useState(false);

  const [editForm, setEditForm] = useState({
    name: chicken.name || "",
    idTag: chicken.idTag || "",
    breed: chicken.breed || "",
    sex: chicken.sex || "Hen",
    ageGroup: chicken.ageGroup || "",
  });

  const [noteForm, setNoteForm] = useState({
    date: "",
    type: "General",
    description: "",
  });

  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  const saveNote = () => {
    if (!noteForm.date || !noteForm.description) return;

    const notes = chicken.notes || [];

    const updatedNotes = editingNoteId
      ? notes.map((n: any) =>
          n.id === editingNoteId ? { ...n, ...noteForm } : n
        )
      : [...notes, { id: Date.now(), ...noteForm }];

    updateChicken({ ...chicken, notes: updatedNotes });

    setNoteForm({ date: "", type: "General", description: "" });
    setEditingNoteId(null);
    setViewNote(null);
  };

  const card = {
    background: "rgba(255,255,255,0.75)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  };

  const btn = {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const input = {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  };

  const sectionTitle = {
    fontWeight: 700,
    marginBottom: 10,
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>

      {/* PROFILE */}
      <div style={card}>
        <h2>🐔 {chicken.name}</h2>
        <div>ID: {chicken.idTag}</div>
        <div>Breed: {chicken.breed}</div>
      </div>

      {/* NOTES */}
      <div style={card}>
        <div style={sectionTitle}>📝 Notes</div>

        {(chicken.notes || []).map((note: any) => (
          <div key={note.id} style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8
          }}>
            <span>{note.description}</span>
            <button onClick={() => setViewNote(note)}>View</button>
          </div>
        ))}
      </div>

      {/* NOTE MODAL */}
      {viewNote && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>

            {editingNoteId === viewNote.id ? (
              <>
                <input
                  style={input}
                  value={noteForm.description}
                  onChange={(e)=>setNoteForm({...noteForm,description:e.target.value})}
                />
                <button onClick={saveNote}>Save</button>
              </>
            ) : (
              <>
                <p>{viewNote.description}</p>

                <button onClick={() => {
                  setNoteForm(viewNote);
                  setEditingNoteId(viewNote.id);
                }}>
                  Edit
                </button>

                <button onClick={() => {
                  updateChicken({
                    ...chicken,
                    notes: chicken.notes.filter((n:any)=>n.id !== viewNote.id)
                  });
                  setViewNote(null);
                }}>
                  Delete
                </button>
              </>
            )}

            <button onClick={() => {
              setViewNote(null);
              setEditingNoteId(null);
            }}>
              Close
            </button>

          </div>
        </div>
      )}

      {/* PHOTO GRID */}
      <div style={card}>
        <div style={sectionTitle}>📸 Photos</div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8
        }}>
          {(chicken.album || []).map((img:any,i:number)=>(
            <img
              key={i}
              src={img}
              onClick={()=>setActiveImage(img)}
              style={{ width:"100%", borderRadius:10 }}
            />
          ))}
        </div>
      </div>

      {/* IMAGE MODAL */}
      {activeImage && (
        <div onClick={()=>setActiveImage(null)} style={{
          position:"fixed",
          top:0,left:0,width:"100%",height:"100%",
          background:"rgba(0,0,0,0.8)",
          display:"flex",
          justifyContent:"center",
          alignItems:"center"
        }}>
          <img src={activeImage} style={{ maxWidth:"90%" }} />
        </div>
      )}

    </div>
  );
}