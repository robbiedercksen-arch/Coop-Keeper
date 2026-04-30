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

  const [isEditingChicken, setIsEditingChicken] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);

  const [editForm, setEditForm] = useState({
    name: selectedChicken.name,
    idTag: selectedChicken.idTag,
    breed: selectedChicken.breed,
    sex: selectedChicken.sex,
    ageGroup: selectedChicken.ageGroup,
  });

  useEffect(() => {
    setEditForm({
      name: chicken.name,
      idTag: chicken.idTag,
      breed: chicken.breed,
      sex: chicken.sex,
      ageGroup: chicken.ageGroup,
    });
  }, [chicken]);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
  });

  const healthLogs = chicken.healthLogs || [];
  const album = chicken.album || [];

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

  const deleteHealthLog = (id: number) => {
    updateChicken({
      ...chicken,
      healthLogs: healthLogs.filter((l: any) => l.id !== id),
    });
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

      {/* EDIT BUTTON */}
      <button
        style={{ ...btn, background: "#6366f1", color: "#fff", marginBottom: 10 }}
        onClick={() => setIsEditingChicken(true)}
      >
        Edit Chicken Profile
      </button>

      {/* PROFILE */}
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
                <h2>{chicken.name}</h2>
                <div>ID: {chicken.idTag}</div>
                <div>Breed: {chicken.breed}</div>
                <div>Sex: {chicken.sex}</div>
                <div>Age: {chicken.ageGroup}</div>
              </>
            ) : (
              <>
                <input style={input} value={editForm.name} onChange={(e)=>setEditForm({...editForm,name:e.target.value})}/>
                <input style={input} value={editForm.idTag} onChange={(e)=>setEditForm({...editForm,idTag:e.target.value})}/>
                <input style={input} value={editForm.breed} onChange={(e)=>setEditForm({...editForm,breed:e.target.value})}/>
                <input style={input} value={editForm.sex} onChange={(e)=>setEditForm({...editForm,sex:e.target.value})}/>
                <input style={input} value={editForm.ageGroup} onChange={(e)=>setEditForm({...editForm,ageGroup:e.target.value})}/>

                <button style={{ ...btn, background: "#22c55e", color: "#fff" }} onClick={saveChickenEdit}>
                  Save
                </button>
                <button onClick={() => setIsEditingChicken(false)}>Cancel</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* PHOTO ALBUM */}
      <div style={card}>
        <h3>📸 Photo Album</h3>

        <input
          type="file"
          multiple
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
                album: [...album, ...images],
              });
            });
          }}
        />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          {album.map((img: any, i: number) => (
            <div key={i}>
              <img src={img} style={{ width: 100, height: 100 }} />
              <button
                onClick={() =>
                  updateChicken({
                    ...chicken,
                    album: album.filter((_: any, index: number) => index !== i),
                  })
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* HEALTH LOGS */}
      <div style={card}>
        <h3>🩺 Health Logs</h3>

        <button onClick={() => setShowHealthForm(!showHealthForm)}>
          + Add Health Log
        </button>

        {showHealthForm && (
          <>
            <input type="date" style={input} value={healthForm.date}
              onChange={(e)=>setHealthForm({...healthForm,date:e.target.value})}/>
            <select style={input} value={healthForm.status}
              onChange={(e)=>setHealthForm({...healthForm,status:e.target.value})}>
              <option>Healthy</option>
              <option>Sick</option>
              <option>Recovering</option>
            </select>
            <input style={input} placeholder="Symptoms"
              value={healthForm.symptoms}
              onChange={(e)=>setHealthForm({...healthForm,symptoms:e.target.value})}/>
            <button onClick={saveHealth}>Save</button>
          </>
        )}

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
    {/* STATUS */}
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: getColor(log.status),
        }}
      />
      <b>{log.status}</b>
      <span style={{ marginLeft: 6 }}>— {log.symptoms}</span>
    </div>

    {/* RESOLVED */}
    <div style={{ marginTop: 8 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span>Resolved</span>
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

    {/* ACTIONS */}
    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
      <button
        style={{ ...btn, background: "#3b82f6", color: "#fff" }}
        onClick={() => setViewLog(log)}
      >
        View
      </button>

      <button
        style={{ ...btn, background: "#f59e0b", color: "#fff" }}
        onClick={() => editHealthLog(log)}
      >
        Edit
      </button>

      <button
        style={{ ...btn, background: "#ef4444", color: "#fff" }}
        onClick={() => deleteHealthLog(log.id)}
      >
        Delete
      </button>
    </div>
  </div>
))}