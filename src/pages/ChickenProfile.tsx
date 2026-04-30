import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  navigate,
}: any) {
  if (!selectedChicken) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  const [viewLog, setViewLog] = useState<any>(null);
  const [viewNote, setViewNote] = useState<any>(null);

  const healthLogs = selectedChicken?.healthLogs || [];
  const notes = selectedChicken?.notes || [];

  const deleteChicken = () => {
    setChickens((prev: any[]) =>
      prev.filter((c) => c.id !== selectedChicken.id)
    );
    navigate("registry");
  };

  // ================= STYLES =================
  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const btn = {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const label = {
    fontWeight: 600,
    color: "#555",
  };

  const value = {
    marginBottom: 8,
  };

  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={{ padding: 20, maxWidth: 1000 }}>

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => navigate("registry")}
        style={{
          padding: "10px 18px",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 20,
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        }}
      >
        ← Back to Registry
      </button>

      {/* ================= PROFILE ================= */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          
          {/* IMAGE */}
          <img
            src={selectedChicken.image}
            style={{
              width: 140,
              height: 140,
              borderRadius: 12,
              objectFit: "cover",
            }}
          />

          {/* DETAILS */}
          <div>
            <h2 style={{ marginBottom: 10 }}>
              {selectedChicken.name}
            </h2>

            <div style={value}>
              <span style={label}>ID Tag:</span> {selectedChicken.idTag}
            </div>

            <div style={value}>
              <span style={label}>Breed:</span>{" "}
              {selectedChicken.breed || "-"}
            </div>

            <div style={value}>
              <span style={label}>Sex:</span> {selectedChicken.sex}
            </div>

            <div style={value}>
              <span style={label}>Age:</span> {selectedChicken.ageGroup}
            </div>

            <div style={value}>
              <span style={label}>Added Date:</span>{" "}
              {formatDate(selectedChicken.hatchDate)}
            </div>

            <div style={value}>
              <span style={label}>Status:</span> {selectedChicken.status}
            </div>

            {/* ACTIONS */}
            <div style={{ marginTop: 15 }}>
              <button
                style={{ ...btn, background: "#3b82f6", color: "#fff" }}
              >
                Edit
              </button>

              <button
                style={{
                  ...btn,
                  background: "#ef4444",
                  color: "#fff",
                  marginLeft: 10,
                }}
                onClick={deleteChicken}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= HEALTH LOGS ================= */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        {healthLogs.length === 0 && <p>No health records</p>}

        {healthLogs.map((log: any) => (
          <div
            key={log.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <b>{log.date}</b> — {log.status}
            </div>

            <button
              style={{ ...btn, background: "#6366f1", color: "#fff" }}
              onClick={() => setViewLog(log)}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* ================= NOTES ================= */}
      <div style={card}>
        <h3>📝 Notes</h3>

        {notes.length === 0 && <p>No notes added</p>}

        {notes.map((note: any) => (
          <div
            key={note.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <b>{note.date}</b> — {note.type}
            </div>

            <button
              style={{ ...btn, background: "#6366f1", color: "#fff" }}
              onClick={() => setViewNote(note)}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* ================= VIEW HEALTH ================= */}
      {viewLog && (
        <div style={card}>
          <h3>📋 Health Details</h3>
          <p><b>Date:</b> {viewLog.date}</p>
          <p><b>Status:</b> {viewLog.status}</p>
          <p><b>Notes:</b> {viewLog.notes || "-"}</p>

          <button
            style={{ ...btn, background: "#6b7280", color: "#fff" }}
            onClick={() => setViewLog(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* ================= VIEW NOTE ================= */}
      {viewNote && (
        <div style={card}>
          <h3>📋 Note Details</h3>
          <p><b>Date:</b> {viewNote.date}</p>
          <p><b>Type:</b> {viewNote.type}</p>
          <p><b>Description:</b> {viewNote.description}</p>

          <button
            style={{ ...btn, background: "#6b7280", color: "#fff" }}
            onClick={() => setViewNote(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}