import { supabase } from "./supabase";
import { useState, useEffect } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const [chickens, setChickens] = useState<any[]>([]);

  const [selectedChicken, setSelectedChicken] = useState<any>(null);
const loadChickens = async () => {
  const { data, error } = await supabase
    .from("chickens")
    .select("*");

  if (error) {
    console.error("Load error:", error);
  } else {
    setChickens(data);
  }
};

useEffect(() => {
  loadChickens();
}, []);
  

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
    <div style={{ display: "flex", background: "#f3f4f6" }}>

      {/* 🔥 SIDEBAR */}
      <div style={{
        width: collapsed ? 70 : 230,
        background: "#111827",
        color: "#fff",
        minHeight: "100vh",
        padding: 15,
        transition: "all 0.25s ease"
      }}>
        
        {/* LOGO */}
        <div style={{
          display: "flex",
          justifyContent: collapsed ? "center" : "space-between",
          alignItems: "center",
          marginBottom: 20
        }}>
          {!collapsed && <h2>🐔 Coop</h2>}

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={collapseBtn}
          >
            {collapsed ? "➡" : "⬅"}
          </button>
        </div>

        {/* MENU */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          <button
            onClick={() => navigate("dashboard")}
            style={menuBtn(page === "dashboard", collapsed)}
          >
            🏠 {!collapsed && "Dashboard"}
          </button>

          <button
            onClick={() => navigate("registry")}
            style={menuBtn(page === "registry", collapsed)}
          >
            🐔 {!collapsed && "Registry"}
          </button>

        </div>
      </div>

      {/* 🔥 MAIN AREA */}
      <div style={{ flex: 1 }}>

        {/* HEADER */}
        <div style={{
          background: "#fff",
          padding: "14px 20px",
          borderBottom: "1px solid #e5e7eb",
          fontWeight: 600,
        }}>
          {page === "dashboard" && "Dashboard"}
          {page === "registry" && "Chicken Registry"}
          {page === "profile" && "Chicken Profile"}
        </div>

        {/* CONTENT */}
        <div style={{ padding: 20 }}>

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
    </div>
  );
}

// 🔥 BUTTON STYLES

const menuBtn = (active: boolean, collapsed: boolean) => ({
  background: active ? "#2563eb" : "#1f2937",
  color: "#fff",
  border: "none",
  padding: collapsed ? "10px" : "10px 12px",
  borderRadius: 10,
  cursor: "pointer",
  textAlign: "left" as const,
  fontWeight: active ? 700 : 500,
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: collapsed ? "center" : "flex-start",
  gap: 8,
});

const collapseBtn = {
  background: "#1f2937",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "4px 8px",
  cursor: "pointer",
};