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

  const card = {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
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

  return (
    <div style={{
      maxWidth: 480,
      margin: "0 auto",
      padding: 16,
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eef2ff, #f8fafc)"
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
                  aspectRatio: "1 / 1",
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
                  top: 6,
                  right: 6,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
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
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000
          }}
        >
          <img
            src={activeImage}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: 12
            }}
          />
        </div>
      )}

    </div>
  );
}