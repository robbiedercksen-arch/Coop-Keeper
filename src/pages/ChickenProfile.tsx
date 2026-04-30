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
          <input type="file" multiple style={{ display: "none" }} />
        </label>
      </div>

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

      {/* 🔥 PREMIUM GLASS MODAL */}
      {viewLog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "rgba(255,255,255,0.92)",
            padding: 24,
            borderRadius: 20,
            width: 340,
            position: "relative",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          }}>

            <button
              onClick={() => {
                setViewLog(null);
                setEditingId(null);
              }}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                border: "none",
                background: "#ef4444",
                color: "#fff",
                borderRadius: "50%",
                width: 26,
                height: 26,
                cursor: "pointer",
              }}
            >
              ×
            </button>

            {editingId === viewLog.id ? (
              <>
                <h3 style={{ marginBottom: 12 }}>Edit Health Log</h3>

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

                <button style={{...btn,background:"#22c55e",color:"#fff",width:"100%"}} onClick={saveHealth}>
                  Save Log
                </button>
              </>
            ) : (
              <>
                <div style={{
                  padding: "4px 10px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 10,
                  background:
                    viewLog.status === "Healthy" ? "#dcfce7" :
                    viewLog.status === "Sick" ? "#fee2e2" :
                    "#fef3c7",
                  color:
                    viewLog.status === "Healthy" ? "#166534" :
                    viewLog.status === "Sick" ? "#991b1b" :
                    "#92400e",
                }}>
                  {viewLog.status}
                </div>

                <div style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  marginBottom: 16
                }}>
                  {viewLog.symptoms || "No symptoms recorded"}
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    style={{ ...btn, background: "#f59e0b", color: "#fff", flex: 1 }}
                    onClick={() => {
                      setHealthForm(viewLog);
                      setEditingId(viewLog.id);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    style={{ ...btn, background: "#ef4444", color: "#fff", flex: 1 }}
                    onClick={() => {
                      updateChicken({
                        ...chicken,
                        healthLogs: healthLogs.filter((l: any) => l.id !== viewLog.id),
                      });
                      setViewLog(null);
                    }}
                  >
                    Delete
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