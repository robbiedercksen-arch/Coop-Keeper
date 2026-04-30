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

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          {chicken.image && (
            <img
              src={chicken.image}
              style={{ width: 140, height: 140, borderRadius: 12 }}
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

      {/* 🔥 PHOTO ALBUM (FULLY RESTORED) */}
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

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginTop: 12 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: getColor(log.status),
                }}
              />
              <b>{log.status}</b> — {log.symptoms}
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