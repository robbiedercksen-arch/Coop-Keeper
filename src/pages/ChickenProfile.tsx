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

  // 🔥 EDIT STATE
  const [isEditingChicken, setIsEditingChicken] = useState(false);

  const [editForm, setEditForm] = useState(() => ({
    name: selectedChicken.name,
    idTag: selectedChicken.idTag,
    breed: selectedChicken.breed,
    sex: selectedChicken.sex,
    ageGroup: selectedChicken.ageGroup,
  }));

  useEffect(() => {
    setEditForm({
      name: chicken.name,
      idTag: chicken.idTag,
      breed: chicken.breed,
      sex: chicken.sex,
      ageGroup: chicken.ageGroup,
    });
  }, [chicken]);

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [viewLog, setViewLog] = useState<any>(null);

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

  const saveChickenEdit = () => {
    updateChicken({ ...chicken, ...editForm });
    setIsEditingChicken(false);
  };

  const saveHealth = () => {
    if (!healthForm.date) return alert("Date required");

    updateChicken({
      ...chicken,
      healthLogs: [
        ...healthLogs,
        { id: Date.now(), ...healthForm, resolved: false },
      ],
    });

    setShowHealthForm(false);
    setHealthForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });
  };

  const deleteHealthLog = (id: number) => {
    updateChicken({
      ...chicken,
      healthLogs: healthLogs.filter((l: any) => l.id !== id),
    });
  };

  const editHealthLog = (log: any) => {
    setHealthForm(log);
    setShowHealthForm(true);
  };

  const card = {
    background: "#ffffff",
    padding: 20,
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    marginBottom: 20,
    border: "1px solid #f1f5f9",
  };

  const btn = {
    padding: "8px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  const input = {
    display: "block",
    width: "100%",
    marginBottom: 8,
    padding: 6,
  };

  const header = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottom: "2px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const getColor = (status: string) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "Sick") return "#ef4444";
    return "#eab308";
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      <button
        onClick={() => navigate("registry")}
        style={{ ...btn, background: "#3b82f6", color: "#fff", marginBottom: 20 }}
      >
        ← Back
      </button>

      <button
        style={{ ...btn, background: "#6366f1", color: "#fff", marginBottom: 10 }}
        onClick={() => setIsEditingChicken(true)}
      >
        Edit Chicken Profile
      </button>

      <div style={card}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>

          {chicken.image && (
            <img
              src={chicken.image}
              style={{ width: 140, height: 140, borderRadius: 12 }}
            />
          )}

          <div>
            {!isEditingChicken ? (
              <>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
                  {chicken.name}
                </h1>
                <div style={{ marginTop: 4 }}>
                  <b>ID Tag:</b> {chicken.idTag}
                </div>
                <div><b>Breed:</b> {chicken.breed}</div>
                <div><b>Sex:</b> {chicken.sex}</div>
                <div><b>Age:</b> {chicken.ageGroup}</div>
              </>
            ) : (
              <>
                <input style={input} value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
                <input style={input} value={editForm.idTag}
                  onChange={(e) => setEditForm({ ...editForm, idTag: e.target.value })}
                />
                <input style={input} value={editForm.breed}
                  onChange={(e) => setEditForm({ ...editForm, breed: e.target.value })}
                />
                <input style={input} value={editForm.sex}
                  onChange={(e) => setEditForm({ ...editForm, sex: e.target.value })}
                />
                <input style={input} value={editForm.ageGroup}
                  onChange={(e) => setEditForm({ ...editForm, ageGroup: e.target.value })}
                />

                <button style={{ ...btn, background: "#22c55e", color: "#fff" }} onClick={saveChickenEdit}>
                  Save
                </button>

                <button onClick={() => setIsEditingChicken(false)}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* PHOTO ALBUM */}
      <div style={card}>
        <div style={header}>📸 Photo Album</div>

        <label style={{ ...btn, background: "#22c55e", color: "#fff" }}>
          + Add Photos
          <input type="file" multiple style={{ display: "none" }} />
        </label>
      </div>

      {/* HEALTH LOGS */}
      <div style={card}>
        <div style={header}>🩺 Health Logs</div>

        <button
          style={{ ...btn, background: "#22c55e", color: "#fff" }}
          onClick={() => setShowHealthForm(prev => !prev)}
        >
          + Add Health Log
        </button>

        {healthLogs.map((log: any) => (
          <div
            key={log.id}
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 10,
              background: "#f9fafb",
            }}
          >

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: getColor(log.status),
                }}
              />
              <b>{log.status}</b> — {log.symptoms}
            </div>

            <div style={{ marginTop: 6 }}>
              <label>
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
                  style={{ marginLeft: 8 }}
                />
              </label>
            </div>

            <div style={{ marginTop: 6 }}>
              <button onClick={() => setViewLog(log)}>View</button>
              <button onClick={() => editHealthLog(log)}>Edit</button>
              <button onClick={() => deleteHealthLog(log.id)}>Delete</button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}