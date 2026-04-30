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
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("registry")} style={primary}>
          ← Back to Registry
        </button>
      </div>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          <img
            src={chicken.image}
            style={{ width: 150, height: 150, borderRadius: 12 }}
          />

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
                  cursor: "pointer",
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
        <div style={sectionTitle}>🩺 Health Logs</div>

        <button style={success} onClick={() => setShowHealthForm(!showHealthForm)}>
          + Add Health Log
        </button>

        {showHealthForm && (
          <div style={{ marginTop: 15 }}>
            <input type="date" value={healthForm.date} onChange={(e) => setHealthForm({ ...healthForm, date: e.target.value })} style={inputStyle} />
            <select value={healthForm.status} onChange={(e) => setHealthForm({ ...healthForm, status: e.target.value })} style={inputStyle}>
              <option>Healthy</option>
              <option>Sick</option>
              <option>Recovering</option>
            </select>
            <input placeholder="Symptoms" value={healthForm.symptoms} onChange={(e) => setHealthForm({ ...healthForm, symptoms: e.target.value })} style={inputStyle} />

            {/* BUTTONS */}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={addHealth} style={success}>
                {editingLogId ? "Update Log" : "Save Log"}
              </button>

              {editingLogId && (
                <button
                  onClick={() => {
                    setEditingLogId(null);
                    setShowHealthForm(false);
                    setHealthForm({
                      date: "",
                      status: "Healthy",
                      symptoms: "",
                      treatment: "",
                      notes: "",
                    });
                  }}
                  style={{
                    background: "#e5e7eb",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}

              {editingLogId && (
                <button
                  onClick={() => {
                    updateChicken({
                      ...chicken,
                      healthLogs: healthLogs.filter(
                        (l: any) => l.id !== editingLogId
                      ),
                    });

                    setEditingLogId(null);
                    setShowHealthForm(false);
                  }}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )}

        {/* LIST */}
        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <b>{log.status}</b> — {log.symptoms}

              <button
                onClick={() => {
                  setEditingLogId(log.id);
                  setHealthForm({
                    date: log.date || "",
                    status: log.status,
                    symptoms: log.symptoms,
                    treatment: log.treatment || "",
                    notes: log.notes || "",
                  });
                  setShowHealthForm(true);
                }}
                style={{
                  fontSize: 11,
                  padding: "2px 6px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  background: "#f3f4f6",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            </div>

            <label style={{ fontSize: 13, color: "#555" }}>
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
                style={{ marginRight: 6 }}
              />
              ✔ Health Issue Resolved
            </label>
          </div>
        ))}
      </div>

      {/* IMAGE POPUP */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={activeImage}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 12,
            }}
          />
        </div>
      )}
    </div>
  );
}