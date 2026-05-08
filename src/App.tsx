import { supabase } from "./supabase";
import { useState, useEffect } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";
import Dashboard from "./components/Dashboard";
import EggRegistry from "./pages/EggRegistry";
import IncubatorRegistry from "./pages/IncubatorRegistry";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [chickens, setChickens] = useState<any[]>([]);
  const [selectedChicken, setSelectedChicken] = useState<any>(null);

  // 🔥 MOBILE DETECTION
useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();

  window.addEventListener("resize", checkMobile);

  return () => {
    window.removeEventListener("resize", checkMobile);
  };
}, []);

  // 🔥 LOAD DATA
  const loadChickens = async () => {
    const { data, error } = await supabase.from("chickens").select("*");

    if (error) {
      console.error("Load error:", error);
    } else {
      if (!data) {
        setChickens([]);
        return;
      }

      const formatted = data.map((row: any) => ({
        ...row.data,
      }));

      setChickens(formatted);
    }
  };

  // 🔥 SAVE DATA
  const saveChickenToDB = async (chicken: any) => {
    const { error } = await supabase
      .from("chickens")
      .upsert(
        {
          id: chicken.id,
          name: chicken.name,
          idTag: chicken.idTag,
          breed: chicken.breed,
          sex: chicken.sex,
          data: chicken,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("Save error:", error);
    } else {
      await loadChickens();
    }
  };

  // 🔥 INITIAL LOAD
  useEffect(() => {
    loadChickens();
  }, []);

  // 🔥 KEEP SELECTED IN SYNC
  useEffect(() => {
    if (selectedChicken) {
      const updated = chickens.find((c) => c.id === selectedChicken.id);
      if (updated) setSelectedChicken(updated);
    }
  }, [chickens]);

  const navigate = (pageName: string) => {
    setPage(pageName);
  };

  return (
    <div style={{ display: "flex", background: "#eef2f7" }}>
      
      {/* 🔥 SIDEBAR */}
      {!isMobile && (
        <div
          style={{
            width: collapsed ? 70 : 230,
            background: "#111827",
            color: "#fff",
            minHeight: "100vh",
            padding: 15,
            transition: "all 0.25s ease",
          }}
        >
          {/* LOGO */}
          <div
            style={{
              display: "flex",
              justifyContent: collapsed ? "center" : "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
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

<button
  onClick={() => navigate("incubator")}
  style={menuBtn(page === "incubator", collapsed)}
>
  🐣 {!collapsed && "Incubators"}
</button>

<button
  onClick={() => navigate("eggs")}
  style={menuBtn(page === "eggs", collapsed)}
>
  🥚 {!collapsed && "Egg Registry"}
</button>
          </div>
        </div>
      )}

{/* 📱 MOBILE MENU */}
{isMobile && showMobileMenu && (
  <>
    {/* OVERLAY */}
    <div
      onClick={() => setShowMobileMenu(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 998,
      }}
    />

    {/* MENU PANEL */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 250,
        height: "100vh",
        background: "#111827",
        color: "#fff",
        padding: 20,
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <button
        onClick={() => setShowMobileMenu(false)}
        style={{
          alignSelf: "flex-end",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: 22,
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      <button
        onClick={() => {
          navigate("dashboard");
          setShowMobileMenu(false);
        }}
        style={menuBtn(page === "dashboard", false)}
      >
        🏠 Dashboard
      </button>

      <button
  onClick={() => {
    navigate("registry");
    setShowMobileMenu(false);
  }}
  style={menuBtn(page === "registry", false)}
>
  🐔 Registry
</button>

<button
  onClick={() => {
    navigate("incubator");
    setShowMobileMenu(false);
  }}
  style={menuBtn(page === "incubator", false)}
>
  🐣 Incubators
</button>

<button
  onClick={() => {
    navigate("eggs");
    setShowMobileMenu(false);
  }}
  style={menuBtn(page === "eggs", false)}
>
  🥚 Egg Registry
</button>
    </div>
  </>
)}
      {/* 🔥 MAIN AREA */}
      <div style={{ flex: 1 }}>
      {/* 📱 MOBILE TOP BAR */}
{isMobile && (
  <div
    style={{
      background: "#111827",
      color: "#fff",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <button
      onClick={() => setShowMobileMenu(true)}
      style={{
        background: "#1f2937",
        border: "none",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: 14,
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      ☰ MENU
    </button>

    <div style={{ fontWeight: 700 }}>
      🐔 Coop Keeper
    </div>
  </div>
)}
        {/* HEADER */}
{!isMobile && (
  <div
    style={{
      background: "#fff",
      padding: "14px 20px",
      borderBottom: "1px solid #e5e7eb",
      fontWeight: 600,
    }}
  >
    {page === "dashboard" && "Dashboard"}
    {page === "registry" && "Chicken Registry"}
    {page === "eggs" && "Egg Registry"}
    {page === "profile" && "Chicken Profile"}
    {page === "incubator" && "Incubator Registry"}
  </div>
)}

        {/* CONTENT */}
        <div style={{ padding: 16 }}>
          {page === "dashboard" && <Dashboard chickens={chickens} />}

          {page === "registry" && (
            <ChickenRegistry
              chickens={chickens}
              setChickens={setChickens}
              saveChickenToDB={saveChickenToDB}
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
    saveChickenToDB={saveChickenToDB}
    setSelectedChicken={setSelectedChicken}
    navigate={navigate}
  />
)}

{page === "eggs" && (
  <EggRegistry chickens={chickens} />
)}
      {page === "incubator" && (
  <IncubatorRegistry />
)}    
        </div>
      </div>
    </div>
  );
}

// 🔥 BUTTON STYLES
const menuBtn = (active: boolean, collapsed: boolean) => ({
  background: active ? "#2563eb" : "transparent",
  color: "#fff",
  border: "none",
  padding: collapsed ? "10px" : "10px 12px",
  borderRadius: 10,
  textAlign: "left" as const,
  fontWeight: active ? 700 : 500,
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  gap: 10,
  cursor: "pointer",
  width: "100%",
});

const collapseBtn = {
  background: "#1f2937",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "4px 8px",
  cursor: "pointer",
};