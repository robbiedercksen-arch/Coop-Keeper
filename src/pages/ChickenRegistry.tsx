import { useState, useEffect } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  setSelectedChicken,
  navigate,
}: any) {

  // 🔥 SAFETY FIX
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

  const [viewLog, setViewLog] = useState<any>(null);
  const [viewNote, setViewNote] = useState<any>(null);

  const healthLogs = selectedChicken.healthLogs || [];
  const notes = selectedChicken.notes || [];
  const album = selectedChicken.album || [];

  // ================= SAFE UPDATE =================
  const updateChicken = (updated: any) => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? updated : c))
    );

    setSelectedChicken(updated);
  };

  // ================= STYLES =================
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
    fontWeight: 600,
  };

  const primary = { ...btn, background: "#3b82f6", color: "#fff" };
  const success = { ...btn, background: "#22c55e", color: "#fff" };
  const danger = { ...btn, background: "#ef4444", color: "#fff" };

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      {/* BACK */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("registry")} style={primary}>
          ← Back to Registry
        </button>
      </div>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          <img
            src={selectedChicken.image || ""}
            style={{
              width: 150,
              height: 150,
              borderRadius: 12,
              objectFit: "cover",
            }}
          />

          <div>
            <h1>{selectedChicken.name || "Unnamed Chicken"}</h1>
            <div><b>ID Tag:</b> {selectedChicken.idTag || "-"}</div>
            <div><b>Breed:</b> {selectedChicken.breed || "-"}</div>
            <div><b>Sex:</b> {selectedChicken.sex || "-"}</div>
            <div><b>Age:</b> {selectedChicken.ageGroup || "-"}</div>
          </div>
        </div>
      </div>

      {/* ================= PHOTO ALBUM ================= */}
      <div style={card}>
        <h3>📸 Photo Album</h3>

        <label style={success}>
          + Add Photos
          <input
            type="file"
            multiple
            onChange={(e: any) => {
              const files = Array.from(e.target.files);

              files.forEach((file: any) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  updateChicken({
                    ...selectedChicken,
                    album: [...album, reader.result],
                  });
                };
                reader.readAsDataURL(file);
              });
            }}
            style={{ display: "none" }}
          />
        </label>

        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          {album.map((img: any, i: number) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={img}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />

              <button
                onClick={() => {
                  const updated = album.filter((_: any, index: number) => index !== i);
                  updateChicken({ ...selectedChicken, album: updated });
                }}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
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

      {/* ================= HEALTH ================= */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginTop: 10 }}>
            <b>{log.status}</b> — {log.symptoms}

            <label>
              <input
                type="checkbox"
                checked={log.resolved}
                onChange={() =>
                  updateChicken({
                    ...selectedChicken,
                    healthLogs: healthLogs.map((l: any) =>
                      l.id === log.id ? { ...l, resolved: !l.resolved } : l
                    ),
                  })
                }
              /> ✔ Resolved
            </label>

            <button onClick={() => setViewLog(log)}>View</button>
          </div>
        ))}
      </div>

      {/* ================= NOTES ================= */}
      <div style={card}>
        <h3>📝 Notes</h3>

        {notes.map((n: any) => (
          <div key={n.id} style={{ marginTop: 10 }}>
            {n.description}
            <button onClick={() => setViewNote(n)}>View</button>
          </div>
        ))}
      </div>

      {/* NOTE VIEW */}
      {viewNote && (
        <div style={card}>
          <h3>Note Details</h3>
          <p>{viewNote.description}</p>

          <button
            style={danger}
            onClick={() => {
              updateChicken({
                ...selectedChicken,
                notes: notes.filter((n: any) => n.id !== viewNote.id),
              });
              setViewNote(null);
            }}
          >
            Delete
          </button>

          <button onClick={() => setViewNote(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}