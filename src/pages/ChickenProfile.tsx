import { useNavigate } from "react-router-dom";

export default function ChickenProfile() {
  const navigate = useNavigate();

  // 🔹 Base button style (shared)
  const btn = {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  };

  return (
    <div style={{ padding: 20 }}>

      {/* 🔙 Back Button (FIXED & IMPROVED) */}
      <div style={{ marginBottom: 15 }}>
        <button
          onClick={() => navigate("registry")}
          style={{
            ...btn,
            background: "#4f6df5",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          ← Back to Registry
        </button>
      </div>

      {/* 🐔 Chicken Card */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          marginBottom: 20,
          display: "flex",
          gap: 20,
        }}
      >
        <img
          src="https://via.placeholder.com/150"
          alt="Chicken"
          style={{ borderRadius: 10, width: 150, height: 150 }}
        />

        <div>
          <h2 style={{ margin: 0 }}>Caramel</h2>
          <p><strong>ID:</strong> 001</p>
          <p><strong>Status:</strong> Active</p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{
                ...btn,
                background: "#4f6df5",
                color: "#fff",
              }}
            >
              Edit
            </button>

            <button
              style={{
                ...btn,
                background: "#ef4444",
                color: "#fff",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ❤️ Health Logs */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          marginBottom: 20,
        }}
      >
        <h3>Health Logs</h3>

        <button
          style={{
            ...btn,
            background: "#f59e0b",
            color: "#fff",
            marginBottom: 10,
          }}
        >
          Add Health Record
        </button>

        {/* Example logs */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span>2026-04-27 — Sick</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...btn, background: "#6366f1", color: "#fff" }}>View</button>
            <button style={{ ...btn, background: "#4f6df5", color: "#fff" }}>Edit</button>
            <button style={{ ...btn, background: "#ef4444", color: "#fff" }}>Delete</button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span>2026-04-27 — Healthy</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...btn, background: "#6366f1", color: "#fff" }}>View</button>
            <button style={{ ...btn, background: "#4f6df5", color: "#fff" }}>Edit</button>
            <button style={{ ...btn, background: "#ef4444", color: "#fff" }}>Delete</button>
          </div>
        </div>
      </div>

      {/* 📝 Notes */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h3>Notes & Observations</h3>
        <p>No notes yet...</p>
      </div>
    </div>
  );
}