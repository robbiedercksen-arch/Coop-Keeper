import { useState, useEffect } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("registry");
  const [chickens, setChickens] = useState<any[]>([]);
  const [selectedChicken, setSelectedChicken] = useState<any>(null);

  // LOAD
  useEffect(() => {
    const saved = localStorage.getItem("chickens");
    if (saved) {
      const parsed = JSON.parse(saved);

      // 🔥 FIX: ensure all chickens have required fields
      const safeData = parsed.map((c: any) => ({
        healthLogs: [],
        notes: [],
        eggs: [],
        ...c,
      }));

      setChickens(safeData);
    }
  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  const navigate = (p: string) => {
    setPage(p);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: 220,
          background: "#8b5e3c",
          color: "#fff",
          padding: 20,
          minHeight: "100vh",
        }}
      >
        <h3>🐔 Coop Keeper</h3>

        <div
          style={{ marginTop: 20, cursor: "pointer" }}
          onClick={() => navigate("dashboard")}
        >
          Dashboard
        </div>

        <div
          style={{ marginTop: 10, cursor: "pointer" }}
          onClick={() => navigate("registry")}
        >
          Chicken Registry
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>
        {page === "dashboard" && <Dashboard chickens={chickens} />}

        {page === "registry" && (
          <ChickenRegistry
            chickens={chickens}
            setChickens={setChickens}
            setSelectedChicken={setSelectedChicken}
            navigate={navigate}
          />
        )}

        {page === "profile" && (
          <ChickenProfile
            selectedChicken={selectedChicken}
            setChickens={setChickens}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
}