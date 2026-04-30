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

 {/* PHOTO ALBUM */}
<div style={card}>
  <div style={{ fontWeight: 700, marginBottom: 10 }}>📸 Photo Album</div>

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

  {/* IMAGES */}
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
    {(chicken.album || []).map((img: any, i: number) => (
      <div key={i} style={{ position: "relative" }}>
        
        <img
          src={img}
          onClick={() => setActiveImage(img)}
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            objectFit: "cover",
            cursor: "pointer",
          }}
        />

        {/* 🗑 DELETE BUTTON */}
        <button
          onClick={() =>
            updateChicken({
              ...chicken,
              album: chicken.album.filter((_: any, index: number) => index !== i),
            })
          }
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 22,
            height: 22,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          🗑
        </button>

      </div>
    ))}
  </div>

  {/* EMPTY STATE */}
  {(!chicken.album || chicken.album.length === 0) && (
    <div style={{ marginTop: 10, fontSize: 13, color: "#9ca3af" }}>
      No photos yet. Add your first photo 📷
    </div>
  )}
</div>

{/* FULL SCREEN IMAGE VIEW */}
{activeImage && (
  <div
    onClick={() => setActiveImage(null)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
    }}
  >
    <div style={{ position: "relative" }}>
      <img
        src={activeImage}
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          borderRadius: 12,
        }}
      />

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setActiveImage(null)}
        style={{
          position: "absolute",
          top: -10,
          right: -10,
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 30,
          height: 30,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ×
      </button>
    </div>
  </div>
)}

      {/* HEALTH LOGS */}
      <div style={card}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>🩺 Health Logs</div>

        <button
          style={{ ...btn, background: "#22c55e", color: "#fff", marginBottom: 10 }}
          onClick={() => {
            setShowHealthForm(!showHealthForm);
            setEditingId(null);
          }}
        >
          + Add Health Log
        </button>

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>

                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: getColor(log.status),
                }} />

                <b>{log.status}</b>
                <span>— {log.symptoms}</span>
              </div>

              <button
                style={{ padding: "4px 8px", fontSize: 12, borderRadius: 6, border: "none", background: "#3b82f6", color: "#fff" }}
                onClick={() => setViewLog(log)}
              >
                View
              </button>
            </div>

            <div style={{ marginTop: 8 }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#374151"
              }}>
                Health risk resolved
                <input
                  type="checkbox"
                  checked={log.resolved || false}
                  onChange={() =>
                    updateChicken({
                      ...chicken,
                      healthLogs: healthLogs.map((l: any) =>
                        l.id === log.id ? { ...l, resolved: !l.resolved } : l
                      ),
                    })
                  }
                />
              </label>
            </div>

          </div>
        ))}
      </div>

      

      {/* 🚀 NEXT LEVEL MODAL */}
      {viewLog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "linear-gradient(180deg,#ffffff,#f9fafb)",
            padding: 26,
            borderRadius: 22,
            width: 350,
            position: "relative",
            boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          }}>

            <button
              onClick={() => {
                setViewLog(null);
                setEditingId(null);
              }}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                border: "none",
                background: "#ef4444",
                color: "#fff",
                borderRadius: "50%",
                width: 28,
                height: 28,
                cursor: "pointer",
                boxShadow: "0 6px 14px rgba(239,68,68,0.4)"
              }}
            >
              ×
            </button>

            {editingId === viewLog.id ? (
              <>
                <h3 style={{ marginBottom: 10 }}>Edit Health Log</h3>

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
                  value={healthForm.symptoms}
                  onChange={(e)=>setHealthForm({...healthForm,symptoms:e.target.value})}
                />

                <button
                  style={{...btn,background:"#22c55e",color:"#fff",width:"100%",fontWeight:700}}
                  onClick={saveHealth}
                >
                  ✔ Save Log
                </button>
              </>
            ) : (
              <>
                <div style={{
                  padding:"5px 12px",
                  borderRadius:12,
                  fontSize:12,
                  fontWeight:700,
                  marginBottom:12,
                  background:
                    viewLog.status==="Healthy"?"#dcfce7":
                    viewLog.status==="Sick"?"#fee2e2":"#fef3c7",
                  color:
                    viewLog.status==="Healthy"?"#166534":
                    viewLog.status==="Sick"?"#991b1b":"#92400e"
                }}>
                  {viewLog.status}
                </div>

                <div style={{
                  background:"#fff",
                  borderRadius:14,
                  padding:14,
                  border:"1px solid #e5e7eb",
                  marginBottom:18
                }}>
                  {viewLog.symptoms || "No symptoms recorded"}
                </div>

                <div style={{ display:"flex", gap:12 }}>
                  <button
                    style={{...btn,background:"#f59e0b",color:"#fff",flex:1,fontWeight:700}}
                    onClick={()=>{
                      setHealthForm(viewLog);
                      setEditingId(viewLog.id);
                    }}
                  >
                    ✏ Edit
                  </button>

                  <button
                    style={{...btn,background:"#ef4444",color:"#fff",flex:1,fontWeight:700}}
                    onClick={()=>{
                      updateChicken({
                        ...chicken,
                        healthLogs: healthLogs.filter((l:any)=>l.id!==viewLog.id),
                      });
                      setViewLog(null);
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}