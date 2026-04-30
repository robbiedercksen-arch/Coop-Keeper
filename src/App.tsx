import { useState, useEffect } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("dashboard");

  // ✅ PERSIST DATA
  const [chickens, setChickens] = useState<any[]>(() => {
    const saved = localStorage.getItem("chickens");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedChicken, setSelectedChicken] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  useEffect(() => {
    if (selectedChicken) {
      const updated = chickens.find(c => c.id === selectedChicken.id);
      if (updated) setSelectedChicken(updated);
    }
  }, [chickens]);

  const navigate = (pageName: string) => {
    setPage(pageName);
  };

  return (
    <div style={{ display: "flex" }}>

      {/* 🔥 SIDEBAR */}
      <div style={{
        width: 220,
        background: "#111827",
        color: "#fff",
        minHeight: "100vh",
        padding: 20
      }}>
        <h2 style={{ marginBottom: 20 }}>🐔 Coop Manager</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          <button
            onClick={() => navigate("dashboard")}
            style={menuBtn(page === "dashboard")}
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => navigate("registry")}
            style={menuBtn(page === "registry")}
          >
            🐔 Chicken Registry
          </button>

        </div>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>

        {page === "dashboard" && (
          <Dashboard chickens={chickens} />
        )}

        {page === "registry" && (
          <ChickenRegistry
            chickens={chickens}
            setChickens={setChickens}
            setSelectedChicken={(chicken: any) => {
              setSelectedChicken(chicken);
              setPage("profile");
            }}
          />
        )}

        {page === "profile" && (
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

// 🔥 UPGRADED MENU BUTTON
const menuBtn = (active: boolean) => ({
  background: active ? "#2563eb" : "#1f2937",
  color: "#fff",
  border: "none",
  padding: "10px 12px",
  borderRadius: 10,
  cursor: "pointer",
  textAlign: "left" as const,
  fontWeight: active ? 700 : 500,
  transition: "all 0.2s ease",
});