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

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const healthLogs = chicken.healthLogs || [];

  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  const saveHealth = () => {
    if (!healthForm.date) return alert("Date required");

    updateChicken({
      ...chicken,
      healthLogs: [
        ...healthLogs,
        { id: Date.now(), ...healthForm, resolved: false },
      ],
    });

    setShowHealthForm(false);
    setHealthForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });
  };

  const deleteHealthLog = (id: number) => {
    updateChicken({
      ...chicken,
      healthLogs: healthLogs.filter((l: any) => l.id !== id),
    });
  };

  const editHealthLog = (log: any) => {
    setHealthForm(log);
    setShowHealthForm(true);
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
    marginBottom: 8,
    padding: 6,
  };

  const header = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: "1px solid #e5e7eb",
  };

  const getColor = (status: string) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "Sick") return "#ef4444";
    return "#eab308";
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      {/* BACK */}
      <button
        onClick={() => navigate("registry")}
        style={{ ...btn, background: "#3b82f6", color: "#fff", marginBottom: 20 }}
      >
        ← Back
      </button>

      {/* EDIT CHICKEN */}
  <button
  style={{ ...btn, background: "#6366f1", color: "#fff", marginBottom: 10 }}
  onClick={() => setIsEditingChicken(true)}
>
  Edit Chicken Profile
</button>

      {/* PROFILE */}
      
<div style={card}>
  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>

    {/* ✅ PROFILE IMAGE (THIS IS THE ONLY ADDITION) */}
    {chicken.image && (
      <img
        src={chicken.image}
        onClick={() => setActiveImage(chicken.image)}
        style={{
          width: 140,
          height: 140,
          borderRadius: 12,
          objectFit: "cover",
          cursor: "pointer",
        }}
      />
    )}

    <div>
    <h1>{chicken.name}</h1>
<div>ID Tag: {chicken.idTag}</div>
<div>Breed: {chicken.breed}</div>
<div>Sex: {chicken.sex}</div>
<div>Age: {chicken.ageGroup}</div>
    </div>

  </div>
</div>
      {/* PHOTO ALBUM */}
      <div style={card}>
        <div style={header}>📸 Photo Album</div>

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

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          {(chicken.album || []).map((img: any, i: number) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={img}
                onClick={() => setActiveImage(img)}
                style={{ width: 100, height: 100, borderRadius: 8 }}
              />
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
                  background: "red",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* HEALTH LOGS */}
      <div style={card}>
        <div style={header}>🩺 Health Logs</div>

        <button
          style={{ ...btn, background: "#22c55e", color: "#fff" }}
          onClick={() => setShowHealthForm(prev => !prev)}
        >
          + Add Health Log
        </button>

        {showHealthForm && (
          <>
            <input type="date" style={input}
              value={healthForm.date}
              onChange={(e) => setHealthForm({ ...healthForm, date: e.target.value })}
            />

            <select style={input}
              value={healthForm.status}
              onChange={(e) => setHealthForm({ ...healthForm, status: e.target.value })}
            >
              <option>Healthy</option>
              <option>Sick</option>
              <option>Recovering</option>
            </select>

            <textarea style={input} placeholder="Symptoms"
              value={healthForm.symptoms}
              onChange={(e) => setHealthForm({ ...healthForm, symptoms: e.target.value })}
            />

            <button style={{ ...btn, background: "#f59e0b", color: "#fff" }} onClick={saveHealth}>
              Save Log
            </button>
          </>
        )}

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginTop: 12 }}>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: getColor(log.status),
              }} />
              <b>{log.status}</b> — {log.symptoms}
            </div>

            <div>
              <label>
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
                  style={{ marginLeft: 8 }}
                />
              </label>
            </div>

            <div>
              <button onClick={() => setViewLog(log)}>View</button>
              <button onClick={() => editHealthLog(log)}>Edit</button>
              <button onClick={() => deleteHealthLog(log.id)}>Delete</button>
            </div>

          </div>
        ))}
      </div>

      {/* VIEW POPUP */}
      {viewLog && (
        <div
          onClick={() => setViewLog(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ background: "#fff", padding: 20, margin: "10% auto", width: 300 }}>
            <h3>{viewLog.status}</h3>
            <p>{viewLog.symptoms}</p>
          </div>
        </div>
      )}

      {/* IMAGE POPUP */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
          }}
        >
          <img src={activeImage} style={{ maxWidth: "90%", margin: "auto", display: "block" }} />
        </div>
      )}
    </div>
  );
}