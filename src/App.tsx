import { useState, useEffect } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("dashboard");

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

  // 🔥 Detect mobile
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      display: isMobile ? "block" : "flex",
      minHeight: "100vh",
      background: "#f3f4f6"
    }}>

      {/* 🔥 MOBILE TOP NAV */}
      {isMobile && (
        <div style={{
          position: "sticky",
          top: 0,
          background: "#111827",
          color: "#fff",
          padding: 12,
          display: "flex",
          justifyContent: "space-around",
          zIndex: 1000
        }}>
          <button onClick={() => navigate("dashboard")} style={mobileBtn}>
            🏠
          </button>

          <button onClick={() => navigate("registry")} style={mobileBtn}>
            🐔
          </button>
        </div>
      )}

      {/* 🔥 SIDEBAR (DESKTOP ONLY) */}
      {!isMobile && (
        <div style={{
          width: 220,
          background: "#111827",
          color: "#fff",
          padding: 20
        }}>
          <h2 style={{ marginBottom: 20 }}>🐔 Coop Manager</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => navigate("dashboard")} style={menuBtn}>
              Dashboard
            </button>

            <button onClick={() => navigate("registry")} style={menuBtn}>
              Chicken Registry
            </button>
          </div>
        </div>
      )}

      {/* 🔥 MAIN CONTENT */}
      <div style={{
        flex: 1,
        padding: isMobile ? 12 : 20
      }}>

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

// 🔥 DESKTOP BUTTON
const menuBtn = {
  background: "#1f2937",
  color: "#fff",
  border: "none",
  padding: "12px 14px",
  borderRadius: 10,
  cursor: "pointer",
  textAlign: "left" as const,
};

// 🔥 MOBILE BUTTON
const mobileBtn = {
  background: "transparent",
  color: "#fff",
  border: "none",
  fontSize: 22,
  cursor: "pointer",
};