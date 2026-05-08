import { useState, useEffect } from "react";
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
  const [showMenu, setShowMenu] = useState(false);

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

// ================= ATTENTION COUNT =================
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

// 👇 Keep this just before return
const attentionCount = getAttentionCount();
const pulseStyle = `
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.85; }
  100% { transform: scale(1); opacity: 1; }
}
`;
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
    justifyContent: "flex-start",
gap: 10,
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

  return (
  <div style={container}>

{/* ✅ OVERLAY */}
{showMenu && (
  <div
    onClick={() => setShowMenu(false)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.4)",
      zIndex: 999,
    }}
  />
)}

{/* ✅ SLIDE MENU */}
<div
  style={{
    position: "fixed",
    top: 0,
    left: showMenu ? 0 : "-100%",
    width: "80%",
    height: "100%",
    background: "#fff",
    boxShadow: "2px 0 12px rgba(0,0,0,0.2)",
    padding: 20,
    zIndex: 1000,
    transition: "left 0.3s ease",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }}
>
  <button
  onClick={() => setShowMenu(false)}
  style={{
    alignSelf: "flex-end",
    fontSize: 18,
    background: "transparent",
    border: "none",
    cursor: "pointer",
  }}
>
  ✖
</button>

  <button onClick={() => navigate("registry")}>
    🐔 Registry
  </button>

  <button onClick={() => navigate("profile")}>
    📋 Profile
  </button>
</div>

    <style>{pulseStyle}</style>

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
  .sort((a: any, b: any) => {
    const getPriority = (c: any) => {
      const logs = c.healthLogs || [];

      if (logs.some((l: any) => l.status === "Ongoing")) return 1;
      if (logs.some((l: any) => l.status === "Monitoring")) return 2;
      return 3;
    };

    return getPriority(a) - getPriority(b);
  })
  .map((c: any) => {
    const logs = c.healthLogs || [];

const isCritical = logs.some((log: any) => {
  if (!log.date) return false;

  const daysOld =
    (new Date().getTime() - new Date(log.date).getTime()) /
    (1000 * 60 * 60 * 24);

  return (
    (log.status === "Ongoing" && daysOld > 2) ||
    (log.status === "Monitoring" && daysOld > 5)
  );
});
        const status = getHealthStatus(c);
          const fixIssues = () => {
  const prevLogs = c.healthLogs || [];

  const updatedLogs = prevLogs.map((log: any) =>
  log.status === "Ongoing" || log.status === "Monitoring"
    ? { ...log, status: "Resolved" }
    : log
);

  const updatedChicken = {
    ...c,
    healthLogs: updatedLogs,
    activity: [
      ...(c.activity || []),
      {
        type: "fix",
        text: "Issues marked as resolved",
        time: Date.now(),
      },
    ],
    _lastAction: {
      type: "fix",
      previousLogs: prevLogs,
    },
  };

  setChickens((prev: any[]) =>
    prev.map((ch) => (ch.id === c.id ? updatedChicken : ch))
  );
};

  // 👇 ADD THIS RIGHT HERE
  const undoFix = () => {
  if (!c._lastAction) return;

  const updatedChicken = {
    ...c,
    healthLogs: c._lastAction.previousLogs,
    activity: [
      ...(c.activity || []),
      {
        type: "undo",
        text: "Fix was undone",
        time: Date.now(),
      },
    ],
    _lastAction: null,
  };

  setChickens((prev: any[]) =>
    prev.map((ch) => (ch.id === c.id ? updatedChicken : ch))
  );
};

  return (
          <div
            key={c.id}
            style={{
  ...card,
  border: isCritical ? "2px solid #ef4444" : "2px solid transparent",
  background: isCritical ? "#fef2f2" : "#fff",
}}
            onClick={() => {
  setSelectedChicken({ ...c, goTo: "health" });
  navigate("profile");
}}
          >
            {/* IMAGE */}
            <img
              src={c.image || "https://via.placeholder.com/80"}
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

  {/* NAME + URGENT */}
  <div>
    {isCritical && (
      <div
        style={{
          fontSize: 10,
          fontWeight: "bold",
          color: "#fff",
          background: "#ef4444",
          padding: "2px 6px",
          borderRadius: 6,
          display: "inline-block",
          marginBottom: 4,
          animation: "pulse 1.5s infinite",
        }}
      >
        URGENT
      </div>
    )}

    {/* ✅ MOVE YOUR H3 HERE */}
    <h3 style={{ margin: 0 }}>{c.name}</h3>
  </div>
                            
  {/* ID */}
  <div style={{ fontSize: 13, color: "#555" }}>
    ID Tag: {c.idTag}
  </div>

  {/* STATUS */}
<div style={{
  marginTop: 6,
  display: "flex",
  gap: 6,
  alignItems: "center",
}}>
  {isCritical && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        fixIssues();
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}   // 👈 ADD
      onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}         // 👈 ADD
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}      // 👈 ADD
      style={{
        fontSize: 12,
        padding: "4px 10px",
        background: "#22c55e",
        color: "#fff",
        border: "none",
        borderRadius: 999,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      ✔ Fix
    </button>
  )}

  {c._lastAction?.type === "fix" && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        undoFix();
      }}
     onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}   // 👈 ADD
     onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}         // 👈 ADD
     onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}      // 👈 ADD
      style={{
        fontSize: 11,
        padding: "4px 10px",
        background: "#6b7280",
        color: "#fff",
        border: "none",
        borderRadius: 999,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      ↩ Undo
    </button>
  )}
</div>

{/* ✅ BUTTON WRAPPER GOES HERE */}


</div>

</div>
        );
      })}
    </div>
  );
}