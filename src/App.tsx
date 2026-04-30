import { useState, useEffect } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [page, setPage] = useState("registry");

  const [chickens, setChickens] = useState<any[]>(() => {
    const saved = localStorage.getItem("chickens");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedChicken, setSelectedChicken] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  const navigate = (p: string) => setPage(p);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: "#444", color: "#fff", padding: 20 }}>
        <h3>Coop Keeper</h3>

        <div onClick={() => navigate("registry")} style={{ cursor: "pointer" }}>
          Chicken Registry
        </div>
      </div>

      {/* Main */}
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
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
}