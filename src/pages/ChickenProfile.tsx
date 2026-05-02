import { useState, useEffect, useRef } from "react";

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

  // ================= IMAGE VIEWER =================
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: any) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextImage();
    if (diff < -50) prevImage();
  };

  useEffect(() => setChicken(selectedChicken), [selectedChicken]);

  // ================= STATE =================
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

  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
    saveChickenToDB(updated);
  };

  const saveHealth = () => {
    if (!healthForm.date) return;

    updateChicken({
      ...chicken,
      healthLogs: [
        ...(chicken.healthLogs || []),
        { id: Date.now(), ...healthForm, resolved: false },
      ],
    });

    setHealthForm({ date: "", status: "Healthy", symptoms: "" });
    setShowHealthForm(false);
  };

  const card = { padding: 16, borderRadius: 16, marginBottom: 16 };
  const btn = { width: "100%", padding: 10, marginTop: 6 };
  const input = { width: "100%", padding: 8, marginBottom: 8 };

  return (
  <div
    style={{
      maxWidth: 420,
      margin: "0 auto",
      padding: 16,
      fontFamily: "system-ui, sans-serif",
    }}
  >

    {/* PROFILE CARD */}
    <div style={{
      background: "#fff",
      borderRadius: 18,
      padding: 18,
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      marginBottom: 16
    }}>
      <h2 style={{ marginBottom: 8 }}>🐔 {chicken.name}</h2>
      <div style={{ color: "#555" }}>ID: {chicken.idTag}</div>
      <div style={{ color: "#555" }}>Breed: {chicken.breed}</div>
    </div>

    {/* NOTES */}
    <div style={{
      background: "#fff",
      borderRadius: 18,
      padding: 16,
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      marginBottom: 16
    }}>
      <h3 style={{ marginBottom: 10 }}>📝 Notes</h3>

      {(chicken.notes || []).map((n: any) => (
        <div
          key={n.id}
          style={{
            padding: 10,
            borderRadius: 10,
            background: "#f3f4f6",
            marginBottom: 8
          }}
        >
          {n.description}
        </div>
      ))}
    </div>

    {/* PHOTOS */}
    <div style={{
      background: "#fff",
      borderRadius: 18,
      padding: 16,
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      marginBottom: 16
    }}>
      <h3 style={{ marginBottom: 10 }}>📸 Photos</h3>

      <input
        type="file"
        multiple
        style={{ marginBottom: 12 }}
        onChange={(e: any) => {
          const files = Array.from(e.target.files);

          Promise.all(
            files.map(
              (file: any) =>
                new Promise((res) => {
                  const r = new FileReader();
                  r.onloadend = () => res(r.result);
                  r.readAsDataURL(file);
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

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8
      }}>
        {(chicken.album || []).map((img: any, i: number) => (
          <img
            key={i}
            src={img}
            onClick={() => {
              setActiveIndex(i);
              setActiveImage(img);
            }}
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              objectFit: "cover",
              borderRadius: 12,
              cursor: "pointer"
            }}
          />
        ))}
      </div>
    </div>

    {/* HEALTH */}
    <div style={{
      background: "#fff",
      borderRadius: 18,
      padding: 16,
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    }}>
      <h3 style={{ marginBottom: 10 }}>🩺 Health Logs</h3>

      <button
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 12,
          background: "#22c55e",
          color: "#fff",
          border: "none",
          marginBottom: 10,
          cursor: "pointer"
        }}
        onClick={() => setShowHealthForm(!showHealthForm)}
      >
        + Add Log
      </button>

      {showHealthForm && (
        <>
          <input
            type="date"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
              marginBottom: 8
            }}
            value={healthForm.date}
            onChange={(e) =>
              setHealthForm({ ...healthForm, date: e.target.value })
            }
          />

          <input
            placeholder="Symptoms"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
              marginBottom: 8
            }}
            value={healthForm.symptoms}
            onChange={(e) =>
              setHealthForm({ ...healthForm, symptoms: e.target.value })
            }
          />

          <button
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 12,
              background: "#3b82f6",
              color: "#fff",
              border: "none"
            }}
            onClick={saveHealth}
          >
            Save
          </button>
        </>
      )}

      {(chicken.healthLogs || []).map((log: any) => (
        <div
          key={log.id}
          style={{
            marginTop: 10,
            padding: 10,
            background: "#f9fafb",
            borderRadius: 10
          }}
        >
          {log.symptoms}
        </div>
      ))}
    </div>

    {/* IMAGE VIEWER */}
    {activeImage && (
      <div
        onClick={() => setActiveImage(null)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}
      >
        <img
          src={activeImage}
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            borderRadius: 12
          }}
        />
      </div>
    )}
  </div>
);

      {/* ================= HEALTH ================= */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        <button style={btn} onClick={() => setShowHealthForm(!showHealthForm)}>
          + Add
        </button>

        {showHealthForm && (
          <>
            <input
              type="date"
              style={input}
              value={healthForm.date}
              onChange={(e) =>
                setHealthForm({ ...healthForm, date: e.target.value })
              }
            />

            <input
              placeholder="Symptoms"
              style={input}
              value={healthForm.symptoms}
              onChange={(e) =>
                setHealthForm({ ...healthForm, symptoms: e.target.value })
              }
            />

            <button style={btn} onClick={saveHealth}>
              Save
            </button>
          </>
        )}

        {(chicken.healthLogs || []).map((log: any) => (
          <div key={log.id}>{log.symptoms}</div>
        ))}
      </div>
    </div>
  );
}