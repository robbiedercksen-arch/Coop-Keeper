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

  // ✅ NEW
  const [viewLog, setViewLog] = useState<any>(null);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
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
    if (!healthForm.date) return;

    updateChicken({
      ...chicken,
      healthLogs: [
        ...healthLogs,
        { id: Date.now(), ...healthForm, resolved: false },
      ],
    });

    setHealthForm({ date: "", status: "Healthy", symptoms: "" });
    setShowHealthForm(false);
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
    marginBottom: 8,
    padding: 6,
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
        <div style={{ fontWeight: 700, marginBottom: 10 }}>🩺 Health Logs</div>

        <button
          style={{ ...btn, background: "#22c55e", color: "#fff", marginBottom: 10 }}
          onClick={() => setShowHealthForm(!showHealthForm)}
        >
          + Add Health Log
        </button>

        {healthLogs.map((log: any) => (
          <div
            key={log.id}
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            {/* TOP ROW WITH VIEW BUTTON */}
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
                <b>{log.status}</b>
                <span>— {log.symptoms}</span>
              </div>

              <button
                style={{
                  padding: "4px 8px",
                  fontSize: 12,
                  borderRadius: 6,
                  border: "none",
                  background: "#3b82f6",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => setViewLog(log)}
              >
                View
              </button>
            </div>

            <div style={{ marginTop: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Health risk resolved
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
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      {viewLog && (
        <div
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
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              width: 320,
              position: "relative",
            }}
          >
            <button
              onClick={() => setViewLog(null)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "#ef4444",
                color: "#fff",
                borderRadius: "50%",
                width: 24,
                height: 24,
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <h3>{viewLog.status}</h3>
            <p>{viewLog.symptoms}</p>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                style={{ background: "#f59e0b", color: "#fff", border: "none", padding: 6, borderRadius: 6 }}
                onClick={() => {
                  setHealthForm(viewLog);
                  setShowHealthForm(true);
                  setViewLog(null);
                }}
              >
                Edit
              </button>

              <button
                style={{ background: "#ef4444", color: "#fff", border: "none", padding: 6, borderRadius: 6 }}
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
          </div>
        </div>
      )}

    </div>
  );
}