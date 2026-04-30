import { useState, useEffect } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [page, setPage] = useState("registry");

  // ✅ LOAD FROM LOCAL STORAGE
  const [chickens, setChickens] = useState<any[]>(() => {
    const saved = localStorage.getItem("chickens");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedChicken, setSelectedChicken] = useState<any>(null);

  const navigate = (p: string) => setPage(p);

  // ✅ SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  // ================= DASHBOARD =================
  const getStats = () => {
    let sick = 0;
    let recovering = 0;

    chickens.forEach((c) => {
      const unresolved = c.healthLogs?.filter((l: any) => !l.resolved) || [];

      if (unresolved.some((l: any) => l.status === "Sick")) sick++;
      else if (unresolved.some((l: any) => l.status === "Recovering"))
        recovering++;
    });

    const healthy = chickens.length - sick - recovering;

    return { total: chickens.length, sick, recovering, healthy };
  };

  const stats = getStats();

  return (
    <div style={{ display: "flex" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: 220,
          background: "#8b5e3c",
          color: "#fff",
          padding: 20,
          height: "100vh",
        }}
      >
        <h3>🐔 Coop Keeper</h3>

        <div
          style={{ marginTop: 20, cursor: "pointer" }}
          onClick={() => navigate("dashboard")}
        >
          📊 Dashboard
        </div>

        <div
          style={{ marginTop: 10, cursor: "pointer" }}
          onClick={() => navigate("registry")}
        >
          🐔 Chicken Registry
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>
        
        {/* DASHBOARD */}
        {page === "dashboard" && (
          <div>
            <h1>Dashboard</h1>

            <div style={{ display: "flex", gap: 20 }}>
              <StatCard title="Total" value={stats.total} color="#3b82f6" />
              <StatCard title="Sick" value={stats.sick} color="#ef4444" />
              <StatCard title="Recovering" value={stats.recovering} color="#eab308" />
              <StatCard title="Healthy" value={stats.healthy} color="#22c55e" />
            </div>
          </div>
        )}

        {/* REGISTRY */}
        {page === "registry" && (
          <ChickenRegistry
            chickens={chickens}
            setChickens={setChickens}
            setSelectedChicken={setSelectedChicken}
            navigate={navigate}
          />
        )}

        {/* PROFILE */}
        {page === "profile" && selectedChicken && (
          <ChickenProfile
            selectedChicken={selectedChicken}
            setChickens={setChickens}
            setSelectedChicken={setSelectedChicken}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
}

// ================= COMPONENT =================
function StatCard({ title, value, color }: any) {
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        padding: 20,
        borderRadius: 14,
        minWidth: 150,
      }}
    >
      <div>{title}</div>
      <h2>{value}</h2>
    </div>
  );
}