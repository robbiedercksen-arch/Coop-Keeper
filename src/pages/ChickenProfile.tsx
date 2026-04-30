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

  // ================= STATE =================
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

  // ================= UPDATE =================
  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  // ================= ADD HEALTH =================
  const addHealth = () => {
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

  // ================= STYLES =================
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
    cursor: "pointer",
  };

  const success = {
    background: "#22c55e",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
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

      {/* BACK */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("registry")} style={primary}>
          ← Back
        </button>
      </div>

      {/* PROFILE */}
      <div style={card}>
        <h1>{chicken.name}</h1>
        <div><b>ID Tag:</b> {chicken.idTag}</div>
        <div><b>Breed:</b> {chicken.breed}</div>
        <div><b>Sex:</b> {chicken.sex}</div>
        <div><b>Age:</b> {chicken.ageGroup}</div>
      </div>

      {/* ================= PHOTO ALBUM ================= */}
      <div style={card}>
        <div style={sectionTitle}>📸 Photo Album</div>

        <label style={success}>
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

              {/* 🔥 DELETE BACK */}
              <button
                onClick={() =>
                  updateChicken({
                    ...chicken,
                    album: (chicken.album || []).filter(
                      (_: any, index: number) => index !== i
                    ),
                  })
                }
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "red",
                  color: "#fff",
                  borderRadius: "50%",
                  border: "none",
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= HEALTH LOGS ================= */}
      <div style={card}>
        <div style={sectionTitle}>🩺 Health Logs</div>

        {/* 🔥 BUTTON FIXED */}
        <button style={success} onClick={() => setShowHealthForm(!showHealthForm)}>
          + Add Health Log
        </button>

        {showHealthForm && (
          <div style={{ marginTop: 10 }}>
            <input type="date" onChange={(e) => setHealthForm({ ...healthForm, date: e.target.value })} style={inputStyle} />
            <select onChange={(e) => setHealthForm({ ...healthForm, status: e.target.value })} style={inputStyle}>
              <option>Healthy</option>
              <option>Sick</option>
              <option>Recovering</option>
            </select>
            <input placeholder="Symptoms" onChange={(e) => setHealthForm({ ...healthForm, symptoms: e.target.value })} style={inputStyle} />
            <button onClick={addHealth} style={success}>Save</button>
          </div>
        )}

        {/* LIST */}
        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginTop: 10 }}>
            <b>{log.status}</b> — {log.symptoms}

            {/* ✔ RESOLVED BACK */}
            <label style={{ marginLeft: 10 }}>
              <input
                type="checkbox"
                checked={log.resolved}
                onChange={() =>
                  updateChicken({
                    ...chicken,
                    healthLogs: healthLogs.map((l: any) =>
                      l.id === log.id ? { ...l, resolved: !l.resolved } : l
                    ),
                  })
                }
              /> ✔
            </label>

            {/* 🔥 VIEW BUTTON BACK */}
            <button
              onClick={() => setViewLog(log)}
              style={{ marginLeft: 10 }}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* ================= VIEW POPUP ================= */}
      {viewLog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
            <h3>{viewLog.status}</h3>
            <p>{viewLog.symptoms}</p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  setHealthForm(viewLog);
                  setShowHealthForm(true);
                  setViewLog(null);
                }}
              >
                Edit
              </button>

              <button onClick={() => setViewLog(null)}>
                Cancel
              </button>

              <button
                onClick={() => {
                  updateChicken({
                    ...chicken,
                    healthLogs: healthLogs.filter(
                      (l: any) => l.id !== viewLog.id
                    ),
                  });
                  setViewLog(null);
                }}
                style={{ background: "red", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE POPUP */}
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={activeImage} style={{ maxWidth: "90%" }} />
        </div>
      )}
    </div>
  );
}