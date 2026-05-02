import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
`;

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  setSelectedChicken,
  navigate,
  saveChickenToDB, 
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

const [activeImage, setActiveImage] = useState<string | null>(null);
const [activeIndex, setActiveIndex] = useState<number>(0);
const nextImage = () => {
  const album = chicken.album || [];
  if (activeIndex < album.length - 1) {
    const next = activeIndex + 1;
    setActiveIndex(next);
    setActiveImage(album[next]);
  }
};

const prevImage = () => {
  const album = chicken.album || [];
  if (activeIndex > 0) {
    const prev = activeIndex - 1;
    setActiveIndex(prev);
    setActiveImage(album[prev]);
  }
};

// 👇 PASTE HERE
const touchStartX = useRef(0);
const touchEndX = useRef(0);

const handleTouchStart = (e: any) => {
  touchStartX.current = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e: any) => {
  touchEndX.current = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  const diff = touchStartX.current - touchEndX.current;

  if (diff > 50) nextImage();
  if (diff < -50) prevImage();
};

useEffect(() => setChicken(selectedChicken), [selectedChicken]);

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
    saveChickenToDB(updated);
  };

  const saveChickenInfo = () => {
    updateChicken({ ...chicken, ...editForm });
    setEditingChicken(false);
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

  const getColor = (status: string) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "Sick") return "#ef4444";
    return "#eab308";
  };

  // ✅ CLEAN GLOBAL STYLES

  const card = {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "none",
    padding: 16,
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    marginBottom: 16,
  };

  const btn = {
    width: "100%",
    minHeight: 44,
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const input = {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  };

  const sectionTitle = {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    color: "#374151",
  };

  // 📝 NOTES SECTION
  const NotesSection = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

    const [noteForm, setNoteForm] = useState({
      date: "",
      type: "General",
      description: "",
    });

    const notes = chicken.notes || [];

    const saveNote = () => {
      if (!noteForm.date || !noteForm.description) return;

      const updatedNotes = editingNoteId
        ? notes.map((n: any) =>
            n.id === editingNoteId ? { ...n, ...noteForm } : n
          )
        : [...notes, { id: Date.now(), ...noteForm }];

      updateChicken({ ...chicken, notes: updatedNotes });

      setNoteForm({ date: "", type: "General", description: "" });
      setEditingNoteId(null);
      setShowForm(false);
    };

    return (
  <div style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>

    <div style={sectionTitle}>📝 Notes & Observations</div>

    <button
      style={{ ...btn, background: "#6366f1", color: "#fff" }}
      onClick={() => {
        setShowForm(!showForm);
        setEditingNoteId(null);
      }}
    >
      + Add Note
    </button>

    {showForm && (
      <div style={{
        background: "#f9fafb",
        padding: 12,
        borderRadius: 12
      }}>
        <input
          type="date"
          style={input}
          value={noteForm.date}
          onChange={(e)=>setNoteForm({...noteForm,date:e.target.value})}
        />

        <select
          style={input}
          value={noteForm.type}
          onChange={(e)=>setNoteForm({...noteForm,type:e.target.value})}
        >
          <option>General</option>
          <option>Concern</option>
          <option>Planning</option>
        </select>

        <input
          style={input}
          placeholder="Description"
          value={noteForm.description}
          onChange={(e)=>setNoteForm({...noteForm,description:e.target.value})}
        />

        <button
          style={{ ...btn, background: "#22c55e", color: "#fff" }}
          onClick={saveNote}
        >
          Save Note
        </button>
      </div>
    )}

    {notes.map((note: any) => (
      <div
        key={note.id}
        style={{
          padding: 14,
          borderRadius: 14,
          background: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>{note.type}</div>
          <div style={{ fontSize: 14, color: "#555" }}>
            {note.description}
          </div>
        </div>

        <button
          onClick={() => setViewNote(note)}
          style={{
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "6px 10px",
            cursor: "pointer"
          }}
        >
          View
        </button>
      </div>
    ))}

    </div>
);
};
return (
  <>
    <style>{globalStyles}</style>

    <div style={{
    maxWidth: 480,
    margin: "0 auto",
    padding: 16,
    minHeight: "100vh"
  }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

  {/* HEADER */}
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <h2 style={{ margin: 0 }}>🐔 Chicken Profile</h2>

    {!editingChicken && (
      <button
        onClick={() => setEditingChicken(true)}
        style={{
          ...btn,
          background: "#6366f1",
          color: "#fff",
          width: "auto",
          padding: "8px 12px"
        }}
      >
        ✏ Edit
      </button>
    )}
  </div>

  {/* IMAGE */}
  {chicken.image && (
    <img
      src={chicken.image}
      style={{
        width: "100%",
        maxWidth: 240,
        borderRadius: 16,
        alignSelf: "center",
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
      }}
    />
  )}

  {/* CONTENT */}
  {editingChicken ? (
    <>
      <input style={input} value={editForm.name} onChange={(e)=>setEditForm({...editForm,name:e.target.value})} />
      <input style={input} value={editForm.idTag} onChange={(e)=>setEditForm({...editForm,idTag:e.target.value})} />
      <input style={input} value={editForm.breed} onChange={(e)=>setEditForm({...editForm,breed:e.target.value})} />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button style={{ ...btn, background: "#22c55e", color: "#fff" }} onClick={saveChickenInfo}>
          ✔ Save
        </button>

        <button style={{ ...btn, background: "#9ca3af", color: "#fff" }} onClick={() => setEditingChicken(false)}>
          Cancel
        </button>
      </div>
    </>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      <h1 style={{ margin: 0 }}>{chicken.name}</h1>

      <div style={{ fontSize: 14, color: "#6b7280" }}>
        ID: {chicken.idTag}
      </div>

      <div style={{ fontSize: 14 }}>
        <strong>Breed:</strong> {chicken.breed}
      </div>

      <div style={{ fontSize: 14 }}>
        <strong>Sex:</strong> {chicken.sex}
      </div>

      <div style={{ fontSize: 14 }}>
        <strong>Age:</strong> {chicken.ageGroup}
      </div>

    </div>
  )}

</div>

      <NotesSection />
{/* NOTE VIEW POPUP */}
{viewNote && (
  <div
    onClick={() => {
      setViewNote(null);
      setEditingNoteId(null);
    }}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: 16,
      animation: "fadeIn 0.2s ease"
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        padding: 20,
        borderRadius: 20,
        width: "90%",
        maxWidth: 420,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >

      {/* EDIT MODE */}
      {editingNoteId === viewNote.id ? (
        <>
          <input
            style={input}
            value={viewNote.description}
            onChange={(e) =>
              setViewNote({ ...viewNote, description: e.target.value })
            }
          />

          <button
            style={{ ...btn, background: "#22c55e", color: "#fff", borderRadius: 10 }}
            onClick={() => {
              updateChicken({
                ...chicken,
                notes: (chicken.notes || []).map((n: any) =>
                  n.id === viewNote.id ? viewNote : n
                ),
              });
              setEditingNoteId(null);
              setViewNote(null);
            }}
          >
            ✔ Save Changes
          </button>

          <button
            style={{ ...btn, background: "#9ca3af", color: "#fff", borderRadius: 10 }}
            onClick={() => {
              setEditingNoteId(null);
              setViewNote(null);
            }}
          >
            Cancel
          </button>
        </>
      ) : (

        /* VIEW MODE */
        <>
          <div style={{ fontWeight: 700 }}>
            {viewNote.type}
          </div>

          <div
            style={{
              background: "#f3f4f6",
              padding: 12,
              borderRadius: 12,
            }}
          >
            {viewNote.description || "No description"}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            
            <button
              style={{ ...btn, background: "#f59e0b", color: "#fff", borderRadius: 10 }}
              onClick={() => {
                setEditingNoteId(viewNote.id);
              }}
            >
              ✏ Edit
            </button>
            <button
  style={{ ...btn, background: "#ef4444", color: "#fff", borderRadius: 10 }}
  onClick={() => {
    updateChicken({
      ...chicken,
      notes: (chicken.notes || []).filter(
        (n: any) => n.id !== viewNote.id
      ),
    });
    setViewNote(null);
  }}
>
  🗑 Delete
</button>

            <button
              style={{ ...btn, background: "#6b7280", color: "#fff", borderRadius: 10 }}
              onClick={() => setViewNote(null)}
            >
              Close
            </button>

          </div>
        
    

    </div>
  </div>

      {/* PHOTO GRID */}
      <div style={card}>
        <div style={sectionTitle}>📸 Photo Album</div>

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
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
  marginTop: 14
}}>
  {(chicken.album || []).map((img: any, i: number) => (
    <div
      key={i}
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        background: "#f3f4f6",
        boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
      }}
    >

      {/* IMAGE */}
      <img
        src={img}
        onClick={() => {
          setActiveIndex(i);
          setActiveImage(img);
        }}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          objectFit: "cover",
          cursor: "pointer",
          transition: "transform 0.2s ease, opacity 0.2s ease",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.95)";
          e.currentTarget.style.opacity = "0.85";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.opacity = "1";
        }}
      />

      {/* DELETE BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          updateChicken({
            ...chicken,
            album: chicken.album.filter((_: any, index: number) => index !== i),
          });
        }}
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 28,
          height: 28,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239,68,68,0.9)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.55)";
        }}
      >
        ✕
      </button>

    </div>
  ))}
</div>
{/* IMAGE VIEWER */}
{activeImage && (
  <div
    onClick={(e) => {
      if (touchStartX.current === touchEndX.current) {
        setActiveImage(null);
      }
    }}
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.95)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999999,
    }}
  >

    {/* IMAGE */}
    <img
      src={activeImage}
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: "92vw",
        maxHeight: "85vh",
        objectFit: "contain",
        borderRadius: 12,
      }}
    />

    {/* CLOSE BUTTON */}
    <button
      onClick={() => setActiveImage(null)}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: "rgba(255,255,255,0.2)",
        backdropFilter: "blur(8px)",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: 42,
        height: 42,
        fontSize: 20,
        cursor: "pointer",
      }}
    >
      ×
    </button>

    {/* LEFT NAV */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        prevImage();
      }}
      style={{
        position: "fixed",
        left: 10,
        top: "50%",
        transform: "translateY(-50%)",
        background: "rgba(255,255,255,0.15)",
        border: "none",
        color: "#fff",
        fontSize: 24,
        borderRadius: 12,
        padding: "8px 12px",
        cursor: "pointer",
      }}
    >
      ‹
    </button>

    {/* RIGHT NAV */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        nextImage();
      }}
      style={{
        position: "fixed",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        background: "rgba(255,255,255,0.15)",
        border: "none",
        color: "#fff",
        fontSize: 24,
        borderRadius: 12,
        padding: "8px 12px",
        cursor: "pointer",
      }}
    >
      ›
    </button>

  </div>
)}
</div>
{/* HEALTH LOGS */}
<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

  <div style={sectionTitle}>🩺 Health Logs</div>

  <button
    style={{ ...btn, background: "#22c55e", color: "#fff" }}
    onClick={() => {
      setShowHealthForm(!showHealthForm);
      setEditingId(null);
    }}
  >
    + Add Health Log
  </button>

  {showHealthForm && (
    <div style={{
      background: "#f9fafb",
      padding: 12,
      borderRadius: 12
    }}>
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

      <button
        style={{ ...btn, background: "#3b82f6", color: "#fff" }}
        onClick={saveHealth}
      >
        Save Log
      </button>
    </div>
  )}

  {healthLogs.map((log: any) => (
  <div
    key={log.id}
    style={{
      padding: 16,
      borderRadius: 16,
      background: "#ffffff",
      boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      borderLeft: `6px solid ${getColor(log.status)}`,
    }}
  >

    {/* TOP ROW */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: getColor(log.status),
          }}
        />
        <b style={{ fontSize: 15 }}>{log.status}</b>
      </div>

      <span style={{ fontSize: 12, color: "#6b7280" }}>
        {log.date || ""}
      </span>
    </div>

    {/* SYMPTOMS */}
    <div style={{ fontSize: 14, color: "#555" }}>
      {log.symptoms || "No symptoms recorded"}
    </div>

    {/* ACTIONS */}
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      <button
        style={{ ...btn, background: "#3b82f6", color: "#fff", borderRadius: 10 }}
        onClick={(e) => {
          e.stopPropagation();
          setViewLog(log);
        }}
      >
              View Details
      </button>

      <label style={{ fontSize: 13 }}>
        <input
          type="checkbox"
          checked={log.resolved || false}
          onChange={() =>
            updateChicken({
              ...chicken,
              healthLogs: healthLogs.map((l: any) =>
                l.id === log.id
                  ? { ...l, resolved: !l.resolved }
                  : l
              ),
            })
          }
        />
        {" "}Resolved
      </label>

    </div>
  </div>
))}

</div>

{/* VIEW LOG POPUP */}
{viewLog && (
  <div
    onClick={() => {
      setViewLog(null);
      setEditingId(null);
    }}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: 16,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 16,
        width: "90%",
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >

      <div style={{ fontWeight: 700 }}>
        {viewLog.status}
      </div>

      {editingId === viewLog.id ? (
        <>
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
            value={healthForm.symptoms}
            onChange={(e) =>
              setHealthForm({ ...healthForm, symptoms: e.target.value })
            }
          />

          <button
            style={{ ...btn, background: "#22c55e", color: "#fff" }}
            onClick={saveHealth}
          >
            ✔ Save
          </button>

          <button
            style={{ ...btn, background: "#9ca3af", color: "#fff" }}
            onClick={() => {
              setEditingId(null);
              setViewLog(null);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <div style={{ padding: 10, background: "#f3f4f6", borderRadius: 10 }}>
            {viewLog.symptoms || "No symptoms"}
          </div>

          <button
            style={{ ...btn, background: "#f59e0b", color: "#fff" }}
            onClick={() => {
              setHealthForm(viewLog);
              setEditingId(viewLog.id);
            }}
          >
            ✏ Edit
          </button>

          <button
            style={{ ...btn, background: "#ef4444", color: "#fff" }}
            onClick={() => {
              updateChicken({
                ...chicken,
                healthLogs: healthLogs.filter((l: any) => l.id !== viewLog.id),
              });
              setViewLog(null);
            }}
          >
            🗑 Delete
          </button>

          <button
            style={{ ...btn, background: "#6b7280", color: "#fff" }}
            onClick={() => setViewLog(null)}
          >
            Close
          </button>
        </>
      )}

    </div>
  </div>
)}

      </div>
    </div>
  </>
);
}