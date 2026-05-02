import { useState, useEffect } from "react";
import ProfileSection from "../components/ProfileSection";
import Dashboard from "../components/Dashboard";  // 👈 ADD THIS
import QuickActions from "../components/QuickActions";

export default function ChickenRegistry({
  chickens,
  setChickens,
  setSelectedChicken,
  navigate,
  saveChickenToDB, // 🔥 ADD THIS LINE
}: any) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    idTag: "",
    name: "",
    breed: "",
    sex: "Hen",
    ageGroup: "Adult",
    image: "",
  });

  // ================= IMAGE =================
  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // ================= ADD =================
  const addChicken = () => {
    if (!form.name) return alert("Name required");

    const newChicken = {
      id: Date.now(),
      ...form,
      healthLogs: [],
      notes: [],
      album: [],
    };

    setChickens((prev: any[]) => [...prev, newChicken]);
    saveChickenToDB(newChicken);
    setShowForm(false);
  };

  // ================= HEALTH STATUS =================
  const getHealthStatus = (c: any) => {
  const logs = c.healthLogs || [];

  if (logs.some((l: any) => l.status === "Ongoing"))
    return { color: "#ef4444", label: "Ongoing" };

  if (logs.some((l: any) => l.status === "Monitoring"))
    return { color: "#eab308", label: "Monitoring" };

  return { color: "#22c55e", label: "Healthy" };
};
const getAttentionCount = () => {
  let count = 0;

  chickens.forEach((chicken: any) => {
    const logs = chicken.healthLogs || [];

    const needsAttention = logs.some((log: any) => {
      if (!log.date) return false;

      const daysOld =
        (new Date().getTime() - new Date(log.date).getTime()) /
        (1000 * 60 * 60 * 24);

      return (
        (log.status === "Ongoing" && daysOld > 2) ||
        (log.status === "Monitoring" && daysOld > 5)
      );
    });

    if (needsAttention) count++;
  });

  return count;
};
  // ================= STYLES =================
  const container = {
    padding: 20,
    maxWidth: 1100,
  };

  const header = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  };

  const card = {
    background: "#fff",
    padding: 16,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginBottom: 12,
    cursor: "pointer",
  };

  const button = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "#22c55e",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  };
const attentionCount = getAttentionCount();

  return (
  <div style={container}>

    <Dashboard chickens={chickens} />  

{attentionCount > 0 && (
  <div style={{
    background: "#fee2e2",
    padding: "10px 14px",
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: 600,
  }}>
    ⚠️ {attentionCount} chicken(s) need attention
  </div>
)}

<QuickActions setShowForm={setShowForm} setFilter={setFilter} />

    {/* rest of your UI */}

      {/* HEADER */}
      <div style={header}>
        <div>
          <h2 style={{ margin: 0 }}>🐔 Chicken Registry</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
            Manage and track your chickens
          </p>
        </div>

        <button onClick={() => setShowForm(!showForm)} style={button}>
          {showForm ? "Cancel" : "+ Add Chicken"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div style={header}>
          <input
            placeholder="ID Tag"
            value={form.idTag}
            onChange={(e) => setForm({ ...form, idTag: e.target.value })}
          />

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Breed"
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
          />

          <input type="file" onChange={handleImage} />

          <button onClick={addChicken}>Save</button>
        </div>
      )}

      {/* LIST */}
      {chickens.length === 0 && <p>No chickens yet</p>}

      {chickens
  .filter((c: any) => {
  if (filter === "all") return true;

  if (filter === "issues") {
    return (c.healthLogs || []).some(
      (log: any) =>
        log.status === "Ongoing" || log.status === "Monitoring"
    );
  }

  return true;
})
  .map((c: any) => {
        const status = getHealthStatus(c);

        return (
          <div
            key={c.id}
            style={card}
            onClick={() => {
              setSelectedChicken({ ...c });
              navigate("profile");
            }}
          >
            {/* IMAGE */}
            <img
              src={c.image || ""}
              style={{
                width: 80,
                height: 80,
                borderRadius: 10,
                objectFit: "cover",
                background: "#eee",
              }}
            />

            {/* INFO */}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>{c.name}</h3>

              <div style={{ fontSize: 13, color: "#555" }}>
                ID Tag: {c.idTag}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: status.color,
                  }}
                />
                <span style={{ fontSize: 12 }}>{status.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}