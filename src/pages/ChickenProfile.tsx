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

  useEffect(() => {
    setChicken(selectedChicken);
  }, [selectedChicken]);

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [editingLogId, setEditingLogId] = useState<number | null>(null);

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

  // ================= ADD / EDIT =================
  const addHealth = () => {
    if (!healthForm.date) return alert("Date required");

    if (editingLogId) {
      updateChicken({
        ...chicken,
        healthLogs: healthLogs.map((l: any) =>
          l.id === editingLogId ? { ...l, ...healthForm } : l
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

    setEditingLogId(null);
    setShowHealthForm(false);
    setHealthForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });
  };

  // ================= STYLES =================
  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const sectionTitle = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10,
  };

  const primary = {
    background: "#3b82f6",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  };

  const success = {
    background: "#22c55e",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    width: "100%",
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      {/* BACK */}
      <button onClick={() => navigate("registry")} style={primary}>
        ← Back
      </button>

      {/* PROFILE */}
      <div style={card}>
        <h1>{chicken.name}</h1>
      </div>

      {/* PHOTO ALBUM */}
      <div style={card}>
        <div style={sectionTitle}>📸 Photo Album</div>

        <label style={success}>
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

        {(chicken.album || []).map((img: any, i: number) => (
          <img key={i} src={img} width={80} onClick={() => setActiveImage(img)} />
        ))}
      </div>

      {/* HEALTH LOGS */}
      <div style={card}>
        <div style={sectionTitle}>🩺 Health Logs</div>

        <button style={success} onClick={() => setShowHealthForm(true)}>
          + Add Health Log
        </button>

        {showHealthForm && (
          <div style={{ display: "grid", gap: 10 }}>
            <input
              type="date"
              value={healthForm.date}
              onChange={(e) =>
                setHealthForm({ ...healthForm, date: e.target.value })
              }
              style={inputStyle}
            />

            <select
              value={healthForm.status}
              onChange={(e) =>
                setHealthForm({ ...healthForm, status: e.target.value })
              }
              style={inputStyle}
            >
              <option>Healthy</option>
              <option>Sick</option>
              <option>Recovering</option>
            </select>

            <input
              placeholder="Symptoms"
              value={healthForm.symptoms}
              onChange={(e) =>
                setHealthForm({ ...healthForm, symptoms: e.target.value })
              }
              style={inputStyle}
            />

            <button onClick={addHealth} style={success}>
              {editingLogId ? "Update Log" : "Save Log"}
            </button>
          </div>
        )}

        {/* LIST */}
        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginTop: 10 }}>
            <b>{log.status}</b> — {log.symptoms}

            {/* ✔ RESOLVED */}
            <div>
              <label>
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
                />
                ✔ Resolved
              </label>

              {/* ✏️ EDIT BUTTON */}
              <button
                onClick={() => {
                  setEditingLogId(log.id);
                  setHealthForm({
                    date: log.date,
                    status: log.status,
                    symptoms: log.symptoms,
                    treatment: log.treatment || "",
                    notes: log.notes || "",
                  });
                  setShowHealthForm(true);
                }}
                style={{
                  marginLeft: 10,
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}