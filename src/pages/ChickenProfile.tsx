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

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      {/* BACK */}
      <button
        onClick={() => navigate("registry")}
        style={{ ...btn, background: "#3b82f6", color: "#fff", marginBottom: 20 }}
      >
        ← Back
      </button>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {chicken.image && (
            <img
              src={chicken.image}
              style={{
                width: 140,
                height: 140,
                borderRadius: 12,
                objectFit: "cover",
              }}
            />
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

      {/* ================= PHOTO ALBUM (UNCHANGED) ================= */}
      <div style={card}>
        <h3>📸 Photo Album</h3>

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
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />

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

      {/* ================= HEALTH LOGS (ONLY PART UPDATED) ================= */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        <button
          style={{ ...btn, background: "#22c55e", color: "#fff" }}
          onClick={() => setShowHealthForm(!showHealthForm)}
        >
          + Add Health Log
        </button>

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginTop: 12 }}>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background:
                    log.status === "Healthy"
                      ? "#22c55e"
                      : log.status === "Sick"
                      ? "#ef4444"
                      : "#eab308",
                }}
              />

              <b>{log.status}</b> — {log.symptoms}

              <button
                onClick={() => setViewLog(log)}
                style={{
                  marginLeft: "auto",
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                  cursor: "pointer",
                }}
              >
                View
              </button>
            </div>

            <div style={{ marginTop: 6 }}>
              <label style={{ fontSize: 12, color: "#555" }}>
                Health risk resolved
                <input
                  type="checkbox"
                  checked={log.resolved}
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
                  style={{ marginLeft: 8 }}
                />
              </label>
            </div>

          </div>
        ))}
      </div>

      {/* IMAGE POPUP */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed",
            inset: 0,
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