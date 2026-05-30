import FlockFeedPlan from "../components/FlockFeedPlan";
import { useState } from "react";
import QuickActions from "../components/QuickActions";

export default function ChickenRegistry({
  chickens,
  setChickens,
  setSelectedChicken,
  navigate,
  saveChickenToDB,
}: any) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("active");
  const [showMenu, setShowMenu] = useState(false);

  const [form, setForm] = useState({
    idTag: "",
    name: "",
    breed: "",
    sex: "Hen",
    ageGroup: "Adult",
    image: "",
  });

  const activeChickens = chickens.filter((c: any) => !c.archived);
  const inactiveChickens = chickens.filter((c: any) => c.archived);

  const isHen = (c: any) =>
    ["hen", "female"].includes((c.sex || "").toLowerCase());

  const isRooster = (c: any) =>
    ["rooster", "male", "cock"].includes((c.sex || "").toLowerCase());

  const isChick = (c: any) =>
    (c.ageGroup || "").toLowerCase().includes("chick");

  const activeHens = activeChickens.filter(isHen).length;
  const activeRoosters = activeChickens.filter(isRooster).length;

  const filterButtons = [
    { key: "active", label: "Active Chickens" },
    { key: "inactive", label: "Inactive Chickens" },
    { key: "roosters", label: "Roosters Only" },
    { key: "hens", label: "Hens Only" },
    { key: "chicks", label: "Chicks Only" },
    { key: "issues", label: "Health Issues" },
  ];

  const filteredChickens = chickens.filter((c: any) => {
    if (filter === "active") return !c.archived;
    if (filter === "inactive") return c.archived;
    if (filter === "roosters") return !c.archived && isRooster(c);
    if (filter === "hens") return !c.archived && isHen(c);
    if (filter === "chicks") return !c.archived && isChick(c);

    if (filter === "issues") {
      return (
        !c.archived &&
        (c.healthLogs || []).some(
          (log: any) =>
            log.status === "Ongoing" || log.status === "Monitoring"
        )
      );
    }

    return !c.archived;
  });

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({
        ...form,
        image: reader.result as string,
      });
    };

    reader.readAsDataURL(file);
  };

  const addChicken = () => {
    if (!form.name) return alert("Name required");

    const newChicken = {
      id: Date.now(),
      ...form,
      archived: false,
      healthLogs: [],
      notes: [],
      album: [],
    };

    setChickens((prev: any[]) => [...prev, newChicken]);
    saveChickenToDB(newChicken);
    setShowForm(false);
  };

  const getHealthStatus = (c: any) => {
    const logs = c.healthLogs || [];

    if (logs.some((l: any) => l.status === "Ongoing")) {
      return { color: "#ef4444", label: "Ongoing" };
    }

    if (logs.some((l: any) => l.status === "Monitoring")) {
      return { color: "#eab308", label: "Monitoring" };
    }

    return { color: "#22c55e", label: "Healthy" };
  };

  const getAttentionCount = () => {
    let count = 0;

    activeChickens.forEach((chicken: any) => {
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

  const attentionCount = getAttentionCount();

  const pulseStyle = `
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.85; }
      100% { transform: scale(1); opacity: 1; }
    }
  `;

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

  return (
    <div style={container}>
      <div
        className="
          bg-gradient-to-r
          from-green-700
          to-green-400
          rounded-3xl
          p-8
          mb-6
          text-white
          shadow-lg
          flex
          justify-between
          items-center
          gap-6
        "
      >
        <div>
          <div className="text-xs tracking-[0.3em] font-bold mb-3">
            FLOCK
          </div>

          <h1 className="text-4xl font-bold mb-2">Chicken Registry</h1>

          <div className="text-white/90">
            Manage your chickens, breeding stock and profiles.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[110px]">
            <div className="text-3xl font-bold">{activeChickens.length}</div>
            <div className="text-[10px] tracking-widest">ACTIVE</div>
          </div>

          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[110px]">
            <div className="text-3xl font-bold">{activeHens}</div>
            <div className="text-[10px] tracking-widest">HENS</div>
          </div>

          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[110px]">
            <div className="text-3xl font-bold">{activeRoosters}</div>
            <div className="text-[10px] tracking-widest">ROOSTERS</div>
          </div>
        </div>
      </div>

      <FlockFeedPlan chickens={activeChickens} />

      <style>{pulseStyle}</style>

      {attentionCount > 0 && (
        <div
          style={{
            background: "#fee2e2",
            padding: "10px 14px",
            borderRadius: 10,
            marginBottom: 10,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ⚠️ {attentionCount} chicken(s) need attention
        </div>
      )}

      <QuickActions setShowForm={setShowForm} setFilter={setFilter} />

      <div className="flex flex-wrap gap-2 mb-4 mt-3">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`
              px-4 py-2 rounded-full text-sm font-bold border transition
              ${
                filter === btn.key
                  ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md"
                  : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"
              }
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>

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

      {filteredChickens.length === 0 && (
        <p style={{ color: "#6b5a3a", fontWeight: 600 }}>
          No chickens found for this filter.
        </p>
      )}

      {filteredChickens
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
                border: isCritical
                  ? "2px solid #ef4444"
                  : c.archived
                  ? "2px solid #9ca3af"
                  : "2px solid transparent",
                background: isCritical ? "#fef2f2" : c.archived ? "#f3f4f6" : "#fff",
                opacity: c.archived ? 0.78 : 1,
              }}
              onClick={() => {
                setSelectedChicken({
                  ...c,
                  goTo: "health",
                });

                navigate("profile");
              }}
            >
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

              <div style={{ flex: 1 }}>
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

                  {c.archived && (
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "#fff",
                        background: "#6b7280",
                        padding: "2px 6px",
                        borderRadius: 6,
                        display: "inline-block",
                        marginBottom: 4,
                        marginLeft: isCritical ? 6 : 0,
                      }}
                    >
                      INACTIVE
                    </div>
                  )}

                  <h3 style={{ margin: 0 }}>{c.name}</h3>
                </div>

                <div style={{ fontSize: 13, color: "#555" }}>
                  ID Tag: {c.idTag}
                </div>

                <div style={{ fontSize: 13, color: "#555" }}>
                  {c.sex} • {c.ageGroup} • {c.breed}
                </div>

                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      background: status.color,
                      color: "#fff",
                      borderRadius: 999,
                      fontWeight: 600,
                    }}
                  >
                    {status.label}
                  </div>

                  {isCritical && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fixIssues();
                      }}
                      style={{
                        fontSize: 12,
                        padding: "4px 10px",
                        background: "#22c55e",
                        color: "#fff",
                        border: "none",
                        borderRadius: 999,
                        cursor: "pointer",
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
                      style={{
                        fontSize: 11,
                        padding: "4px 10px",
                        background: "#6b7280",
                        color: "#fff",
                        border: "none",
                        borderRadius: 999,
                        cursor: "pointer",
                      }}
                    >
                      ↩ Undo
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}