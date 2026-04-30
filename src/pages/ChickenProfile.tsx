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
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [viewLog, setViewLog] = useState<any>(null);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
  });

  // 🔥 NOTES STATE
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [viewNote, setViewNote] = useState<any>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteForm, setNoteForm] = useState({
    date: "",
    type: "General",
    description: "",
  });

  const notes = chicken.notes || [];

  const getPriority = (log: any) => {
    if (log.resolved) return 99;
    if (log.status === "Sick") return 1;
    if (log.status === "Recovering") return 2;
    return 3;
  };

  const healthLogs = (chicken.healthLogs || []).sort((a: any, b: any) => {
    const priorityDiff = getPriority(a) - getPriority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return b.id - a.id;
  });

  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  const saveHealth = () => {
    if (!healthForm.date) return;

    if (editingId) {
      updateChicken({
        ...chicken,
        healthLogs: healthLogs.map((l: any) =>
          l.id === editingId ? { ...l, ...healthForm } : l
        ),
      });
    } else {
      updateChicken({
        ...chicken,
        healthLogs: [
          ...healthLogs,
          { id: Date.now(), ...healthForm, resolved: false },
        ],
      });
    }

    setHealthForm({ date: "", status: "Healthy", symptoms: "" });
    setShowHealthForm(false);
    setEditingId(null);
    setViewLog(null);
  };

  // 🔥 SAVE NOTE
  const saveNote = () => {
    if (!noteForm.date || !noteForm.description) return;

    let updatedNotes;

    if (editingNoteId) {
      updatedNotes = notes.map((n: any) =>
        n.id === editingNoteId ? { ...n, ...noteForm } : n
      );
    } else {
      updatedNotes = [
        ...notes,
        { id: Date.now(), ...noteForm },
      ];
    }

    updateChicken({
      ...chicken,
      notes: updatedNotes,
    });

    setNoteForm({ date: "", type: "General", description: "" });
    setShowNoteForm(false);
    setEditingNoteId(null);
    setViewNote(null);
  };

  const getColor = (status: string) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "Sick") return "#ef4444";
    return "#eab308";
  };

  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const btn = {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  };

  const input = {
    display: "block",
    width: "100%",
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #e5e7eb",
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      <button
        onClick={() => navigate("registry")}
        style={{ ...btn, background: "#3b82f6", color: "#fff", marginBottom: 20 }}
      >
        ← Back
      </button>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          {chicken.image && (
            <img src={chicken.image} style={{ width: 140, height: 140, borderRadius: 12 }} />
          )}
          <div>
            <h1>{chicken.name}</h1>
            <div><b>ID Tag:</b> {chicken.idTag}</div>
            <div><b>Breed:</b> {chicken.breed}</div>
            <div><b>Sex:</b> {chicken.sex}</div>
            <div><b>Age:</b> {chicken.ageGroup}</div>
          </div>
        </div>
      </div>

      {/* 📝 NOTES */}
      <div style={card}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>📝 Notes & Observations</div>

        <button
          style={{ ...btn, background: "#6366f1", color: "#fff", marginBottom: 10 }}
          onClick={() => {
            setShowNoteForm(!showNoteForm);
            setEditingNoteId(null);
          }}
        >
          + Add Note
        </button>

        {showNoteForm && (
          <>
            <input type="date" style={input}
              value={noteForm.date}
              onChange={(e)=>setNoteForm({...noteForm,date:e.target.value})}
            />

            <select style={input}
              value={noteForm.type}
              onChange={(e)=>setNoteForm({...noteForm,type:e.target.value})}
            >
              <option>General</option>
              <option>Concern</option>
              <option>Planning</option>
            </select>

            <input style={input}
              placeholder="Description"
              value={noteForm.description}
              onChange={(e)=>setNoteForm({...noteForm,description:e.target.value})}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...btn, background: "#22c55e", color: "#fff", flex: 1 }} onClick={saveNote}>
                Save Note
              </button>

              <button style={{ ...btn, background: "#9ca3af", color: "#fff", flex: 1 }} onClick={()=>setShowNoteForm(false)}>
                Cancel
              </button>
            </div>
          </>
        )}

        {notes.map((note:any)=>(
          <div key={note.id}
            onClick={()=>setViewNote(note)}
            style={{
              marginTop:10,
              padding:10,
              borderRadius:10,
              background:"#f9fafb",
              border:"1px solid #e5e7eb",
              cursor:"pointer"
            }}
          >
            <b>{note.type}</b> — {note.description}
            <div style={{fontSize:12,color:"#6b7280"}}>{note.date}</div>
          </div>
        ))}
      </div>

      {/* PHOTO ALBUM */}
      <div style={card}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>📸 Photo Album</div>

        <label style={{ ...btn, background: "#22c55e", color: "#fff" }}>
          + Add Photos
          <input type="file" multiple style={{ display: "none" }}
            onChange={(e:any)=>{
              const files = Array.from(e.target.files);

              Promise.all(files.map((file:any)=>new Promise((resolve)=>{
                const reader = new FileReader();
                reader.onloadend = ()=>resolve(reader.result);
                reader.readAsDataURL(file);
              }))).then((images:any)=>{
                updateChicken({
                  ...chicken,
                  album:[...(chicken.album||[]),...images]
                });
              });
            }}
          />
        </label>

        <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginTop:10 }}>
          {(chicken.album||[]).map((img:any,i:number)=>(
            <div key={i} style={{ position:"relative" }}>
              <img src={img} onClick={()=>setActiveImage(img)}
                style={{width:100,height:100,borderRadius:10,objectFit:"cover",cursor:"pointer"}}
              />
              <button
                onClick={()=>updateChicken({
                  ...chicken,
                  album:chicken.album.filter((_:any,index:number)=>index!==i)
                })}
                style={{
                  position:"absolute",top:-6,right:-6,
                  background:"#ef4444",color:"#fff",
                  border:"none",borderRadius:"50%",
                  width:22,height:22,cursor:"pointer"
                }}
              >🗑</button>
            </div>
          ))}
        </div>
      </div>

      {activeImage && (
        <div onClick={()=>setActiveImage(null)}
          style={{
            position:"fixed",top:0,left:0,width:"100%",height:"100%",
            background:"rgba(0,0,0,0.8)",
            display:"flex",alignItems:"center",justifyContent:"center"
          }}>
          <img src={activeImage} style={{maxWidth:"90%",maxHeight:"90%"}} />
        </div>
      )}

    </div>
  );
}