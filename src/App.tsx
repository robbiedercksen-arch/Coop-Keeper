import { useState } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [page, setPage] = useState("registry");

  const [chickens, setChickens] = useState<any[]>([]);
  const [selectedChicken, setSelectedChicken] = useState<any>(null);

  const navigate = (p: string) => setPage(p);

  // ================= DASHBOARD STATS =================
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

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20 }}>

        {page === "dashboard" && (
          <div>
            <h1>Dashboard</h1>

            <div style={{ display: "flex", gap: 20 }}>
              <div style={card("#3b82f6")}>
                Total Chickens
                <h2>{stats.total}</h2>
              </div>

              <div style={card("#ef4444")}>
                Sick
                <h2>{stats.sick}</h2>
              </div>

              <div style={card("#eab308")}>
                Recovering
                <h2>{stats.recovering}</h2>
              </div>

              <div style={card("#22c55e")}>
                Healthy
                <h2>{stats.healthy}</h2>
              </div>
            </div>
          </div>
        )}

        {page === "registry" && (
          <ChickenRegistry
            chickens={chickens}
            setChickens={setChickens}
            setSelectedChicken={setSelectedChicken}
            navigate={navigate}
          />
        )}

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

// ================= CARD STYLE =================
const card = (color: string) => ({
  background: color,
  color: "#fff",
  padding: 20,
  borderRadius: 14,
  minWidth: 150,
});