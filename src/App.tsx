import Wishlist from "./pages/Wishlist";
import Expenses from "./pages/Expenses";
import { supabase } from "./supabase";
import { useState, useEffect } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";
import Dashboard from "./components/Dashboard";
import EggRegistry from "./pages/EggRegistry";
import IncubatorRegistry from "./pages/IncubatorRegistry";
import DailyChores from "./pages/DailyChores";
import FarmPlanning from "./pages/FarmPlanning";
import ChickenFeed from "./pages/ChickenFeed";

const logoPath = "/icon-192.png";

const brandGreen =
  "linear-gradient(180deg, #022312 0%, #04301A 45%, #2d2412 100%)";

function CoopLogo({ size = 48 }: any) {
  return (
    <img
      src={logoPath}
      alt="Coop Keeper"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        borderRadius: 12,
        filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.45))",
      }}
      onError={(e: any) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f0e8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          border: "1px solid #d9a441",
          background: "#faf7f0",
          borderRadius: 24,
          padding: 28,
          textAlign: "center",
          boxShadow: "0 16px 34px rgba(76,54,24,0.16)",
          maxWidth: 340,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <CoopLogo size={76} />
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#3d2a10",
            marginBottom: 6,
          }}
        >
          Loading Coop Keeper
        </div>

        <div style={{ color: "#6b5a3a", fontWeight: 600 }}>
          Fetching your chickens from Supabase...
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [chickens, setChickens] = useState<any[]>([]);
  const [selectedChicken, setSelectedChicken] = useState<any>(null);
  const [loadingChickens, setLoadingChickens] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const loadChickens = async () => {
    setLoadingChickens(true);

    const { data, error } = await supabase
  .from("chickens")
  .select("id,name,idTag,breed,sex,ageGroup,image")
  .order("id", { ascending: true });

    if (error) {
      console.error("Load error:", error);
      setChickens([]);
      setLoadingChickens(false);
      return;
    }
console.log("SUPABASE RAW DATA:", data);
    const formatted = (data || []).map((row: any) => {
      const chickenData = row.data || {};

      return {
  ...row,
  ...chickenData,
  id: chickenData.id || row.id,
  name: chickenData.name || row.name || "",
  idTag: chickenData.idTag || row.idTag || "",
  breed: chickenData.breed || row.breed || "",
  sex: chickenData.sex || row.sex || "",
  ageGroup: chickenData.ageGroup || row.ageGroup || "",
  image: chickenData.image || row.image || "",
  notes: chickenData.notes || row.notes || [],
  healthLogs: chickenData.healthLogs || row.healthLogs || [],
  album: chickenData.album || row.album || [],
};
    });

console.log("FORMATTED CHICKENS:", formatted);
    setChickens(formatted);
    setLoadingChickens(false);
  };

  const saveChickenToDB = async (chicken: any) => {
    const { error } = await supabase.from("chickens").upsert(
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
      return;
    }

    await loadChickens();
  };

  useEffect(() => {
    loadChickens();
  }, []);

  useEffect(() => {
    if (selectedChicken) {
      const updated = chickens.find((c) => c.id === selectedChicken.id);
      if (updated) setSelectedChicken(updated);
    }
  }, [chickens]);

  const navigate = (pageName: string) => {
    setPage(pageName);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: "⌂" },
    { key: "registry", label: "Chicken Registry", icon: "🐔" },
    { key: "incubator", label: "Incubators", icon: "🐣" },
    { key: "chicken-feed", label: "Chicken Feed", icon: "🌾" },
    { key: "eggs", label: "Egg Registry", icon: "🥚" },
    { key: "planner", label: "Daily Chores", icon: "✅" },
    { key: "planning", label: "Farm Planning", icon: "📋" },
    { key: "expenses", label: "Expenses", icon: "💰" },
    { key: "wishlist", label: "Wishlist", icon: "🛒" },
  ];

  if (loadingChickens) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ display: "flex", background: "#f4f0e8", minHeight: "100vh" }}>
      {!isMobile && (
        <aside
          style={{
            width: collapsed ? 82 : 255,
            background: brandGreen,
            color: "#fff",
            minHeight: "100vh",
            padding: collapsed ? 12 : 18,
            transition: "all 0.25s ease",
            boxShadow:
              "10px 0 30px rgba(45,36,18,0.22), inset -1px 0 0 rgba(255,255,255,0.06)",
            borderRight: "1px solid rgba(217,164,65,0.55)",
            borderTopRightRadius: 18,
            borderBottomRightRadius: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: collapsed ? "center" : "flex-start",
              padding: collapsed ? "10px 0 18px" : "18px 6px 24px",
              borderBottom: "1px solid rgba(217,164,65,0.22)",
              marginBottom: 16,
            }}
          >
            <CoopLogo size={collapsed ? 52 : 82} />

            {!collapsed && (
              <>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    color: "#ffffff",
                    letterSpacing: "-0.5px",
                    marginTop: 12,
                    textShadow:
                      "0 1px 0 rgba(255,255,255,0.08), 0 2px 0 rgba(0,0,0,0.18), 0 3px 8px rgba(0,0,0,0.35)",
                  }}
                >
                  Coop Keeper
                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 650,
                    color: "#E7C66B",
                    marginTop: 6,
                    letterSpacing: "0.4px",
                    textShadow: "0 1px 3px rgba(0,0,0,0.35)",
                  }}
                >
                  Chicken Farm Manager
                </div>
              </>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                ...collapseBtn,
                marginTop: collapsed ? 14 : 16,
                width: collapsed ? 42 : "100%",
              }}
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                style={menuBtn(page === item.key, collapsed)}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>
      )}

      {isMobile && showMobileMenu && (
        <>
          <div
            onClick={() => setShowMobileMenu(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 998,
            }}
          />

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 270,
              height: "100vh",
              background: brandGreen,
              color: "#fff",
              padding: 18,
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              boxShadow: "8px 0 24px rgba(0,0,0,0.35)",
              borderRight: "1px solid rgba(217,164,65,0.55)",
            }}
          >
            <button
              onClick={() => setShowMobileMenu(false)}
              style={{
                alignSelf: "flex-end",
                background: "rgba(255,255,255,0.10)",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
                borderRadius: 12,
                width: 38,
                height: 38,
              }}
            >
              ✕
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <CoopLogo size={60} />

              <div>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    color: "#ffffff",
                    letterSpacing: "-0.4px",
                    textShadow:
                      "0 1px 0 rgba(255,255,255,0.08), 0 2px 0 rgba(0,0,0,0.18), 0 3px 8px rgba(0,0,0,0.35)",
                  }}
                >
                  Coop Keeper
                </div>

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 650,
                    color: "#E7C66B",
                    marginTop: 5,
                    letterSpacing: "0.3px",
                    textShadow: "0 1px 3px rgba(0,0,0,0.35)",
                  }}
                >
                  Chicken Farm Manager
                </div>
              </div>
            </div>

            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  navigate(item.key);
                  setShowMobileMenu(false);
                }}
                style={menuBtn(page === item.key, false)}
              >
                <span style={{ fontSize: 18, width: 24 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}

      <main style={{ flex: 1 }}>
        {isMobile && (
          <div
            style={{
              background: "linear-gradient(90deg, #022312, #04301A)",
              color: "#fff",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 6px 18px rgba(15,23,42,0.16)",
              borderBottom: "1px solid rgba(217,164,65,0.45)",
            }}
          >
            <button
              onClick={() => setShowMobileMenu(true)}
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              ☰ Menu
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 900,
              }}
            >
              <CoopLogo size={36} />
              Coop Keeper
            </div>
          </div>
        )}

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
                window.scrollTo({ top: 0, behavior: "auto" });
              }}
              navigate={navigate}
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

          {page === "eggs" && <EggRegistry chickens={chickens} />}
          {page === "incubator" && <IncubatorRegistry />}
          {page === "planner" && <DailyChores />}
          {page === "chicken-feed" && <ChickenFeed chickens={chickens} />}
          {page === "planning" && <FarmPlanning />}
          {page === "expenses" && <Expenses />}
          {page === "wishlist" && <Wishlist />}
        </div>
      </main>
    </div>
  );
}

const menuBtn = (active: boolean, collapsed: boolean) => ({
  background: active
    ? "linear-gradient(90deg, rgba(245,158,11,0.22), rgba(245,158,11,0.08))"
    : "transparent",
  color: active ? "#fbbf24" : "rgba(255,255,255,0.86)",
  border: active ? "1px solid rgba(245,158,11,0.35)" : "1px solid transparent",
  padding: collapsed ? "12px" : "12px 14px",
  borderRadius: 14,
  textAlign: "left" as const,
  fontWeight: active ? 900 : 650,
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: collapsed ? "center" : "flex-start",
  gap: 10,
  cursor: "pointer",
  width: "100%",
  boxShadow: active ? "inset 3px 0 0 #fbbf24" : "none",
});

const collapseBtn = {
  background: "rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 12,
  padding: "9px 10px",
  cursor: "pointer",
  fontWeight: 800,
};