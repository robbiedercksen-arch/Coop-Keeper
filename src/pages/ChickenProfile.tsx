import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  navigate,
}: any) {
  // ✅ SAFETY (prevents white screen)
  if (!selectedChicken) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  const [form, setForm] = useState({ ...selectedChicken });

  const healthLogs = selectedChicken?.healthLogs || [];
  const notes = selectedChicken?.notes || [];

  const [viewLog, setViewLog] = useState<any>(null);
  const [viewNote, setViewNote] = useState<any>(null);

  // BUTTON STYLE
  const btn = {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    marginRight: 5,
  };

  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const updateChicken = (updated: any) => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? updated : c))
    );
  };

  // DELETE
  const deleteChicken = () => {
    setChickens((prev: any[]) =>
      prev.filter((c) => c.id !== selectedChicken.id)
    );
    navigate("registry");
  };

  return (
    <div style={{ padding: 20 }}>
      {/* 🔥 PREMIUM BACK BUTTON */}
      <button
        onClick={() => navigate("registry")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        ← Back
      </button>

      {/* PROFILE */}
      <div style={card}>
        <h2>{selectedChicken.name}</h2>
        <p><b>ID:</b> {selectedChicken.idTag}</p>
        <p><b>Status:</b> {selectedChicken.status}</p>

        <button
          style={{ ...btn, background: "#ef4444", color: "#fff" }}
          onClick={deleteChicken}
        >
          Delete Chicken
        </button>
      </div>

      {/* HEALTH */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginBottom: 10 }}>
            {log.date} — {log.status}

            <div>
              <button
                style={{ ...btn, background: "#6366f1", color: "#fff" }}
                onClick={() => setViewLog(log)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* NOTES */}
      <div style={card}>
        <h3>📝 Notes</h3>

        {notes.map((note: any) => (
          <div key={note.id} style={{ marginBottom: 10 }}>
            {note.date} — {note.type}

            <div>
              <button
                style={{ ...btn, background: "#6366f1", color: "#fff" }}
                onClick={() => setViewNote(note)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW HEALTH */}
      {viewLog && (
        <div style={card}>
          <h3>Health Details</h3>
          <p>{viewLog.date}</p>
          <p>{viewLog.status}</p>
          <p>{viewLog.notes}</p>

          <button onClick={() => setViewLog(null)}>Close</button>
        </div>
      )}

      {/* VIEW NOTE */}
      {viewNote && (
        <div style={card}>
          <h3>Note Details</h3>
          <p>{viewNote.date}</p>
          <p>{viewNote.type}</p>
          <p>{viewNote.description}</p>

          <button onClick={() => setViewNote(null)}>Close</button>
        </div>
      )}
    </div>
  );
}