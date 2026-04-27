import { useState, useEffect } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [page, setPage] = useState("registry");
  const [chickens, setChickens] = useState<any[]>([]);
  const [selectedChicken, setSelectedChicken] = useState<any>(null);

  // ✅ LOAD FROM STORAGE
  useEffect(() => {
    const saved = localStorage.getItem("chickens");
    if (saved) setChickens(JSON.parse(saved));
  }, []);

  // ✅ SAVE TO STORAGE
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
          width: 200,
          background: "#8b5e3c",
          color: "#fff",
          minHeight: "100vh",
          padding: 20,
        }}
      >
        <h3>🐔 Coop Keeper</h3>

        <div
          style={{ cursor: "pointer", marginTop: 20 }}
          onClick={() => navigate("registry")}
        >
          Chicken Registry
        </div>

        <div
          style={{ cursor: "pointer", marginTop: 10 }}
          onClick={() => navigate("dashboard")}
        >
          Dashboard
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1 }}>
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

        {page === "dashboard" && (
          <div style={{ padding: 20 }}>
            <h2>Dashboard</h2>
          </div>
        )}
      </div>
    </div>
  );
}