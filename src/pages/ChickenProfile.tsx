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
          ← Back
        </button>
      </div>
    );
  }

  const [chicken, setChicken] = useState(selectedChicken);
  useEffect(() => setChicken(selectedChicken), [selectedChicken]);

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [viewLog, setViewLog] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
  });

  const getColor = (status: string) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "Sick") return "#ef4444";
    return "#eab308";
  };

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
        healthLogs: (chicken.healthLogs || []).map((l: any) =>
          l.id === editingId ? { ...l, ...healthForm } : l
        ),
      });
    } else {
      updateChicken({
        ...chicken,
        healthLogs: [
          ...(chicken.healthLogs || []),
          { id: Date.now(), ...healthForm, resolved: false },
        ],
      });
    }

    setHealthForm({ date: "", status: "Healthy", symptoms: "" });
    setEditingId(null);
    setViewLog(null);
    setShowHealthForm(false);
  };

  // STYLES
  const card = {
    background: "rgba(255,255,255,0.75)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  };

  const btn = {
    width: "100%",
    padding: "10px",
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
    border: "1px solid #ddd",
  };

  const sectionTitle = {
    fontWeight: 700,
    marginBottom: 10,
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: "0 auto",
      padding: 16,
      background: "#f5f7fb",
      minHeight: "100vh"
    }}>

      <button
        onClick={() => navigate("registry")}
        style={{ ...btn, background: "#3b82f6", color: "#fff", marginBottom: 16 }}
      >
        ← Back
      </button>

      {/* PROFILE */}
      <div style={card}>
        <h2>🐔 {chicken.name}</h2>
        <div>ID: {chicken.idTag}</div>
        <div>Breed: {chicken.breed}</div>
      </div>

      {/* PHOTO ALBUM */}
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
          gap: 8,
          marginTop: 10
        }}>
          {(chicken.album || []).map((img: any, i: number) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={img}
                onClick={() => setActiveImage(img)}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  borderRadius: 10
                }}
              />

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
                  top: 5,
                  right: 5,
                  background: "#0008",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* HEALTH LOGS */}
      <div style={card}>
        <div style={sectionTitle}>🩺 Health Logs</div>

        <button
          style={{ ...btn, background: "#22c55e", color: "#fff" }}
          onClick={() => setShowHealthForm(!showHealthForm)}
        >
          + Add Log
        </button>

        {showHealthForm && (
          <>
            <input type="date" style={input}
              value={healthForm.date}
              onChange={(e)=>setHealthForm({...healthForm,date:e.target.value})}
            />
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
            <b>{log.status}</b> - {log.symptoms}
            <button
              style={{ ...btn, background:"#3b82f6", color:"#fff", marginTop:6 }}
              onClick={()=>setViewLog(log)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* IMAGE VIEWER */}
      {activeImage && (
        <div onClick={()=>setActiveImage(null)} style={{
          position:"fixed", inset:0,
          background:"rgba(0,0,0,0.85)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:2000
        }}>
          <img src={activeImage} style={{ maxWidth:"90%", borderRadius:12 }}/>
        </div>
      )}

      {/* HEALTH MODAL */}
      {viewLog && (
        <div onClick={()=>setViewLog(null)} style={{
          position:"fixed", inset:0,
          background:"rgba(0,0,0,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:1000
        }}>
          <div onClick={(e)=>e.stopPropagation()} style={{
            background:"#fff",
            padding:20,
            borderRadius:12
          }}>
            <h3>{viewLog.status}</h3>
            <p>{viewLog.symptoms}</p>
          </div>
        </div>
      )}

    </div>
  );
}