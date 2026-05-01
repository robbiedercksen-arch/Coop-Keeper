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

  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  // ================= NOTES =================

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

  // ================= HEALTH =================

  const saveHealth = () => {
    if (!healthForm.date) return;

    updateChicken({
      ...chicken,
      healthLogs: [
        ...(chicken.healthLogs || []),
        { id: Date.now(), ...healthForm },
      ],
    });

    setHealthForm({ date: "", status: "Healthy", symptoms: "" });
    setShowHealthForm(false);
  };

  const getColor = (status: string) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "Sick") return "#ef4444";
    return "#eab308";
  };

  // ================= STYLES =================

  const card = {
    background: "rgba(255,255,255,0.85)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
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

  // ================= UI =================

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>

      {/* PROFILE */}
      <div style={card}>
        {chicken.image && (
          <img
            src={chicken.image}
            style={{
              width: "100%",
              maxWidth: 220,
              borderRadius: 16,
              display: "block",
              margin: "0 auto 10px"
            }}
          />
        )}

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

      {/* PHOTO SECTION */}
      <div style={card}>
        <div style={sectionTitle}>📸 Photos</div>

        <label style={{ ...btn, background: "#22c55e", color: "#fff" }}>
          + Add Photos
          <input
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e: any) => {
              const files = Array.from(e.target.files);

              Promise.all(
                files.map(
                  (file: any) =>
                    new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result);
                      reader.readAsDataURL(file);
                    })
                )
              ).then((images: any) => {
                updateChicken({
                  ...chicken,
                  album: [...(chicken.album || []), ...images],
                });
              });
            }}
          />
        </label>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
          marginTop: 10
        }}>
          {(chicken.album || []).map((img:any,i:number)=>(
            <div key={i} style={{ position: "relative" }}>

              <img
                src={img}
                onClick={()=>setActiveImage(img)}
                style={{
                  width:"100%",
                  aspectRatio:"1/1",
                  objectFit:"cover",
                  borderRadius:10
                }}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateChicken({
                    ...chicken,
                    album: chicken.album.filter((_:any,idx:number)=>idx!==i)
                  });
                }}
                style={{
                  position:"absolute",
                  top:5,
                  right:5,
                  background:"#0008",
                  color:"#fff",
                  border:"none",
                  borderRadius:"50%",
                  width:22,
                  height:22
                }}
              >
                ✕
              </button>

            </div>
          ))}
        </div>
      </div>

      {/* IMAGE VIEWER */}
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

      {/* HEALTH */}
      <div style={card}>
        <div style={sectionTitle}>🩺 Health Logs</div>

        <button
          style={{ ...btn, background: "#22c55e", color: "#fff", marginBottom: 10 }}
          onClick={() => setShowHealthForm(!showHealthForm)}
        >
          + Add Health Log
        </button>

        {showHealthForm && (
          <>
            <input type="date" style={input}
              value={healthForm.date}
              onChange={(e)=>setHealthForm({...healthForm,date:e.target.value})}
            />

            <select style={input}
              value={healthForm.status}
              onChange={(e)=>setHealthForm({...healthForm,status:e.target.value})}
            >
              <option>Healthy</option>
              <option>Sick</option>
              <option>Recovering</option>
            </select>

            <input style={input}
              placeholder="Symptoms"
              value={healthForm.symptoms}
              onChange={(e)=>setHealthForm({...healthForm,symptoms:e.target.value})}
            />

            <button style={{ ...btn, background: "#22c55e", color: "#fff" }} onClick={saveHealth}>
              Save
            </button>
          </>
        )}

        {(chicken.healthLogs || []).map((log:any)=>(
          <div key={log.id} style={{ marginTop:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{
                width:10,height:10,borderRadius:"50%",
                background:getColor(log.status)
              }} />
              <b>{log.status}</b> — {log.symptoms}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}