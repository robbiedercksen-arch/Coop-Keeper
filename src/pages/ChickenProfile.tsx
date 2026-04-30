{/* ✅ PREMIUM VIEW MODAL */}
{viewLog && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  }}>
    <div style={{
      background: "#fff",
      padding: 24,
      borderRadius: 18,
      width: 340,
      position: "relative",
      boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
      animation: "fadeIn 0.2s ease",
    }}>

      {/* CLOSE BUTTON */}
      <button
        onClick={() => {
          setViewLog(null);
          setEditingId(null);
        }}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          border: "none",
          background: "#ef4444",
          color: "#fff",
          borderRadius: "50%",
          width: 26,
          height: 26,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ×
      </button>

      {editingId === viewLog.id ? (
        <>
          <h3 style={{ marginBottom: 12 }}>Edit Health Log</h3>

          <input
            type="date"
            style={input}
            value={healthForm.date}
            onChange={(e) =>
              setHealthForm({ ...healthForm, date: e.target.value })
            }
          />

          <select
            style={input}
            value={healthForm.status}
            onChange={(e) =>
              setHealthForm({ ...healthForm, status: e.target.value })
            }
          >
            <option>Healthy</option>
            <option>Sick</option>
            <option>Recovering</option>
          </select>

          <input
            style={input}
            placeholder="Symptoms"
            value={healthForm.symptoms}
            onChange={(e) =>
              setHealthForm({ ...healthForm, symptoms: e.target.value })
            }
          />

          <button
            style={{
              ...btn,
              background: "#22c55e",
              color: "#fff",
              width: "100%",
              marginTop: 8,
              fontWeight: 600,
            }}
            onClick={saveHealth}
          >
            Save Log
          </button>
        </>
      ) : (
        <>
          {/* STATUS BADGE */}
          <div style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 10,
            background:
              viewLog.status === "Healthy" ? "#dcfce7" :
              viewLog.status === "Sick" ? "#fee2e2" :
              "#fef3c7",
            color:
              viewLog.status === "Healthy" ? "#166534" :
              viewLog.status === "Sick" ? "#991b1b" :
              "#92400e",
          }}>
            {viewLog.status}
          </div>

          {/* CONTENT */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 15,
              fontWeight: 500,
              color: "#111827",
              marginBottom: 6
            }}>
              Symptoms
            </div>

            <div style={{
              fontSize: 14,
              color: "#4b5563",
              background: "#f9fafb",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #e5e7eb"
            }}>
              {viewLog.symptoms || "No symptoms recorded"}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{
                ...btn,
                background: "#f59e0b",
                color: "#fff",
                flex: 1,
                fontWeight: 600,
              }}
              onClick={() => {
                setHealthForm(viewLog);
                setEditingId(viewLog.id);
              }}
            >
              Edit
            </button>

            <button
              style={{
                ...btn,
                background: "#ef4444",
                color: "#fff",
                flex: 1,
                fontWeight: 600,
              }}
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
        </>
      )}
    </div>
  </div>
)}