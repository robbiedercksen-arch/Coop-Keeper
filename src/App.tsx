import { useState } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [page, setPage] = useState("registry");

  const [chickens, setChickens] = useState<any[]>([]);
  const [selectedChicken, setSelectedChicken] = useState<any>(null);

  const navigate = (p: string) => setPage(p);

  return (
    <div style={{ display: "flex" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: 200,
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

        {page === "dashboard" && (
          <div>
            <h1>Dashboard</h1>
            <p>Total Chickens: {chickens.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}